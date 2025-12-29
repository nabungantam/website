import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, "static-export");
const publicDir = path.join(rootDir, "public");
const assetsDir = path.join(publicDir, "assets");
const heroDir = path.join(assetsDir, "emas");
const experienceDir = path.join(assetsDir, "konten");

const imageRegex = /\.(png|jpe?g|webp|avif|gif)$/i;

async function collectImages(dir, baseDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectImages(fullPath, baseDir)));
    } else if (entry.isFile() && imageRegex.test(entry.name)) {
      const relativePath = path
        .relative(baseDir, fullPath)
        .split(path.sep)
        .join("/");
      results.push(relativePath);
    }
  }

  return results;
}

async function listSlides(dir, prefix, altPrefix) {
  try {
    const files = await collectImages(dir, dir);
    return files
      .sort((a, b) => a.localeCompare(b))
      .map((file, index) => ({
        src: `${prefix}/${file}`,
        alt: `${altPrefix} ${index + 1}`,
      }));
  } catch {
    return [];
  }
}

async function writeFile(filePath, contents) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, contents);
}

async function main() {
  const heroSlides = await listSlides(heroDir, "assets/emas", "NabungAntam emas");
  const experienceSlides = await listSlides(
    experienceDir,
    "assets/konten",
    "NabungAntam konten"
  );
  const heroBackground = heroSlides[0]?.src ?? "assets/banner1.jpg";

  await fs.mkdir(outDir, { recursive: true });
  await fs.cp(assetsDir, path.join(outDir, "assets"), {
    recursive: true,
    force: true,
  });
  await writeFile(
    path.join(outDir, "assets", "emas", "manifest.json"),
    JSON.stringify(heroSlides, null, 2)
  );
  await writeFile(
    path.join(outDir, "assets", "konten", "manifest.json"),
    JSON.stringify(experienceSlides, null, 2)
  );

  try {
    await fs.copyFile(
      path.join(rootDir, "app", "favicon.ico"),
      path.join(outDir, "favicon.ico")
    );
  } catch {
    // Ignore if favicon is missing.
  }

  const html = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NabungAntam - LM ANTAM CertiEye 2020+ ONLY</title>
    <link rel="icon" href="favicon.ico" sizes="any" />
    <link rel="icon" href="assets/icon-mobile.png" type="image/png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header">
      <div class="container nav-wrap">
        <div class="logo">
          <img src="assets/icon-mobile.png" alt="NabungAntam icon" class="logo-icon" />
          <img src="assets/logo-text.png" alt="NabungAntam" class="logo-text" />
        </div>
        <nav class="nav-links">
          <a href="#steps">Alur</a>
          <span class="nav-divider">-</span>
          <a href="#form-order">Cek stok</a>
        </nav>
        <a class="btn btn-primary nav-cta" href="#form-order">Tanya Stok &amp; Harga</a>
      </div>
    </header>

    <main>
      <section class="hero" style="--hero-bg: url('${heroBackground}');">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="badge">#Spesialis Emas Antam</span>
            <h1 class="hero-title">
              <span class="gradient-text">LM ANTAM CertiEye 2020+ <strong>ONLY</strong></span>
            </h1>
            <p class="hero-desc">
              Transaksi aman dan verifikasi terpercaya, menerima seluruh jenis pembayaran
              (Transfer/QRIS/Kartu Kredit). COD area Bekasi-Jakarta atau kirim kurir seluruh Indonesia.
            </p>
            <div class="button-row">
              <a class="btn btn-primary" href="#form-order">Tanya Stok &amp; Harga</a>
              <a class="btn btn-outline" href="#steps">Cara Kerja</a>
            </div>
            <div class="hero-stats">
              <div class="stat-card">
                <p class="stat-label">Terpercaya</p>
                <p class="stat-value">CertiEye 2020+ ONLY</p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Pembayaran</p>
                <p class="stat-value">Menerima Kartu Kredit</p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Harga</p>
                <p class="stat-value">Dibawah Pasar</p>
              </div>
            </div>
          </div>

          <div class="hero-card card">
            <div class="carousel carousel--single" id="hero-carousel" aria-label="Galeri emas">
              <button class="carousel-btn carousel-prev" type="button" aria-label="Sebelumnya">
                &#10094;
              </button>
              <div class="carousel-track"></div>
              <button class="carousel-btn carousel-next" type="button" aria-label="Berikutnya">
                &#10095;
              </button>
            </div>
            <div class="hero-card-actions">
              <a class="btn btn-primary" href="#form-order">Tanya Stok &amp; Harga</a>
              <a class="btn btn-outline" href="#steps">Cara Kerja</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container stats-grid">
          <div class="stat">
            <p class="stat-value">CertiEye 2020+</p>
            <p class="stat-text">verified dan mudah dicek</p>
          </div>
          <div class="stat">
            <p class="stat-value">Transfer/QRIS/CC</p>
            <p class="stat-text">pembayaran tanpa cash</p>
          </div>
          <div class="stat">
            <p class="stat-value">COD Bekasi-Jakarta</p>
            <p class="stat-text">atau kirim kurir</p>
          </div>
          <div class="stat">
            <p class="stat-value">Recap</p>
            <p class="stat-text">konfirmasi sebelum proses</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container section-head centered">
          <span class="badge">Kenapa NabungAntam ?</span>
          <h2>
            Transaksi <span class="gradient-text">MENGUNTUNGKAN dan Transparan</span>
          </h2>
          <p class="muted">
            Fokus pada keaslian, alur konfirmasi jelas, dan pengalaman beli yang premium.
          </p>
        </div>
        <div class="container card-grid">
          <div class="card">
            <h3>CertiEye 2020+ only</h3>
            <p class="muted">Fokus pada LM ANTAM yang mudah diverifikasi dan harga stabil.</p>
          </div>
          <div class="card">
            <h3>Semua jenis pembayaran</h3>
            <p class="muted">Transfer, QRIS, dan kartu kredit untuk transaksi yang rapi.</p>
          </div>
          <div class="card">
            <h3>Fulfillment jelas</h3>
            <p class="muted">COD Bekasi-Jakarta atau kirim kurir, recap sebelum proses.</p>
          </div>
        </div>
      </section>

      <section id="steps" class="section">
        <div class="container section-head centered">
          <span class="badge">Cara kerja</span>
          <h2>Alur rapi dan jelas</h2>
          <p class="muted">Setiap langkah dikonfirmasi agar transaksi tetap transparan.</p>
        </div>
        <div class="container steps-card">
          <div class="step">
            <div class="step-title">
              <span class="step-number">1</span>
              <h4>Isi form</h4>
            </div>
            <p class="muted">Pilih produk, tahun, dan jumlah yang diinginkan.</p>
          </div>
          <div class="step">
            <div class="step-title">
              <span class="step-number">2</span>
              <h4>Followup</h4>
            </div>
            <p class="muted">Kami konfirmasi stok dan harga termurah hari ini.</p>
          </div>
          <div class="step">
            <div class="step-title">
              <span class="step-number">3</span>
              <h4>Pilih pengiriman</h4>
            </div>
            <p class="muted">COD Bekasi-Jakarta atau kirim kurir ke seluruh Indonesia.</p>
          </div>
          <div class="step">
            <div class="step-title">
              <span class="step-number">4</span>
              <h4>Pembayaran</h4>
            </div>
            <p class="muted">Transfer/QRIS/Kartu Kredit (tanpa cash). Recap sebelum proses.</p>
          </div>
        </div>
      </section>

      <section class="experience" id="experience">
        <div class="container">
          <div class="experience-head">
            <div>
              <span class="badge badge-gold">Premium experience</span>
              <h2>Transparan, rapi, dan premium</h2>
              <p class="muted">Alur singkat, konfirmasi jelas, dan fokus pada keaslian.</p>
            </div>
            <a class="btn btn-primary" href="#form-order">Tanya Stok &amp; Harga</a>
          </div>
          <div class="carousel carousel--multi" id="experience-carousel" aria-label="Konten pengalaman">
            <button class="carousel-btn carousel-prev" type="button" aria-label="Sebelumnya">
              &#10094;
            </button>
            <div class="carousel-track"></div>
            <button class="carousel-btn carousel-next" type="button" aria-label="Berikutnya">
              &#10095;
            </button>
          </div>
        </div>
      </section>

      <section id="order" class="section">
        <div class="container cta-card">
          <div class="cta-image">
            <img src="assets/banner1.jpg" alt="LM ANTAM gold bar" />
            <div class="cta-image-overlay"></div>
          </div>
          <div class="form-card">
            <h3>Form cek stok &amp; harga</h3>
            <p class="muted">
              Cukup isi produk, tahun, dan jumlah. Setelah submit langsung ke WhatsApp untuk cek stok &amp;
              harga hari ini.
            </p>
            <form id="order-form">
              <div class="form-row">
                <label class="form-field" for="order-weight">
                  Produk
                  <select id="order-weight" name="weight" required>
                    <option value="">Pilih produk</option>
                    <option value="1">1 gram</option>
                    <option value="3" selected>3 gram</option>
                    <option value="5">5 gram</option>
                    <option value="10">10 gram</option>
                    <option value="25">25 gram</option>
                    <option value="50">50 gram</option>
                  </select>
                </label>
                <label class="form-field" for="order-year">
                  Tahun
                  <select id="order-year" name="year" required>
                    <option value="">Pilih tahun</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024" selected>2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </label>
              </div>
              <label class="form-field" for="order-qty">
                Jumlah
                <input id="order-qty" name="quantity" type="number" min="1" value="1" required />
              </label>
              <button class="btn btn-primary" type="submit">Tanya Stok &amp; Harga</button>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="assets/icon-mobile.png" alt="NabungAntam logo" />
          </div>
          <div>
            <h4>NabungAntam</h4>
            <p class="muted">
              LM ANTAM CertiEye 2020+ only. Transaksi rapi, verifikasi jelas, pembayaran tanpa cash
              (Transfer/QRIS/CC).
            </p>
          </div>
        </div>
        <div>
          <h5>Pembayaran</h5>
          <p class="muted">Transfer</p>
          <p class="muted">QRIS</p>
          <p class="muted">Kartu Kredit</p>
        </div>
        <div>
          <h5>Pengiriman</h5>
          <p class="muted">COD Bekasi-Jakarta</p>
          <p class="muted">Kirim kurir (Seluruh Indonesia)</p>
        </div>
        <div>
          <h5>Akses cepat</h5>
          <a href="#steps">Alur transaksi</a>
          <a href="#form-order">Cek stok</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <p>2025 NabungAntam. Semua hak dilindungi.</p>
          <p>Nabung ANTAM, Bisa Pakai Kartu Kredit.</p>
        </div>
      </div>
    </footer>

    <div class="lightbox" id="lightbox" aria-hidden="true">
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" aria-describedby="lightbox-desc">
        <div class="lightbox-header">
          <h2 id="lightbox-title" class="sr-only">Preview gambar</h2>
          <p id="lightbox-desc" class="sr-only">Gunakan tombol navigasi untuk melihat gambar lain.</p>
          <button class="lightbox-close" type="button" aria-label="Tutup">&times;</button>
        </div>
        <div class="lightbox-carousel">
          <button class="carousel-btn lightbox-prev" type="button" aria-label="Sebelumnya">
            &#10094;
          </button>
          <div class="lightbox-track"></div>
          <button class="carousel-btn lightbox-next" type="button" aria-label="Berikutnya">
            &#10095;
          </button>
        </div>
        <div class="lightbox-counter" aria-live="polite"></div>
      </div>
    </div>

    <script src="app.js" defer></script>
  </body>
</html>
`;

  const css = `:root {
  --bg: #0b0b0b;
  --bg-soft: #141414;
  --border: #2a2a2a;
  --text: #f6f1e6;
  --muted: #a1a1aa;
  --gold: #c8a848;
  --gold-bright: #f0e078;
  --shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Plus Jakarta Sans", sans-serif;
  background: var(--bg);
  color: var(--text);
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font: inherit;
}

.container {
  width: min(1200px, 100% - 2rem);
  margin: 0 auto;
}

.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.is-hidden {
  display: none !important;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid #1a1a1a;
  background: rgba(11, 11, 11, 0.95);
  backdrop-filter: blur(12px);
}

.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  height: 28px;
  width: auto;
  object-fit: contain;
}

