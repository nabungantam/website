import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[#1A1A1A] bg-[#0B0B0B]">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(/assets/banner1.jpg), url(/assets/banner2.jpg), url(/assets/logo.jpg)",
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#0B0B0B]/75 via-[#0B0B0B]/85 to-[#0B0B0B]" />
      <div className="relative z-10">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 sm:px-6 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-[#2A2A2A] bg-[#141414]">
                <Image
                  src="/assets/icon-mobile.png"
                  alt="NabungAntam logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <h4 className="text-base font-semibold text-[#F6F1E6]">
                NabungAntam
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              Jual - Beli LM ANTAM CertiEye 2020+ ONLY. Menerima pembayaran QRIS
              &amp; kartu kredit.
            </p>
          </div>
          <div className="space-y-3 text-sm text-[#A1A1AA]">
            <p className="font-semibold text-[#F6F1E6]">Pembayaran</p>
            <p>Transfer</p>
            <p>QRIS</p>
            <p>Kartu Kredit</p>
          </div>
          <div className="space-y-3 text-sm text-[#A1A1AA]">
            <p className="font-semibold text-[#F6F1E6]">Pengiriman</p>
            <p>COD Bekasi-Jakarta</p>
            <p>Kirim kurir ( Seluruh Indonesia )</p>
          </div>
          <div className="space-y-3 text-sm text-[#A1A1AA]">
            <p className="font-semibold text-[#F6F1E6]">Contact</p>
            <a
              href="mailto:admin@nabungantam.com"
              className="inline-flex items-center gap-2 hover:text-[#F6F1E6]"
            >
              <Mail className="h-4 w-4" />
              admin@nabungantam.com
            </a>
            <a
              href="https://instagram.com/nabungantam"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#F6F1E6]"
            >
              <Instagram className="h-4 w-4" />
              @nabungantam
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61585726980097"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#F6F1E6]"
            >
              <Facebook className="h-4 w-4" />
              Nabung Antam FB Pages
            </a>
          </div>
          
        </div>
        <div className="border-t border-[#1A1A1A]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-[#A1A1AA] sm:px-6">
            <p>2025 NabungAntam. Semua hak dilindungi.</p>
            <p>Nabung ANTAM, Bisa Pakai Kartu Kredit.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
