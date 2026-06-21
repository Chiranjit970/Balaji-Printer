import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const dateUtils = {
  /**
   * Formats a date string to a readable format
   * e.g., 'Today, 2:30 PM', 'Yesterday, 10:00 AM', '12 Oct 2023'
   */
  formatRelativeDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = parseISO(dateString);
      
      if (isToday(date)) {
        return `Today, ${format(date, 'h:mm a')}`;
      }
      
      if (isYesterday(date)) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      }
      
      return format(date, 'dd MMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  },

  /**
   * Formats a date to standard display format
   * e.g., '12 Oct 2023, 2:30 PM'
   */
  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = parseISO(dateString);
      return format(date, 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return dateString;
    }
  }
};
