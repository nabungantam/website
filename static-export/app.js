const HERO_SLIDES = [
  {
    "src": "assets/emas/1.jpg",
    "alt": "NabungAntam emas 1"
  },
  {
    "src": "assets/emas/2.jpg",
    "alt": "NabungAntam emas 2"
  },
  {
    "src": "assets/emas/3.jpg",
    "alt": "NabungAntam emas 3"
  },
  {
    "src": "assets/emas/4.jpg",
    "alt": "NabungAntam emas 4"
  },
  {
    "src": "assets/emas/5.jpg",
    "alt": "NabungAntam emas 5"
  },
  {
    "src": "assets/emas/6.jpg",
    "alt": "NabungAntam emas 6"
  }
];
const EXPERIENCE_SLIDES = [
  {
    "src": "assets/konten/1.webp",
    "alt": "NabungAntam konten 1"
  },
  {
    "src": "assets/konten/2.webp",
    "alt": "NabungAntam konten 2"
  },
  {
    "src": "assets/konten/3.webp",
    "alt": "NabungAntam konten 3"
  },
  {
    "src": "assets/konten/4.webp",
    "alt": "NabungAntam konten 4"
  },
  {
    "src": "assets/konten/5.webp",
    "alt": "NabungAntam konten 5"
  }
];
const WHATSAPP_NUMBER = "6287783791588";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

async function loadSlides(manifestUrl, fallback) {
  try {
    const response = await fetch(manifestUrl, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("Failed to load");
    }
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function initCarousel({ rootId, slides, fallbackSlides = [] }) {
  const root = document.getElementById(rootId);
  if (!root) {
    return;
  }

  const resolvedSlides = slides.length ? slides : fallbackSlides;
  if (!resolvedSlides.length) {
    root.closest("section")?.classList.add("is-hidden");
    return;
  }

  const track = root.querySelector(".carousel-track");
  const prevButton = root.querySelector(".carousel-prev");
  const nextButton = root.querySelector(".carousel-next");

  if (!track) {
    return;
  }

  track.innerHTML = "";
  resolvedSlides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel-slide";
    button.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt || "NabungAntam";
    img.loading = index === 0 ? "eager" : "lazy";
    img.decoding = "async";

    button.appendChild(img);
    button.addEventListener("click", () => openLightbox(resolvedSlides, index));
    track.appendChild(button);
  });

  const slideEls = Array.from(track.children);
  let currentIndex = 0;

  const goTo = (index, behavior = "smooth") => {
    const target = slideEls[index];
    if (!target) {
      return;
    }
    track.scrollTo({ left: target.offsetLeft, behavior });
    currentIndex = index;
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      goTo(clamp(currentIndex - 1, 0, slideEls.length - 1));
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goTo(clamp(currentIndex + 1, 0, slideEls.length - 1));
    });
  }

  if (slideEls.length < 2) {
    prevButton?.setAttribute("hidden", "true");
    nextButton?.setAttribute("hidden", "true");
  }

  let scrollFrame = null;
  track.addEventListener("scroll", () => {
    if (scrollFrame) {
      cancelAnimationFrame(scrollFrame);
    }
    scrollFrame = requestAnimationFrame(() => {
      const scrollLeft = track.scrollLeft;
      let nearestIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;
      slideEls.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = index;
        }
      });
      currentIndex = nearestIndex;
    });
  });

  window.addEventListener("resize", () => {
    goTo(currentIndex, "auto");
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxTrack = lightbox?.querySelector(".lightbox-track");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxCounter = lightbox?.querySelector(".lightbox-counter");

let lightboxSlides = [];
let lightboxIndex = 0;

function openLightbox(slides, startIndex) {
  if (!lightbox || !lightboxTrack) {
    return;
  }

  lightboxSlides = slides;
  lightboxIndex = startIndex;
  lightboxTrack.innerHTML = "";

  slides.forEach((slide, index) => {
    const frame = document.createElement("div");
    frame.className = "lightbox-slide";

    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt || "NabungAntam";
    img.loading = index === startIndex ? "eager" : "lazy";
    img.decoding = "async";

    frame.appendChild(img);
    lightboxTrack.appendChild(frame);
  });

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (slides.length < 2) {
    lightboxPrev?.setAttribute("hidden", "true");
    lightboxNext?.setAttribute("hidden", "true");
  } else {
    lightboxPrev?.removeAttribute("hidden");
    lightboxNext?.removeAttribute("hidden");
  }

  goToLightbox(lightboxIndex, "auto");
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function goToLightbox(index, behavior = "smooth") {
  if (!lightboxTrack) {
    return;
  }

  const slides = Array.from(lightboxTrack.children);
  const target = slides[index];
  if (!target) {
    return;
  }
  lightboxTrack.scrollTo({ left: target.offsetLeft, behavior });
  lightboxIndex = index;
  if (lightboxCounter) {
    lightboxCounter.textContent =
      String(index + 1) + "/" + String(slides.length);
  }
}

lightboxPrev?.addEventListener("click", () => {
  if (!lightboxSlides.length) {
    return;
  }
  goToLightbox((lightboxIndex - 1 + lightboxSlides.length) % lightboxSlides.length);
});

lightboxNext?.addEventListener("click", () => {
  if (!lightboxSlides.length) {
    return;
  }
  goToLightbox((lightboxIndex + 1) % lightboxSlides.length);
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const orderForm = document.getElementById("order-form");
orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const weight = document.getElementById("order-weight")?.value;
  const year = document.getElementById("order-year")?.value;
  const quantity = document.getElementById("order-qty")?.value;

  if (!weight || !year || !quantity) {
    return;
  }

  const message = [
    "Halo kak, mau tanya Stok & Harga hari ini:",
    "LM ANTAM CertiEye " + year,
    "Pecahan: " + weight + "g",
    "Jumlah: " + quantity,
  ].join("\n");

  const url =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  window.location.href = url;
});

async function bootstrap() {
  const [heroSlides, experienceSlides] = await Promise.all([
    loadSlides("assets/emas/manifest.json", HERO_SLIDES),
    loadSlides("assets/konten/manifest.json", EXPERIENCE_SLIDES),
  ]);

  initCarousel({
    rootId: "hero-carousel",
    slides: heroSlides,
    fallbackSlides: [{ src: "assets/banner1.jpg", alt: "NabungAntam" }],
  });

  initCarousel({
    rootId: "experience-carousel",
    slides: experienceSlides,
  });
}

bootstrap();
