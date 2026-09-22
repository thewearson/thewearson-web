const clamp01 = (n) => Math.min(1, Math.max(0, n));

const smoothstep = (t) => {
  t = clamp01(t);
  return t * t * (3 - 2 * t);
};

function stickyProgress(section) {
  const range = section.offsetHeight - window.innerHeight;
  if (range <= 0) return 0;
  return clamp01(-section.getBoundingClientRect().top / range);
}

function band(p, a, b, c, d) {
  if (p <= a || p >= d) return 0;
  if (p < b) return smoothstep((p - a) / Math.max(0.0001, b - a));
  if (p <= c) return 1;
  return 1 - smoothstep((p - c) / Math.max(0.0001, d - c));
}

function springStep(pos, vel, target, dt, omega) {
  const accel = omega * omega * (target - pos) - 2 * omega * vel;
  vel += accel * dt;
  pos += vel * dt;
  return [pos, vel];
}

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const pill = document.getElementById("onPill");
const knob = document.getElementById("onKnob");
const wordCulture = document.getElementById("wordCulture");
const wordArchive = document.getElementById("wordArchive");
const wordStars = document.getElementById("wordStars");
const chapterHero = document.querySelector("[data-chapter='hero']");
const chapterWords = document.querySelector("[data-chapter='words']");

let heroP = 0;
let wordsP = 0;
let heroV = 0;
let wordsV = 0;
let running = false;
let lastTs = 0;
let knobTravel = 0;
let wordTravel = 0;

function measure() {
  if (pill) {
    const h = pill.offsetHeight;
    const aspect = 1.990196;
    const pad = h * 12 / 102;
    const knobSize = h - pad * 2;
    knobTravel = h * aspect - pad * 2 - knobSize;
  }
  wordTravel = Math.min(window.innerWidth * 0.2, 320);
}

function setWord(el, amt, dir) {
  const t = clamp01(amt);
  const x = (1 - t) * dir;
  el.style.opacity = t.toFixed(4);
  el.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
}

function paint(hero, words) {
  const on = smoothstep(clamp01(hero / 0.42));
  if (knob) {
    knob.style.transform = `translate3d(${(on * knobTravel).toFixed(2)}px, 0, 0)`;
  }

  const culture = band(words, 0.0, 0.13, 0.27, 0.48);
  const archive = band(words, 0.28, 0.44, 0.56, 0.76);
  const stars = band(words, 0.58, 0.74, 1.2, 1.4);

  setWord(wordCulture, culture, -wordTravel);
  setWord(wordArchive, archive, wordTravel);
  setWord(wordStars, stars, -wordTravel);
}

function frame(ts) {
  const targetHero = stickyProgress(chapterHero);
  const targetWords = stickyProgress(chapterWords);
  const dt = lastTs ? Math.min(0.048, (ts - lastTs) / 1000) : 0.016;
  lastTs = ts;

  const omega = finePointer ? 7.4 : 16;
  [heroP, heroV] = springStep(heroP, heroV, targetHero, dt, omega);
  [wordsP, wordsV] = springStep(wordsP, wordsV, targetWords, dt, omega);

  paint(heroP, wordsP);

  const settled =
    Math.abs(targetHero - heroP) < 0.0007 &&
    Math.abs(targetWords - wordsP) < 0.0007 &&
    Math.abs(heroV) < 0.015 &&
    Math.abs(wordsV) < 0.015;

  if (settled) {
    heroP = targetHero;
    wordsP = targetWords;
    heroV = 0;
    wordsV = 0;
    paint(heroP, wordsP);
    running = false;
    lastTs = 0;
    return;
  }
  requestAnimationFrame(frame);
}

function requestTick() {
  if (reduced || running) return;
  running = true;
  requestAnimationFrame(frame);
}

