/* Noyau web : apps, notifications, persistance */
"use strict";

const OS = (() => {
  const $ = (sel) => document.querySelector(sel);

  const state = { currentApp: null, volume: 60 };

  const APPS = {};          // id -> { id, name, icon, color, render(container) }
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
    const clock = $("#top-clock");
    if (clock) clock.textContent = fmtTime(new Date());
  }

  /* ---------- Notifications ---------- */
  function notify(icon, iconBg, title, text, timeout = 4200) {
    if (!store.get("notifications", true)) return;
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

  /* ---------- Cycle de vie des apps ---------- */
  function registerApp(def) {
    APPS[def.id] = def;
  }

  function openApp(id) {
    const app = APPS[id];
    if (!app) return;

    const previous = state.currentApp && APPS[state.currentApp];
    if (previous && typeof previous.onClose === "function") previous.onClose();

    state.currentApp = id;
    const body = $("#app-body");
    body.innerHTML = "";
    body.classList.remove("padend");
    app.render(body);
    document.querySelectorAll(".top-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.app === id);
    });
    window.scrollTo(0, 0);
  }

  function closeApp() {
    const previous = state.currentApp && APPS[state.currentApp];
    state.currentApp = null;
    if (previous && typeof previous.onClose === "function") previous.onClose();
    $("#app-body").innerHTML = "";
    openApp("asteria");
  }

  function goBack() {
    const app = state.currentApp && APPS[state.currentApp];
    if (app && typeof app.onBack === "function" && app.onBack()) return;
    if (state.currentApp !== "asteria") openApp("asteria");
  }

  /* ---------- Plein écran ---------- */
  function toggleFullscreen() {
    const root = document.documentElement;
    if (!root.requestFullscreen) {
      notify("⛶", "#333b52", "Plein écran", "Plein écran non supporté par ce navigateur", 2200);
      return;
    }
    try {
      if (!document.fullscreenElement) {
        root.requestFullscreen().catch(() => notify("⛶", "#333b52", "Plein écran", "Indisponible dans ce contexte", 2200));
      } else {
        document.exitFullscreen();
      }
    } catch {
      notify("⛶", "#333b52", "Plein écran", "Indisponible dans ce contexte", 2200);
    }
  }
  function updateFsButton() {
    const btn = $("#btn-fullscreen");
    if (btn) btn.textContent = document.fullscreenElement ? "⤡ Quitter le plein écran" : "⛶ Plein écran";
  }

  /* ---------- Volume (réglage interne) ---------- */
  function setVolume(v) {
    state.volume = Math.max(0, Math.min(100, v));
    store.set("volume", state.volume);
  }

  /* ---------- Barre d'apps ---------- */
  function buildTabs() {
    const nav = $("#top-tabs");
    nav.innerHTML = "";
    Object.values(APPS).forEach((app) => {
      const btn = document.createElement("button");
      btn.className = "top-tab";
      btn.dataset.app = app.id;
      btn.innerHTML = `<span class="glyph" style="--icon-bg:${app.color}">${app.icon}</span>${app.name}`;
      btn.addEventListener("click", () => openApp(app.id));
      nav.appendChild(btn);
    });
  }

  /* ---------- Sélecteur de difficulté (Mode Histoire) ---------- */
  let diffSel = null;
  let diffRefresh = null;

  function buildDiffSelect(data) {
    const bar = $("#top-bar");
    if (!bar || !data || !data.storyDiffs || !data.setStoryDiff || diffSel) return;
    diffSel = document.createElement("select");
    diffSel.className = "top-diff";
    diffSel.id = "top-diff";
    diffSel.title = "Difficulté du Mode Histoire";
    diffRefresh = () => {
      diffSel.innerHTML = "";
      data.storyDiffs().forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.key;
        opt.textContent = (d.active ? "⚔ " : "") + d.label + (d.locked ? " 🔒" : "");
        opt.disabled = d.locked;
        diffSel.appendChild(opt);
      });
    };
    diffRefresh();
    diffSel.addEventListener("change", () => {
      const key = diffSel.value;
      if (data.setStoryDiff(key)) {
        notify("⚔", "#6b4f9e", "Mode Histoire", "Difficulté : " + keyLabel(data, key), 2600);
        if (state.currentApp === "asteria") openApp("asteria");
      }
      diffRefresh();
    });
    document.addEventListener("asteria-diff", diffRefresh);
    bar.insertBefore(diffSel, $("#btn-fullscreen"));
  }

  function keyLabel(data, key) {
    const d = data.storyDiffs().find((x) => x.key === key);
    return d ? d.label : key;
  }

  /* ---------- Événements globaux ---------- */
  function bindGlobal() {
    $("#btn-fullscreen").addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFsButton);
    document.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") goBack();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    state.volume = store.get("volume", 60);
    bindGlobal();
    buildTabs();
    tick();
    setInterval(tick, 15000);
    openApp(Object.keys(APPS)[0] || "asteria");
  }

  return {
    APPS,
    state,
    store,
    on, emit,
    init,
    registerApp,
    openApp, closeApp, goBack,
    notify,
    toggleFullscreen,
    buildDiffSelect,
    setVolume,
    fmtTime, fmtDate,
    buildTabs,
  };
})();
