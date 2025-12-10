import React, { useState, useEffect } from "react";
import { formatCurrency, parseCurrency } from "@/lib/numberUtils";

export default function CurrencyInput({ value, onChange, currency = "USD", locale = "en-US", placeholder }) {
  const [display, setDisplay] = useState(value != null ? formatCurrency(value, currency, locale) : "");

  useEffect(() => {
    setDisplay(value != null ? formatCurrency(value, currency, locale) : "");
  }, [value, currency, locale]);

  function handleChange(e) {
    const v = e.target.value;
    setDisplay(v);
    const parsed = parseCurrency(v);
    if (onChange) onChange(Number.isNaN(parsed) ? null : parsed);
  }

  function handleBlur() {
    const parsed = parseCurrency(display);
    setDisplay(Number.isNaN(parsed) ? "" : formatCurrency(parsed, currency, locale));
  }

  function handleFocus() {
    // show raw numeric when focusing to make editing easier
    const parsed = parseCurrency(display);
    setDisplay(Number.isNaN(parsed) ? "" : String(parsed));
  }

  return (
    <input
      type="text"
      className="border rounded px-2 py-1 w-full"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder || `Amount (${currency})`}
    />
  );
}
