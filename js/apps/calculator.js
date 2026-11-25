/* App : Calculatrice */
"use strict";

OS.registerApp({
  id: "calculator",
  name: "Calc",
  icon: "🧮",
  color: "#3e4a63",
  render(body) {
    body.classList.add("padend");

    let expr = "";
    let preview = "";

    const display = document.createElement("div");
    display.className = "calc-display";
    display.innerHTML = '<div class="calc-expr"></div><div class="calc-result">0</div>';

    const pad = document.createElement("div");
    pad.className = "calc-pad";

    const keys = [
      ["C", "fn"], ["(", "fn"], [")", "fn"], ["÷", "op"],
      ["7", ""], ["8", ""], ["9", ""], ["×", "op"],
      ["4", ""], ["5", ""], ["6", ""], ["−", "op"],
      ["1", ""], ["2", ""], ["3", ""], ["+", "op"],
      ["0", ""], [".", ""], ["⌫", "fn"], ["=", "eq"],
    ];

    const sym = { "÷": "/", "×": "*", "−": "-" };

    function evaluate(s) {
      const clean = s.replace(/[0-9+\-*/().]/g, "");
      if (clean) return null;
      try {
        const val = Function('"use strict"; return (' + s + ")")();
        if (typeof val !== "number" || !isFinite(val)) return null;
        return val;
      } catch {
        return null;
      }
    }

    function update() {
      display.querySelector(".calc-expr").textContent = expr;
      if (!expr) {
        display.querySelector(".calc-result").textContent = "0";
        preview = "";
        return;
      }
      const val = evaluate(expr);
      preview = val === null ? "" : String(Math.round(val * 1e10) / 1e10);
      display.querySelector(".calc-result").textContent = preview || "…";
    }

    keys.forEach(([label, cls]) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (cls) b.classList.add(cls);
      b.addEventListener("click", () => {
        if (label === "C") expr = "";
        else if (label === "⌫") expr = expr.slice(0, -1);
        else if (label === "=") {
          const val = evaluate(expr);
          if (val !== null) {
            expr = String(Math.round(val * 1e10) / 1e10);
            OS.notify("🧮", "#3e4a63", "Calculatrice", "= " + expr, 2200);
          } else {
            OS.notify("🧮", "#3e4a63", "Calculatrice", "Expression invalide", 2200);
          }
        } else {
          expr += sym[label] ?? label;
        }
        update();
      });
      pad.appendChild(b);
    });

    body.append(display, pad);
    update();
  },
});
