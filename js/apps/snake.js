/* App : Snake */
"use strict";

OS.registerApp({
  id: "snake",
  name: "Snake",
  icon: "🐍",
  color: "#2e7d4f",
  render(body) {
    body.classList.add("padend");

    const SIZE = 15;
    const app = this;

    let snake, dir, nextDir, food, score, timer, alive;
    let best = OS.store.get("snake-best", 0);

    const scoreLine = document.createElement("div");
    scoreLine.className = "game-scoreline";

    const board = document.createElement("div");
    board.className = "snake-board";
    const cells = [];
    for (let i = 0; i < SIZE * SIZE; i++) {
      const c = document.createElement("div");
      c.className = "snake-cell";
      cells.push(c);
      board.appendChild(c);
    }

    const status = document.createElement("div");
    status.className = "game-status";

    const pad = document.createElement("div");
    pad.className = "dpad";
    function empty() { return document.createElement("div"); }
    function dpadBtn(label, delta) {
      const b = document.createElement("button");
      b.textContent = label;
      b.addEventListener("click", () => turn(delta));
      return b;
    }
    const btnUp = dpadBtn("↑", [0, -1]);
    const btnLeft = dpadBtn("←", [-1, 0]);
    const btnRight = dpadBtn("→", [1, 0]);
    const btnDown = dpadBtn("↓", [0, 1]);
    pad.append(
      empty(), btnUp, empty(),
      btnLeft, empty(), btnRight,
      empty(), btnDown, empty(),
    );

    function turn(d) {
      if (!d) return;
      if (snake.length > 1 && d[0] === -dir[0] && d[1] === -dir[1]) return;
      nextDir = d;
    }

    function reset() {
      snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
      dir = [1, 0];
      nextDir = dir;
      score = 0;
      alive = true;
      placeFood();
      status.textContent = "Flèches ou boutons pour diriger";
      render();
      clearInterval(timer);
      timer = setInterval(step, 150);
    }

    function placeFood() {
      do {
        food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
      } while (snake.some((s) => s.x === food.x && s.y === food.y));
    }

    function step() {
      if (!alive) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir[0], y: snake[0].y + dir[1] };

      const hitWall = head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE;
      const hitSelf = snake.some((s) => s.x === head.x && s.y === head.y);
      if (hitWall || hitSelf) return gameOver();

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
        if (score > best) {
          best = score;
          OS.store.set("snake-best", best);
          status.textContent = "Nouveau record : " + best + " !";
        }
      } else {
        snake.pop();
      }
      render();
    }

    function gameOver() {
      alive = false;
      clearInterval(timer);
      status.textContent = "Perdu ! Score : " + score + (score > 0 && score >= best ? " — record !" : "");
    }

    function render() {
      scoreLine.innerHTML = "<span>Score : <b>" + score + "</b></span><span>Record : <b>" + best + "</b></span>";
      cells.forEach((c) => { c.className = "snake-cell"; });
      snake.forEach((s, i) => {
        cells[s.y * SIZE + s.x].className = "snake-cell " + (i === 0 ? "head" : "body");
      });
      cells[food.y * SIZE + food.x].className = "snake-cell food";
    }

    function onKey(e) {
      const map = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (map[e.key]) {
        e.preventDefault();
        turn(map[e.key]);
      }
    }

    document.addEventListener("keydown", onKey);
    app.onClose = () => {
      clearInterval(timer);
      document.removeEventListener("keydown", onKey);
    };

    const restart = document.createElement("button");
    restart.className = "game-restart";
    restart.textContent = "Nouvelle partie";
    restart.addEventListener("click", reset);

    body.append(scoreLine, board, status, pad, restart);
    reset();
  },
});
