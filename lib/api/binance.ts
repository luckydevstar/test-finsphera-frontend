import type { Ticker24hr, KlineData, CryptoAsset, PriceHistoryPoint } from '@/types/crypto';

export class BinanceAPI {
  /**
   * Fetches 24hr ticker statistics for all symbols
   * Uses Next.js API route to avoid CORS issues
   */
  static async getAllTickers24hr(): Promise<Ticker24hr[]> {
    try {
      const response = await fetch('/api/tickers');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch cryptocurrency data');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tickers:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch cryptocurrency data');
    }
  }

  /**
   * Fetches 24hr ticker statistics for a specific symbol
   * Uses Next.js API route to avoid CORS issues
   */
  static async getTicker24hr(symbol: string): Promise<Ticker24hr> {
    try {
      const response = await fetch(`/api/ticker/${symbol}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch data for ${symbol}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ticker for ${symbol}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to fetch data for ${symbol}`);
    }
  }

  /**
   * Fetches kline (candlestick) data for price history
   * Uses Next.js API route to avoid CORS issues
   */
  static async getKlines(
    symbol: string,
    interval: string = '1h',
    limit: number = 24
  ): Promise<PriceHistoryPoint[]> {
    try {
      const response = await fetch(
        `/api/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch price history for ${symbol}`);
      }
      const data: KlineData[] = await response.json();

      return data.map((kline) => {
        // Binance klines are arrays: [openTime, open, high, low, close, volume, ...]
        const openTime = kline[0]; // milliseconds timestamp
        const close = kline[4];    // close price
        const volume = kline[5];    // volume
        
        const date = new Date(openTime);
        
        // Format as HH:MM for display (24-hour format)
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return {
          time: `${hours}:${minutes}`,
          price: parseFloat(close),
          volume: parseFloat(volume),
        };
      });
    } catch (error) {
      console.error(`Error fetching klines for ${symbol}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to fetch price history for ${symbol}`);
    }
  }

  /**
   * Transforms ticker data to a more usable format
   */
  static transformTickerToAsset(ticker: Ticker24hr): CryptoAsset {
    return {
      symbol: ticker.symbol,
      price: ticker.lastPrice,
      priceChange: ticker.priceChange,
      priceChangePercent: ticker.priceChangePercent,
      volume: ticker.volume,
      highPrice: ticker.highPrice,
      lowPrice: ticker.lowPrice,
      openPrice: ticker.openPrice,
      lastPrice: ticker.lastPrice,
    };
  }

  /**
   * Filters tickers to only include USDT pairs
   */
  static filterUSDTPairs(tickers: Ticker24hr[]): Ticker24hr[] {
    return tickers.filter((ticker) => ticker.symbol.endsWith('USDT'));
  }
}

