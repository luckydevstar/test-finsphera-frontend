import { NextResponse } from 'next/server';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET() {
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error');
      console.error('Binance API error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: 'Failed to fetch cryptocurrency data',
          status: response.status,
          details: errorText.substring(0, 200)
        },
        { status: response.status >= 500 ? 502 : response.status }
      );
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', typeof data);
      return NextResponse.json(
        { error: 'Invalid data format from API' },
        { status: 502 }
      );
    }
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching tickers:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - Binance API took too long to respond' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch cryptocurrency data',
          details: error.message,
          name: error.name
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data', details: 'Unknown error' },
      { status: 500 }
    );
  }
}

