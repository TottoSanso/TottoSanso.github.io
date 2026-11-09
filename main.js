// ============ CONFIG: editá acá ============
const CONFIG = {
  live: false,                                   // true cuando estés en vivo
  liveUrl: "https://www.twitch.tv/tottosanso228",
  schedule: "A confirmar",                       // ej: "Lun a Vie · 21:00 (ARG)"
  countdown: { label: "GTA 6", date: "2026-11-19T00:00:00" }, // poné null para ocultarlo
  discord: "https://discord.gg/g5gWxjDKUr",
};

const LINKS = [
  { name: "Discord", handle: "Totto | community", url: CONFIG.discord, icon: "discord", featured: true },
  { name: "Twitch", handle: "tottosanso228", url: "https://www.twitch.tv/tottosanso228", icon: "twitch" },
  { name: "Kick", handle: "tottosanso", url: "https://kick.com/tottosanso", icon: "kick" },
  { name: "Starvios", handle: "tottosanso", url: "https://starvios.com/tottosanso", icon: "starvios" },
  { name: "TikTok", handle: "@tottosanso", url: "https://www.tiktok.com/@tottosanso", icon: "tiktok" },
  { name: "Threads", handle: "@tottosanso", url: "https://www.threads.net/@tottosanso", icon: "threads" },
  { name: "X", handle: "@TottoSanso228", url: "https://x.com/TottoSanso228", icon: "x" },
  { name: "Instagram", handle: "@tottosanso", url: "https://www.instagram.com/tottosanso", icon: "instagram" },
  { name: "YouTube", handle: "@tottosanso", url: "https://www.youtube.com/@tottosanso", icon: "youtube" },
];
// Componentes de la PC (label = qué es, value = modelo)
const SPECS = [
  { label: "Procesador", value: "AMD Ryzen 7 5800X", note: "8 núcleos / 16 hilos" },
  { label: "Placa de video", value: "AMD Radeon RX 6650 XT", note: "8 GB GDDR6" },
  { label: "Memoria RAM", value: "32 GB G.Skill Trident Z RGB", note: "DDR4 3200 MHz CL16 · 4×8 GB" },
  { label: "Motherboard", value: "ASUS TUF Gaming B550-Plus", note: "AM4" },
  { label: "Almacenamiento", value: "WD_BLACK SN850X 1 TB", note: "NVMe + HDD Toshiba 1 TB" },
  { label: "Monitor principal", value: "Samsung Odyssey G7 28\"", note: "4K 144 Hz" },
  { label: "Monitor secundario", value: "Philips 241V8 24\"", note: "Full HD" },
  { label: "Captura", value: "Elgato 4K X", note: "Para la Xbox" },
  { label: "Consola", value: "Xbox Series X", note: "" },
];

// Galería: agregá imágenes en assets/galeria/ y sumalas acá
const GALLERY = [
  { src: "assets/banner.jpg", alt: "Banner del canal TottoSanso228" },
  { src: "assets/avatar.jpg", alt: "Logo de TottoSanso228" },
  { src: "assets/wordmark.png", alt: "Wordmark TottoSanso 228" },
];
const GALLERY_AUTOPLAY_MS = 4000;
// ==========================================

const $ = (sel) => document.querySelector(sel);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;

function renderLinks() {
  $("#links-grid").innerHTML = LINKS.map((l) => `
    <a class="link reveal${l.featured ? " link--featured" : ""}" href="${esc(l.url)}" target="_blank" rel="noopener">
      <span class="link__icon">${icon(l.icon)}</span>
      <span class="link__body">
        <span class="link__name">${esc(l.name)}</span>
        <span class="link__handle">${esc(l.handle)}</span>
      </span>
      ${icon("arrow", "link__arrow")}
    </a>`).join("");
}

function renderStatus() {
  const s = $("#status");
  s.href = CONFIG.liveUrl;
  if (CONFIG.live) {
    s.classList.add("is-live");
    $("#status-text").textContent = "En vivo ahora";
  } else {
    $("#status-text").textContent = "Offline · seguime para enterarte";
  }
  $("#discord-cta").href = CONFIG.discord;
  $("#stream-cta").href = CONFIG.liveUrl;
  $("#discord-footer").href = CONFIG.discord;
  $("#schedule").textContent = CONFIG.schedule;
  $("#year").textContent = new Date().getFullYear();
}

