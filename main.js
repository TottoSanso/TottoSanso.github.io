// ============ CONFIG: editá acá ============
const CONFIG = {
  live: false,                                   // se detecta solo con Twitch (ver checkLive); esto es solo el valor inicial
  twitchUser: "tottosanso228",
  liveUrl: "https://www.twitch.tv/tottosanso228",
  schedule: "A confirmar",                       // ej: "Lun a Vie · 21:00 (ARG)"
  badge: "Jugando GTA 6 🔥",                     // cartelito al lado del estado; poné null para ocultarlo
  countdown: null,                               // ej: { label: "GTA 7", date: "2039-01-01T00:00:00" }
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
  { name: "Instagram", handle: "@tottosanso.tv", url: "https://www.instagram.com/tottosanso.tv/", icon: "instagram" },
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
  { src: "assets/galeria/gta6-3.jpg", alt: "GTA 6 en stream: atardecer manejando por un puente" },
  { src: "assets/galeria/gta6-1.jpg", alt: "GTA 6 en stream: en lancha por los pantanos" },
  { src: "assets/galeria/gta6-2.jpg", alt: "GTA 6 en stream: camioneta roja en Vice City" },
  { src: "assets/galeria/gta6-4.jpg", alt: "GTA 6 en stream: en moto por la ruta" },
  { src: "assets/galeria/gta6-5.jpg", alt: "GTA 6 en stream: puesto de flores" },
  { src: "assets/galeria/gta6-6.jpg", alt: "GTA 6 en stream: misión de noche" },
  { src: "assets/banner.jpg", alt: "Banner del canal TottoSanso228" },
];
const GALLERY_AUTOPLAY_MS = 4000;
// ==========================================

const $ = (sel) => document.querySelector(sel);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${id}"/></svg>`;

function renderLinks() {
  $("#links-grid").innerHTML = LINKS.map((l) => `
    <a class="link reveal${l.featured ? " link--featured" : ""}" href="${esc(l.url)}" data-umami-event="clic-red" data-umami-event-red="${esc(l.name)}" target="_blank" rel="noopener">
      <span class="link__icon">${icon(l.icon)}</span>
      <span class="link__body">
        <span class="link__name">${esc(l.name)}</span>
        <span class="link__handle">${esc(l.handle)}</span>
      </span>
      ${icon("arrow", "link__arrow")}
    </a>`).join("");
}

function setLive(live) {
  const s = $("#status");
  s.classList.toggle("is-live", live);
  $("#status-text").textContent = live ? "En vivo ahora" : "Offline · seguime para enterarte";
}

// Pregunta a decapi.me (gratis, sin claves) si el canal de Twitch está en vivo.
// Responde "<canal> is offline" o el tiempo en vivo ("1 hour, 5 minutes").
async function checkLive() {
  try {
    const res = await fetch(`https://decapi.me/twitch/uptime/${CONFIG.twitchUser}`, { cache: "no-store" });
    const txt = (await res.text()).trim();
    if (!res.ok || !txt) return;
    setLive(!/offline|error|not found|invalid|rate/i.test(txt));
  } catch (e) { /* sin conexión: queda como estaba */ }
}

function renderStatus() {
  $("#status").href = CONFIG.liveUrl;
  setLive(CONFIG.live);
  checkLive();
  setInterval(() => { if (!document.hidden) checkLive(); }, 120_000);
  $("#discord-cta").href = CONFIG.discord;
  $("#stream-cta").href = CONFIG.liveUrl;
  $("#discord-footer").href = CONFIG.discord;
  $("#schedule").textContent = CONFIG.schedule;
  $("#year").textContent = new Date().getFullYear();
}

