const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeOut = (t) => 1 - (1 - t) ** 2;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function stickyProgress(section) {
  const range = section.offsetHeight - window.innerHeight;
  if (range <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / range);
}

function burstScale(t) {
  if (t <= 0) return 0.92;
  if (t < 0.34) return 0.92 + 0.12 * easeOutCubic(t / 0.34);
  if (t < 0.5) return 1.04 - 0.04 * easeInOut((t - 0.34) / 0.16);
  return 1;
}

function burstOpacity(t) {
  if (t <= 0) return 0;
  if (t < 0.14) return easeOut(t / 0.14);
  return 1;
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pill = document.getElementById("onPill");
const comingSoon = document.getElementById("comingSoon");
const frost = document.getElementById("frostShots");
const wordCulture = document.getElementById("wordCulture");
const wordArchive = document.getElementById("wordArchive");
const wordStars = document.getElementById("wordStars");
const chapterHero = document.querySelector("[data-chapter='hero']");
const chapterFrost = document.querySelector("[data-chapter='frost']");
const chapterWords = document.querySelector("[data-chapter='words']");

function emergeFromPill(t) {
  const w = comingSoon.offsetWidth;
  const h = comingSoon.offsetHeight;
  const radius = Math.min(w, h) * 0.2 + easeOutCubic(t) * Math.hypot(w, h);

  comingSoon.style.opacity = String(burstOpacity(t));
  comingSoon.style.transform = `scale(${burstScale(t)})`;
  comingSoon.style.clipPath = t >= 0.98 ? "none" : `circle(${radius}px at 0% 50%)`;
}

function tick() {
  if (reduced) return;

  const heroP = stickyProgress(chapterHero);
  const on = easeInOutCubic(clamp01(heroP / 0.4));
  pill.style.setProperty("--on", String(on));
  emergeFromPill(clamp01((heroP - 0.36) / 0.4));

  const frostP = stickyProgress(chapterFrost);
  const clear = easeInOutCubic(clamp01(frostP / 0.55));
  const drop = clamp01((frostP - 0.55) / 0.45);
  frost.style.setProperty("--clear", String(clear));
  frost.style.setProperty("--drop", `${drop * 118}vh`);

  const words = stickyProgress(chapterWords);
  let culture = 0;
  let archive = 0;
  let stars = 0;
  if (words < 0.34) {
    culture = words < 0.2 ? easeInOutCubic(words / 0.2) : 1 - easeInOutCubic((words - 0.2) / 0.14);
  }
  if (words >= 0.3 && words < 0.66) {
    if (words < 0.42) archive = easeInOutCubic((words - 0.3) / 0.12);
    else if (words < 0.52) archive = 1;
    else archive = 1 - easeInOutCubic((words - 0.52) / 0.14);
  }
  if (words >= 0.62) stars = easeInOutCubic(clamp01((words - 0.62) / 0.16));

  wordCulture.style.opacity = String(culture);
  wordCulture.style.transform = `translate(calc(-50% + ${(1 - culture) * -42}vw), -50%)`;
  wordArchive.style.opacity = String(archive);
  wordArchive.style.transform = `translate(calc(-50% + ${(1 - archive) * 42}vw), -50%)`;
  wordStars.style.opacity = String(stars);
  wordStars.style.transform = `translate(calc(-50% + ${(1 - stars) * -42}vw), -50%)`;
}

let raf = 0;
function requestTick() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    tick();
  });
}

if (!reduced) {
  tick();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
}
