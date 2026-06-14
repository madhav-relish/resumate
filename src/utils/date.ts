export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'current') return 'Present';
  
  // Try to parse YYYY-MM
  const match = dateStr.match(/^(\d{4})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const month = parseInt(match[2], 10) - 1; // 0-indexed month
    const date = new Date(parseInt(year), month);
    // return MMM YYYY (e.g. Jan 2020)
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  }
  
  // Fallback for raw text if AI fails or old data is present
  return dateStr;
}

export function sortChronologically<T extends { startDate?: string; endDate?: string; current?: boolean }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    // 1. Current items always go first
    if (a.current && !b.current) return -1;
    if (!a.current && b.current) return 1;
    
    // 2. Sort by end date descending (newest first)
    const endDateA = a.endDate || '';
    const endDateB = b.endDate || '';
    
    if (endDateA !== endDateB) {
      if (endDateA.toLowerCase() === 'present') return -1;
      if (endDateB.toLowerCase() === 'present') return 1;
      // Since format is YYYY-MM, string localeCompare perfectly sorts chronologically!
      return endDateB.localeCompare(endDateA);
    }
    
    // 3. Sort by start date descending if end dates match
    const startDateA = a.startDate || '';
    const startDateB = b.startDate || '';
    return startDateB.localeCompare(startDateA);
  });
}