.nav-links,
.nav-cta {
  display: none;
}

.nav-links {
  gap: 28px;
  font-size: 14px;
  color: var(--muted);
}

.nav-links a:hover {
  color: var(--text);
}

.nav-divider {
  color: #2a2a2a;
}

@media (min-width: 640px) {
  .nav-wrap {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 24px;
  }

  .nav-links {
    display: inline-flex;
    justify-self: center;
    align-items: center;
  }

  .nav-cta {
    display: inline-flex;
    justify-self: end;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size: 12px;
}

.badge-gold {
  background: var(--gold);
  color: #111;
  border-color: transparent;
}

.hero {
  position: relative;
  padding: 72px 0 96px;
  background-image: linear-gradient(120deg, rgba(0, 0, 0, 0.85), rgba(11, 11, 11, 0.55)),
    var(--hero-bg, linear-gradient(120deg, #0b0b0b, #1b1b1b));
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 11, 11, 0.15), rgba(11, 11, 11, 0.65), #0b0b0b);
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 32px;
}

.hero-title {
  margin: 16px 0;
  font-size: 32px;
  line-height: 1.15;
}

.hero-desc {
  max-width: 560px;
  color: var(--muted);
  line-height: 1.6;
}

.gradient-text {
  background: linear-gradient(90deg, #c8a848, #f0e078, #a8842a);
  -webkit-background-clip: text;
  color: transparent;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0 26px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: var(--gold);
  color: #000;
}

.btn-primary:hover {
  background: var(--gold-bright);
}

.btn-outline {
  background: transparent;
  border-color: var(--gold);
  color: var(--gold);
}

.btn-outline:hover {
  background: rgba(200, 168, 72, 0.15);
  color: var(--text);
}

.hero-stats {
  display: grid;
  gap: 12px;
}

.stat-card {
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.8);
  border-radius: 16px;
  padding: 14px 16px;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin: 0 0 6px;
}

.stat-value {
  margin: 0;
  font-weight: 600;
}

@media (min-width: 720px) {
  .hero-title {
    font-size: 40px;
  }

  .hero-stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
  }

  .hero-title {
    font-size: 48px;
  }
}

.card {
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.85);
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.hero-card {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.hero-card-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.carousel {
  position: relative;
  height: var(--carousel-height, 360px);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  background: #0b0b0b;
}

.carousel-track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-slide {
  flex: 0 0 100%;
  scroll-snap-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #0b0b0b;
  border: none;
  cursor: pointer;
}

.carousel-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #0b0b0b;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.95);
  color: var(--text);
  cursor: pointer;
}

.carousel-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.carousel-prev {
  left: 12px;
}

.carousel-next {
  right: 12px;
}

.carousel--multi {
  --carousel-height: 320px;
}

.carousel--multi .carousel-slide {
  flex: 0 0 85%;
}

.carousel--single {
  --carousel-height: 360px;
}

.section {
  padding: 64px 0;
}

.stats-grid {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.8);
}

