/* App : Horloge (horloge mondiale, chrono) */
"use strict";

OS.registerApp({
  id: "clock",
  name: "Horloge",
  icon: "⏰",
  color: "#3b3b4f",
  render(body) {
    body.classList.add("padend");
    const app = this;

    const tabs = document.createElement("div");
    tabs.className = "clock-tabs";
    const viewClock = document.createElement("button");
    viewClock.textContent = "Horloge";
    const viewSw = document.createElement("button");
    viewSw.textContent = "Chrono";
    tabs.append(viewClock, viewSw);

    let offTick = null;

    function showClock() {
      setActive(viewClock);
      body.innerHTML = "";
      if (offTick) offTick();
      const view = buildClockView();
      offTick = view.dispose;
      body.append(tabs, view);
    }

    function showStopwatch() {
      setActive(viewSw);
      body.innerHTML = "";
      if (offTick) offTick();
      const view = buildStopwatchView(app);
      offTick = view.dispose;
      body.append(tabs, view);
    }

    function setActive(btn) {
      [viewClock, viewSw].forEach((b) => b.classList.toggle("active", b === btn));
    }

    viewClock.addEventListener("click", showClock);
    viewSw.addEventListener("click", showStopwatch);
    showClock();
  },
});

function buildClockView() {
  const wrap = document.createElement("div");
  wrap.innerHTML = '<div class="clock-big"></div><div class="clock-date"></div>';
  const big = wrap.querySelector(".clock-big");
  const date = wrap.querySelector(".clock-date");
  const update = () => {
    const now = new Date();
    big.textContent = now.toLocaleTimeString();
    date.textContent = now.toLocaleDateString([], {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  };
  update();
  const dispose = OS.on("tick", update);
  wrap.dispose = dispose;
  return wrap;
}

function buildStopwatchView(app) {
  const wrap = document.createElement("div");
  wrap.className = "stopwatch-view";

  let elapsed = 0;
  let running = false;
  let lastStart = 0;
  let laps = [];
  let offTick = null;

  const timeEl = document.createElement("div");
  timeEl.className = "sw-time";
  const controls = document.createElement("div");
  controls.className = "sw-controls";
  const startStop = document.createElement("button");
  startStop.className = "primary";
  const lap = document.createElement("button");
  lap.textContent = "Tour";
  const reset = document.createElement("button");
  reset.textContent = "Réinit.";
  controls.append(startStop, lap, reset);

  const lapsEl = document.createElement("div");
  lapsEl.className = "sw-laps";

  function fmt(ms) {
    const cs = Math.floor(ms / 10) % 100;
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / 60000);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0") + "," + String(cs).padStart(2, "0");
  }

  function render() {
    timeEl.textContent = fmt(elapsed + (running ? Date.now() - lastStart : 0));
    if (running) offTick = requestAnimationFrame(render);
  }

  function renderLaps() {
    lapsEl.innerHTML = "";
    [...laps].reverse().forEach((l, i) => {
      const row = document.createElement("div");
      row.className = "sw-lap";
      const idx = document.createElement("span");
      idx.textContent = "Tour " + (laps.length - i);
      const val = document.createElement("span");
      val.textContent = fmt(l);
      row.append(idx, val);
      lapsEl.appendChild(row);
    });
  }

  startStop.addEventListener("click", () => {
    if (running) {
      elapsed += Date.now() - lastStart;
      running = false;
      startStop.textContent = "Démarrer";
      startStop.className = "primary";
      cancelAnimationFrame(offTick);
    } else {
      running = true;
      lastStart = Date.now();
      startStop.textContent = "Stop";
      startStop.classList.add("stop");
      render();
    }
  });

  lap.addEventListener("click", () => {
    if (!running) return;
    laps.push(elapsed + Date.now() - lastStart);
    renderLaps();
  });

  reset.addEventListener("click", () => {
    running = false;
    elapsed = 0;
    laps = [];
    startStop.textContent = "Démarrer";
    startStop.className = "primary";
    renderLaps();
    timeEl.textContent = fmt(0);
  });

  timeEl.textContent = fmt(0);
  renderLaps();
  wrap.append(timeEl, controls, lapsEl);
  wrap.dispose = () => {
    running = false;
    cancelAnimationFrame(offTick);
  };
  return wrap;
}
