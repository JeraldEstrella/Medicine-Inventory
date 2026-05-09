/**
 * Format an ISO date string to a short locale date (e.g. "Aug 15, 2025")
 */
export function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/**
 * Format an ISO date string to a full locale datetime (e.g. "Aug 15, 2025, 02:30 PM")
 */
export function fmtDateFull(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Returns number of days until a given ISO date expires.
 * Returns null if no expiry.
 */
export function daysUntilExpiry(iso) {
  if (!iso) return null;
  return Math.ceil((new Date(iso) - new Date()) / 86_400_000);
}

/**
 * Returns a CSS pill colour class based on stock vs minStock
 */
export function stockPillClass(qty, minStock) {
  if (qty === 0) return 'pill-red';
  if (qty < minStock) return 'pill-yellow';
  return 'pill-green';
}

/**
 * Returns a stock-bar fill percentage (capped at 100)
 */
export function stockBarPct(qty, minStock) {
  if (!minStock) return 100;
  return Math.min(100, Math.round((qty / minStock) * 100));
}

/**
 * Returns the fill colour for the stock bar
 */
export function stockBarColor(qty, minStock) {
  if (qty === 0) return 'var(--red)';
  if (qty < minStock) return 'var(--yellow)';
  return 'var(--green)';
}

/**
 * Export an array of dispense logs as a CSV download
 */
export function exportLogsAsCSV(logs) {
  const headers = ['Date', 'Medicine', 'Quantity', 'Dispensed To', 'By', 'Notes'];
  const rows = [...logs].reverse().map(l => [
    fmtDateFull(l.date), l.medicineName, l.qty, l.to, l.by || '', l.notes || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `medisys_history_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

/**
 * Returns today's dispense logs (same calendar date)
 */
export function todaysLogs(logs) {
  const today = new Date().toDateString();
  return logs.filter(l => new Date(l.date).toDateString() === today);
}
