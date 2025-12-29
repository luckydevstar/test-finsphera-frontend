import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CryptoList } from '@/components/CryptoList';
import type { CryptoAsset } from '@/types/crypto';

const mockAssets: CryptoAsset[] = [
  {
    symbol: 'BTCUSDT',
    price: '40000',
    priceChange: '100',
    priceChangePercent: '2.5',
    volume: '1000000',
    highPrice: '41000',
    lowPrice: '39000',
    openPrice: '39000',
    lastPrice: '40000',
  },
  {
    symbol: 'ETHUSDT',
    price: '2500',
    priceChange: '-50',
    priceChangePercent: '-2.0',
    volume: '500000',
    highPrice: '2600',
    lowPrice: '2400',
    openPrice: '2550',
    lastPrice: '2500',
  },
];

describe('CryptoList', () => {
  it('renders list of crypto assets', () => {
    const onSelect = jest.fn();
    render(<CryptoList assets={mockAssets} selectedAsset={null} onSelect={onSelect} />);

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('calls onSelect when an asset is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    render(<CryptoList assets={mockAssets} selectedAsset={null} onSelect={onSelect} />);

    const btcItem = screen.getByText('BTC').closest('div[class*="cursor-pointer"]');
    if (btcItem) {
      await user.click(btcItem);
      expect(onSelect).toHaveBeenCalledWith(mockAssets[0]);
    }
  });

  it('highlights selected asset', () => {
    const onSelect = jest.fn();
    render(
      <CryptoList
        assets={mockAssets}
        selectedAsset={mockAssets[0]}
        onSelect={onSelect}
      />
    );

    const btcItem = screen.getByText('BTC').closest('div');
    expect(btcItem?.className).toContain('from-purple-600');
  });

  it('displays price change indicators correctly', () => {
    const onSelect = jest.fn();
    render(<CryptoList assets={mockAssets} selectedAsset={null} onSelect={onSelect} />);

    // BTC has positive change (2.5%)
    expect(screen.getByText('2.50%')).toBeInTheDocument();
    
    // ETH has negative change (-2.0%)
    expect(screen.getByText('2.00%')).toBeInTheDocument();
  });
});

