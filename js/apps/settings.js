/* App : Réglages */
"use strict";

OS.registerApp({
  id: "settings",
  name: "Réglages",
  icon: "⚙️",
  color: "#5a6275",
  render(body) {
    body.classList.add("padend");

    function group(title) {
      const g = document.createElement("div");
      g.className = "settings-group";
      const h = document.createElement("h3");
      h.textContent = title;
      g.appendChild(h);
      return g;
    }

    function row(label, sub) {
      const r = document.createElement("div");
      r.className = "set-row";
      const lab = document.createElement("div");
      lab.className = "set-label";
      const l = document.createElement("span");
      l.textContent = label;
      const s = document.createElement("span");
      s.className = "set-sub";
      s.textContent = sub;
      lab.append(l, s);
      r.appendChild(lab);
      return r;
    }

    function toggle(label, sub, initial, onChange) {
      const r = row(label, sub);
      const sw = document.createElement("label");
      sw.className = "switch";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!initial;
      input.addEventListener("change", () => onChange(input.checked));
      const track = document.createElement("span");
      track.className = "track";
      sw.append(input, track);
      r.appendChild(sw);
      return r;
    }

    function renderAll() {
      body.innerHTML = "";

      const net = group("Réseau");
      net.appendChild(toggle("Mode avion", "Coupe le Wi-Fi simulé", OS.store.get("airplane", false), (v) => {
        OS.store.set("airplane", v);
        OS.setAirplane(v);
      }));

      const display = group("Affichage");
      const rowB = row("Luminosité", "Écran du téléphone");
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "20";
      slider.max = "100";
      slider.value = String(OS.store.get("brightness", 100));
      slider.addEventListener("input", () => {
        OS.setBrightness(Number(slider.value));
        OS.store.set("brightness", Number(slider.value));
      });
      rowB.appendChild(slider);
      display.appendChild(rowB);

      const sound = group("Son");
      const rowV = row("Volume", String(OS.state.volume) + " %");
      const vol = document.createElement("input");
      vol.type = "range";
      vol.min = "0";
      vol.max = "100";
      vol.value = String(OS.state.volume);
      vol.addEventListener("change", () => OS.setVolume(Number(vol.value)));
      rowV.appendChild(vol);
      sound.appendChild(rowV);

      const batt = group("Batterie");
      batt.appendChild(toggle("Charger", "Recharge la batterie simulée", OS.state.charging, (v) => {
        OS.state.charging = v;
        OS.setBattery(OS.state.battery);
      }));

      const sys = group("Système");
      const about = document.createElement("div");
      about.className = "about-line";
      about.innerHTML =
        "PhoneOS 1.0<br>" +
        "Émulateur de téléphone en HTML/CSS/JS<br>" +
        "Batterie : " + OS.state.battery + " % · " +
        (OS.state.airplane ? "Avion actif" : "Connecté");
      sys.appendChild(about);

      const actions = document.createElement("div");
      actions.className = "notes-actions";
      actions.style.padding = "0 16px 16px";
      const reboot = document.createElement("button");
      reboot.textContent = "Redémarrer";
      reboot.addEventListener("click", () => {
        OS.notify("⚙️", "#5a6275", "Système", "Redémarrage…", 1200);
        setTimeout(() => location.reload(), 800);
      });
      const wipe = document.createElement("button");
      wipe.className = "danger";
      wipe.textContent = "Réinitialiser les données";
      wipe.addEventListener("click", () => {
        try {
          Object.keys(localStorage)
            .filter((k) => k.startsWith("phoneos:"))
            .forEach((k) => localStorage.removeItem(k));
        } catch {
          /* stockage indisponible */
        }
        OS.notify("⚙️", "#5a6275", "Système", "Données réinitialisées", 2000);
        renderAll();
      });
      actions.append(reboot, wipe);

      body.append(net, display, sound, batt, sys, actions);
    }

    renderAll();
  },
});
