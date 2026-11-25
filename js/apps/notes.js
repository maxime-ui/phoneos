/* App : Notes (persistées en localStorage) */
"use strict";

OS.registerApp({
  id: "notes",
  name: "Notes",
  icon: "📝",
  color: "#b98a2e",
  render(body) {
    body.classList.add("padend");
    const initial = OS.store.get("notes", [
      { title: "Bienvenue", text: "Voici vos notes. Elles sont sauvegardées sur cet appareil." },
    ]);
    let notes = initial;

    function persist() {
      OS.store.set("notes", notes);
    }

    function renderList() {
      body.innerHTML = "";
      const toolbar = document.createElement("div");
      toolbar.className = "notes-toolbar";
      const add = document.createElement("button");
      add.textContent = "+ Nouvelle note";
      add.addEventListener("click", () => renderEditor(null));
      toolbar.appendChild(add);

      const list = document.createElement("div");
      list.className = "notes-list";
      if (!notes.length) {
        list.innerHTML = '<div class="recents-empty">Aucune note</div>';
      }
      notes.forEach((note, i) => {
        const item = document.createElement("button");
        item.className = "note-item";
        item.innerHTML = `
          <div class="note-title"></div>
          <div class="note-snippet"></div>`;
        item.querySelector(".note-title").textContent = note.title || "Sans titre";
        item.querySelector(".note-snippet").textContent = note.text || "(vide)";
        item.addEventListener("click", () => renderEditor(i));
        list.appendChild(item);
      });

      body.append(toolbar, list);
    }

    function renderEditor(index) {
      body.innerHTML = "";
      const isNew = index === null;
      const note = isNew ? { title: "", text: "" } : notes[index];

      const editor = document.createElement("div");
      editor.className = "notes-editor";
      const titleInput = document.createElement("input");
      titleInput.placeholder = "Titre";
      titleInput.value = note.title;
      const textInput = document.createElement("textarea");
      textInput.placeholder = "Votre note…";
      textInput.value = note.text;

      const actions = document.createElement("div");
      actions.className = "notes-actions";
      const save = document.createElement("button");
      save.textContent = "Enregistrer";
      save.addEventListener("click", () => {
        note.title = titleInput.value.trim() || "Sans titre";
        note.text = textInput.value;
        if (isNew) notes.unshift(note);
        persist();
        OS.notify("📝", "#b98a2e", "Notes", "Note enregistrée", 1800);
        renderList();
      });
      const cancel = document.createElement("button");
      cancel.className = "danger";
      cancel.textContent = "Annuler";
      cancel.addEventListener("click", () => renderList());
      actions.append(save, cancel);

      if (!isNew) {
        const del = document.createElement("button");
        del.className = "danger";
        del.textContent = "Supprimer";
        del.addEventListener("click", () => {
          notes.splice(index, 1);
          persist();
          renderList();
        });
        actions.appendChild(del);
      }

      editor.append(titleInput, textInput, actions);
      body.appendChild(editor);
      titleInput.focus();
    }

    renderList();
  },
});
