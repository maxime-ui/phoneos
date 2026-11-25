/* App : Téléphone (clavier + appel simulé) */
"use strict";

OS.registerApp({
  id: "phone",
  name: "Téléphone",
  icon: "📞",
  color: "#2fbf71",
  render(body) {
    body.classList.add("padend");

    let number = "";

    const display = document.createElement("div");
    display.className = "dialer-num";

    const pad = document.createElement("div");
    pad.className = "dialer-pad";
    const keys = [
      ["1", ""], ["2", "ABC"], ["3", "DEF"],
      ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
      ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
      ["+", ""], ["0", ""], ["#", ""],
    ];
    keys.forEach(([digit, sub]) => {
      const b = document.createElement("button");
      b.innerHTML = digit + (sub ? `<span class="sub">${sub}</span>` : "");
      b.addEventListener("click", () => {
        if (number.length < 18) number += digit;
        update();
      });
      pad.appendChild(b);
    });

    const actions = document.createElement("div");
    actions.className = "dialer-actions";

    const call = document.createElement("button");
    call.className = "dialer-call";
    call.textContent = "📞";
    call.title = "Appeler";
    call.addEventListener("click", () => {
      if (number.length >= 3) startCall(number);
    });

    const del = document.createElement("button");
    del.className = "dialer-del";
    del.textContent = "⌫";
    del.addEventListener("click", () => {
      number = number.slice(0, -1);
      update();
    });

    actions.append(del, call);

    function update() {
      display.textContent = number;
    }

    function startCall(num) {
      const overlay = document.createElement("div");
      overlay.className = "call-screen";
      overlay.innerHTML = `
        <div class="call-avatar">👤</div>
        <div class="call-name"></div>
        <div class="call-status">Appel en cours…</div>
        <button class="call-end" title="Raccrocher">📵</button>`;
      overlay.querySelector(".call-name").textContent = num;
      document.getElementById("screen").appendChild(overlay);

      const status = overlay.querySelector(".call-status");
      const start = Date.now();
      const timer = setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        status.textContent = s < 3 ? "Sonnerie…" :
          "En ligne · " + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
      }, 500);

      overlay.querySelector(".call-end").addEventListener("click", () => {
        clearInterval(timer);
        overlay.remove();
        OS.notify("📞", "#2fbf71", "Appel terminé", "Numéro " + num, 3000);
      });
    }

    body.append(display, pad, actions);
    update();
  },
});
