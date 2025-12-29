import { NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const response = await fetch(
      `${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol}`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching ticker for ${params.symbol}:`, error);
    return NextResponse.json(
      { error: `Failed to fetch data for ${params.symbol}` },
      { status: 500 }
    );
  }
}