function renderCountdown() {
  const c = CONFIG.countdown;
  const el = $("#countdown");
  if (!c) return;
  const target = new Date(c.date).getTime();
  const tick = () => {
    const ms = target - Date.now();
    if (ms <= 0) { el.textContent = `${c.label} ya salió 🔥`; return; }
    const d = Math.floor(ms / 864e5);
    const h = Math.floor((ms % 864e5) / 36e5);
    el.textContent = `${c.label} en ${d}d ${h}h`;
  };
  tick();
  el.hidden = false;
  setInterval(tick, 60_000);
}

const fmtDate = (iso) => {
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
};

async function renderNews() {
  const box = $("#news-list");
  try {
    const res = await fetch("news.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    const items = (await res.json()).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    if (!items.length) { box.innerHTML = `<p class="muted">Todavía no hay novedades.</p>`; return; }
    box.innerHTML = items.map((n) => `
      <article class="news-card reveal">
        ${n.image ? `<img class="news-card__img" src="${esc(n.image)}" alt="" loading="lazy">` : ""}
        <div class="news-card__body">
          <time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.body)}</p>
          ${n.link ? `<a class="news-card__link" href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.linkText || "Ver más")} →</a>` : ""}
        </div>
      </article>`).join("");
    observeReveal();
  } catch (e) {
    box.innerHTML = `<p class="muted">No se pudieron cargar las novedades. Pasate por el Discord.</p>`;
  }
}

let io;
function observeReveal() {
  const els = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-visible")); return; }
  io ??= new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}

function renderSpecs() {
  $("#specs-grid").innerHTML = SPECS.map((s) => `
    <div class="spec reveal">
      <span class="spec__label">${esc(s.label)}</span>
      <span class="spec__value">${esc(s.value)}</span>
      ${s.note ? `<span class="spec__note">${esc(s.note)}</span>` : ""}
    </div>`).join("");
}

// Carrusel infinito: 3 visibles en desktop, 1 en celular. Avanza de a una.
function initCarousel() {
  const root = $("#carousel");
  const track = $("#carousel-track");
  const n = GALLERY.length;
  if (!n) { $("#galeria").hidden = true; return; }

  const slide = (g) => `<figure class="carousel__item"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></figure>`;
  // 3 copias para poder girar sin fin en ambos sentidos
  track.innerHTML = [...GALLERY, ...GALLERY, ...GALLERY].map(slide).join("");

  let index = n;
  let busy = false;
  const perView = () => parseInt(getComputedStyle(root).getPropertyValue("--per-view")) || 3;
  const move = (animate) => {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(-${(index * 100) / perView()}%)`;
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const settle = () => {
    if (index >= 2 * n) index -= n;
    if (index < n) index += n;
    move(false);
    busy = false;
  };
  const go = (dir) => {
    if (busy) return;
    busy = true;
    index += dir;
    move(true);
    if (reduce) settle(); // sin animación no hay transitionend
  };
  track.addEventListener("transitionend", (e) => { if (e.target === track) settle(); });

  root.querySelector(".carousel__btn--prev").addEventListener("click", () => { go(-1); restart(); });
  root.querySelector(".carousel__btn--next").addEventListener("click", () => { go(1); restart(); });
  window.addEventListener("resize", () => move(false));

  let timer;
  const start = () => { if (!reduce && GALLERY_AUTOPLAY_MS) timer = setInterval(() => { if (!document.hidden) go(1); }, GALLERY_AUTOPLAY_MS); };
  const stop = () => clearInterval(timer);
  const restart = () => { stop(); start(); };
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  // swipe en celular
  let x0 = null;
  root.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    x0 = null; start();
  });

  move(false);
  start();
}

renderLinks();
renderSpecs();
initCarousel();
renderStatus();
renderCountdown();
observeReveal();
renderNews();
