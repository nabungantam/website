import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-[#F6F1E6]">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url(/assets/logo.jpg)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0B0B0B]/70 via-[#0B0B0B]/85 to-[#0B0B0B]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
            <span className="text-xs uppercase tracking-[0.4em] text-[#A1A1AA]">
              404
            </span>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Halaman tidak ditemukan
            </h1>
            <p className="max-w-xl text-[#A1A1AA]">
              Halaman yang kamu cari sudah pindah atau tidak tersedia. Balik ke
              beranda untuk lanjut cek stok dan harga.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="bg-[#C8A848] text-black hover:bg-[#F0E078]"
              >
                <Link href="/">Kembali ke beranda</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[#C8A848] bg-transparent text-[#C8A848] hover:bg-[#1A1A1A] hover:text-[#F6F1E6]"
              >
                <Link href="/#form-order">Nabung Antam YUK</Link>
              </Button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
