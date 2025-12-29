import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder text', () => {
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} placeholder="Search crypto..." />);
    
    const input = screen.getByPlaceholderText('Search crypto...');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} />);
    
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'BTC');
    
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith('BTC');
  });

  it('displays the current value', () => {
    const onChange = jest.fn();
    render(<SearchBar value="ETH" onChange={onChange} />);
    
    const input = screen.getByDisplayValue('ETH');
    expect(input).toBeInTheDocument();
  });
});

