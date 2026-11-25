/* App : Messages (conversations simulées + réponses automatiques) */
"use strict";

OS.registerApp({
  id: "messages",
  name: "Messages",
  icon: "💬",
  color: "#4f7cff",
  render(body) {
    body.classList.add("padend");

    const threads = OS.store.get("threads", {
      "Alice": [
        { from: "in", text: "Salut ! Ça marche pour ce soir ?" },
        { from: "out", text: "Oui, à 19 h chez toi ?" },
        { from: "in", text: "Parfait, à tout à l'heure !" },
      ],
      "Bob": [
        { from: "in", text: "Tu as vu le match hier ?" },
      ],
    });

    function save() {
      OS.store.set("threads", threads);
    }

    function hashColor(str) {
      const palette = ["#5b6b94", "#4f7a9e", "#6b5b94", "#5b9477", "#946b5b"];
      let h = 0;
      for (const c of str) h = (h * 31 + c.charCodeAt(0)) % 997;
      return palette[h % palette.length];
    }

    function renderConversations() {
      body.innerHTML = "";
      const list = document.createElement("div");
      list.className = "conv-list";
      Object.keys(threads).forEach((name) => {
        const msgs = threads[name];
        const last = msgs[msgs.length - 1];
        const item = document.createElement("button");
        item.className = "conv-item";
        item.innerHTML = `
          <div class="conv-avatar" style="--icon-bg:${hashColor(name)}">${name[0].toUpperCase()}</div>
          <div style="flex:1;min-width:0">
            <div class="conv-name"></div>
            <div class="conv-last"></div>
          </div>`;
        item.querySelector(".conv-name").textContent = name;
        item.querySelector(".conv-last").textContent = (last.from === "out" ? "Vous : " : "") + last.text;
        item.addEventListener("click", () => renderChat(name));
        list.appendChild(item);
      });
      body.appendChild(list);
    }

    function renderChat(name) {
      body.innerHTML = "";
      const scroll = document.createElement("div");
      scroll.className = "chat-scroll";
      const typing = document.createElement("div");
      typing.className = "chat-typing";
      const compose = document.createElement("div");
      compose.className = "chat-compose";
      const input = document.createElement("input");
      input.placeholder = "Message…";
      const send = document.createElement("button");
      send.textContent = "➤";

      function addBubble(from, text) {
        const b = document.createElement("div");
        b.className = "bubble " + from;
        b.textContent = text;
        scroll.appendChild(b);
        scroll.scrollTop = scroll.scrollHeight;
      }

      function sendMsg() {
        const text = input.value.trim();
        if (!text) return;
        input.value = "";
        threads[name].push({ from: "out", text });
        save();
        addBubble("out", text);
        typing.textContent = name + " écrit…";
        setTimeout(() => {
          typing.textContent = "";
          const t = text.toLowerCase();
          let reply;
          if (/\?/.test(t)) reply = "Bonne question, je te réponds vite !";
          else if (/(salut|bonjour|coucou|hello)/.test(t)) reply = "Hey ! Comment ça va ?";
          else if (/merci/.test(t)) reply = "Avec plaisir 😄";
          else if (/(rdv|rendez-vous|ce soir|demain)/.test(t)) reply = "Ça me va, on confirme plus tard.";
          else {
            const canned = ["Bien reçu !", "Haha, pas mal 😄", "Je te tiens au courant.", "On en reparle ce soir."];
            reply = canned[Math.floor(Math.random() * canned.length)];
          }
          threads[name].push({ from: "in", text: reply });
          save();
          addBubble("in", reply);
          OS.notify("💬", "#4f7cff", name, reply, 4500);
        }, 900 + Math.random() * 1400);
      }

      send.addEventListener("click", sendMsg);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMsg();
      });

      threads[name].forEach((m) => addBubble(m.from, m.text));
      compose.append(input, send);
      body.append(scroll, typing, compose);
      input.focus();
    }

    renderConversations();
  },
});
