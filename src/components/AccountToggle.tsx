"use client";

import { motion } from "framer-motion";
import { AccountType } from "@/lib/data";

/** Control segmentado Primaria / Secundaria con píldora animada */
export function AccountToggle({
  id,
  value,
  onChange,
  small,
}: {
  id: string;
  value: AccountType;
  onChange: (t: AccountType) => void;
  small?: boolean;
}) {
  const opts: { v: AccountType; label: string }[] = [
    { v: "secundaria", label: "Secundaria" },
    { v: "primaria", label: "Primaria" },
  ];
  return (
    <div className={`relative flex rounded-full bg-black/35 p-1 ring-1 ring-white/10 ${small ? "text-[11px]" : "text-sm"}`}>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`relative z-10 flex-1 rounded-full font-medium transition-colors ${
            small ? "px-2.5 py-1" : "px-5 py-2"
          } ${value === o.v ? "text-brand-ink" : "text-white/60 hover:text-white"}`}
        >
          {value === o.v && (
            <motion.span
              layoutId={`toggle-${id}`}
              className="absolute inset-0 -z-10 rounded-full bg-brand glow-brand"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}
