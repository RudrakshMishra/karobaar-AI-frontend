import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('productName') || 'Generic Product';
  const platform = searchParams.get('platform') || 'Amazon';
  
  return NextResponse.json({
    productName: product,
    platform: platform,
    theirPrice: 899,
    ourPrice: 949,
    theirRating: 4.6,
    theirReviews: 1240,
    stockStatus: 'In Stock',
    action: 'Price drop by ₹50 recommended'
  });
}
