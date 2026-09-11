const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function stickyProgress(section) {
  const range = section.offsetHeight - window.innerHeight;
  if (range <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / range);
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pill = document.getElementById("onPill");
const comingSoon = document.getElementById("comingSoon");
const frost = document.getElementById("frostShots");
const wordCulture = document.getElementById("wordCulture");
const wordArchive = document.getElementById("wordArchive");
const chapterPill = document.querySelector("[data-chapter='pill']");
const chapterSoon = document.querySelector("[data-chapter='soon']");
const chapterFrost = document.querySelector("[data-chapter='frost']");
const chapterWords = document.querySelector("[data-chapter='words']");

function tick() {
  if (reduced) return;

  const on = easeInOutCubic(stickyProgress(chapterPill));
  pill.style.setProperty("--on", String(on));

  const soon = easeInOutCubic(clamp01((stickyProgress(chapterSoon) - 0.08) / 0.42));
  comingSoon.style.opacity = String(soon);
  comingSoon.style.transform = `translateY(${(1 - soon) * 28}px)`;

  const frostP = stickyProgress(chapterFrost);
  const clear = easeInOutCubic(clamp01(frostP / 0.55));
  const drop = clamp01((frostP - 0.55) / 0.45);
  frost.style.setProperty("--clear", String(clear));
  frost.style.setProperty("--drop", `${drop * 118}vh`);

  const words = stickyProgress(chapterWords);
  let culture = 0;
  let archive = 0;
  if (words < 0.42) culture = easeInOutCubic(words / 0.42);
  else if (words < 0.56) culture = 1 - easeInOutCubic((words - 0.42) / 0.14);
  if (words >= 0.5) archive = easeInOutCubic(clamp01((words - 0.5) / 0.32));

  wordCulture.style.opacity = String(culture);
  wordCulture.style.transform = `translate(calc(-50% + ${(1 - culture) * -42}vw), -50%)`;
  wordArchive.style.opacity = String(archive);
  wordArchive.style.transform = `translate(calc(-50% + ${(1 - archive) * 42}vw), -50%)`;
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
