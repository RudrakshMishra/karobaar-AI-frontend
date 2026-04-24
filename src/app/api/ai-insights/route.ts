import { NextResponse } from 'next/server';

export async function GET() {
  // In production, this would securely call:
  // const response = await anthropic.messages.create({...})
  // or openai.chat.completions.create({...})
  // passing the database metrics array as context to formulate logic.

  return NextResponse.json({
    data: [
      { 
        title: 'Increase Price', 
        desc: 'Ethnic Kurti demand +34%. Raise to ₹549.', 
        critical: false 
      },
      { 
        title: 'Pause Campaign', 
        desc: 'FB Ads ROI drops to -12%. Stop spend.', 
        critical: true 
      },
      { 
        title: 'Reorder Stock', 
        desc: 'Polo Shirts empty in 3D. Order 200.', 
        critical: true 
      },
      { 
        title: 'Buy Box Lost', 
        desc: 'Flipkart competitor dropped price by ₹10.', 
        critical: false 
      },
      { 
        title: 'High Returns', 
        desc: 'Size XL returning +15% over avg. Check chart.', 
        critical: false 
      }
    ]
  });
}