.stat {
  text-align: center;
}

.stat-text {
  color: var(--muted);
  font-size: 13px;
}

.section-head {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
}

.section-head.centered {
  text-align: center;
  justify-items: center;
}

.section-head h2 {
  margin: 0;
  font-size: 28px;
}

.muted {
  color: var(--muted);
  line-height: 1.6;
}

.card-grid {
  display: grid;
  gap: 16px;
}

.card-grid .card {
  padding: 20px;
}

.steps-card {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.8);
}

.step {
  display: grid;
  gap: 8px;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: rgba(200, 168, 72, 0.2);
  color: var(--gold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.experience {
  position: relative;
  padding: 72px 0;
  background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.82)),
    url("assets/banner2.jpg");
  background-size: cover;
  background-position: center;
}

.experience-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.cta-card {
  display: grid;
  gap: 24px;
  padding: 24px;
  border-radius: 28px;
  border: 1px solid var(--border);
  background: rgba(20, 20, 20, 0.8);
  box-shadow: var(--shadow);
}

.cta-image {
  position: relative;
  min-height: 260px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #0b0b0b;
}

.cta-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cta-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(11, 11, 11, 0.7), rgba(11, 11, 11, 0));
}

.form-card {
  border-radius: 20px;
  border: 1px solid var(--border);
  background: #0b0b0b;
  padding: 24px;
  display: grid;
  gap: 16px;
}

