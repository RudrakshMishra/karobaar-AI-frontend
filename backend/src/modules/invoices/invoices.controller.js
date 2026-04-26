const Tesseract = require("tesseract.js");
const puppeteer = require("puppeteer");
const crypto = require("crypto");

// Mock Database since Postgres is unconfigured locally for demo
let inMemoryInvoices = [];

exports.scanBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No bill image uploaded." });
    }

    console.log("Starting OCR processing with Tesseract.js...");
    // Run OCR on the image buffer
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");

    // Highly simplified heuristics to guess Total Amount and Date based on unstructured text
    const extractedData = {
      rawText: text,
      invoiceNumber: "INV-" + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toISOString().split("T")[0],
      totalAmount: 0,
      items: [
        { product: "Misc Items (Auto-Detected)", qty: 1, price: 0 }
      ]
    };

    // Regex to find things that look like money amounts (e.g. Total: $50.00 or Rs. 100)
    const amountRegex = /(?:total|amount|rs|₹|\$)\s*:?\s*(\d+[\.,]\d{2})/gi;
    let match;
    let maxAmount = 0;
    while ((match = amountRegex.exec(text)) !== null) {
      const val = parseFloat(match[1].replace(',', ''));
      if (val > maxAmount) maxAmount = val;
    }
    
    if (maxAmount > 0) {
      extractedData.totalAmount = maxAmount;
      extractedData.items[0].price = maxAmount;
    }

    res.json({ success: true, data: extractedData });
  } catch (error) {
    console.error("OCR Error:", error);
    res.status(500).json({ error: "Failed to process bill image." });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, customerName, items, totalAmount, date, source } = req.body;
    
    const newInvoice = {
      id: crypto.randomUUID(),
      invoiceNumber: invoiceNumber || "INV-" + Math.floor(Math.random() * 100000),
      customerName: customerName || "Guest Walk-in",
      items: items || [],
      totalAmount: totalAmount || 0,
      date: date || new Date().toISOString(),
      source: source || 'Manual',
      createdAt: new Date().toISOString()
    };

    inMemoryInvoices.push(newInvoice);

    // MOCK: In a real system, we'd also push to Orders matrix here to update DB revenue

    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ error: "Failed to save invoice." });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    // Return newest first
    const sorted = [...inMemoryInvoices].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, invoices: sorted });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch invoices." });
  }
};

exports.downloadInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = inMemoryInvoices.find(i => i.id === id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found." });

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #120C08; }
            .header { border-bottom: 2px solid #D4A373; padding-bottom: 20px; margin-bottom: 40px; }
            .title { font-size: 32px; font-weight: bold; color: #120C08; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; }
            .logo-accent { color: #D4A373; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; background-color: #f8f9fa; padding: 12px; border-bottom: 1px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total { text-align: right; font-size: 20px; font-weight: bold; padding-top: 20px; }
            .tag { display: inline-block; padding: 4px 8px; background: #D4A373; color: white; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Karobaar <span class="logo-accent">AI</span></div>
            <p>Official Platform Invoice</p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <p><strong>Billed To:</strong> ${invoice.customerName}</p>
              <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div style="text-align: right;">
              <span class="tag">Source: ${invoice.source}</span>
            </div>
          </div>
          <table>
            <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.product}</td>
                  <td>${item.qty}</td>
                  <td>₹${item.price}</td>
                  <td>₹${item.price * item.qty}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="total">
            Total Amount: ₹${invoice.totalAmount}
          </div>
          <p style="text-align: center; margin-top: 60px; color: #888; font-size: 12px;">Generated automatically via Karobaar AI Engine.</p>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generate Error:", error);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
};
