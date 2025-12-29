import { BinanceAPI } from '@/lib/api/binance';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BinanceAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTickers24hr', () => {
    it('fetches and returns ticker data', async () => {
      const mockTickers = [
        {
          symbol: 'BTCUSDT',
          priceChange: '100',
          priceChangePercent: '2.5',
          lastPrice: '40000',
          volume: '1000000',
          highPrice: '41000',
          lowPrice: '39000',
          openPrice: '39000',
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockTickers });

      const result = await BinanceAPI.getAllTickers24hr();

      expect(result).toEqual(mockTickers);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.binance.com/api/v3/ticker/24hr'
      );
    });

    it('handles errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(BinanceAPI.getAllTickers24hr()).rejects.toThrow(
        'Failed to fetch cryptocurrency data'
      );
    });
  });

  describe('filterUSDTPairs', () => {
    it('filters to only USDT pairs', () => {
      const tickers = [
        { symbol: 'BTCUSDT', priceChange: '100' },
        { symbol: 'ETHUSDT', priceChange: '50' },
        { symbol: 'BTCBTC', priceChange: '10' },
        { symbol: 'ETHBNB', priceChange: '20' },
      ] as any[];

      const result = BinanceAPI.filterUSDTPairs(tickers);

      expect(result).toHaveLength(2);
      expect(result[0].symbol).toBe('BTCUSDT');
      expect(result[1].symbol).toBe('ETHUSDT');
    });
  });

  describe('transformTickerToAsset', () => {
    it('transforms ticker data correctly', () => {
      const ticker = {
        symbol: 'BTCUSDT',
        priceChange: '100',
        priceChangePercent: '2.5',
        lastPrice: '40000',
        volume: '1000000',
        highPrice: '41000',
        lowPrice: '39000',
        openPrice: '39000',
      } as any;

      const result = BinanceAPI.transformTickerToAsset(ticker);

      expect(result).toEqual({
        symbol: 'BTCUSDT',
        price: '40000',
        priceChange: '100',
        priceChangePercent: '2.5',
        volume: '1000000',
        highPrice: '41000',
        lowPrice: '39000',
        openPrice: '39000',
        lastPrice: '40000',
      });
    });
  });
});

