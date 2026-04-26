import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch real data from DB
    const salesData = await prisma.salesData.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const orders = await prisma.order.findMany({
      where: { userId }
    });

    if (salesData.length === 0 && orders.length === 0) {
      // Mock data if no CSV uploaded
      return NextResponse.json({
        totalRevenue: 412000,
        realProfit: 54300,
        totalOrders: 284,
        healthScore: 91,
        revenueChart: [
          { date: '1 Apr', revenue: 12000 },
          { date: '8 Apr', revenue: 24000 },
          { date: '15 Apr', revenue: 18000 },
          { date: '22 Apr', revenue: 35000 },
          { date: '30 Apr', revenue: 54000 },
        ],
        topProducts: [
          { rank: 1, name: 'Wireless Earbuds', realProfit: 18400, margin: 34 },
          { rank: 2, name: 'Smart Watch', realProfit: 12100, margin: 28 },
          { rank: 3, name: 'Phone Case', realProfit: 8600, margin: 42 },
        ],
        recentOrders: []
      });
    }

    // Real data aggressive aggregation
    let totalRevenue = 0;
    let realProfit = 0;
    const totalOrders = orders.length;

    const chartMap = new Map<string, number>();

    salesData.forEach(s => {
      totalRevenue += s.revenue;
      realProfit += s.profit || (s.revenue * 0.15); // mock 15% if null
      
      const d = new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      chartMap.set(d, (chartMap.get(d) || 0) + s.revenue);
    });

    const revenueChart = Array.from(chartMap.entries()).map(([date, revenue]) => ({ date, revenue }));

    return NextResponse.json({
      totalRevenue,
      realProfit,
      totalOrders,
      healthScore: 88, // Standard computation placeholder
      revenueChart,
      topProducts: [],
      recentOrders: orders.slice(0, 5)
    });
    
  } catch (error) {
    console.error('Dashboard Overview Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
