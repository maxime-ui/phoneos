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

  /* ---------- Portrait procédural unique par héros ---------- */
  function h32(s) {
    let x = 2166136261;
    for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = (x * 1677761) >>> 0; }
    return x;
  }

  const P_SKINS = ["#e8b98c", "#d99b6c", "#b97a4b", "#8a5a38", "#f0c9a2", "#c98d63"];
  const P_HAIRS = ["#2b2320", "#5d3a1e", "#b8742e", "#d9b36a", "#8c2f2f", "#4f6bd4", "#3d7a52", "#e0e0e0", "#7d3bd4"];
  const P_OUTFIT = ["#39415a", "#5c3b2e", "#2f5f8f", "#8c2f39", "#3d7a52", "#6b4e9a", "#a06a2c", "#4a5470"];
  const P_ACCENT = ["#e3b23c", "#ff8c5a", "#3bd4c4", "#ff7b7b", "#9fb0c8", "#ffd970", "#8f6bd9"];
  const P_BG2 = ["#232b4d", "#3d2d4d", "#2d3d2d", "#4d2d2d", "#2d4055", "#40332d"];

  function portrait(u, evo) {
    const RAR = { 1: "#7d869c", 2: "#4f9eff", 3: "#e3b23c", 4: "#ff8c5a" };
    const h = h32(u.id);
    const ch = (salt, arr) => arr[(h >>> salt) % arr.length];
    const skin = ch(3, P_SKINS), hair = ch(6, P_HAIRS), outfit = ch(9, P_OUTFIT), accent = ch(12, P_ACCENT);
    const bg2 = ch(15, P_BG2), rc = RAR[u.r] || RAR[1];
    const deco = (h >>> 18) % 4;
    const gid = "pg" + (h >>> 0).toString(36);
    let s = `<svg class="hero-portrait" viewBox="0 0 64 64" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${u.name}">`;
    s += gradient(gid, bg2, "#0d1220");
    s += `<rect width="64" height="64" fill="url(#${gid})"/>`;
    if (deco === 0) {
      s += `<g fill="#dfe6f5">`;
      [[12, 10, 1.1], [52, 14, 0.9], [46, 6, 0.7], [8, 22, 0.6]].forEach(([cx, cy, r]) => { s += `<circle cx="${cx}" cy="${cy}" r="${r}" opacity="0.55"/>`; });
      s += "</g>";
    } else if (deco === 1) {
      s += `<circle cx="50" cy="12" r="6" fill="#dfe6f5" opacity="0.5"/><circle cx="53" cy="10" r="5" fill="url(#${gid})"/>`;
    } else if (deco === 2) {
      s += `<g opacity="0.14" stroke="#dfe6f5" stroke-width="3">` +
        `<line x1="-8" y1="52" x2="26" y2="18"/><line x1="6" y1="66" x2="40" y2="32"/><line x1="30" y1="66" x2="64" y2="32"/></g>`;
    } else {
      s += `<circle cx="32" cy="30" r="20" fill="${rc}" opacity="0.10"/><circle cx="32" cy="30" r="26" fill="none" stroke="${rc}" stroke-width="1" opacity="0.25"/>`;
    }
    
    /* arme en arrière-plan selon la classe */
    s += `<g opacity="0.85">`;
    const w = u.cls;
    if (w === "Chevalier" || w === "Défenseur" || w === "Valkyrie") {
      s += `<rect x="52" y="8" width="3" height="40" rx="1.5" fill="#9fb0c8" transform="rotate(12 52 28)"/>`;
    } else if (w === "Berserker" || w === "Tueur") {
      s += `<rect x="8" y="14" width="4" height="30" rx="2" fill="#8a6a4a" transform="rotate(-14 10 28)"/><path d="M6 12 L14 14 L10 22 Z" fill="#9fb0c8" transform="rotate(-14 10 18)"/>`;
    } else if (w === "Mage" || w === "Invocateur") {
      s += `<line x1="54" y1="10" x2="50" y2="46" stroke="#8a6a4a" stroke-width="2.4"/><circle cx="54" cy="9" r="3.5" fill="${accent}" opacity="0.95"/>`;
    } else if (w === "Archer" || w === "Rôdeur") {
      s += `<path d="M50 8 Q40 28 50 48" fill="none" stroke="#8a6a4a" stroke-width="2.4"/><line x1="50" y1="8" x2="50" y2="48" stroke="#dfe6f5" stroke-width="0.8"/>`;
    } else if (w === "Soigneur") {
      s += `<circle cx="54" cy="12" r="5.5" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.9"/>`;
    } else {
      s += `<rect x="51" y="8" width="3" height="40" rx="1.5" fill="#9fb0c8" transform="rotate(12 52 28)"/>`;
    }
    s += `</g>`;
    
    /* buste */
    s += `<path d="M14 64 Q15 46 24 42 L40 42 Q49 46 50 64 Z" fill="${outfit}"/>`;
    s += `<path d="M28 42 L32 48 L36 42 Z" fill="${skin}"/>`;
    if ((h >>> 21) % 2 === 0) s += `<path d="M14 64 Q15 46 24 42 L27 42 Q20 48 20 64 Z" fill="${accent}" opacity="0.35"/>`;
    s += `<rect x="29.4" y="34" width="5.2" height="7" fill="${skin}"/>`;
    s += `<circle cx="32" cy="27" r="8.4" fill="${skin}"/>`;
    
    /* yeux + coiffure */
    s += `<circle cx="29" cy="27.5" r="1" fill="#1c2030"/><circle cx="35" cy="27.5" r="1" fill="#1c2030"/>`;
    const hairStyle = (h >>> 24) % 4;
    if (hairStyle === 0) s += `<path d="M23.5 26 Q23 16 32 16 Q41 16 40.5 26 Q38 19 32 19 Q26 19 23.5 26 Z" fill="${hair}"/>`;
    else if (hairStyle === 1) s += `<path d="M23.5 27 Q22 14 32 14 Q42 14 40.5 27 L41 36 L38 30 Q39 20 32 19 Q25 20 26 30 L23 36 Z" fill="${hair}"/>`;
    else if (hairStyle === 2) s += `<path d="M24 24 Q24 15 32 15 Q40 15 40 24 Q40 20 32 18.5 Q24 20 24 24 Z" fill="${hair}"/><circle cx="32" cy="12.5" r="3.4" fill="${hair}"/>`;
    else s += `<path d="M23.5 25 Q23.5 15.5 32 15.5 Q40.5 15.5 40.5 25 Q40.5 19.5 32 18 Q23.5 19.5 23.5 25 Z" fill="${hair}"/><rect x="23" y="22" width="18" height="2.4" rx="1.2" fill="${accent}" opacity="0.85"/>`;
    
    /* coiffure de classe */
    const cls2 = u.cls;
    if (cls2 === "Chevalier") {
      s += `<path d="M23.5 25 Q23.5 14.5 32 14.5 Q40.5 14.5 40.5 25 L38.5 25 Q38.5 17 32 17 Q25.5 17 25.5 25 Z" fill="#9fb0c8"/>` +
        `<path d="M32 11 Q35 8 36 4 Q38 9 34 12 Z" fill="${accent}"/>`;
    } else if (cls2 === "Défenseur") {
      s += `<path d="M22.5 27 Q22.5 13.5 32 13.5 Q41.5 13.5 41.5 27 L38 27 L38 22.5 L26 22.5 L26 27 Z" fill="#9fb0c8"/><rect x="27.5" y="24.5" width="9" height="2" fill="#1c2030"/>`;
    } else if (cls2 === "Berserker") {
      s += `<path d="M25 17 L20 8 L26 14 Z" fill="#e0e0e0"/><path d="M39 17 L44 8 L38 14 Z" fill="#e0e0e0"/>`;
    } else if (cls2 === "Mage") {
      s += `<path d="M20 20 L32 4 L44 20 Z" fill="${outfit}"/><rect x="19" y="19" width="26" height="3.4" rx="1.7" fill="${accent}"/>`;
    } else if (cls2 === "Archer" || cls2 === "Rôdeur") {
      s += `<path d="M22 28 Q20.5 13 32 12.5 Q43.5 13 42 28 L42 33 L22 33 Z" fill="${outfit}" opacity="0.92"/><circle cx="32" cy="24" r="7.4" fill="${skin}"/><circle cx="29" cy="24.5" r="1" fill="#1c2030"/><circle cx="35" cy="24.5" r="1" fill="#1c2030"/><path d="M42 14 L48 12 L43 18 Z" fill="${accent}"/>`;
    } else if (cls2 === "Héros") {
      s += `<rect x="24" y="20.5" width="16" height="2.8" rx="1.4" fill="${accent}"/><path d="M45 8 l1.5 3 3 .4 -2.2 2.2 .5 3.1 -2.8-1.6 -2.8 1.6 .5-3.1 -2.2-2.2 3-.4 Z" fill="${accent}" opacity="0.9"/>`;
    } else if (cls2 === "Soigneur") {
      s += `<path d="M22 30 Q21 13 32 12.5 Q43 13 42 30 L42 34 L22 34 Z" fill="#e8ecf6" opacity="0.94"/><circle cx="32" cy="24" r="7.4" fill="${skin}"/><circle cx="29" cy="24.5" r="1" fill="#1c2030"/><circle cx="35" cy="24.5" r="1" fill="#1c2030"/><ellipse cx="32" cy="9" rx="8" ry="2" fill="none" stroke="${accent}" stroke-width="1.4" opacity="0.9"/><line x1="32" y1="44" x2="32" y2="50" stroke="${accent}" stroke-width="2"/><line x1="29" y1="47" x2="35" y2="47" stroke="${accent}" stroke-width="2"/>`;
    } else if (cls2 === "Tueur") {
      s += `<rect x="24.6" y="25" width="14.8" height="4.4" rx="2" fill="#1c2030" opacity="0.9"/><path d="M25.5 25.5 L38.5 25.5" stroke="${accent}" stroke-width="1" opacity="0.9"/>`;
    } else if (cls2 === "Invocateur") {
      s += `<path d="M22 29 Q21 13 32 12.5 Q43 13 42 29 L42 34 L22 34 Z" fill="#2d2440" opacity="0.95"/><circle cx="29" cy="26" r="1.2" fill="#b18cff"/><circle cx="35" cy="26" r="1.2" fill="#b18cff"/><circle cx="32" cy="36" r="2" fill="none" stroke="#b18cff" stroke-width="1.2" opacity="0.8"/>`;
    } else if (cls2 === "Valkyrie") {
      s += `<path d="M23.5 25 Q23.5 14 32 14 Q40.5 14 40.5 25 L38.5 25 Q38.5 16.5 32 16.5 Q25.5 16.5 25.5 25 Z" fill="#9fb0c8"/>` +
        `<path d="M22 16 Q14 14 10 8 Q18 9 23 13 Z" fill="#dfe6f5" opacity="0.9"/><path d="M42 16 Q50 14 54 8 Q46 9 41 13 Z" fill="#dfe6f5" opacity="0.9"/>`;
    }
    
    /* évolutions : lueur puis constellation */
    if (evo >= 1) s += `<ellipse cx="32" cy="34" rx="21" ry="24" fill="${rc}" opacity="0.10"/>`;
    if (evo >= 2) s += `<ellipse cx="32" cy="32" rx="24" ry="28" fill="#ffffff" opacity="0.06"/>`;
    if (evo >= 3) s += `<circle cx="18" cy="14" r="1.6" fill="#e3b23c"/><circle cx="32" cy="8.5" r="2" fill="#ffd970"/><circle cx="46" cy="14" r="1.4" fill="#e3b23c"/>`;
    s += `</svg>`;
    return s;
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

  return { scene, silhouette, dragon, portrait };
})();
