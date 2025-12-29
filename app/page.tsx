'use client';

import { useState, useEffect } from 'react';
import { CryptoList } from '@/components/CryptoList';
import { CryptoDetails } from '@/components/CryptoDetails';
import { SearchBar } from '@/components/SearchBar';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { BinanceAPI } from '@/lib/api/binance';
import type { CryptoAsset } from '@/types/crypto';

export default function Home() {
  const { theme } = useTheme();
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<CryptoAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCryptoData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssets(cryptoAssets);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = cryptoAssets.filter((asset) => {
        const symbol = asset.symbol.toLowerCase();
        const baseSymbol = symbol.replace('usdt', '');
        return symbol.includes(query) || baseSymbol.includes(query);
      });
      setFilteredAssets(filtered);
    }
  }, [searchQuery, cryptoAssets]);

  const fetchCryptoData = async () => {
    try {
      setError(null);
      const tickers = await BinanceAPI.getAllTickers24hr();
      const usdtPairs = BinanceAPI.filterUSDTPairs(tickers);
      const assets = usdtPairs.map(BinanceAPI.transformTickerToAsset);
      
      // Sort by volume (descending) to show most traded first
      assets.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
      
      setCryptoAssets(assets);
      setFilteredAssets(assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
  };

  const handleCloseDetails = () => {
    setSelectedAsset(null);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchCryptoData} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-colors duration-300 ${
      theme === 'dark' 
        ? 'from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-white'
    }`}>
      <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-full lg:w-80 backdrop-blur-sm border-r flex flex-col transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-slate-800/50 border-slate-700/50'
        : 'bg-white border-black/10'
    }`}>
          <div className={`p-6 border-b ${
      theme === 'dark' ? 'border-slate-700/50' : 'border-black/10'
    }`}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                    : 'text-black'
                }`}>
                  Crypto Analyzer
                </h1>
                <p className={`text-sm mt-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-black/70'
                }`}>
                  Real-time market data
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
          
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-slate-700/50' : 'border-black/10'
          }`}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search cryptocurrencies..."
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredAssets.length === 0 ? (
              <div className={`p-6 text-center ${
                theme === 'dark' ? 'text-slate-400' : 'text-black/60'
              }`}>
                <p>No cryptocurrencies found</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <CryptoList
                assets={filteredAssets}
                selectedAsset={selectedAsset}
                onSelect={handleAssetSelect}
              />
            )}
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto">
          {selectedAsset ? (
            <CryptoDetails
              asset={selectedAsset}
              onClose={handleCloseDetails}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">📈</div>
                <h2 className={`text-2xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-slate-200' : 'text-black'
                }`}>
                  Welcome to Crypto Market Analyzer
                </h2>
                <p className={theme === 'dark' ? 'text-slate-400' : 'text-black/60'}>
                  Select a cryptocurrency from the sidebar to view detailed market information,
                  price history, and analytics.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

