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

      const game = group("Jeu");
      const speed = OS.store.get("game-speed", 1);
      const rowS = row("Vitesse du jeu", speed + "× — vitesse des dialogues et de la musique");
      const seg = document.createElement("div");
      seg.className = "seg-row";
      [[0.5, "Lent"], [1, "Normal"], [2, "Rapide"]].forEach(([v, lbl]) => {
        const b = document.createElement("button");
        b.textContent = lbl;
        if (speed === v) b.classList.add("active");
        b.addEventListener("click", () => {
          OS.store.set("game-speed", v);
          OS.sfx.play("ui");
          renderAll();
        });
        seg.appendChild(b);
      });
      rowS.appendChild(seg);
      game.appendChild(rowS);

      const storySpeed = OS.store.get("story-speed", null);
      const rowT = row("Vitesse des dialogues", "frappe du Mode Histoire, indépendante du jeu");
      const segT = document.createElement("div");
      segT.className = "seg-row";
      [["instant", "Instantané"], [0.5, "Lent"], [1, "Normal"], [2, "Rapide"]].forEach(([v, lbl]) => {
        const b = document.createElement("button");
        b.textContent = lbl;
        if (storySpeed === v) b.classList.add("active");
        b.addEventListener("click", () => {
          OS.store.set("story-speed", v);
          OS.sfx.play("ui");
          renderAll();
        });
        segT.appendChild(b);
      });
      rowT.appendChild(segT);
      game.appendChild(rowT);
      game.appendChild(toggle("Son du jeu", "Effets sonores et musique chiptune", !OS.store.get("sound-muted", false), (v) => {
        OS.sfx.setMuted(!v);
        OS.sfx.play("ui");
      }));
      game.appendChild(toggle("Notifications système", "Bannières, trophées, évènements", OS.store.get("notifications", true), (v) => {
        OS.store.set("notifications", v);
      }));
      game.appendChild(toggle("Mode daltonien", "Repères visuels en plus des couleurs (raretés, cartes, PV)", OS.store.get("colorblind", false), (v) => {
        OS.store.set("colorblind", v);
        document.body.classList.toggle("cb", !!v);
      }));

      const sound = group("Son");
      const rowV = row("Volume", String(OS.state.volume) + " %");
      const vol = document.createElement("input");
      vol.type = "range";
      vol.min = "0";
      vol.max = "100";
      vol.value = String(OS.state.volume);
      vol.addEventListener("input", () => OS.setVolume(Number(vol.value)));
      rowV.appendChild(vol);
      sound.appendChild(rowV);
      sound.appendChild(toggle("Musique de fond", "Une mélodie différente pour chaque menu", OS.sfx.musicPlaying, (v) => {
        OS.sfx.setMusic(v);
      }));

      const sys = group("Système");
      const about = document.createElement("div");
      about.className = "about-line";
      about.innerHTML =
        "Astéria — RPG gacha en page web (HTML/CSS/JS)<br>" +
        "Raccourcis : 1–4 apps · F plein écran · Échap retour<br>" +
        "Plein écran : bouton ⛶ dans la barre supérieure · sauvegarde automatique dans le navigateur";
      sys.appendChild(about);

      const actions = document.createElement("div");
      actions.className = "notes-actions";
      actions.style.padding = "0 16px 16px";
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
        setTimeout(() => location.reload(), 800);
      });
      actions.append(wipe);

      body.append(game, sound, sys, actions);
    }

    renderAll();
  },
});
