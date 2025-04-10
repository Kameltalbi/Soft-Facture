
/**
 * Format a number to a localized string
 */
export const formatNumber = (number: number): string => {
  if (!number) return '0';
  return number.toLocaleString();
};

/**
 * Format a date to a localized string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

/**
 * Get currency symbol from currency code
 */
export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'TND':
      return 'DT';
    case 'GBP':
      return '£';
    case 'MAD':
      return 'DH';
    case 'CAD':
      return 'C$';
    case 'CHF':
      return 'CHF';
    default:
      return currency;
  }
};

/**
 * Get default currency code based on stored preference or default to TND
 */
export const getDefaultDeviseCode = (): string => {
  // Try to get the currency from localStorage first
  const storedCurrency = localStorage.getItem('defaultCurrency');
  if (storedCurrency) {
    return storedCurrency;
  }
  // Default to TND if nothing is stored
  return "TND";
};

/**
 * Get available currency options for dropdowns
 */
export const getDeviseOptions = () => {
  return [
    { value: 'TND', label: 'Dinar Tunisien (TND)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dollar US ($)' },
    { value: 'GBP', label: 'Livre Sterling (£)' },
    { value: 'MAD', label: 'Dirham Marocain (DH)' },
    { value: 'CAD', label: 'Dollar Canadien (C$)' },
    { value: 'CHF', label: 'Franc Suisse (CHF)' }
  ];
};

/**
 * Format currency with symbol and proper formatting
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  
  return `${formatNumber(amount)} ${symbol}`;
};
