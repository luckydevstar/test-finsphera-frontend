'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoAsset } from '@/types/crypto';

interface CryptoListProps {
  assets: CryptoAsset[];
  selectedAsset: CryptoAsset | null;
  onSelect: (asset: CryptoAsset) => void;
}

export function CryptoList({ assets, selectedAsset, onSelect }: CryptoListProps) {
  const formatPrice = (price: string): string => {
    const num = parseFloat(price);
    if (num < 0.01) {
      return num.toFixed(6);
    }
    if (num < 1) {
      return num.toFixed(4);
    }
    return num.toFixed(2);
  };

  const formatVolume = (volume: string): string => {
    const num = parseFloat(volume);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    }
    if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="p-2">
      <AnimatePresence>
        {assets.map((asset, index) => {
          const priceChange = parseFloat(asset.priceChangePercent);
          const isPositive = priceChange >= 0;
          const isSelected = selectedAsset?.symbol === asset.symbol;

          return (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelect(asset)}
              className={`
                p-4 mb-2 rounded-lg cursor-pointer transition-all relative overflow-hidden
                ${isSelected
                  ? 'bg-white dark:bg-gradient-to-r dark:from-purple-600/50 dark:to-pink-600/50 border-2 border-black dark:border-purple-400/50 shadow-lg dark:shadow-none'
                  : 'bg-white dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700/50 border-2 border-black/10 dark:border-transparent hover:border-black/20 dark:hover:border-transparent hover:shadow-md dark:shadow-none transition-all'
                }
              `}
            >
              {/* Left accent bar for selected item - only in light mode */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E6D5F7] dark:hidden" />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Purple dot indicator - only in light mode */}
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#E6D5F7] dark:hidden flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={`font-semibold text-sm ${
                      isSelected 
                        ? 'text-black dark:text-slate-200 font-bold' 
                        : 'text-black dark:text-slate-200'
                    }`}>
                      {asset.symbol.replace('USDT', '')}
                    </h3>
                    <p className={`text-xs ${
                      isSelected 
                        ? 'text-black/70 dark:text-slate-400' 
                        : 'text-black/60 dark:text-slate-400'
                    }`}>USDT</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    isSelected 
                      ? 'text-black dark:text-slate-100 text-base' 
                      : 'text-black dark:text-slate-100'
                  }`}>
                    ${formatPrice(asset.price)}
                  </p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-black dark:text-green-400' : 'text-black dark:text-red-400'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{Math.abs(priceChange).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <div className={`text-xs ${
                isSelected 
                  ? 'text-black/70 dark:text-slate-500 font-medium' 
                  : 'text-black/60 dark:text-slate-500'
              }`}>
                Vol: {formatVolume(asset.volume)}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