function renderCountdown() {
  const c = CONFIG.countdown;
  const el = $("#countdown");
  if (!c) {
    if (CONFIG.badge) { el.textContent = CONFIG.badge; el.hidden = false; }
    return;
  }
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
    // "images": [...] = carrusel (se ve la portada + miniaturas); "image" = una sola foto
    const photos = (n) => (n.images?.length ? n.images : n.image ? [n.image] : []);
    box.innerHTML = items.map((n, i) => {
      const imgs = photos(n);
      const multi = imgs.length > 1;
      return `
      <article class="news-card reveal">
        ${imgs.length ? `
        <button class="news-card__media" type="button" data-news="${i}" data-idx="0" aria-label="Ver ${multi ? `las ${imgs.length} imágenes` : "la imagen"} en grande">
          <img class="news-card__img${multi ? " news-card__img--tall" : ""}" src="${esc(imgs[0])}" alt="" loading="lazy">
          ${multi ? `<span class="news-card__count">📷 ${imgs.length}</span>` : ""}
        </button>` : ""}
        ${multi ? `<div class="news-card__thumbs">${imgs.map((src, k) => `
          <button type="button" data-news="${i}" data-idx="${k}" aria-label="Ver imagen ${k + 1} de ${imgs.length}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("")}
        </div>` : ""}
        <div class="news-card__body">
          <time datetime="${esc(n.date)}">${esc(fmtDate(n.date))}</time>
          <h3>${esc(n.title)}</h3>
          <p>${esc(n.body)}</p>
          ${n.link ? `<a class="news-card__link" data-umami-event="clic-novedad" data-umami-event-titulo="${esc(n.title)}" href="${esc(n.link)}" target="_blank" rel="noopener">${esc(n.linkText || "Ver más")} →</a>` : ""}
        </div>
      </article>`;
    }).join("");
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-news]");
      if (!b) return;
      const n = items[+b.dataset.news];
      openLightbox(photos(n), +b.dataset.idx, n.title);
      window.umami?.track("ver-imagen-novedad", { titulo: n.title });
    });
    observeReveal();
  } catch (e) {
    box.innerHTML = `<p class="muted">No se pudieron cargar las novedades. Pasate por el Discord.</p>`;
  }
}

// ---------- Visor de imágenes ----------
const LB = { list: [], i: 0, title: "" };
function showLightbox() {
  const { list, i } = LB;
  $("#lightbox-img").src = list[i];
  $("#lightbox-img").alt = LB.title ? `${LB.title} (${i + 1} de ${list.length})` : "";
  $("#lightbox-title").textContent = LB.title;
  $("#lightbox-count").textContent = list.length > 1 ? `${i + 1} / ${list.length}` : "";
  document.querySelectorAll(".lightbox__nav").forEach((b) => { b.hidden = list.length < 2; });
  [list[i + 1], list[i - 1]].forEach((src) => { if (src) new Image().src = src; }); // precarga vecinas
}
function stepLightbox(d) {
  if (LB.list.length < 2) return;
  LB.i = (LB.i + d + LB.list.length) % LB.list.length;
  showLightbox();
}
function openLightbox(list, i = 0, title = "") {
  Object.assign(LB, { list, i, title });
  showLightbox();
  const dlg = $("#lightbox");
  if (!dlg.open) dlg.showModal();
}
function initLightbox() {
  const dlg = $("#lightbox");
  dlg.querySelector(".lightbox__close").addEventListener("click", () => dlg.close());
  dlg.querySelector(".lightbox__nav--prev").addEventListener("click", () => stepLightbox(-1));
  dlg.querySelector(".lightbox__nav--next").addEventListener("click", () => stepLightbox(1));
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // clic en el fondo
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") stepLightbox(1);
    if (e.key === "ArrowLeft") stepLightbox(-1);
  });
  let x0 = null;
  dlg.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) stepLightbox(dx < 0 ? 1 : -1);
    x0 = null;
  });
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
  // clic en una foto de la galería: se abre en grande
  track.addEventListener("click", (e) => {
    const fig = e.target.closest(".carousel__item");
    if (!fig) return;
    const k = [...track.children].indexOf(fig) % n;
    openLightbox(GALLERY.map((g) => g.src), k, "Galería");
  });

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
initLightbox();
initCarousel();
renderStatus();
renderCountdown();
observeReveal();
renderNews();
