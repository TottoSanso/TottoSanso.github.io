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
  { name: "Instagram", handle: "@tottosanso", url: "https://www.instagram.com/tottosanso", icon: "instagram" },
  { name: "YouTube", handle: "@tottosanso", url: "https://www.youtube.com/@tottosanso", icon: "youtube" },
];
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

renderLinks();
renderStatus();
renderCountdown();
observeReveal();
renderNews();
