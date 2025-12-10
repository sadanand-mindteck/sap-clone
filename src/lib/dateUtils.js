// Date utilities used across the app
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDateOnly(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatDateISO(d) {
  if (!d) return "";
  const date = toDateOnly(d);
  return date.toISOString().slice(0, 10);
}

export function parseDateISO(s) {
  if (!s) return null;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  return toDateOnly(new Date(t));
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function getPredefinedRanges() {
  const today = toDateOnly(new Date());
  const yesterday = addDays(today, -1);
  const last7 = addDays(today, -6);
  const last30 = addDays(today, -29);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  return [
    { key: "today", label: "Today", start: today, end: today },
    { key: "yesterday", label: "Yesterday", start: yesterday, end: yesterday },
    { key: "last7", label: "Last 7 days", start: last7, end: today },
    { key: "last30", label: "Last 30 days", start: last30, end: today },
    { key: "monthToDate", label: "Month to date", start: startOfMonth, end: today },
    { key: "yearToDate", label: "Year to date", start: startOfYear, end: today },
  ];
}

// Suggest ranges by matching the query against label or key
export function suggestRanges(query) {
  const q = (query || "").toLowerCase().trim();
  const ranges = getPredefinedRanges();
  if (!q) return ranges;
  return ranges.filter((r) => r.label.toLowerCase().includes(q) || r.key.toLowerCase().includes(q));
}

// Build range from a key (returns {start,end} or null)
export function rangeFromKey(key) {
  const ranges = getPredefinedRanges();
  const found = ranges.find((r) => r.key === key || r.label.toLowerCase() === key?.toLowerCase());
  if (!found) return null;
  return { start: found.start, end: found.end };
}

export default {
  toDateOnly,
  formatDateISO,
  parseDateISO,
  getPredefinedRanges,
  suggestRanges,
  rangeFromKey,
};
