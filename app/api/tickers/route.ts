import { NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Binance API error:', response.status, errorText);
      throw new Error(`Binance API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching tickers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data', details: errorMessage },
      { status: 500 }
    );
  }
}

