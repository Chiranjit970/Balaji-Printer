import { format, formatDistanceToNow, parseISO, isValid, isToday, isYesterday } from 'date-fns';

export const DateUtils = {
  /**
   * Formats a date string to a readable format (legacy)
   * e.g., 'Today, 2:30 PM', 'Yesterday, 10:00 AM', '12 Oct 2023'
   */
  formatRelativeDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
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
   * Formats a date to standard display format (legacy)
   * e.g., '12 Oct 2023, 2:30 PM'
   */
  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return dateString;
      return format(date, 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return dateString;
    }
  },

  /**
   * Format for order list: "12 May 2025"
   */
  formatOrderDate(isoString: string): string {
    try {
      const date = parseISO(isoString);
      if (!isValid(date)) return 'Unknown date';
      return format(date, 'd MMM yyyy');
    } catch {
      return 'Unknown date';
    }
  },

  /**
   * Format for timeline: "12 May 2025, 10:30 AM"
   */
  formatTimestamp(isoString: string): string {
    try {
      const date = parseISO(isoString);
      if (!isValid(date)) return '';
      return format(date, 'd MMM yyyy, hh:mm aa');
    } catch {
      return '';
    }
  },

  /**
   * Relative time: "2 hours ago"
   */
  formatRelative(isoString: string): string {
    try {
      const date = parseISO(isoString);
      if (!isValid(date)) return '';
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  },

  /**
   * Format for payment: "12 May 2025, 10:32 AM"
   */
  formatPaymentDate(isoString: string): string {
    return DateUtils.formatTimestamp(isoString);
  },
};

// Export camelCase alias for legacy code compatibility
export const dateUtils = DateUtils;

