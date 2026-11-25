/* App : Galerie (photos de démonstration, picsum) */
"use strict";

OS.registerApp({
  id: "gallery",
  name: "Photos",
  icon: "🖼️",
  color: "#6b5b94",
  render(body) {
    body.classList.add("padend");

    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    const count = 12;
    const seed = "phoneos-demo";
    for (let i = 1; i <= count; i++) {
      const img = document.createElement("img");
      img.src = "https://picsum.photos/seed/" + seed + i + "/300/300";
      img.alt = "Photo " + i;
      img.loading = "lazy";
      img.addEventListener("click", () => openPhoto(i));
      grid.appendChild(img);
    }

    function openPhoto(index) {
      const view = document.createElement("div");
      view.className = "photo-view";
      view.innerHTML = `
        <img alt="Photo ${index}">
        <div class="photo-bar"><span></span><button class="photo-close">Fermer ✕</button></div>`;
      
      const closeBtn = view.querySelector(".photo-close");
      closeBtn.style.cssText = "background:none;border:none;color:#9fd0ff;cursor:pointer;font-size:14px;font-family:inherit";
      closeBtn.addEventListener("click", () => view.remove());
      document.getElementById("screen").appendChild(view);
    }

    body.appendChild(grid);
  },
});
