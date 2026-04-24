import { NextResponse } from 'next/server';

export async function GET() {
  const products = [
    { name: "Men's Polo T-Shirt", rev: "₹45,200", margin: "22%", stock: 45, status: 'ok', action: 'Increase Ads' },
    { name: "Ethnic Cotton Kurti", rev: "₹82,400", margin: "34%", stock: 3, status: 'low', action: 'Urgent Restock' },
    { name: "Wireless Earbuds Pro", rev: "₹12,100", margin: "8%", stock: 420, status: 'ok', action: 'Lower Price' },
    { name: "Yoga Mat Premium", rev: "₹24,800", margin: "41%", stock: 52, status: 'ok', action: 'Monitor' }
  ];

  return NextResponse.json({ success: true, data: products });
}
