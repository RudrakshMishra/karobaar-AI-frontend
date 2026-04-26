import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const userId = (session.user as any).id;
    let imported = 0;

    for (const record of records as any[]) {
      // Very basic normalizer based on common headers
      const dateStr = record.date || record.Date || record['Order Date'];
      const product = record.product_name || record.Product || record['Item Name'];
      const revenue = parseFloat(record.revenue || record.Revenue || record['Total Amount'] || '0');
      const quantity = parseInt(record.quantity || record.Quantity || record.Qty || '1', 10);
      const platform = record.platform || record.Platform || 'Unknown';

      if (dateStr && product) {
        await prisma.salesData.create({
          data: {
            userId,
            date: new Date(dateStr),
            product,
            revenue,
            quantity,
            platform,
            profit: revenue * 0.2 // Default mock profit
          }
        });
        imported++;
      }
    }

    return NextResponse.json({ success: true, rowsImported: imported, summary: `Successfully imported ${imported} rows.` });
  } catch (error) {
    console.error('CSV Upload Error:', error);
    return NextResponse.json({ error: 'Error processing CSV' }, { status: 500 });
  }
}
