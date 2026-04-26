import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const revenue = parseFloat(searchParams.get('revenue') || '0');
    const orders = parseInt(searchParams.get('orders') || '0', 10);

    const platformFee = revenue * 0.02;
    const shipping = orders * 60;
    const gst = revenue * 0.18;
    const packaging = orders * 20;
    const returnLoss = revenue * 0.05;

    const totalDeductions = platformFee + shipping + gst + packaging + returnLoss;
    const realProfit = revenue - totalDeductions;

    return NextResponse.json({
      grossRevenue: revenue,
      totalDeductions,
      realProfit,
      margin: revenue > 0 ? (realProfit / revenue) * 100 : 0,
      breakdown: { platformFee, shipping, gst, packaging, returnLoss }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
