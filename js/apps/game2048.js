/* App : 2048 */
"use strict";

OS.registerApp({
  id: "game2048",
  name: "2048",
  icon: "🔢",
  color: "#a54f2f",
  render(body) {
    body.classList.add("padend");
    const app = this;

    let grid, score, over;
    let best = OS.store.get("2048-best", 0);

    const scoreLine = document.createElement("div");
    scoreLine.className = "game-scoreline";

    const board = document.createElement("div");
    board.className = "board2048";
    const cells = [];
    for (let i = 0; i < 16; i++) {
      const c = document.createElement("div");
      c.className = "tile2048";
      cells.push(c);
      board.appendChild(c);
    }

    const status = document.createElement("div");
    status.className = "game-status";

    const pad = document.createElement("div");
    pad.className = "dpad";
    function empty() { return document.createElement("div"); }
    function dpadBtn(label, dir) {
      const b = document.createElement("button");
      b.textContent = label;
      b.addEventListener("click", () => move(dir));
      return b;
    }
    const btnUp = dpadBtn("↑", "up");
    const btnLeft = dpadBtn("←", "left");
    const btnRight = dpadBtn("→", "right");
    const btnDown = dpadBtn("↓", "down");
    pad.append(
      empty(), btnUp, empty(),
      btnLeft, empty(), btnRight,
      empty(), btnDown, empty(),
    );

    function reset() {
      grid = Array.from({ length: 4 }, () => Array(4).fill(0));
      score = 0;
      over = false;
      status.textContent = "Fusionnez les tuiles pour atteindre 2048";
      spawn();
      spawn();
      render();
    }

    function freeCells() {
      const out = [];
      grid.forEach((row, y) => row.forEach((v, x) => { if (v === 0) out.push({ x, y }); }));
      return out;
    }

    function spawn() {
      const free = freeCells();
      if (!free.length) return;
      const spot = free[Math.floor(Math.random() * free.length)];
      grid[spot.y][spot.x] = Math.random() < 0.9 ? 2 : 4;
    }

    function slide(row) {
      const arr = row.filter((v) => v !== 0);
      const out = [];
      for (let i = 0; i < arr.length; i++) {
        if (i + 1 < arr.length && arr[i] === arr[i + 1]) {
          out.push(arr[i] * 2);
          score += arr[i] * 2;
          i++;
        } else {
          out.push(arr[i]);
        }
      }
      while (out.length < 4) out.push(0);
      return out;
    }

    function move(dir) {
      if (over) return;
      const before = JSON.stringify(grid);
      if (dir === "left") {
        grid = grid.map(slide);
      } else if (dir === "right") {
        grid = grid.map((row) => slide(row.slice().reverse()).reverse());
      } else {
        const down = dir === "down";
        const cols = [0, 1, 2, 3].map((x) => [grid[0][x], grid[1][x], grid[2][x], grid[3][x]]);
        const newCols = down
          ? cols.map((c) => slide(c.slice().reverse()).reverse())
          : cols.map(slide);
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) grid[y][x] = newCols[x][y];
        }
      }
      if (JSON.stringify(grid) === before) return;
      spawn();
      if (score > best) {
        best = score;
        OS.store.set("2048-best", best);
      }
      render();
      if (!hasMoves()) {
        over = true;
        status.textContent = "Bloqué ! Score final : " + score;
      }
    }

    function hasMoves() {
      if (freeCells().length) return true;
      for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
          const v = grid[y][x];
          if (x < 3 && grid[y][x + 1] === v) return true;
          if (y < 3 && grid[y + 1][x] === v) return true;
        }
      }
      return false;
    }

    const TILES = {
      2: ["#e8e4da", "#5a5448"], 4: ["#e5d9b3", "#5a5448"], 8: ["#eab04c", "#fff"],
      16: ["#e2893c", "#fff"], 32: ["#d9653c", "#fff"], 64: ["#c34a2f", "#fff"],
      128: ["#d9b93c", "#fff"], 256: ["#d4a72e", "#fff"], 512: ["#cb9620", "#fff"],
      1024: ["#b8842a", "#fff"], 2048: ["#8f6a1c", "#fff"],
    };

    function render() {
      scoreLine.innerHTML = "<span>Score : <b>" + score + "</b></span><span>Record : <b>" + best + "</b></span>";
      grid.forEach((row, y) => row.forEach((v, x) => {
        const c = cells[y * 4 + x];
        c.textContent = v || "";
        if (v) {
          const colors = TILES[v] || ["#7a5e15", "#fff"];
          c.style.background = colors[0];
          c.style.color = colors[1];
        } else {
          c.style.background = "";
          c.style.color = "";
        }
      }));
    }

    function onKey(e) {
      const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
      if (map[e.key]) {
        e.preventDefault();
        move(map[e.key]);
      }
    }

    document.addEventListener("keydown", onKey);
    app.onClose = () => document.removeEventListener("keydown", onKey);

    const restart = document.createElement("button");
    restart.className = "game-restart";
    restart.textContent = "Nouvelle partie";
    restart.addEventListener("click", reset);

    body.append(scoreLine, board, status, pad, restart);
    reset();
  },
});
