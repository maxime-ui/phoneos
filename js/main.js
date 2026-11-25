/* Point d'entrée Astéria */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.toggle("cb", !!OS.store.get("colorblind", false));
  OS.init();
  if (OS.asteriaData && OS.asteriaData.storyDiffs && OS.asteriaData.setStoryDiff) {
    OS.buildDiffSelect(OS.asteriaData);
  }
});
