'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BinanceAPI } from '@/lib/api/binance';
import { useTheme } from '@/lib/contexts/ThemeContext';
import type { CryptoAsset, PriceHistoryPoint } from '@/types/crypto';

interface CryptoDetailsProps {
  asset: CryptoAsset;
  onClose: () => void;
}

export function CryptoDetails({ asset, onClose }: CryptoDetailsProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#475569' : '#1e293b';
  const axisColor = isDark ? '#94a3b8' : '#0f172a';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#475569' : '#1e293b';
  const tooltipText = isDark ? '#cbd5e1' : '#0f172a';

  useEffect(() => {
    fetchPriceHistory();
  }, [asset.symbol]);

  const fetchPriceHistory = async () => {
    try {
      setLoadingHistory(true);
      setHistoryError(null);
      const history = await BinanceAPI.getKlines(asset.symbol, '1h', 24);
      setPriceHistory(history);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Failed to load price history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatPrice = (price: string): string => {
    const num = parseFloat(price);
    if (num < 0.01) {
      return num.toFixed(8);
    }
    if (num < 1) {
      return num.toFixed(6);
    }
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (value: string): string => {
    return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const priceChange = parseFloat(asset.priceChangePercent);
  const isPositive = priceChange >= 0;

  const stats = [
    { label: 'Open Price', value: `$${formatPrice(asset.openPrice)}` },
    { label: 'High Price', value: `$${formatPrice(asset.highPrice)}`, isHigh: true },
    { label: 'Low Price', value: `$${formatPrice(asset.lowPrice)}`, isLow: true },
    { label: '24h Volume', value: formatNumber(asset.volume) },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-full p-6 lg:p-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${
                theme === 'dark' ? 'text-slate-100' : 'text-black'
              }`}>
                {asset.symbol.replace('USDT', '')}
                <span className={`text-xl ml-2 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-black/60'
                }`}>/USDT</span>
              </h1>
              <div className="flex items-center gap-4">
                <p className={`text-2xl lg:text-3xl font-semibold ${
                  theme === 'dark' ? 'text-slate-200' : 'text-black'
                }`}>
                  ${formatPrice(asset.price)}
                </p>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium
                  ${isPositive 
                    ? theme === 'dark' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-white text-black border border-black/20'
                    : theme === 'dark'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white text-black border border-black/20'
                  }`}>
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-slate-700/50' 
                  : 'hover:bg-black/5'
              }`}
              aria-label="Close details"
            >
              <X className={`w-6 h-6 ${
                theme === 'dark' ? 'text-slate-400' : 'text-black/60'
              }`} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`backdrop-blur-sm rounded-lg p-4 border ${
                  theme === 'dark' 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white border-black/10'
                }`}
              >
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-black/60'
                }`}>{stat.label}</p>
                <p className={`text-lg font-semibold 
                  ${stat.isHigh 
                    ? theme === 'dark' ? 'text-green-400' : 'text-black'
                    : stat.isLow 
                    ? theme === 'dark' ? 'text-red-400' : 'text-black'
                    : theme === 'dark' ? 'text-slate-200' : 'text-black'
                  }`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Price History Chart */}
          <div className={`backdrop-blur-sm rounded-lg p-6 border mb-6 ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-black/10'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-slate-200' : 'text-black'
            }`}>24h Price History</h2>
            {loadingHistory ? (
              <div className="h-64 flex items-center justify-center">
                <div className={isDark ? 'text-slate-400' : 'text-slate-700'}>Loading chart data...</div>
              </div>
            ) : historyError ? (
              <div className="h-64 flex items-center justify-center">
                <div className={isDark ? 'text-red-400' : 'text-red-600'}>{historyError}</div>
              </div>
            ) : priceHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={gridColor}
                    strokeOpacity={isDark ? 1 : 0.3}
                  />
                  <XAxis
                    dataKey="time"
                    stroke={axisColor}
                    style={{ fontSize: '12px', fontWeight: isDark ? 'normal' : '500' }}
                    tick={{ fill: axisColor, fontWeight: isDark ? 'normal' : '500' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={axisColor}
                    style={{ fontSize: '12px', fontWeight: isDark ? 'normal' : '500' }}
                    tick={{ fill: axisColor, fontWeight: isDark ? 'normal' : '500' }}
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `$${value.toFixed(6)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: tooltipText }}
                    formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: isPositive ? '#10b981' : '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-slate-400">No chart data available</div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className={`backdrop-blur-sm rounded-lg p-6 border ${
            theme === 'dark' 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-black/10'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-slate-200' : 'text-black'
            }`}>Market Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-black/60'
                }`}>Price Change (24h)</p>
                <p className={`text-lg font-semibold ${
                  isPositive 
                    ? theme === 'dark' ? 'text-green-400' : 'text-black'
                    : theme === 'dark' ? 'text-red-400' : 'text-black'
                }`}>
                  ${formatPrice(asset.priceChange)} ({isPositive ? '+' : ''}{priceChange.toFixed(2)}%)
                </p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-black/60'
                }`}>Trading Volume (24h)</p>
                <p className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-slate-200' : 'text-black'
                }`}>
                  {formatNumber(asset.volume)} USDT
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

