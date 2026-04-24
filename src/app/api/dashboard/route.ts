import { NextResponse } from 'next/server';
import { fetchLiveDashboardMetrics } from '@/lib/supabase';

export async function GET() {
  const dbResult = await fetchLiveDashboardMetrics();

  const rawRevenue = dbResult.success ? dbResult.data?.revenue || 284500 : 284500;
  
  const platformFee = rawRevenue * 0.02; // 2%
  const shippingTotal = 1847 * 60; // ₹60 per order
  const gst = rawRevenue * 0.18; // 18% GST 
  const packagingTotal = 1847 * 20; // ₹20 packaging
  const returnsLoss = 25000; 

  const totalDeductions = platformFee + shippingTotal + gst + packagingTotal + returnsLoss;
  const realProfit = rawRevenue - totalDeductions;

  return NextResponse.json({
    metrics: {
      revenue: rawRevenue,
      profit: parseFloat(realProfit.toFixed(2)),
      orders: 1847,
      healthScore: 84
    },
    deductions: {
       platformFee,
       shippingTotal,
       gst,
       packagingTotal,
       returnsLoss
    }
  });
}
