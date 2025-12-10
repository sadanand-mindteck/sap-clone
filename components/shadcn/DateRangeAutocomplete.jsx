import React, { useState, useEffect, useRef } from "react";
import { formatDateISO, getPredefinedRanges, suggestRanges, parseDateISO } from "../../lib/dateUtils";

export default function DateRangeAutocomplete({ onChange, initialRange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState(getPredefinedRanges());
  const [show, setShow] = useState(false);
  const [start, setStart] = useState(initialRange?.start || null);
  const [end, setEnd] = useState(initialRange?.end || null);
  const [label, setLabel] = useState(initialRange?.label || "");
  const rootRef = useRef();

  useEffect(() => {
    setSuggestions(suggestRanges(query));
  }, [query]);

  useEffect(() => {
    function onDoc(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setShow(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function applyRange(r) {
    setStart(r.start);
    setEnd(r.end);
    setLabel(r.label);
    setShow(false);
    if (onChange) onChange({ start: r.start, end: r.end, label: r.label });
  }

  function onCustomChange(which, value) {
    const parsed = parseDateISO(value);
    if (which === "start") setStart(parsed);
    else setEnd(parsed);
    setLabel("Custom");
    if (onChange) onChange({ start: which === "start" ? parsed : start, end: which === "end" ? parsed : end, label: "Custom" });
  }

  return (
    <div className="relative" ref={rootRef}>
      <div>
        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="Search ranges or pick custom dates (e.g. 'Last 7 days')"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
          }}
          onFocus={() => setShow(true)}
        />
      </div>

      {show && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-64 overflow-auto">
          {suggestions.map((s) => (
            <button key={s.key} type="button" className="block w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => applyRange(s)}>
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-slate-500">
                {formatDateISO(s.start)} — {formatDateISO(s.end)}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <div className="flex-1">
          <label className="block text-sm text-slate-600">Start</label>
          <input
            type="date"
            className="border rounded px-2 py-1 w-full"
            value={start ? formatDateISO(start) : ""}
            onChange={(e) => onCustomChange("start", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-slate-600">End</label>
          <input
            type="date"
            className="border rounded px-2 py-1 w-full"
            value={end ? formatDateISO(end) : ""}
            onChange={(e) => onCustomChange("end", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-2 text-sm text-slate-700">
        Selected: {label || "—"} {start ? `(${formatDateISO(start)} to ${formatDateISO(end)})` : ""}
      </div>
    </div>
  );
}
