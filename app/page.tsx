import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";

import { NabungAntamOrderForm } from "@/components/layout/form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LightboxCarousel } from "@/components/lightbox-carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GoldProduct = {
  slug: string;
  name: string;
  summary: string;
  year: number;
  weight: number;
  status: "Ready" | "Limited";
  image: string;
  tags: string[];
};

type AssetSlide = {
  src: string;
  alt: string;
};

const catalog: GoldProduct[] = [
  {
    slug: "antam-1g-2024",
    name: "LM ANTAM 1g CertiEye",
    summary: "Pecahan ringan untuk mulai nabung dengan aman.",
    year: 2024,
    weight: 1,
    status: "Ready",
    image:
      "https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Verified", "CertiEye 2024", "Ready"],
  },
  {
    slug: "antam-3g-2025",
    name: "LM ANTAM 3g CertiEye",
    summary: "Paling populer untuk tabungan rutin dan hadiah.",
    year: 2025,
    weight: 3,
    status: "Ready",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80",
    tags: ["Verified", "CertiEye 2025", "Ready"],
  },
  {
    slug: "antam-5g-2024",
    name: "LM ANTAM 5g CertiEye",
    summary: "Pecahan ideal untuk simpan jangka menengah.",
    year: 2024,
    weight: 5,
    status: "Limited",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    tags: ["Verified", "CertiEye 2024", "Limited"],
  },
  {
    slug: "antam-10g-2026",
    name: "LM ANTAM 10g CertiEye",
    summary: "Pilih untuk tujuan keuangan yang lebih besar.",
    year: 2026,
    weight: 10,
    status: "Ready",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    tags: ["Verified", "CertiEye 2026", "Ready"],
  },
  {
    slug: "antam-25g-2023",
    name: "LM ANTAM 25g CertiEye",
    summary: "Keseimbangan antara nilai dan likuiditas.",
    year: 2023,
    weight: 25,
    status: "Limited",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2000&q=80",
    tags: ["Verified", "CertiEye 2023", "Limited"],
  },
  {
    slug: "antam-50g-2022",
    name: "LM ANTAM 50g CertiEye",
    summary: "Cocok untuk korporat atau akumulasi premium.",
    year: 2022,
    weight: 50,
    status: "Ready",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1600&q=80",
    tags: ["Verified", "CertiEye 2022", "Ready"],
  },
];

const HERO_CONTENT_DIR = path.join(process.cwd(), "public", "assets", "emas");
const EXPERIENCE_CONTENT_DIR = path.join(
  process.cwd(),
  "public",
  "assets",
  "konten"
);

const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|avif|gif)$/i;

async function collectImages(
  dirPath: string,
  baseDir: string
): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectImages(fullPath, baseDir)));
    } else if (entry.isFile() && IMAGE_EXT_REGEX.test(entry.name)) {
      const relativePath = path
        .relative(baseDir, fullPath)
        .split(path.sep)
        .join("/");
      results.push(relativePath);
    }
  }

  return results;
}

async function getSlidesFromDir(
  dirPath: string,
  urlPrefix: string,
  altPrefix: string
): Promise<AssetSlide[]> {
  try {
    const files = await collectImages(dirPath, dirPath);
    return files
      .sort((a, b) => a.localeCompare(b))
      .map((file, index) => ({
        src: `${urlPrefix}/${file}`,
        alt: `${altPrefix} ${index + 1}`,
      }));
  } catch {
    return [];
  }
}

function GradientTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-linear-to-r from-[#C8A848] via-[#F0E078] to-[#A8842A] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

export default async function Page() {
  const heroProduct = catalog[0];
  const heroSlides = await getSlidesFromDir(
    HERO_CONTENT_DIR,
    "/assets/emas",
    "NabungAntam emas"
  );
  const experienceSlides = await getSlidesFromDir(
    EXPERIENCE_CONTENT_DIR,
    "/assets/konten",
    "NabungAntam konten"
  );
  const resolvedHeroSlides = heroSlides.length
    ? heroSlides
    : [
        {
          src: heroProduct.image,
          alt: heroProduct.name,
        },
      ];
  const heroBackground = resolvedHeroSlides[0]?.src ?? heroProduct.image;
  const experienceBackground = "/assets/banner2.jpg";

  return (
    <div className="bg-[#0B0B0B] text-[#F6F1E6]">
      <SiteHeader />
      <HeroSection
        heroProduct={heroProduct}
        heroSlides={resolvedHeroSlides}
        heroBackground={heroBackground}
      />
      <TrustedStats />
      <WhySection />
      <JourneySection />
      <ExperienceSection
        slides={experienceSlides}
        backgroundImage={experienceBackground}
      />
      <CTASection />
      <SiteFooter />
    </div>
  );
}

function HeroSection({
  heroProduct,
  heroSlides,
  heroBackground,
}: {
  heroProduct: GoldProduct;
  heroSlides: AssetSlide[];
  heroBackground: string;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.85), rgba(11,11,11,0.6)), url(${heroBackground})`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0B]/20 via-[#0B0B0B]/70 to-[#0B0B0B]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:py-28">
        <div className="flex-1 space-y-6">
          <Badge
            variant="outline"
            className="border-[#2A2A2A] bg-[#141414]/80 text-[#F6F1E6]"
          >
            # No.1 Spesialis Emas ANTAM
          </Badge>
          <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            <GradientTitle>LM ANTAM CertiEye 2020+ <b>ONLY</b> </GradientTitle>
          </h1>
          <p className="text-xl  text-[#A1A1AA]">
            Transaksi Jual - Beli LM ANTAM No.1 Terbaik.  
          </p>          
          <p className="text-xl  text-[#A1A1AA]">
            Harga di bawah pasar | Buyback di atas Toko
          </p>          
          <p className="max-w-2xl text-lg leading-relaxed text-[#A1A1AA]">          
          COD area Jakarta-Bekasi atau kirim kurir seluruh Indonesia. Melayani Semua Jenis Pembayaran (Transfer/QRIS/Kartu Kredit)
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[#C8A848] text-black hover:bg-[#F0E078]"
            >
              <Link href="#form-order">Tanya Admin YUK</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-[#C8A848] bg-transparent text-[#C8A848] hover:bg-[#1A1A1A] hover:text-[#F6F1E6]"
            >
              <Link href="#steps">Cara Kerja</Link>
            </Button>
          </div>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Terpercaya", value: "CertiEye 2020+ ONLY" },
              { label: "Pembayaran ", value: "Menerima Semua Jenis Pembayaran" },
              { label: "Harga", value: "No.1 Terbaik" },
            ].map((item) => (
              <Card
                key={item.label}
                className="border-[#2A2A2A] bg-[#141414]/80 shadow-xs backdrop-blur"
              >
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs uppercase tracking-wide text-[#A1A1AA]">
                    {item.label}
                  </CardDescription>
                  <CardTitle className="text-lg text-[#F6F1E6]">
                    {item.value}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div> */}
        </div>

        <div className="flex-1">
          <Card className="border-[#2A2A2A] bg-[#141414]/90 pt-0 shadow-lg backdrop-blur">
            <LightboxCarousel
              images={heroSlides}
              sizes="(min-width: 1024px) 500px, 100vw"
              priority
              carouselClassName="relative"
              contentClassName="ml-0"
              itemClassName="pl-0"
              frameClassName="h-[360px] sm:h-[420px]"
              imageClassName="object-cover"
              triggerClassName="bg-[#0B0B0B]"
              prevClassName="left-3 top-1/2 -translate-y-1/2 border border-[#2A2A2A] bg-[#141414]/95 text-[#F6F1E6] shadow-sm"
              nextClassName="right-3 top-1/2 -translate-y-1/2 border border-[#2A2A2A] bg-[#141414]/95 text-[#F6F1E6] shadow-sm"
            />
            <CardFooter className="gap-2">
              <Button
                asChild
                className="flex-1 bg-[#C8A848] text-black hover:bg-[#F0E078]"
              >
                <Link href="#form-order">Tanya Admin YUK</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#C8A848] bg-transparent text-[#C8A848] hover:bg-[#1A1A1A] hover:text-[#F6F1E6]"
                asChild
              >
                <Link href="#steps">Cara Kerja</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TrustedStats() {
  const stats = [
    { value: "CertiEye 2020+", label: "Verified Aman & Terpercaya" },
    { value: "Pembayaran", label: "Semua Jenis Pembayaran" },
    { value: "Pengiriman", label: "COD Jakarta-Bekasi" },
    { value: "Buyback", label: "No.1 Harga Terbaik" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#2A2A2A] bg-[#141414]/70 p-6 shadow-sm sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1 text-center">
            <div className="text-lg font-semibold text-[#C8A848]">
              {stat.value}
            </div>
            <p className="text-sm text-[#A1A1AA]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  const items = [
    {
      title: "CertiEye 2020+ only",
      desc: "Fokus pada LM ANTAM yang mudah diverifikasi dan harga stabil",
    },
    {
      title: "Semua Jenis Pembayaran",
      desc: "Transfer, QRIS, dan kartu kredit untuk transaksi yang rapi.",
    },
    {
      title: "Fulfillment jelas",
      desc: "COD Jakarta-Bekasi atau kirim kurir, recap sebelum proses.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-8 space-y-3 text-center">
        <Badge variant="outline" className="border-[#2A2A2A] text-[#F6F1E6]">
          Kenapa NabungAntam ?
        </Badge>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Transaksi <GradientTitle>MENGUNTUNGKAN dan Transparan</GradientTitle>
        </h2>
        <p className="mx-auto max-w-3xl text-[#A1A1AA]">
          Fokus pada keaslian, alur konfirmasi jelas, dan pengalaman beli yang
          premium.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.title}
            className="border-[#2A2A2A] bg-[#141414]/80 shadow-md backdrop-blur"
          >
            <CardHeader>
              <CardTitle className="text-[#F6F1E6]">{item.title}</CardTitle>
              <CardDescription className="text-base text-[#A1A1AA]">
                {item.desc}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

function JourneySection() {
  const steps = [
    {
      title: "Isi Form",
      desc: "Pilih produk, tahun, dan jumlah yang diinginkan.",
    },
    {
      title: "Followup",
      desc: "Kami konfirmasi Stok dan Harga TERMURAH hari ini.",
    },
    {
      title: "Pilih pengiriman",
      desc: "COD Jakarta-Bekasi atau kirim kurir ke seluruh Indonesia",
    },
    {
      title: "Pembayaran",
      desc: "Transfer/QRIS/Kartu Kredit (tanpa cash). Recap sebelum proses.",
    },
  ];

  return (
    <section id="steps" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <Badge variant="outline" className="border-[#2A2A2A] text-[#F6F1E6]">
          Cara kerja
        </Badge>
        <h3 className="mt-3 text-3xl font-semibold">Alur Rapi dan Professional</h3>
        <p className="mx-auto mt-2 max-w-2xl text-[#A1A1AA]">
          Setiap langkah dikonfirmasi agar transaksi tetap transparan.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-[#2A2A2A] bg-[#141414]/70 p-6 shadow-sm lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#C8A848]/20 text-[#C8A848] font-semibold">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-[#F6F1E6]">
                {step.title}
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection({
  slides,
  backgroundImage,
}: {
  slides: AssetSlide[];
  backgroundImage: string;
}) {
  if (!slides.length) {
    return null;
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-fixed bg-cover bg-center py-16"
      style={{
        backgroundImage:
          `linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.82)), url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-[#0B0B0B]/30 via-[#0B0B0B]/40 to-[#0B0B0B]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge className="bg-[#C8A848] text-black">
              Premium experience
            </Badge>
            <h3 className="text-3xl font-semibold text-[#F6F1E6] sm:text-4xl">
              Transparan, rapi, dan premium
            </h3>
            <p className="max-w-2xl text-[#A1A1AA]">
              Alur singkat, konfirmasi jelas, dan fokus pada keaslian.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#C8A848] text-black hover:bg-[#F0E078]"
          >
            <Link href="#form-order">Tanya Admin YUK</Link>
          </Button>
        </div>

        <LightboxCarousel
          images={slides}
          sizes="(min-width: 1024px) 420px, 100vw"
          carouselClassName="relative"
          contentClassName="pb-10"
          itemClassName="md:basis-1/2 lg:basis-1/3"
          frameClassName="aspect-[1/1]"
          imageClassName="object-contain"
          triggerClassName="bg-[#141414]/80 shadow-none"
          prevClassName="left-2 top-1/2 -translate-y-1/2 bg-[#141414]/95 text-[#F6F1E6] shadow-sm"
          nextClassName="right-2 top-1/2 -translate-y-1/2 bg-[#141414]/95 text-[#F6F1E6] shadow-sm"
        />
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="order" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#141414]/80 shadow-xl">
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_0.95fr] sm:p-12" id="form-order">
          <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0B0B0B] sm:min-h-[360px]">
            <Image
              src="/assets/banner2.jpg"
              alt="LM ANTAM gold bar"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 520px, 100vw"
            />
            <div className="absolute inset-0 bg-linear-to-br from-[#0B0B0B]/70 via-transparent to-transparent" />
          </div>
          <NabungAntamOrderForm />
        </div>
      </div>
    </section>
  );
}
