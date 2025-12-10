// Number and currency helpers
export function formatCurrency(value, currency = "USD", locale = "en-US") {
  if (value == null || Number.isNaN(Number(value))) return "";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(value));
}

export function parseCurrency(str) {
  if (str == null) return NaN;
  const cleaned = String(str).replace(/[^0-9.-]/g, "");
  return cleaned === "" ? NaN : parseFloat(cleaned);
}

export function formatNumberShort(value) {
  const n = Number(value);
  if (!isFinite(n)) return String(value);
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2).replace(/\.00$/, "") + "T";
  if (abs >= 1e9) return (n / 1e9).toFixed(2).replace(/\.00$/, "") + "B";
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
  if (abs >= 1e3) return (n / 1e3).toFixed(2).replace(/\.00$/, "") + "K";
  return n.toString();
}

export default {
  formatCurrency,
  parseCurrency,
  formatNumberShort,
};
