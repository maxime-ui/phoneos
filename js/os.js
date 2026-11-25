/* PhoneOS — noyau : état système, apps, notifications */
"use strict";

const OS = (() => {
  const $ = (sel) => document.querySelector(sel);

  const state = {
    powered: true,
    locked: true,
    booted: false,
    currentApp: null,
    recents: [],
    battery: 100,
    charging: false,
    airplane: false,
    volume: 60,
    brightness: 100,
    wallpaper: "aurora",
    ticking: null,
  };

  const APPS = {};          // id -> { id, name, icon, color, dock, render(container) }
  const listeners = {};     // events simples

  function on(evt, fn) {
    (listeners[evt] ||= []).push(fn);
    return () => {
      listeners[evt] = listeners[evt].filter((f) => f !== fn);
    };
  }
  function emit(evt, data) {
    (listeners[evt] || []).forEach((fn) => fn(data));
  }

  /* ---------- Persistance ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("phoneos:" + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("phoneos:" + key, JSON.stringify(value));
      } catch {
        /* stockage indisponible : OK en mémoire */
      }
    },
  };

  /* ---------- Horloge ---------- */
  function fmtTime(d = new Date()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function fmtDate(d = new Date()) {
    return d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
  }

  function tick() {
    const now = new Date();
    $("#status-time").textContent = fmtTime(now);
    $("#lock-clock").textContent = fmtTime(now);
    $("#lock-date").textContent = fmtDate(now);
    // batterie simulée : -1% toutes les 45 s, cycles 20..100
    if (!state.charging && now.getSeconds() % 45 === 0 && state.battery > 20) {
      setBattery(state.battery - 1);
    }
    emit("tick", now);
  }

  /* ---------- Écran / couches ---------- */
  function showLayer(name) {
    ["boot", "lock", "home", "recents", "app"].forEach((l) => {
      document.getElementById("layer-" + l).classList.toggle("hidden", l !== name);
    });
  }

  function unlock() {
    state.locked = false;
    showLayer(state.currentApp ? "app" : "home");
    $("#nav-bar").classList.remove("hidden");
  }

  function lock() {
    state.locked = true;
    showLayer("lock");
  }

  /* ---------- Notifications ---------- */
  function notify(icon, iconBg, title, text, timeout = 4200) {
    const tpl = document.getElementById("tpl-notification");
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".notif-icon").textContent = icon;
    node.querySelector(".notif-icon").style.setProperty("--icon-bg", iconBg);
    node.querySelector(".notif-title").textContent = title;
    node.querySelector(".notif-text").textContent = text;
    $("#notif-stack").appendChild(node);
    setTimeout(() => {
      node.classList.add("closing");
      setTimeout(() => node.remove(), 320);
    }, timeout);
  }

  /* ---------- État système ---------- */
  function setBattery(v) {
    state.battery = Math.max(0, Math.min(100, v));
    $("#status-batt").textContent = state.battery + "%";
    $("#status-batt-icon").textContent = state.charging ? "⚡" : state.battery < 20 ? "🪫" : "🔋";
  }

  function setAirplane(on) {
    state.airplane = on;
    $("#status-plane").classList.toggle("hidden", !on);
    $("#status-wifi").classList.toggle("hidden", on);
  }

  function setBrightness(v) {
    state.brightness = v;
    document.documentElement.style.setProperty("--light", String(v / 100));
  }

  function setVolume(v) {
    const before = state.volume;
    state.volume = Math.max(0, Math.min(100, v));
    if (state.volume > before) notify("🔊", "#333b52", "Volume", state.volume + "%", 1400);
  }

  /* ---------- Cycle de vie des apps ---------- */
  function registerApp(def) {
    APPS[def.id] = def;
  }

  function openApp(id) {
    const app = APPS[id];
    if (!app || state.locked || !state.powered) return;

    state.currentApp = id;
    if (!state.recents.includes(id)) state.recents.unshift(id);
    else state.recents = [id, ...state.recents.filter((r) => r !== id)];

    $("#app-title").textContent = app.name;
    const body = $("#app-body");
    body.innerHTML = "";
    body.classList.remove("padend");
    app.render(body);
    showLayer("app");
  }

  function closeApp() {
    state.currentApp = null;
    $("#app-body").innerHTML = "";
    showLayer("home");
  }

  function goBack() {
    if (state.locked || !state.powered) return;
    const app = state.currentApp && APPS[state.currentApp];
    if (app && typeof app.onBack === "function" && app.onBack()) return;
    closeApp();
  }

  function showRecents() {
    if (state.locked || !state.powered) return;
    const list = $("#recents-list");
    list.innerHTML = "";
    if (!state.recents.length) {
      list.innerHTML = '<div class="recents-empty">Aucune application récente</div>';
    } else {
      state.recents.forEach((id) => {
        const app = APPS[id];
        if (!app) return;
        const card = document.createElement("button");
        card.className = "recents-card";
        card.innerHTML = `
          <div class="glyph" style="--icon-bg:${app.color}">${app.icon}</div>
          <div>${app.name}</div>`;
        card.addEventListener("click", () => {
          showLayer("app");
          openApp(id);
        });
        list.appendChild(card);
      });
    }
    showLayer("recents");
  }

  function clearRecents() {
    state.recents = [];
    state.currentApp = null;
    $("#app-body").innerHTML = "";
    showLayer("home");
  }

  /* ---------- Power ---------- */
  function powerOff() {
    state.powered = false;
    state.currentApp = null;
    clearInterval(state.ticking);
    ["home", "recents", "app", "lock", "notif-stack", "nav-bar"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    $("#screen-off").classList.remove("hidden");
  }

  function boot() {
    state.powered = true;
    state.locked = true;
    state.booted = false;
    state.battery = 100;
    $("#screen-off").classList.add("hidden");
    ["notif-stack", "nav-bar"].forEach((id) => document.getElementById(id).classList.add("hidden"));
    $("#layer-lock").classList.add("hidden");
    $("#layer-home").classList.add("hidden");
    $("#layer-recents").classList.add("hidden");
    $("#layer-app").classList.add("hidden");
    $("#layer-boot").classList.remove("hidden");

    const bar = $("#boot-bar");
    let p = 0;
    const iv = setInterval(() => {
      p += 8 + Math.random() * 14;
      bar.style.width = Math.min(100, p) + "%";
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          state.booted = true;
          $("#layer-boot").classList.add("hidden");
          $("#layer-lock").classList.remove("hidden");
          showLayer("lock");
          $("#nav-bar").classList.remove("hidden");
          buildLockPad();
        }, 350);
      }
    }, 180);
  }

  /* ---------- Écran de verrouillage ---------- */
  let pinBuffer = "";
  const PIN = "1234";

  function buildLockPad() {
    const pad = $("#lock-pad");
    pad.innerHTML = "";
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];
    keys.forEach((k) => {
      const b = document.createElement("button");
      b.textContent = k;
      b.addEventListener("click", () => pressPin(k));
      pad.appendChild(b);
    });
    renderDots();
  }

  function pressPin(k) {
    const err = $("#lock-error");
    if (k === "C") {
      pinBuffer = "";
    } else if (k === "⌫") {
      pinBuffer = pinBuffer.slice(0, -1);
    } else if (pinBuffer.length < 4) {
      pinBuffer += k;
    }
    if (pinBuffer === PIN) {
      err.textContent = "";
      pinBuffer = "";
      unlock();
      return;
    }
    if (pinBuffer.length === 4 && pinBuffer !== PIN) {
      err.textContent = "Code incorrect";
      setTimeout(() => { pinBuffer = ""; err.textContent = ""; renderDots(); }, 500);
    } else {
      err.textContent = "";
    }
    renderDots();
  }

  function renderDots() {
    const dots = $("#lock-dots");
    dots.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const s = document.createElement("span");
      if (i < pinBuffer.length) s.classList.add("filled");
      dots.appendChild(s);
    }
  }

  /* ---------- Écran d'accueil ---------- */
  function buildHome() {
    const grid = $("#home-grid");
    const dock = $("#dock");
    grid.innerHTML = "";
    dock.innerHTML = "";
    Object.values(APPS).forEach((app) => {
      const btn = document.createElement("button");
      btn.className = "app-icon";
      btn.innerHTML = `
        <div class="glyph" style="--icon-bg:${app.color}">${app.icon}</div>
        <div class="label">${app.name}</div>`;
      btn.addEventListener("click", () => openApp(app.id));
      (app.dock ? dock : grid).appendChild(btn);
    });
  }

  /* ---------- Événements globaux ---------- */
  function bindHardware() {
    $("#btn-power").addEventListener("click", () => {
      if (state.powered && !$("#screen-off").classList.contains("hidden")) {
        resetSystem();
      } else if (state.powered) {
        powerOff();
      } else {
        boot();
      }
    });
    $("#screen-off").addEventListener("click", resetSystem);
    $("#btn-vol-up").addEventListener("click", () => setVolume(state.volume + 10));
    $("#btn-vol-down").addEventListener("click", () => setVolume(state.volume - 10));

    $("#nav-back").addEventListener("click", goBack);
    $("#nav-home").addEventListener("click", () => {
      if (!state.locked && state.powered) showLayer("home");
    });
    $("#nav-recents").addEventListener("click", showRecents);
    $("#recents-clear").addEventListener("click", clearRecents);
    $("#app-back").addEventListener("click", goBack);

    document.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.key === "Escape") goBack();
    });
  }

  function resetSystem() {
    boot();
    emit("reset");
  }

  /* ---------- Init ---------- */
  function init() {
    bindHardware();
    setBattery(store.get("battery", 100));
    state.charging = false;
    setAirplane(store.get("airplane", false));
    setBrightness(store.get("brightness", 100));
    buildHome();
    boot();
    state.ticking = setInterval(tick, 1000);
    tick();
  }

  return {
    APPS,
    state,
    store,
    on, emit,
    init,
    registerApp,
    openApp, closeApp, goBack, showRecents, clearRecents,
    notify,
    setBattery, setAirplane, setBrightness, setVolume,
    lock, unlock,
    fmtTime, fmtDate,
    buildHome,
  };
})();
