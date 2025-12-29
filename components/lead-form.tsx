"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type LeadFormState = {
  weight: number;
  year: number;
  quantity: number;
};

const WHATSAPP_NUMBER = "6287783791588";
const WEIGHT_OPTIONS = [1, 3, 5, 10, 25, 50];
const YEAR_OPTIONS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
export function LeadForm() {
  const [form, setForm] = useState<LeadFormState>({
    weight: 3,
    year: 2024,
    quantity: 1,
  });

  const message = useMemo(() => {
    return [
      "Halo kak, mau tanya stok & harga LM ANTAM hari ini ya \u{1F60A}",
      "",
      `Produk: ${form.weight} gram`,
      `Tahun: ${form.year}`,
      `Jumlah: ${form.quantity}`,
      "",
      "Terima kasih \u{1F64F}",
    ].join("\n");
  }, [form]);

  const waLink = useMemo(() => {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }, [message]);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = waLink;
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-[#A1A1AA]">Produk</span>
          <select
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#101010] px-3 py-2 text-sm text-[#F6F1E6] outline-none focus:border-[#C8A848] focus:ring-2 focus:ring-[#C8A848]/40"
            value={form.weight}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                weight: Number(event.target.value),
              }))
            }
          >
            {WEIGHT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} gram
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[#A1A1AA]">Tahun</span>
          <select
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#101010] px-3 py-2 text-sm text-[#F6F1E6] outline-none focus:border-[#C8A848] focus:ring-2 focus:ring-[#C8A848]/40"
            value={form.year}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                year: Number(event.target.value),
              }))
            }
          >
            {YEAR_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-[#A1A1AA]">Jumlah</span>
        <input
          className="w-full rounded-lg border border-[#2A2A2A] bg-[#101010] px-3 py-2 text-sm text-[#F6F1E6] outline-none focus:border-[#C8A848] focus:ring-2 focus:ring-[#C8A848]/40"
          type="number"
          min={1}
          value={form.quantity}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              quantity: Math.max(1, Number(event.target.value || 1)),
            }))
          }
        />
      </label>
      <Button
        className="w-full bg-[#C8A848] text-black hover:bg-[#F0E078]"
        type="submit"
      >
        Tanya Admin YUK
      </Button>
    </form>
  );
}
