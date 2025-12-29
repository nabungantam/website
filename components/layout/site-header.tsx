import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1A1A1A] bg-[#0B0B0B]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-4 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-6">
        <div className="flex items-center justify-center sm:justify-self-start">
          <div className="flex items-center gap-2 sm:hidden">
            <Image
              src="/assets/icon-mobile.png"
              alt="NabungAntam icon"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <Image
              src="/assets/logo-text.png"
              alt="NabungAntam"
              width={140}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Image
              src="/assets/icon-mobile.png"
              alt="NabungAntam icon"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <Image
              src="/assets/logo-text.png"
              alt="NabungAntam"
              width={160}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>
        <nav className="hidden items-center justify-center gap-6 text-sm text-[#A1A1AA] sm:flex sm:justify-self-center">
          <Link href="#steps" className="hover:text-[#F6F1E6]">
            Alur
          </Link>
          <span className="text-[#2A2A2A]">-</span>
          <Link href="#form-order" className="hover:text-[#F6F1E6]">
            Cek stok
          </Link>
        </nav>
        <div className="hidden justify-end sm:flex sm:justify-self-end">
          <Button
            asChild
            className="bg-[#C8A848] text-black hover:bg-[#F0E078]"
          >
            <Link href="#form-order">Tanya Admin YUK</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
