import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: 'Samsung S24 Ultra', stockLevel: 'OK', stockCount: 145, daysUntilStockout: 28, suggestion: 'Monitor' },
    { id: 2, name: 'Blue Kurta L', stockLevel: 'Critical', stockCount: 12, daysUntilStockout: 3, suggestion: 'Reorder 150 units immediately' },
    { id: 3, name: 'Minimalist Desk Lamp', stockLevel: 'Low', stockCount: 45, daysUntilStockout: 8, suggestion: 'Reorder 50 units this week' }
  ]);
}
