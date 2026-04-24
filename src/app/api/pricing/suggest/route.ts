import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    suggestedPrice: 549,
    currentPrice: 499,
    projectedProfitChange: '+18.4%',
    reason: 'Competitors on Flipkart raised prices by 10%. Demand remains highly elastic.'
  });
}
