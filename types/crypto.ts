export interface TickerPrice {
  symbol: string;
  price: string;
}

export interface Ticker24hr {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

// Binance klines are returned as arrays, not objects
// [0] = openTime, [1] = open, [2] = high, [3] = low, [4] = close, [5] = volume, etc.
export type KlineData = [
  number,    // openTime
  string,    // open
  string,    // high
  string,    // low
  string,    // close
  string,    // volume
  number,    // closeTime
  string,    // quoteAssetVolume
  number,    // numberOfTrades
  string,    // takerBuyBaseAssetVolume
  string,    // takerBuyQuoteAssetVolume
  string     // ignore
];

export interface CryptoAsset {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
  highPrice: string;
  lowPrice: string;
  openPrice: string;
  lastPrice: string;
}

export interface PriceHistoryPoint {
  time: string;
  price: number;
  volume: number;
}

