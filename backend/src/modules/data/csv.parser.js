const fs = require('fs');
const csv = require('csv-parser');
const { prisma } = require('../../config/db');

// Helper to normalize values
const normalizeNumber = (val) => {
  if (!val) return 0;
  const num = parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
};

// Map columns based on assumed platform schemas or generic headers
const mapHeaders = (headers, platform) => {
  return headers.map(h => {
    const lh = h.toLowerCase().trim();
    if (lh.includes('order id') || lh === 'id') return 'orderId';
    if (lh.includes('product') || lh.includes('item') || lh.includes('title')) return 'product';
    if (lh.includes('qty') || lh.includes('quantity')) return 'qty';
    if (lh.includes('price') || lh.includes('sales')) return 'salePrice';
    if (lh.includes('cost')) return 'costPrice';
    if (lh.includes('fee')) return 'platformFee';
    if (lh.includes('shipping')) return 'shipping';
    if (lh.includes('gst') || lh.includes('tax')) return 'gst';
    if (lh.includes('return') || lh.includes('status')) return 'returnStatus';
    if (lh.includes('date') || lh.includes('created')) return 'orderDate';
    return lh;
  });
};

exports.processCSV = (filePath, userId, uploadId, platform) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header, index }) => mapHeaders([header], platform)[0]
      }))
      .on('data', (data) => {
        // Basic mapping and cleaning per row
        const salePrice = normalizeNumber(data.salePrice);
        const costPrice = normalizeNumber(data.costPrice);
        const platformFee = normalizeNumber(data.platformFee);
        const shipping = normalizeNumber(data.shipping);
        const gst = normalizeNumber(data.gst);
        const returnRate = data.returnStatus === 'RETURNED' ? 1 : 0;
        const returnLossFactor = 1.0; 

        // Real profit calculation
        const realProfit = salePrice 
           - costPrice 
           - platformFee 
           - shipping 
           - (gst) // Assuming GST is already an absolute value
           - (returnRate * salePrice * returnLossFactor);

        results.push({
          userId,
          uploadId,
          orderId: data.orderId || `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          product: data.product || 'Unknown Product',
          qty: normalizeNumber(data.qty) || 1,
          salePrice,
          costPrice,
          platformFee,
          shipping,
          gst,
          realProfit,
          returnStatus: data.returnStatus || 'DELIVERED',
          orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
        });
      })
      .on('end', async () => {
        try {
          // Bulk insert
          // Due to memory constraints, if rows are massive, batch them. For simplicity, chunk by 1000.
          const chunkSize = 1000;
          for (let i = 0; i < results.length; i += chunkSize) {
            const chunk = results.slice(i, i + chunkSize);
            await prisma.order.createMany({ data: chunk, skipDuplicates: true });
          }
          // Optionally, also update product table if items don't exist
          resolve(results);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
