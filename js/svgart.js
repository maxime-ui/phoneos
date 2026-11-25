/* Astéria — générateur d'illustrations SVG procédurales */
"use strict";

OS.art = (() => {
  const W = 320, H = 130;

  function gradient(id, from, to) {
    return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>` +
      "</linearGradient></defs>";
  }

  /* Silhouette simplifiée d'un personnage de classe donnée.
     evo (0-3) : aura croissante + couronne d'étoiles au rang III. */
  function silhouette(cls, color, x, groundY, flip, evo) {
    const dir = flip ? -1 : 1;
    const y = groundY;
    const ev = evo || 0;
    let aura = "";
    if (ev >= 1) aura += `<ellipse cx="${x}" cy="${y - 32}" rx="13" ry="27" fill="${color}" opacity="0.16"/>`;
    if (ev >= 2) aura += `<ellipse cx="${x}" cy="${y - 32}" rx="18" ry="33" fill="#ffffff" opacity="0.10"/>`;
    if (ev >= 3) {
      aura += `<ellipse cx="${x}" cy="${y - 58}" rx="12" ry="3.5" fill="none" stroke="#e3b23c" stroke-width="1.4" opacity="0.9"/>`
        + `<circle cx="${x - 10}" cy="${y - 74}" r="1.6" fill="#e3b23c"/>`
        + `<circle cx="${x}" cy="${y - 79}" r="2" fill="#ffd970"/>`
        + `<circle cx="${x + 10}" cy="${y - 73}" r="1.4" fill="#e3b23c"/>`;
    }
    const open = ev >= 1
      ? `<g transform="translate(${x} ${y}) scale(1.08) translate(${-x} ${-y})">`
      : "<g>";
    let weapon = "";
    switch (cls) {
      case "Chevalier":
        weapon = `<rect x="${x + 14 * dir}" y="${y - 34}" width="3" height="34" fill="${color}"/>
          <polygon points="${x + 14 * dir},${y - 42} ${x + 12 * dir},${y - 34} ${x + 16 * dir},${y - 34}" fill="${color}"/>
          <rect x="${x + 10 * dir}" y="${y - 24}" width="4" height="2.5" fill="${color}"/>`;
        break;
      case "Mage":
        weapon = `<line x1="${x + 13 * dir}" y1="${y - 42}" x2="${x + 13 * dir}" y2="${y - 2}" stroke="${color}" stroke-width="2"/>
          <circle cx="${x + 13 * dir}" cy="${y - 44}" r="4" fill="${color}" opacity="0.9"/>`;
        break;
      case "Archer":
        weapon = `<path d="M ${x + 13 * dir} ${y - 40} Q ${x + 22 * dir} ${y - 22} ${x + 13 * dir} ${y - 4}" stroke="${color}" stroke-width="2" fill="none"/>
          <line x1="${x + 13 * dir}" y1="${y - 40}" x2="${x + 13 * dir}" y2="${y - 4}" stroke="${color}" stroke-width="1" opacity="0.7"/>`;
        break;
      case "Rôdeur":
        weapon = `<polygon points="${x + 12 * dir},${y - 20} ${x + 19 * dir},${y - 16} ${x + 12 * dir},${y - 13}" fill="${color}"/>
          <line x1="${x + 12 * dir}" y1="${y - 18}" x2="${x + 12 * dir}" y2="${y - 8}" stroke="${color}" stroke-width="2"/>`;
        break;
      case "Berserker":
        weapon = `<line x1="${x + 14 * dir}" y1="${y - 40}" x2="${x + 14 * dir}" y2="${y - 8}" stroke="${color}" stroke-width="2"/>
          <path d="M ${x + 14 * dir} ${y - 40} Q ${x + 26 * dir} ${y - 34} ${x + 14 * dir} ${y - 26}" fill="${color}"/>`;
        break;
      case "Soigneur":
        weapon = `<line x1="${x + 12 * dir}" y1="${y - 44}" x2="${x + 12 * dir}" y2="${y - 2}" stroke="${color}" stroke-width="2"/>
          <circle cx="${x + 12 * dir}" cy="${y - 46}" r="3.5" fill="none" stroke="${color}" stroke-width="1.5"/>
          <line x1="${x + 12 * dir}" y1="${y - 48.5}" x2="${x + 12 * dir}" y2="${y - 43.5}" stroke="${color}" stroke-width="1.5"/>
          <line x1="${x + 9.5 * dir}" y1="${y - 46}" x2="${x + 14.5 * dir}" y2="${y - 46}" stroke="${color}" stroke-width="1.5"/>
          <circle cx="${x - 10 * dir}" cy="${y - 30}" r="4" fill="${color}" opacity="0.35"/>`;
        break;
      case "Défenseur":
        weapon = `<ellipse cx="${x + 12 * dir}" cy="${y - 22}" rx="7" ry="14" fill="${color}" opacity="0.85"/>
          <ellipse cx="${x + 12 * dir}" cy="${y - 22}" rx="4" ry="9" fill="none" stroke="#0e1420" stroke-width="1" opacity="0.5"/>`;
        break;
      case "Tueur":
        weapon = `<rect x="${x + 15 * dir}" y="${y - 52}" width="5" height="42" fill="${color}" transform="rotate(${6 * dir} ${x + 17 * dir} ${y - 31})"/>
          <polygon points="${x + 15 * dir},${y - 60} ${x + 12 * dir},${y - 52} ${x + 23 * dir},${y - 52}" fill="${color}"/>
          <rect x="${x + 11 * dir}" y="${y - 12}" width="13" height="3" fill="${color}"/>`;
        break;
      case "Héros":
        weapon = `<rect x="${x + 13 * dir}" y="${y - 48}" width="3" height="36" fill="${color}" transform="rotate(${10 * dir} ${x + 14 * dir} ${y - 30})"/>
          <path d="M ${x - 2} ${y - 24} L ${x + 8 * dir} ${y - 10} L ${x - 2} ${y - 4} Z" fill="${color}" opacity="0.55"/>`;
        break;
      case "Invocateur":
        weapon = `<rect x="${x + 11 * dir}" y="${y - 34}" width="9" height="12" rx="1" fill="${color}" transform="rotate(${-8 * dir} ${x + 15 * dir} ${y - 28})"/>
          <line x1="${x + 12 * dir}" y1="${y - 34}" x2="${x + 12 * dir}" y2="${y - 22}" stroke="#0e1420" stroke-width="0.8" transform="rotate(${-8 * dir} ${x + 15 * dir} ${y - 28})"/>
          <circle cx="${x + 17 * dir}" cy="${y - 28}" r="2.2" fill="#b48cff"/>
          <path d="M ${x - 4} ${y} Q ${x - 8 * dir} ${y - 14} ${x - 2 * dir} ${y - 24} Q ${x + 2 * dir} ${y - 16} ${x - 4} ${y} Z" fill="#3b2d63" opacity="0.75"/>`;
        break;
      case "Valkyrie":
        weapon = `<line x1="${x + 12 * dir}" y1="${y - 56}" x2="${x + 12 * dir}" y2="${y - 4}" stroke="${color}" stroke-width="1.8"/>
          <polygon points="${x + 12 * dir},${y - 62} ${x + 9.5 * dir},${y - 53} ${x + 14.5 * dir},${y - 53}" fill="${color}"/>
          <path d="M ${x + 6 * dir} ${y - 44} Q ${x - 6 * dir} ${y - 50} ${x - 9 * dir} ${y - 36} Q ${x - 2 * dir} ${y - 40} ${x + 6 * dir} ${y - 40} Z" fill="${color}" opacity="0.45"/>
          <path d="M ${x + 6 * dir} ${y - 40} Q ${x - 5 * dir} ${y - 42} ${x - 7 * dir} ${y - 32} Q ${x - 1 * dir} ${y - 36} ${x + 6 * dir} ${y - 36} Z" fill="#ffffff" opacity="0.28"/>`;
        break;
      default:
        weapon = "";
    }
    return `${open}
      ${aura}
      <circle cx="${x}" cy="${y - 58}" r="7" fill="${color}"/>
      <path d="M ${x - 7} ${y - 24} Q ${x - 8} ${y - 50} ${x} ${y - 51} Q ${x + 8} ${y - 50} ${x + 7} ${y - 24} Z" fill="${color}"/>
      <line x1="${x}" y1="${y - 24}" x2="${x - 5}" y2="${y}" stroke="${color}" stroke-width="4"/>
      <line x1="${x}" y1="${y - 24}" x2="${x + 5}" y2="${y}" stroke="${color}" stroke-width="4"/>
      ${weapon}
    </g>`;
  }

  /* Décors */
  function scenery(kind) {
    switch (kind) {
      case "village":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#26314a"/>
          <g fill="#1b2438">
            <rect x="30" y="80" width="34" height="28"/><polygon points="30,80 47,68 64,80"/>
            <rect x="90" y="74" width="30" height="34"/><polygon points="90,74 105,62 120,74"/>
            <rect x="250" y="78" width="36" height="30"/><polygon points="250,78 268,66 286,78"/>
          </g>
          <rect x="46" y="90" width="6" height="8" fill="#e3b23c" opacity="0.8"/>
          <rect x="103" y="86" width="6" height="8" fill="#e3b23c" opacity="0.8"/>`;
      case "foret":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#1c2a24"/>
          <g fill="#16241f">
            <polygon points="20,${H - 10} 34,56 48,${H - 10}"/>
            <polygon points="60,${H - 10} 78,44 96,${H - 10}"/>
            <polygon points="220,${H - 10} 240,40 260,${H - 10}"/>
            <polygon points="270,${H - 10} 288,52 306,${H - 10}"/>
          </g>`;
      case "canopee":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#141f1b"/>
          <g fill="#101a16">
            <polygon points="10,${H - 8} 30,34 50,${H - 8}"/>
            <polygon points="70,${H - 8} 92,26 114,${H - 8}"/>
            <polygon points="200,${H - 8} 224,22 248,${H - 8}"/>
            <polygon points="265,${H - 8} 288,30 311,${H - 8}"/>
          </g>`;
      case "canopee2":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#101a17"/>
          <g fill="#0c1512">
            <polygon points="24,${H - 8} 46,20 68,${H - 8}"/>
            <polygon points="100,${H - 8} 124,14 148,${H - 8}"/>
            <polygon points="180,${H - 8} 206,16 232,${H - 8}"/>
            <polygon points="260,${H - 8} 284,22 308,${H - 8}"/>
          </g>`;
      case "canopee3":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#0d1613"/>
          <g fill="#091310">
            <polygon points="14,${H - 8} 36,18 58,${H - 8}"/>
            <polygon points="120,${H - 8} 144,10 168,${H - 8}"/>
            <polygon points="220,${H - 8} 244,12 268,${H - 8}"/>
            <polygon points="288,${H - 8} 306,16 324,${H - 8}"/>
          </g>`;
      case "sanctuaire":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#20263d"/>
          <g fill="#171d33">
            <rect x="120" y="40" width="80" height="68"/>
            <polygon points="120,40 160,18 200,40"/>
            <rect x="30" y="60" width="14" height="48"/><rect x="276" y="60" width="14" height="48"/>
          </g>
          <ellipse cx="160" cy="56" rx="10" ry="14" fill="#e3b23c" opacity="0.25"/>`;
      case "vulkan":
        return `<rect x="0" y="${H - 22}" width="${W}" height="22" fill="#2b1a14"/>
          <g fill="#1c100c">
            <polygon points="40,${H - 20} 90,36 140,${H - 20}"/>
            <polygon points="180,${H - 20} 240,44 300,${H - 20}"/>
          </g>
          <ellipse cx="90" cy="40" rx="6" ry="3" fill="#ff9f43"/>
          <ellipse cx="240" cy="48" rx="7" ry="3.5" fill="#ff6b6b" opacity="0.9"/>`;
      default:
        return "";
    }
  }

  function dragon(x, y, color) {
    return `<g fill="${color || "#5c3b2e"}">
      <path d="M ${x} ${y} Q ${x + 26} ${y - 26} ${x + 58} ${y - 16} Q ${x + 84} ${y - 24} ${x + 104} ${y - 6} Q ${x + 76} ${y + 4} ${x + 50} ${y - 2} Q ${x + 22} ${y + 10} ${x} ${y} Z"/>
      <path d="M ${x + 104} ${y - 6} L ${x + 122} ${y - 24} L ${x + 118} ${y - 10} L ${x + 134} ${y - 16} L ${x + 112} ${y + 4} Z"/>
      <polygon points="${x + 30},${y - 22} ${x + 38},${y - 34} ${x + 44},${y - 20}" fill="${color || "#5c3b2e"}"/>
      <circle cx="${x + 112}" cy="${y - 14}" r="2.4" fill="#ffb347"/>
    </g>`;
  }

  /* Scène : ciel + décor + acteurs */
  function scene(opts) {
    const skies = {
      dawn: ["#7c6a9e", "#2a2440", "#f4a15d"],
      forest: ["#3d5a45", "#15221b", "#c4e59a"],
      night: ["#232b4d", "#0b0f1c", "#aeb6d8"],
      ash: ["#4a3226", "#160e0a", "#ff8c5a"],
    };
    const [top, bottom, sunColor] = skies[opts.sky || "night"];
    const gid = "sky" + Math.random().toString(36).slice(2, 8);
    let out = `<svg class="story-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">`;
    out += gradient(gid, top, bottom);
    out += `<rect width="${W}" height="${H}" fill="url(#${gid})"/>`;
    out += `<circle cx="${opts.sunX || 250}" cy="34" r="16" fill="${sunColor}" opacity="0.65"/>`;
    if (opts.stars) {
      out += '<g fill="#dfe6f5">';
      for (let i = 0; i < 26; i++) {
        out += `<circle cx="${Math.floor(Math.random() * W)}" cy="${Math.floor(Math.random() * 55)}" r="${Math.random() * 0.9 + 0.4}" opacity="${(Math.random() * 0.7 + 0.3).toFixed(2)}"/>`;
      }
      out += "</g>";
    }
    out += scenery(opts.ground || "");
    (opts.actors || []).forEach((a) => {
      out += silhouette(a.cls, a.color, a.x, H - 20, a.flip, a.evo);
    });
    if (opts.dragon) out += dragon(opts.dragon[0], opts.dragon[1], opts.dragonColor);
    out += "</svg>";
    return out;
  }

  return { scene, silhouette, dragon };
})();