if (!reduced) {
  measure();
  requestTick();
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    requestTick();
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function playWhileVisible(el, play) {
  if (!el) return;
  let stop = () => {};
  const io = new IntersectionObserver(
    ([entry]) => {
      stop();
      if (entry.isIntersecting) stop = play() || (() => {});
    },
    { threshold: 0.32 }
  );
  io.observe(el);
}

const searchDemo = document.getElementById("searchDemo");
const searchTyped = document.getElementById("searchTyped");
const notifyStage = document.getElementById("notifyStage");
const feedDemo = document.getElementById("feedDemo");
const lookDemo = document.getElementById("lookDemo");
const saveDemo = document.getElementById("saveDemo");
const talkDemo = document.getElementById("talkDemo");
const talkTyped = document.getElementById("talkTyped");
const plateDemo = document.getElementById("plateDemo");
const plateName = document.getElementById("plateName");
const archDemo = document.getElementById("archDemo");
const archRail = archDemo ? archDemo.querySelector(".arch-rail") : null;
const regDemo = document.getElementById("regDemo");

function archGo(sel) {
  if (!archDemo || !archRail) return;
  const el = archDemo.querySelector(sel);
  const y = el ? el.offsetTop : 0;
  archRail.style.setProperty("--arch-y", `${-y}px`);
}

async function typeInto(el, text, delay, alive) {
  if (!el) return;
  el.textContent = "";
  for (const ch of text) {
    if (!alive()) return;
    el.textContent += ch;
    await wait(delay);
  }
}

if (reduced) {
  if (searchDemo && searchTyped) {
    searchDemo.classList.add("is-icon", "is-open", "is-caret", "is-type", "is-hits");
    searchTyped.textContent = "AS";
  }
  if (notifyStage) notifyStage.classList.add("is-in", "is-open");
  if (feedDemo) feedDemo.classList.add("is-liked", "is-saved");
  if (lookDemo) lookDemo.classList.add("is-fit", "is-piece");
  if (saveDemo) saveDemo.classList.add("is-vault");
  if (talkDemo && talkTyped) {
    talkDemo.classList.add("is-fit", "is-open", "is-one", "is-type", "is-post");
    talkTyped.textContent = "Keep this in the archive.";
  }
  if (plateDemo && plateName) {
    plateDemo.classList.add("is-in", "is-photo", "is-type", "is-stamp", "is-sig", "is-artist", "is-brand", "is-done");
    plateName.textContent = "MILES";
  }
  if (archDemo) {
    archDemo.classList.add("is-save-t", "is-save-w");
    archGo("#archWayneCards");
  }
  if (regDemo) regDemo.className = "reg-stage is-as";
} else {
  playWhileVisible(searchDemo, () => {
    let alive = true;
    const run = async () => {
      while (alive) {
        searchDemo.className = "search-stage";
        searchTyped.textContent = "";
        await wait(240);
        if (!alive) break;
        searchDemo.classList.add("is-icon");
        await wait(480);
        if (!alive) break;
        searchDemo.classList.add("is-open");
        await wait(620);
        if (!alive) break;
        searchDemo.classList.add("is-caret");
        await wait(380);
        if (!alive) break;
        searchTyped.textContent = "A";
        searchDemo.classList.add("is-type");
        await wait(150);
        if (!alive) break;
        searchTyped.textContent = "AS";
        await wait(200);
        if (!alive) break;
        searchDemo.classList.add("is-hits");
        await wait(2800);
      }
    };
    run();
    return () => {
      alive = false;
      searchDemo.className = "search-stage";
      searchTyped.textContent = "";
    };
  });

  playWhileVisible(notifyStage, () => {
    let alive = true;
    const run = async () => {
      notifyStage.classList.add("is-in");
      while (alive) {
        await wait(1100);
        if (!alive) break;
        notifyStage.classList.add("is-open");
        await wait(3400);
        if (!alive) break;
        notifyStage.classList.remove("is-open");
        await wait(1600);
      }
    };
    run();
    return () => {
      alive = false;
      notifyStage.classList.remove("is-in", "is-open");
    };
  });

  playWhileVisible(feedDemo, () => {
    let alive = true;
    const run = async () => {
      while (alive) {
        feedDemo.className = "feed-stage";
        await wait(700);
        if (!alive) break;
        feedDemo.classList.add("is-liked", "is-like-burst");
        await wait(1600);
        if (!alive) break;
        feedDemo.classList.remove("is-like-burst");
        await wait(500);
        if (!alive) break;
        feedDemo.classList.add("is-saved", "is-save-burst");
        await wait(1600);
        if (!alive) break;
        feedDemo.classList.remove("is-save-burst");
        await wait(1800);
      }
    };
    run();
    return () => {
      alive = false;
      feedDemo.className = "feed-stage";
    };
  });

  playWhileVisible(lookDemo, () => {
    let alive = true;
    const run = async () => {
      while (alive) {
        lookDemo.className = "look-stage";
        await wait(900);
        if (!alive) break;
        lookDemo.classList.add("is-press-fit");
        await wait(280);
        if (!alive) break;
        lookDemo.classList.remove("is-press-fit");
        lookDemo.classList.add("is-sheet-fit");
        await wait(900);
        if (!alive) break;
        lookDemo.classList.add("is-pick-cee");
        await wait(520);
        if (!alive) break;
        lookDemo.classList.remove("is-sheet-fit", "is-pick-cee");
        lookDemo.classList.add("is-fit");
        await wait(700);
        if (!alive) break;
        lookDemo.classList.add("is-press-piece");
        await wait(280);
        if (!alive) break;
        lookDemo.classList.remove("is-press-piece");
        lookDemo.classList.add("is-sheet-piece");
        await wait(900);
        if (!alive) break;
        lookDemo.classList.add("is-pick-miu");
        await wait(520);
        if (!alive) break;
        lookDemo.classList.remove("is-sheet-piece", "is-pick-miu");
        lookDemo.classList.add("is-piece");
        await wait(2800);
      }
    };
    run();
    return () => {
      alive = false;
      lookDemo.className = "look-stage";
    };
  });

  playWhileVisible(saveDemo, () => {
    let alive = true;
    const run = async () => {
      while (alive) {
        saveDemo.className = "save-stage";
        await wait(280);
        if (!alive) break;
        saveDemo.classList.add("is-cut", "is-wifi-3");
        await wait(480);
        if (!alive) break;
        saveDemo.classList.add("is-wifi-2");
        await wait(320);
        if (!alive) break;
        saveDemo.classList.add("is-wifi-1");
        await wait(320);
        if (!alive) break;
        saveDemo.classList.add("is-wifi-slash");
        await wait(900);
        if (!alive) break;
        saveDemo.classList.remove("is-cut", "is-wifi-3", "is-wifi-2", "is-wifi-1", "is-wifi-slash");
        saveDemo.classList.add("is-line");
        await wait(2200);
        if (!alive) break;
        saveDemo.classList.remove("is-line");
        saveDemo.classList.add("is-vault");
        await wait(3200);
      }
    };
    run();
    return () => {
      alive = false;
      saveDemo.className = "save-stage";
    };
  });

  playWhileVisible(talkDemo, () => {
    let alive = true;
    const still = () => alive;
    const run = async () => {
      while (alive) {
        talkDemo.className = "talk-stage";
        if (talkTyped) talkTyped.textContent = "";
        await wait(360);
        if (!alive) break;
        talkDemo.classList.add("is-fit");
        await wait(520);
        if (!alive) break;
        talkDemo.classList.add("is-open");
        await wait(700);
        if (!alive) break;
        talkDemo.classList.add("is-one");
        await wait(900);
        if (!alive) break;
        talkDemo.classList.add("is-caret");
        await wait(280);
        if (!alive) break;
        talkDemo.classList.add("is-type");
        await typeInto(talkTyped, "Keep this in the archive.", 42, still);
        if (!alive) break;
        await wait(280);
        if (!alive) break;
        talkDemo.classList.add("is-send");
        await wait(240);
        if (!alive) break;
        talkDemo.classList.remove("is-send", "is-caret", "is-type");
        if (talkTyped) talkTyped.textContent = "";
        talkDemo.classList.add("is-post");
        await wait(3600);
      }
    };
    run();
    return () => {
      alive = false;
      talkDemo.className = "talk-stage";
      if (talkTyped) talkTyped.textContent = "";
    };
  });

  playWhileVisible(plateDemo, () => {
    let alive = true;
    const still = () => alive;
    const run = async () => {
      while (alive) {
        plateDemo.className = "plate-stage";
        if (plateName) plateName.textContent = "";
        await wait(360);
        if (!alive) break;
        plateDemo.classList.add("is-in");
        await wait(620);
        if (!alive) break;
        plateDemo.classList.add("is-edit");
        await wait(520);
        if (!alive) break;
        plateDemo.classList.add("is-photo");
        await wait(480);
        if (!alive) break;
        plateDemo.classList.add("is-type");
        await typeInto(plateName, "MILES", 90, still);
        if (!alive) break;
        await wait(380);
        if (!alive) break;
        plateDemo.classList.add("is-stamp");
        await wait(520);
        if (!alive) break;
        plateDemo.classList.add("is-sig");
        await wait(420);
        if (!alive) break;
        plateDemo.classList.add("is-artist");
        await wait(560);
        if (!alive) break;
        plateDemo.classList.add("is-brand");
        await wait(420);
        if (!alive) break;
        plateDemo.classList.remove("is-edit");
        plateDemo.classList.add("is-done");
        await wait(4200);
      }
    };
    run();
    return () => {
      alive = false;
      plateDemo.className = "plate-stage";
      if (plateName) plateName.textContent = "";
    };
  });

  playWhileVisible(archDemo, () => {
    let alive = true;
    const run = async () => {
      while (alive) {
        archDemo.className = "arch-stage";
        archGo("#archTravis");
        await wait(1200);
        if (!alive) break;
        archGo("#archTravisCards");
        await wait(780);
        if (!alive) break;
        archDemo.classList.add("is-save-t");
        await wait(1600);
        if (!alive) break;
        archGo("#archWayne");
        await wait(1200);
        if (!alive) break;
        archGo("#archWayneCards");
        await wait(780);
        if (!alive) break;
        archDemo.classList.add("is-save-w");
        await wait(3200);
      }
    };
    run();
    return () => {
      alive = false;
      archDemo.className = "arch-stage";
      if (archRail) archRail.style.setProperty("--arch-y", "0px");
    };
  });

  playWhileVisible(regDemo, () => {
    let alive = true;
    const run = async () => {
      const pick = async (region, flag) => {
        regDemo.classList.add("is-press");
        await wait(280);
        if (!alive) return;
        regDemo.classList.remove("is-press");
        regDemo.classList.add("is-sheet");
        await wait(820);
        if (!alive) return;
        regDemo.classList.add(flag);
        await wait(520);
        if (!alive) return;
        regDemo.className = `reg-stage ${region}`;
        await wait(2400);
      };
      while (alive) {
        regDemo.className = "reg-stage is-na";
        await wait(900);
        if (!alive) break;
        await pick("is-as", "is-pick-as");
        if (!alive) break;
        await pick("is-eu", "is-pick-eu");
        if (!alive) break;
        await pick("is-na", "is-pick-na");
      }
    };
    run();
    return () => {
      alive = false;
      regDemo.className = "reg-stage is-na";
    };
  });
}