.form-card form {
  display: grid;
  gap: 16px;
}

.form-row {
  display: grid;
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

select,
input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #101010;
  color: var(--text);
}

select:focus,
input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(200, 168, 72, 0.2);
}

.footer {
  position: relative;
  overflow: hidden;
  border-top: 1px solid #1a1a1a;
  background: #0b0b0b;
}

.footer::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("assets/banner1.jpg"), url("assets/banner2.jpg"), url("assets/logo.jpg");
  background-size: cover, cover, cover;
  background-position: center, center, center;
  background-repeat: no-repeat;
  opacity: 0.2;
  pointer-events: none;
}

.footer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(11, 11, 11, 0.75), rgba(11, 11, 11, 0.85), #0b0b0b);
  pointer-events: none;
}

.footer-grid,
.footer-bottom {
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: grid;
  gap: 24px;
  padding: 48px 0 24px;
}

.footer-grid h5 {
  margin-bottom: 8px;
}

.footer-grid a {
  display: block;
  margin-top: 6px;
}

.footer-brand {
  display: flex;
  gap: 16px;
}

.footer-logo {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #141414;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.footer-bottom {
  border-top: 1px solid #1a1a1a;
}

.footer-bottom-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 0;
  font-size: 12px;
  color: var(--muted);
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.lightbox.is-open {
  display: flex;
}

