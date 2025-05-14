// Format date to YYYY-MM-DD
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date to display format (e.g., Jan 1, 2023)
export function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Get date for X days ago
export function getDateXDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

// Get date for X days in the future
export function getDateXDaysInFuture(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Check if a date is today
export function isToday(dateString: string): boolean {
  const today = new Date();
  const date = new Date(dateString);
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Get the first day of the month for a given date
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

// Get the last day of the month for a given date
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

// Get all days in a month for calendar
export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = getFirstDayOfMonth(year, month);
  const lastDay = getLastDayOfMonth(year, month);
  
  // Add last days from previous month to make the calendar start on Sunday
  const dayOfWeek = firstDay.getDay();
  if (dayOfWeek > 0) {
    for (let i = dayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push(prevDate);
    }
  }
  
  // Add all days in current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add first days from next month to complete the calendar
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

// Check if two dates are the same day (regardless of time)
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// Check if a date is in current month
export function isCurrentMonth(date: Date, currentMonth: number): boolean {
  return date.getMonth() === currentMonth;
}

// Format time ago (e.g., "2 hours ago", "5 days ago")
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return 'Just now';
}

// Check if maintenance is overdue
export function isMaintenanceOverdue(lastMaintenanceDate: string): boolean {
  const lastMaintenance = new Date(lastMaintenanceDate);
  const today = new Date();
  
  // Consider maintenance overdue if it's been more than 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  
  return lastMaintenance < sixMonthsAgo;
}

// Check if maintenance is due soon
export function isMaintenanceDueSoon(lastMaintenanceDate: string): boolean {
  const lastMaintenance = new Date(lastMaintenanceDate);
  const today = new Date();
  
  // Maintenance due if it's been more than 5 months but less than 6
  const fiveMonthsAgo = new Date();
  fiveMonthsAgo.setMonth(today.getMonth() - 5);
  
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  
  return lastMaintenance < fiveMonthsAgo && lastMaintenance >= sixMonthsAgo;
}

// Get maintenance status based on last maintenance date
export function getMaintenanceStatus(lastMaintenanceDate: string): 'Overdue' | 'Due Soon' | 'Up to Date' {
  if (isMaintenanceOverdue(lastMaintenanceDate)) {
    return 'Overdue';
  } else if (isMaintenanceDueSoon(lastMaintenanceDate)) {
    return 'Due Soon';
  } else {
    return 'Up to Date';
  }
}
