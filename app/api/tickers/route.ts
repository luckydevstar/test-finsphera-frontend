import { NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET() {
  try {
    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}

