"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LightboxImage = {
  src: string;
  alt: string;
};

type LightboxCarouselProps = {
  images: LightboxImage[];
  sizes: string;
  priority?: boolean;
  opts?: React.ComponentProps<typeof Carousel>["opts"];
  carouselClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  triggerClassName?: string;
  frameClassName?: string;
  imageClassName?: string;
  prevClassName?: string;
  nextClassName?: string;
  modalClassName?: string;
  modalFrameClassName?: string;
  modalImageClassName?: string;
  showNav?: boolean;
};

export function LightboxCarousel({
  images,
  sizes,
  priority = false,
  opts,
  carouselClassName,
  contentClassName,
  itemClassName,
  triggerClassName,
  frameClassName,
  imageClassName,
  prevClassName,
  nextClassName,
  modalClassName,
  modalFrameClassName,
  modalImageClassName,
  showNav = true,
}: LightboxCarouselProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [modalApi, setModalApi] = React.useState<CarouselApi | null>(null);
  const activeTitle =
    openIndex !== null && images[openIndex]?.alt
      ? images[openIndex].alt
      : "Preview gambar";

  React.useEffect(() => {
    if (openIndex === null || !modalApi) return;
    modalApi.scrollTo(openIndex, true);
  }, [openIndex, modalApi]);

  const showArrows = showNav && images.length > 1;

  return (
    <>
      <Carousel
        opts={{ align: "start", loop: true, ...opts }}
        className={carouselClassName}
      >
        <CarouselContent className={contentClassName}>
          {images.map((item, index) => (
            <CarouselItem key={item.src} className={itemClassName}>
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#0B0B0B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A848]/60",
                  triggerClassName
                )}
                aria-label={`Buka gambar ${item.alt}`}
              >
                <div className={cn("relative w-full", frameClassName)}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className={cn("object-contain", imageClassName)}
                    sizes={sizes}
                    priority={priority && index === 0}
                  />
                </div>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showArrows && (
          <>
            <CarouselPrevious className={prevClassName} />
            <CarouselNext className={nextClassName} />
          </>
        )}
      </Carousel>
      <Dialog open={openIndex !== null} onOpenChange={(open) => {
        if (!open) setOpenIndex(null);
      }}>
        <DialogContent
          className={cn(
            "w-[90vw] max-w-[90vw] border border-[#2A2A2A] bg-[#0B0B0B] p-3 sm:w-[80vw] sm:max-w-none sm:p-4 md:w-[900px]",
            modalClassName
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{activeTitle}</DialogTitle>
            <DialogDescription>
              Geser atau gunakan panah untuk melihat gambar lainnya.
            </DialogDescription>
          </DialogHeader>
          <Carousel
            setApi={setModalApi}
            opts={{ align: "center", loop: true }}
            className="relative"
          >
            <CarouselContent className="ml-0">
              {images.map((item) => (
                <CarouselItem key={item.src} className="pl-0">
                  <div
                    className={cn("relative h-[75vh] w-full", modalFrameClassName)}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className={cn("object-contain", modalImageClassName)}
                      sizes="90vw"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {showArrows && (
              <>
                <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 border border-[#2A2A2A] bg-[#141414]/95 text-[#F6F1E6] shadow-sm" />
                <CarouselNext className="right-4 top-1/2 -translate-y-1/2 border border-[#2A2A2A] bg-[#141414]/95 text-[#F6F1E6] shadow-sm" />
              </>
            )}
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
