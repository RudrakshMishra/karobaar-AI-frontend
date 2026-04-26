import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return realistic mock data if no API key is provided
      return NextResponse.json([
        { type: 'PRICING', message: 'Product A margin dropped 12% due to return rates.', action: 'Raise price to ₹549', impact: '+18%' },
        { type: 'INVENTORY', message: 'Blue Kurta L stockout predicted in 3 days.', action: 'Restock 150 units', impact: 'Prevents ₹12k loss' },
        { type: 'MARKETING', message: 'Ad Campaign C is ROI negative for 5 days.', action: 'Kill Campaign', impact: 'Saves ₹800/day' },
        { type: 'PRICING', message: 'Competitor dropped price on SKU-1234.', action: 'Match at ₹349', impact: 'Win Buy Box' },
        { type: 'INVENTORY', message: 'Dead stock detected: 200 units of Product B.', action: 'Run flash sale', impact: 'Free ₹20k capital' },
      ]);
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const userId = session.user.id;
    const recentData = await prisma.salesData.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50
    });

    const parsedDataString = JSON.stringify(recentData.length > 0 ? recentData : [{ note: "No data uploaded, use generic e-commerce assumptions" }]);

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: 'You are an AI business advisor for an Indian e-commerce seller. You must return ONLY a JSON array with exactly 5 objects. Fields: type, message, action, impact.',
      messages: [{ role: 'user', content: `Based on this data: ${parsedDataString}, give 5 specific actionable recommendations to increase profit. Formatting: JSON array only.` }]
    });

    let result;
    if (msg.content[0].type === 'text') {
      try {
        result = JSON.parse(msg.content[0].text);
      } catch (e) {
        const jsonMatch = msg.content[0].text.match(/\[[\s\S]*\]/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
      }
    }

    if (!result) throw new Error('Claude failed to return valid JSON array');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json({ error: 'Internal server error while analyzing data' }, { status: 500 });
  }
}
