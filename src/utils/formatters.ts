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