.lightbox-dialog {
  width: min(900px, 95vw);
  border-radius: 20px;
  border: 1px solid var(--border);
  background: #0b0b0b;
  padding: 12px;
  box-shadow: var(--shadow);
}

.lightbox-header {
  display: flex;
  justify-content: flex-end;
}

.lightbox-close {
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 28px;
  cursor: pointer;
}

.lightbox-carousel {
  position: relative;
  height: min(70vh, 620px);
}

.lightbox-track {
  display: flex;
  height: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.lightbox-track::-webkit-scrollbar {
  display: none;
}

.lightbox-slide {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.lightbox-slide img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #0b0b0b;
}

.lightbox-counter {
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  padding: 8px 0 4px;
}

body.modal-open {
  overflow: hidden;
}

@media (min-width: 640px) {
  .carousel--multi .carousel-slide {
    flex: 0 0 48%;
  }

  .carousel--single {
    --carousel-height: 420px;
  }

  .form-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .stats-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .steps-card {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .cta-card {
    grid-template-columns: 1fr 1fr;
    padding: 40px;
  }

  .footer-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .carousel--multi .carousel-slide {
    flex: 0 0 33.333%;
  }
}
`;

const js = `const HERO_SLIDES = ${JSON.stringify(heroSlides, null, 2)};
const EXPERIENCE_SLIDES = ${JSON.stringify(experienceSlides, null, 2)};
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
      String(index + 1) + \"/\" + String(slides.length);
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
    "Halo kak, mau tanya stok & harga LM ANTAM hari ini ya \\u{1F60A}",
    "",
    "Produk: " + weight + " gram",
    "Tahun: " + year,
    "Jumlah: " + quantity,
    "",
    "Terima kasih \\u{1F64F}",
  ].join("\\n");

  const url =
    \"https://wa.me/\" + WHATSAPP_NUMBER + \"?text=\" + encodeURIComponent(message);
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
`;

  await writeFile(path.join(outDir, "index.html"), html);
  await writeFile(path.join(outDir, "styles.css"), css);
  await writeFile(path.join(outDir, "app.js"), js);

  console.log("Static site generated in static-export/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
