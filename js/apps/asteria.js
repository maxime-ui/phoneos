/* App : Astéria — gacha + combat au tour par tour (personnages fictifs) */
"use strict";

    const RARITY = { 1: { label: "R", color: "#7d869c" }, 2: { label: "SR", color: "#4f9eff" }, 3: { label: "SSR", color: "#e3b23c" }, 4: { label: "SS", color: "#ff8c5a" } };
    const CARD = {
      R: { label: "Brut", color: "#c34a2f", mult: 1.5, element: "feu" },
      B: { label: "Arcane", color: "#3b6bd4", mult: 1.0, element: "arcane" },
      V: { label: "Rapide", color: "#3ba75c", mult: 0.8, element: "vent" },
    };
    const ELEMENTS = {
      feu: { label: "Feu", icon: "🔥", strong: "nature", weak: "eau" },
      eau: { label: "Eau", icon: "💧", strong: "feu", weak: "foudre" },
      foudre: { label: "Foudre", icon: "⚡", strong: "eau", weak: "terre" },
      nature: { label: "Nature", icon: "🌿", strong: "terre", weak: "feu" },
      terre: { label: "Terre", icon: "🪨", strong: "foudre", weak: "nature" },
      arcane: { label: "Arcane", icon: "🔮", strong: null, weak: null },
      vent: { label: "Vent", icon: "🌪️", strong: null, weak: null },
    };
    const ENEMY_AFFINITY = {
      "Brute": "terre", "Assassin": "vent", "Sorcier": "feu",
      "Capitaine": "foudre", "Golem": "terre", "Oracle": "eau",
      "Muraille": "terre", "Invocateur": "arcane", "Fantassin": "foudre",
      "Nécromant": "nature", "Banshee": "eau", "Sanguinaire": "feu",
      "Colosse de givre": "eau", "Duelliste": "vent", "Artilleur": "feu", "Alchimiste": "nature", "Sentinelle": "terre", "Prédateur": "foudre", "Chronomancien": "arcane", "Duelliste": "vent", "Artilleur": "feu", "Alchimiste": "nature", "Sentinelle": "terre", "Prédateur": "foudre", "Chronomancien": "arcane",
    };
    const TIER = {
      facile: { label: "Facile", hp: 7000, atk: 780, reward: 5 },
      normal: { label: "Normal", hp: 15000, atk: 1330, reward: 10 },
      dur: { label: "Difficile", hp: 28000, atk: 2050, reward: 20 },
      infini: { label: "Infini", hp: 7000, atk: 780, reward: 0, infinite: true },
    };
    const ENEMY_NAMES = ["Gobelin ancien", "Chevalier déchu", "Dragon des cendres", "Spectre des marais", "Colosse de pierre", "Sorcière du brouillard", "Basilic", "Seigneur liche", "Fantassin d'élite", "Nécromant errant", "Banshee des marais", "Sanguinaire du brasier", "Colosse de givre", "Ombre du serment", "Dueliste des failles", "Canonnière cendrée", "Alchimiste du néant", "Sentinelle prismatique", "Prédateur nocturne", "Chronomancien brisé", "Hydre des brumes", "Reine des épines", "Garde astral", "Dévoreur de runes"];

    const DIFF_ORDER = ["facile", "moyen", "difficile", "impossible", "enfer", "enferPlus"];

    function diffUnlockedSt(st, key) {
      const cleared = (st && Array.isArray(st.cleared)) ? st.cleared : [];
      const i = DIFF_ORDER.indexOf(key);
      if (i <= 0) return true;
      return DIFF_ORDER.slice(0, i).every((dk) => cleared.includes(dk));
    }

    function matKeyOf(cls) { return "mat_" + cls; }

    const COLLECTION_REWARDS = [
      { pct: 25, quartz: 50 },
      { pct: 50, quartz: 100 },
      { pct: 75, quartz: 200 },
      { pct: 100, quartz: 500 },
    ];
    const LOOT = {
      eclat: { name: "Éclat d'acier", color: "#8f9bb3" },
      coeur: { name: "Cœur de braise", color: "#ff8c5a" },
      larme: { name: "Larme de la nuit", color: "#4f9eff" },
      couronne: { name: "Couronne d'aube", color: "#e3b23c" },
      sceau: { name: "Sceau du dragon", color: "#d33b2f" },
      elixir: { name: "Élixir de raid", color: "#3bd4c4" },
      poussiere: { name: "Poussière de relique", color: "#b48ce0" },
      cristal: { name: "Cristal de relique", color: "#7de0e8" },
      "mat_Chevalier": { name: "Insigne de Chevalier", color: "#c8cfe0" },
      "mat_Berserker": { name: "Croc de Berserker", color: "#d46a2f" },
      "mat_Mage": { name: "Rune de Mage", color: "#6b8ce3" },
      "mat_Archer": { name: "Plume d'Archer", color: "#7ee08c" },
      "mat_Rôdeur": { name: "Fleur de Rôdeur", color: "#3ba75c" },
      "mat_Héros": { name: "Étoile du Héros", color: "#e3b23c" },
      "mat_Soigneur": { name: "Baume de Soigneur", color: "#3bd4a0" },
      "mat_Défenseur": { name: "Rivet de Défenseur", color: "#9fb0c8" },
      "mat_Tueur": { name: "Lame du Tueur", color: "#d33b6f" },
      "mat_Artificier": { name: "Noyau d’Artificier", color: "#d7a85a" },
      "mat_Druide": { name: "Sève de Druide", color: "#3bd4a0" },
      "mat_Occultiste": { name: "Voile d’Occultiste", color: "#9b79d0" },
    };

    const RECYCLE_GAIN = { 1: 2, 2: 4, 3: 8 };
    const RAID_PHASES = [
      { name: "Gardien de la trempe", type: "Golem", hp: 66000, atk: 2730, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" } },
      { name: "Commandant du feu", type: "Capitaine", hp: 100000, atk: 3360, elite: { id: "siphon", name: "Siphon d'âmes", desc: "se soigne de la moitié des dégâts infligés" } },
      { name: "Cœur du dragon", type: "Sorcier", hp: 155000, atk: 3990, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" } },
    ];
    const RAID_BOTS = [
      "Sombrevel", "Ironhelm", "Vespera", "Morvane", "Talliasha", "Grondor", "Ombrelys",
      "Arkhanor", "Freyla", "Zarkan", "Mistheal", "Noldrax",
    ];

    function hashStr(s) {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h * 16777619) >>> 0;
      }
      return h;
    }

    function raidRwOf(rank) {
      return rank === 1 ? 60 : rank <= 3 ? 40 : 20;
    }

    function raidLeaderboard(week, cleared) {
      const entries = [];
      const used = {};
      for (let i = 0; i < 7; i++) {
        const v = hashStr(week + "#" + i);
        let ni = v % RAID_BOTS.length;
        let guard = 0;
        while (used[ni] && guard < RAID_BOTS.length) { ni = (ni + 1) % RAID_BOTS.length; guard++; }
        used[ni] = true;
        entries.push({ name: RAID_BOTS[ni], score: 1500 + (Math.floor(v / 13) % 11500) });
      }
      const mine = (cleared >= 1 ? 1500 : 0) + (cleared >= 2 ? 2500 : 0) + (cleared >= 3 ? 4000 : 0);
      entries.push({ name: "Vous", score: mine, you: true });
      entries.sort((a, b) => b.score - a.score);
      const rank = entries.findIndex((e) => e.you) + 1;
      return { entries, rank, myScore: mine };
    }

    const EVO_REQ = {
      1: [{ eclat: 8 }, { eclat: 12, larme: 5 }, { larme: 5, sceau: 2 }],
      2: [{ eclat: 12, coeur: 6 }, { larme: 8, couronne: 3 }, { larme: 4, sceau: 3 }],
      3: [{ eclat: 20, coeur: 10 }, { larme: 12, couronne: 6 }, { sceau: 5 }],
    };
    const EVO4_REQ = { 1: 3, 2: 4, 3: 5 };
    const EVO2 = {
      Chevalier: { fx: { hp: 8 }, label: "PV max +8 %" },
      Berserker: { fx: { crit: 8 }, label: "Critique +8 %" },
      Mage: { fx: { teamAtk: 5 }, label: "ATK d'équipe +5 %" },
      Archer: { fx: { esquive: 8 }, label: "Esquive +8 %" },
      Rôdeur: { fx: { gauge: 4 }, label: "Jauge +4 % par carte" },
      Héros: { fx: { hp: 6 }, label: "PV max +6 %" },
      Soigneur: { fx: { gauge: 5 }, label: "Jauge +5 % par carte" },
      Défenseur: { fx: { renvoi: 8 }, label: "Renvoi +8 %" },
      Tueur: { fx: { execute: 12 }, label: "+12 % (cible < 50 % PV)" },
      Artificier: { fx: { gauge: 5 }, label: "Jauge +5 % par carte" },
      Druide: { fx: { hp: 8 }, label: "PV max +8 %" },
      Occultiste: { fx: { crit: 8 }, label: "Critique +8 %" },
    };
    const EVO3 = {
      Chevalier: { fx: { renvoi: 10 }, label: "Renvoi +10 %" },
      Berserker: { fx: { rage: 15 }, label: "Rage +15 % sous le seuil" },
      Mage: { fx: { gauge: 6 }, label: "Jauge +6 % par carte" },
      Archer: { fx: { crit: 15 }, label: "Critique +15 %" },
      Rôdeur: { fx: { esquive: 10 }, label: "Esquive +10 %" },
      Héros: { fx: { growth: 4 }, label: "Croissance +4 %/tour" },
      Soigneur: { fx: { heal: 30 }, label: "Soins +30 %" },
      Défenseur: { fx: { rempart: 5 }, label: "Encaissement +5 %" },
      Tueur: { fx: { fureur: 10 }, label: "Tueur +10 % (cible blessée)" },
      Artificier: { fx: { dmg: 10 }, label: "Dégâts +10 %" },
      Druide: { fx: { heal: 20 }, label: "Soins +20 %" },
      Occultiste: { fx: { execute: 10 }, label: "Exécution +10 %" },
    };
    const EVO3B = {
      Chevalier: { fx: { dmg: 6 }, label: "Dégâts +6 %" },
      Berserker: { fx: { hp: 8 }, label: "PV max +8 %" },
      Mage: { fx: { crit: 8 }, label: "Critique +8 %" },
      Archer: { fx: { gauge: 5 }, label: "Jauge +5 % par carte" },
      Rôdeur: { fx: { crit: 8 }, label: "Critique +8 %" },
      Héros: { fx: { teamAtk: 5 }, label: "ATK d'équipe +5 %" },
      Soigneur: { fx: { hp: 8 }, label: "PV max +8 %" },
      Défenseur: { fx: { esquive: 8 }, label: "Esquive +8 %" },
      Tueur: { fx: { gauge: 4 }, label: "Jauge +4 % par carte" },
      Artificier: { fx: { teamAtk: 3 }, label: "ATK d’équipe +3 %" },
      Druide: { fx: { heal: 8 }, label: "Soins +8 %" },
      Occultiste: { fx: { dmg: 5 }, label: "Dégâts +5 %" },
    };
    const PASSIVE_INFO = {
      gauvin: ["Serment renforcé", "renvoie 10 % de plus", { renvoi: 10 }],
      morgane: ["Écho arcanique", "jauge +5 % de plus par carte", { gauge: 5 }],
      kaelith: ["Œil d'aigle", "critique +10 %", { crit: 10 }],
      aldric: ["Bannière levée", "ATK d'équipe +8 % de plus", { teamAtk: 8 }],
      seraphine: ["Bouclier sacré", "PV max +10 %", { hp: 10 }],
      draven: ["Fureur montante", "dégâts +10 %", { dmg: 10 }],
      valen: ["Juste dernier", "+25 % contre une cible sous 50 % PV", { execute: 25 }],
      ravenne: ["Sceau amplifié", "dégâts +8 %", { dmg: 8 }],
      aelis: ["Flèche d'or", "jauge +5 % par carte", { gauge: 5 }],
      kargan: ["Peau de titane", "PV max +12 %", { hp: 12 }],
      kairo: ["Héritage du dragon", "croissance +3 %/tour", { growth: 3 }],
      okatsuro: ["Double ombre", "esquive +15 %", { esquive: 15 }],
      barrok: ["Élasticité max", "renvoie 10 % de plus", { renvoi: 10 }],
      enzo: ["Âme du brasier", "dégâts +6 %", { dmg: 6 }],
      edele: ["Printemps éternel", "soins +20 %", { heal: 20 }],
      nadila: ["Jardin d'herbes", "jauge +5 % par carte", { gauge: 5 }],
      bastien: ["Mur vivant", "PV max +15 %", { hp: 15 }],
      orlan: ["Aube fatale", "+15 % contre une cible sous 50 % PV", { execute: 15 }],
      raiden: ["Éclair noir", "critique +15 %", { crit: 15 }],
      rin: ["Destin lié", "jauge de départ +15 %", { jaugeInit: 15 }],
      vespera: ["Âme veillée", "PV max +8 %", { hp: 8 }],
      takumi: ["Écailles d'épaule", "PV max +12 %", { hp: 12 }],
      graal: ["Héritière des braises", "dégâts +10 % et jauge de départ +10 %", { dmg: 10, jaugeInit: 10 }],
      elyndra: ["Noyau résonant", "ATK d’équipe +6 %", { teamAtk: 6 }],
      maelis: ["Floraison protectrice", "soins +18 % et PV +5 %", { heal: 18, hp: 5 }],
      nyxar: ["Dette du crépuscule", "dégâts +10 %", { dmg: 10 }],
      toren: ["Rivet de guerre", "dégâts +7 %", { dmg: 7 }],
      sylwen: ["Sève apaisante", "soins +12 %", { heal: 12 }],
      vhal: ["Marque du bannissement", "exécution +12 %", { execute: 12 }],
      brena: ["Mécanisme de secours", "jauge +4 % par carte", { gauge: 4 }],
      lirio: ["Pollen calme", "soins +8 %", { heal: 8 }],
      zarek: ["Encre noire", "dégâts +5 %", { dmg: 5 }],
      pavel: ["Clé d’apprenti", "ATK d’équipe +2 %", { teamAtk: 2 }],
      nima: ["Herbe vivace", "PV +5 %", { hp: 5 }],
      orik: ["Cendre froide", "critique +5 %", { crit: 5 }],
      sirona: ["Cœur du baume", "soins +15 %", { heal: 15 }],
      gorm: ["Mur d'os", "renvoie 12 %", { renvoi: 12 }],
      poppy: ["Petite jauge", "jauge +4 % par carte", { gauge: 4 }],
      elise: ["Discipline d'acier", "renvoie 8 %", { renvoi: 8 }],
      yuki: ["Pluie fine", "esquive +10 %", { esquive: 10 }],
      luna: ["Regard des tombes", "+10 % contre une cible sous 50 % PV", { execute: 10 }],
      kelt: ["Crochet du soir", "+12 % contre une cible sous 50 % PV", { execute: 12 }],
      hiryu: ["Trait du vent", "esquive +10 %", { esquive: 10 }],
      garrion: ["Étendard levé", "ATK d'équipe +7 %", { teamAtk: 7 }],
      lyra: ["Source pure", "soins +18 %", { heal: 18 }],
      mordevai: ["Lame au flanc", "+20 % contre une cible sous 50 % PV", { execute: 20 }],
      haru: ["Archet d'aube", "critique +12 %", { crit: 12 }],
      freida: ["Braises retenues", "dégâts +10 %", { dmg: 10 }],
      doran: ["Porte de fer", "PV max +16 %", { hp: 16 }],
      asuran: ["Sang bouillant", "renvoie 12 %", { renvoi: 12 }],
      milena: ["Mains douces", "soins +12 %", { heal: 12 }],
      corvan: ["Aiguillon", "jauge +4 % par carte", { gauge: 4 }],
      ella: ["Souffle vert", "jauge de départ +8 %", { jaugeInit: 8 }],
      brann: ["Mur de glaise", "renvoie 8 %", { renvoi: 8 }],
      iseult: ["Lueur d'archive", "dégâts +7 %", { dmg: 7 }],
      togor: ["Croc court", "critique +6 %", { crit: 6 }],
      mira: ["Tisane claire", "soins +8 %", { heal: 8 }],
      wendel: ["Serment frais", "PV max +6 %", { hp: 6 }],
    };
    const ENEMY_BALANCE = {
      Brute: [1.08, 1.04], Assassin: [0.94, 1.12], Sorcier: [1.00, 0.96],
      Capitaine: [1.06, 1.00], Golem: [1.18, 0.90], Oracle: [1.12, 0.88],
      Muraille: [1.22, 0.84], Invocateur: [0.96, 1.04], Fantassin: [1.00, 0.98],
      Nécromant: [1.04, 0.94], Banshee: [0.96, 1.02], Sanguinaire: [0.94, 1.12],
      "Colosse de givre": [1.14, 0.96], Duelliste: [0.96, 1.10], Artilleur: [0.92, 1.08],
      Alchimiste: [1.04, 0.92], Sentinelle: [1.20, 0.90], Prédateur: [0.96, 1.12],
      Chronomancien: [0.92, 1.08],
    };
    function enemyStats(type, hp, atk) {
      const tune = ENEMY_BALANCE[type] || [1, 1];
      return { hp: Math.round(hp * tune[0]), maxHp: Math.round(hp * tune[0]), atk: Math.round(atk * tune[1]) };
    }

    const ENEMY_TYPES = {
      "Brute": { desc: "Frappe fort le membre le plus blessé" },
      "Assassin": { desc: "Traque l'attaquant le plus dangereux, critiques fréquents" },
      "Sorcier": { desc: "Brûle toute l'équipe à chaque tour" },
      "Capitaine": { desc: "Se renforce de 4 % à chacun de ses tours" },
      "Golem": { desc: "Carapace : subit 20 % de dégâts en moins, frappe plus lentement" },
      "Oracle": { desc: "Prie à chaque tour : régénère 4 % de ses PV max" },
      "Muraille": { desc: "Bastion : subit 10 % de dégâts en moins" },
      "Invocateur": { desc: "Rituel : appelle une ombre qui frappe une seconde fois" },
      "Fantassin": { desc: "Rythme de fer : frappe deux fois, mais plus légèrement" },
      "Nécromant": { desc: "Juste funeste : se soigne 3 % de ses PV max puis frappe" },
      "Banshee": { desc: "Hurlement : draine 12 % de la jauge d'Ultime de l'équipe" },
      "Sanguinaire": { desc: "Soif de sang : frappe très fort les membres les plus blessés" },
      "Colosse de givre": { desc: "Carapace de givre : subit 15 % de dégâts en moins" },
      "Duelliste": { desc: "Frappe le héros le plus rapide et prépare une exécution" },
      "Artilleur": { desc: "Barrage de zone à dégâts modérés" },
      "Alchimiste": { desc: "Empoisonne l’équipe et se régénère" },
      "Sentinelle": { desc: "Armure prismatique et réduction des dégâts" },
      "Prédateur": { desc: "Traque les héros blessés et monte en puissance" },
      "Chronomancien": { desc: "Draine la jauge et déforme le rythme du combat" },
      "Duelliste": { desc: "Riposte précise : cible le héros le plus rapide" },
      "Artilleur": { desc: "Barrage : frappe toute l’équipe" },
      "Alchimiste": { desc: "Transmutation : empoisonne et se soigne" },
      "Sentinelle": { desc: "Formation : réduit les dégâts reçus" },
      "Prédateur": { desc: "Marquage : traque le héros le plus blessé" },
      "Chronomancien": { desc: "Distorsion : ralentit la jauge d’Ultime" },
    };
    const UNITS = [
      /* --- SSR (5 %) --- */
      { id: "gauvin", name: "Sir Gauvin", r: 3, cls: "Chevalier", atk: 1900, hp: 11500, cards: ["R", "B", "B"] },
      { id: "morgane", name: "Morgane", r: 3, cls: "Mage", atk: 1750, hp: 9800, cards: ["B", "B", "R"] },
      { id: "kaelith", name: "Kaelith", r: 3, cls: "Archer", atk: 1850, hp: 9200, cards: ["V", "R", "B"] },
      { id: "aldric", name: "Aldric de Hautefeuille", r: 3, cls: "Chevalier", atk: 1950, hp: 12000, cards: ["R", "R", "B"] },
      { id: "seraphine", name: "Séraphine", r: 3, cls: "Mage", atk: 1800, hp: 9500, cards: ["B", "V", "B"] },
      { id: "draven", name: "Draven", r: 3, cls: "Berserker", atk: 2000, hp: 9000, cards: ["R", "R", "V"] },
      { id: "valen", name: "Valen le Juste", r: 3, cls: "Chevalier", atk: 1980, hp: 11900, cards: ["R", "R", "B"] },
      { id: "ravenne", name: "Ravenne", r: 3, cls: "Mage", atk: 1820, hp: 10000, cards: ["B", "B", "V"] },
      { id: "aelis", name: "Aelis aux mille flèches", r: 3, cls: "Archer", atk: 1900, hp: 9400, cards: ["V", "V", "R"] },
      { id: "kargan", name: "Kargan", r: 3, cls: "Berserker", atk: 2050, hp: 9200, cards: ["R", "R", "V"] },
      /* --- Faction manga : légendes inspirées des archétypes --- */
      { id: "kairo", name: "Kairo, l'enfant des dragons", r: 3, cls: "Héros", atk: 2000, hp: 10600, cards: ["R", "R", "B"] },
      { id: "okatsuro", name: "Okatsuro", r: 3, cls: "Rôdeur", atk: 1920, hp: 9600, cards: ["V", "V", "B"] },
      { id: "barrok", name: "Barrok le Caoutchouc", r: 3, cls: "Héros", atk: 1880, hp: 11200, cards: ["R", "V", "B"] },
      { id: "enzo", name: "Enzo le Pyromane", r: 3, cls: "Mage", atk: 1850, hp: 9900, cards: ["B", "R", "R"] },
      /* --- SR (20 %) --- */
      { id: "elise", name: "Dame Elise", r: 2, cls: "Chevalier", atk: 1450, hp: 9500, cards: ["R", "B", "V"] },
      { id: "orwen", name: "Orwen", r: 2, cls: "Berserker", atk: 1700, hp: 8500, cards: ["R", "R", "V"] },
      { id: "lia", name: "Lia", r: 2, cls: "Mage", atk: 1350, hp: 8800, cards: ["B", "V", "B"] },
      { id: "farid", name: "Farid", r: 2, cls: "Rôdeur", atk: 1500, hp: 8300, cards: ["V", "R", "V"] },
      { id: "rowena", name: "Rowena", r: 2, cls: "Mage", atk: 1400, hp: 9200, cards: ["B", "V", "R"] },
      { id: "cassius", name: "Cassius", r: 2, cls: "Chevalier", atk: 1500, hp: 9800, cards: ["B", "R", "B"] },
      { id: "morwenna", name: "Morwenna", r: 2, cls: "Rôdeur", atk: 1600, hp: 8600, cards: ["V", "V", "R"] },
      { id: "thibault", name: "Thibault", r: 2, cls: "Chevalier", atk: 1380, hp: 10200, cards: ["R", "B", "V"] },
      { id: "isolde", name: "Isolde", r: 2, cls: "Archer", atk: 1550, hp: 8400, cards: ["V", "R", "R"] },
      { id: "kaeren", name: "Kaeren", r: 2, cls: "Rôdeur", atk: 1480, hp: 8900, cards: ["B", "V", "V"] },
      { id: "bellamy", name: "Bellamy", r: 2, cls: "Berserker", atk: 1650, hp: 8300, cards: ["R", "V", "R"] },
      { id: "odric", name: "Odric", r: 2, cls: "Chevalier", atk: 1520, hp: 9400, cards: ["B", "R", "V"] },
      { id: "gauthier", name: "Gauthier", r: 2, cls: "Chevalier", atk: 1560, hp: 9600, cards: ["R", "B", "V"] },
      { id: "elda", name: "Elda", r: 2, cls: "Mage", atk: 1420, hp: 9400, cards: ["B", "V", "B"] },
      { id: "soren", name: "Soren", r: 2, cls: "Archer", atk: 1580, hp: 8500, cards: ["V", "R", "B"] },
      { id: "ravena", name: "Ravena", r: 2, cls: "Rôdeur", atk: 1540, hp: 8700, cards: ["V", "B", "V"] },
      { id: "duncan", name: "Duncan", r: 2, cls: "Berserker", atk: 1680, hp: 8600, cards: ["R", "R", "V"] },
      { id: "yvain", name: "Yvain", r: 2, cls: "Chevalier", atk: 1490, hp: 10000, cards: ["B", "B", "R"] },
      { id: "maeva", name: "Maéva", r: 2, cls: "Rôdeur", atk: 1510, hp: 8800, cards: ["V", "V", "B"] },
      { id: "coralie", name: "Coralie", r: 2, cls: "Mage", atk: 1380, hp: 9600, cards: ["V", "B", "B"] },
      { id: "koharu", name: "Koharu", r: 2, cls: "Mage", atk: 1450, hp: 9500, cards: ["B", "V", "B"] },
      { id: "daichi", name: "Daichi le briseur de titans", r: 2, cls: "Chevalier", atk: 1580, hp: 10200, cards: ["R", "B", "V"] },
      { id: "akemi", name: "Akemi la Lame Rouge", r: 2, cls: "Rôdeur", atk: 1600, hp: 8400, cards: ["V", "R", "R"] },
      { id: "ryoji", name: "Ryoji", r: 2, cls: "Berserker", atk: 1720, hp: 8600, cards: ["R", "R", "V"] },
      /* --- R (75 %) --- */
      { id: "bron", name: "Bron", r: 1, cls: "Berserker", atk: 1100, hp: 7000, cards: ["R", "R", "V"] },
      { id: "tilia", name: "Tilia", r: 1, cls: "Mage", atk: 950, hp: 7500, cards: ["B", "B", "V"] },
      { id: "nerys", name: "Nerys", r: 1, cls: "Chevalier", atk: 1000, hp: 8200, cards: ["B", "R", "V"] },
      { id: "joach", name: "Joach", r: 1, cls: "Archer", atk: 1050, hp: 6800, cards: ["V", "R", "R"] },
      { id: "sylphe", name: "Sylphe", r: 1, cls: "Rôdeur", atk: 980, hp: 7200, cards: ["V", "V", "B"] },
      { id: "perrin", name: "Perrin", r: 1, cls: "Chevalier", atk: 1020, hp: 8400, cards: ["B", "R", "V"] },
      { id: "maud", name: "Maud", r: 1, cls: "Mage", atk: 960, hp: 7600, cards: ["B", "B", "V"] },
      { id: "hugo", name: "Hugo", r: 1, cls: "Berserker", atk: 1150, hp: 6900, cards: ["R", "R", "V"] },
      { id: "anouk", name: "Anouk", r: 1, cls: "Rôdeur", atk: 1000, hp: 7400, cards: ["V", "R", "B"] },
      { id: "basil", name: "Basil", r: 1, cls: "Archer", atk: 1080, hp: 6600, cards: ["V", "R", "R"] },
      { id: "celestine", name: "Célestine", r: 1, cls: "Mage", atk: 990, hp: 7800, cards: ["B", "V", "B"] },
      { id: "dorian", name: "Dorian", r: 1, cls: "Archer", atk: 1120, hp: 6700, cards: ["R", "V", "B"] },
      { id: "emeric", name: "Emeric", r: 1, cls: "Chevalier", atk: 980, hp: 8600, cards: ["R", "B", "V"] },
      { id: "fenna", name: "Fenna", r: 1, cls: "Rôdeur", atk: 1040, hp: 7200, cards: ["V", "V", "R"] },
      { id: "gael", name: "Gael", r: 1, cls: "Berserker", atk: 1180, hp: 6600, cards: ["R", "V", "B"] },
      { id: "hilda", name: "Hilda", r: 1, cls: "Mage", atk: 940, hp: 8000, cards: ["B", "R", "B"] },
      { id: "ivor", name: "Ivor", r: 1, cls: "Chevalier", atk: 1060, hp: 8200, cards: ["B", "R", "R"] },
      { id: "jolande", name: "Jolande", r: 1, cls: "Mage", atk: 1010, hp: 7500, cards: ["V", "B", "B"] },
      { id: "kasimir", name: "Kasimir", r: 1, cls: "Berserker", atk: 1140, hp: 7100, cards: ["V", "R", "R"] },
      { id: "lisette", name: "Lisette", r: 1, cls: "Archer", atk: 1090, hp: 6900, cards: ["B", "V", "R"] },
      { id: "marceau", name: "Marceau", r: 1, cls: "Rôdeur", atk: 1070, hp: 7300, cards: ["R", "V", "V"] },
      { id: "noemie", name: "Noémie", r: 1, cls: "Mage", atk: 970, hp: 7700, cards: ["B", "V", "R"] },
      { id: "oswald", name: "Oswald", r: 1, cls: "Chevalier", atk: 990, hp: 8800, cards: ["V", "B", "R"] },
      { id: "petra", name: "Petra", r: 1, cls: "Rôdeur", atk: 1030, hp: 7600, cards: ["B", "V", "V"] },
      { id: "arthaud", name: "Arthaud", r: 1, cls: "Chevalier", atk: 1040, hp: 8500, cards: ["R", "B", "V"] },
      { id: "blanche", name: "Blanche", r: 1, cls: "Mage", atk: 950, hp: 7800, cards: ["B", "B", "V"] },
      { id: "colin", name: "Colin", r: 1, cls: "Berserker", atk: 1160, hp: 7000, cards: ["R", "R", "V"] },
      { id: "delphine", name: "Delphine", r: 1, cls: "Mage", atk: 980, hp: 7900, cards: ["B", "V", "B"] },
      { id: "everard", name: "Everard", r: 1, cls: "Chevalier", atk: 1010, hp: 8700, cards: ["B", "R", "V"] },
      { id: "florence", name: "Florence", r: 1, cls: "Archer", atk: 1060, hp: 6800, cards: ["V", "R", "R"] },
      { id: "guilhem", name: "Guilhem", r: 1, cls: "Chevalier", atk: 1070, hp: 8300, cards: ["R", "V", "B"] },
      { id: "hermine", name: "Hermine", r: 1, cls: "Mage", atk: 990, hp: 7400, cards: ["V", "B", "B"] },
      { id: "ismael", name: "Ismael", r: 1, cls: "Rôdeur", atk: 1050, hp: 7100, cards: ["V", "R", "B"] },
      { id: "jade", name: "Jade", r: 1, cls: "Archer", atk: 1100, hp: 7000, cards: ["B", "V", "V"] },
      { id: "kaelan", name: "Kaelan", r: 1, cls: "Berserker", atk: 1130, hp: 7200, cards: ["R", "V", "R"] },
      { id: "lois", name: "Loïs", r: 1, cls: "Rôdeur", atk: 1020, hp: 7500, cards: ["V", "V", "B"] },
      { id: "margo", name: "Margo", r: 1, cls: "Mage", atk: 960, hp: 7600, cards: ["B", "R", "B"] },
      { id: "nils", name: "Nils", r: 1, cls: "Chevalier", atk: 1050, hp: 8100, cards: ["B", "R", "R"] },
      { id: "odile", name: "Odile", r: 1, cls: "Mage", atk: 1000, hp: 7200, cards: ["V", "B", "R"] },
      { id: "pierrick", name: "Pierrick", r: 1, cls: "Berserker", atk: 1170, hp: 6700, cards: ["R", "R", "V"] },
      { id: "quentin", name: "Quentin", r: 1, cls: "Archer", atk: 1110, hp: 6600, cards: ["V", "R", "B"] },
      { id: "rosalie", name: "Rosalie", r: 1, cls: "Rôdeur", atk: 1030, hp: 7400, cards: ["R", "V", "V"] },
      { id: "simon", name: "Simon", r: 1, cls: "Chevalier", atk: 990, hp: 8900, cards: ["R", "B", "R"] },
      { id: "thea", name: "Théa", r: 1, cls: "Mage", atk: 970, hp: 7700, cards: ["B", "V", "V"] },
      { id: "ulric", name: "Ulric", r: 1, cls: "Berserker", atk: 1150, hp: 7300, cards: ["V", "R", "R"] },
      { id: "victoire", name: "Victoire", r: 1, cls: "Chevalier", atk: 1080, hp: 8000, cards: ["B", "V", "R"] },
      { id: "isao", name: "Isao", r: 1, cls: "Chevalier", atk: 1060, hp: 8400, cards: ["B", "R", "V"] },
      { id: "mei", name: "Mei", r: 1, cls: "Mage", atk: 980, hp: 7700, cards: ["B", "V", "B"] },
      { id: "kenji", name: "Kenji", r: 1, cls: "Archer", atk: 1090, hp: 6800, cards: ["V", "R", "R"] },
      { id: "sora", name: "Sora Takeda", r: 1, cls: "Rôdeur", atk: 1010, hp: 7300, cards: ["V", "V", "B"] },

      /* --- Vague des nouveaux rôles : Soigneur, Défenseur, Tueur --- */
      /* --- SSR --- */
      { id: "edele", name: "Mère Édelé", r: 3, cls: "Soigneur", atk: 1500, hp: 10000, cards: ["B", "B", "V"] },
      { id: "nadila", name: "Nadila l'Apothicaire", r: 3, cls: "Soigneur", atk: 1550, hp: 9900, cards: ["B", "V", "B"] },
      { id: "bastien", name: "Bastien le Rempart", r: 3, cls: "Défenseur", atk: 1300, hp: 14000, cards: ["R", "B", "V"] },
      { id: "orlan", name: "Orlan, lames de l'aube", r: 3, cls: "Tueur", atk: 2100, hp: 9000, cards: ["R", "R", "V"] },
      { id: "raiden", name: "Raiden l'Éclair-Noir", r: 3, cls: "Tueur", atk: 2050, hp: 9200, cards: ["R", "V", "V"] },
      { id: "rin", name: "Rin, l'élue noire", r: 3, cls: "Héros", atk: 2000, hp: 10400, cards: ["R", "R", "B"] },
      { id: "vespera", name: "Vespera des veillés", r: 3, cls: "Mage", atk: 1860, hp: 9700, cards: ["B", "B", "R"] },
      { id: "takumi", name: "Takumi, bras du dragon", r: 3, cls: "Chevalier", atk: 1970, hp: 11600, cards: ["R", "B", "R"] },
      /* --- SR --- */
      { id: "sirona", name: "Sirona", r: 2, cls: "Soigneur", atk: 1150, hp: 8900, cards: ["B", "B", "V"] },
      { id: "annelie", name: "Annelie", r: 2, cls: "Soigneur", atk: 1120, hp: 8700, cards: ["B", "V", "V"] },
      { id: "gorm", name: "Gorm", r: 2, cls: "Défenseur", atk: 1050, hp: 11500, cards: ["R", "B", "V"] },
      { id: "hedda", name: "Hedda", r: 2, cls: "Défenseur", atk: 1080, hp: 11200, cards: ["B", "R", "V"] },
      { id: "kelt", name: "Kelt", r: 2, cls: "Tueur", atk: 1750, hp: 8000, cards: ["R", "V", "V"] },
      { id: "sablier", name: "Sablier", r: 2, cls: "Tueur", atk: 1720, hp: 8100, cards: ["V", "R", "B"] },
      { id: "luna", name: "Luna des tombes", r: 2, cls: "Mage", atk: 1450, hp: 9300, cards: ["B", "B", "V"] },
      { id: "hachiro", name: "Hachiro", r: 2, cls: "Berserker", atk: 1740, hp: 8500, cards: ["R", "R", "V"] },
      /* --- R --- */
      { id: "poppy", name: "Poppy", r: 1, cls: "Soigneur", atk: 850, hp: 7300, cards: ["B", "V", "V"] },
      { id: "germain", name: "Germain", r: 1, cls: "Soigneur", atk: 840, hp: 7400, cards: ["B", "B", "V"] },
      { id: "tulio", name: "Tulio", r: 1, cls: "Défenseur", atk: 800, hp: 10200, cards: ["R", "B", "V"] },
      { id: "marguerite", name: "Marguerite", r: 1, cls: "Défenseur", atk: 790, hp: 10000, cards: ["B", "V", "R"] },
      { id: "faust", name: "Faust", r: 1, cls: "Tueur", atk: 1150, hp: 6900, cards: ["R", "V", "B"] },
      { id: "yuki", name: "Yuki", r: 1, cls: "Archer", atk: 1100, hp: 6800, cards: ["V", "R", "B"] },
      { id: "tora", name: "Tora", r: 1, cls: "Rôdeur", atk: 1030, hp: 7100, cards: ["V", "V", "B"] },
      { id: "piou", name: "Piou-Bleu", r: 1, cls: "Mage", atk: 950, hp: 7800, cards: ["B", "B", "V"] },
      /* --- Nouvelle vague SSR --- */
      { id: "hiryu", name: "Hiryu, aile de vent", r: 3, cls: "Rôdeur", atk: 2010, hp: 9300, cards: ["V", "V", "B"] },
      { id: "garrion", name: "Garrion le Porteur", r: 3, cls: "Héros", atk: 1960, hp: 11400, cards: ["R", "R", "B"] },
      { id: "lyra", name: "Lyra du Sanctuaire", r: 3, cls: "Soigneur", atk: 1560, hp: 10100, cards: ["B", "B", "V"] },
      { id: "mordevai", name: "Mordevai", r: 3, cls: "Tueur", atk: 2120, hp: 8900, cards: ["R", "R", "V"] },
      { id: "haru", name: "Haru, l'arc d'aube", r: 3, cls: "Archer", atk: 1890, hp: 9300, cards: ["V", "R", "B"] },
      { id: "freida", name: "Freida la Flamboyante", r: 3, cls: "Mage", atk: 1880, hp: 9600, cards: ["B", "B", "V"] },
      { id: "doran", name: "Doran du Mur atavique", r: 3, cls: "Défenseur", atk: 1310, hp: 14200, cards: ["R", "B", "V"] },
      { id: "asuran", name: "Asuran", r: 3, cls: "Berserker", atk: 2070, hp: 9000, cards: ["R", "R", "V"] },
      /* --- Nouvelle vague SR --- */
      { id: "milena", name: "Milena", r: 2, cls: "Soigneur", atk: 1140, hp: 9000, cards: ["B", "B", "V"] },
      { id: "corvan", name: "Corvan", r: 2, cls: "Tueur", atk: 1740, hp: 8200, cards: ["R", "V", "V"] },
      { id: "ella", name: "Ella des sentiers", r: 2, cls: "Rôdeur", atk: 1530, hp: 8700, cards: ["V", "V", "R"] },
      { id: "brann", name: "Brann le Tangru", r: 2, cls: "Défenseur", atk: 1060, hp: 11400, cards: ["R", "B", "V"] },
      { id: "iseult", name: "Iseult", r: 2, cls: "Mage", atk: 1440, hp: 9400, cards: ["B", "B", "V"] },
      { id: "togor", name: "Togor", r: 2, cls: "Berserker", atk: 1690, hp: 8700, cards: ["R", "R", "V"] },
      /* --- Nouvelle vague R --- */
      { id: "atis", name: "Atis", r: 1, cls: "Mage", atk: 960, hp: 7600, cards: ["B", "B", "V"] },
      { id: "renar", name: "Renar", r: 1, cls: "Rôdeur", atk: 1000, hp: 7400, cards: ["V", "V", "B"] },
      { id: "clara", name: "Clara", r: 1, cls: "Berserker", atk: 1140, hp: 6800, cards: ["R", "R", "V"] },
      { id: "wendel", name: "Wendel", r: 1, cls: "Chevalier", atk: 990, hp: 8200, cards: ["B", "R", "V"] },
      { id: "mira", name: "Mira", r: 1, cls: "Soigneur", atk: 850, hp: 7300, cards: ["B", "V", "V"] },
      { id: "oskar", name: "Oskar", r: 1, cls: "Archer", atk: 1100, hp: 6800, cards: ["V", "R", "B"] },

      /* --- SS exclusive : Le Graal (Dragon des cendres en Enfer+) --- */
      { id: "elyndra", name: "Elyndra, forgeuse d’étoiles", r: 3, cls: "Artificier", atk: 1840, hp: 10100, cards: ["B", "R", "V"] },
      { id: "maelis", name: "Maélis, gardienne des racines", r: 3, cls: "Druide", atk: 1580, hp: 10800, cards: ["B", "B", "V"] },
      { id: "nyxar", name: "Nyxar, veilleur du voile", r: 3, cls: "Occultiste", atk: 1900, hp: 9500, cards: ["B", "R", "B"] },
      { id: "toren", name: "Toren des enclumes", r: 2, cls: "Artificier", atk: 1430, hp: 9300, cards: ["R", "B", "V"] },
      { id: "sylwen", name: "Sylwen la sève-lune", r: 2, cls: "Druide", atk: 1160, hp: 9500, cards: ["B", "V", "B"] },
      { id: "vhal", name: "Vhal l’exilé", r: 2, cls: "Occultiste", atk: 1510, hp: 8900, cards: ["B", "R", "V"] },
      { id: "brena", name: "Brena la mécaniste", r: 2, cls: "Artificier", atk: 1390, hp: 9700, cards: ["R", "V", "B"] },
      { id: "lirio", name: "Lirio des clairières", r: 1, cls: "Druide", atk: 880, hp: 7900, cards: ["B", "V", "B"] },
      { id: "zarek", name: "Zarek", r: 1, cls: "Occultiste", atk: 1080, hp: 7300, cards: ["B", "R", "V"] },
      { id: "pavel", name: "Pavel l’apprenti", r: 1, cls: "Artificier", atk: 1030, hp: 7600, cards: ["R", "B", "V"] },
      { id: "nima", name: "Nima", r: 1, cls: "Druide", atk: 860, hp: 8000, cards: ["B", "B", "V"] },
      { id: "orik", name: "Orik des cendres", r: 1, cls: "Occultiste", atk: 1060, hp: 7400, cards: ["B", "R", "B"] },
      /* --- SS exclusive : Le Graal (Dragon des cendres en Enfer+) --- */
      { id: "graal", name: "Astrée, Héritière des braises", r: 4, cls: "Héros", atk: 2380, hp: 13200, cards: ["R", "R", "B"] },
    ];
    const PASSIVE_BY_CLASS = {
      Chevalier: ["Garde disciplinée", "PV max +5 %", { hp: 5 }],
      Berserker: ["Fureur contrôlée", "dégâts +4 %", { dmg: 4 }],
      Mage: ["Flux arcanique", "jauge +3 % par carte", { gauge: 3 }],
      Archer: ["Œil exercé", "critique +4 %", { crit: 4 }],
      "Rôdeur": ["Pas silencieux", "esquive +4 %", { esquive: 4 }],
      "Héros": ["Volonté tenace", "croissance +2 %/tour", { growth: 2 }],
      Soigneur: ["Main secourable", "soins +6 %", { heal: 6 }],
      Défenseur: ["Rempart mobile", "renvoi +4 %", { renvoi: 4 }],
      Tueur: ["Frappe précise", "exécution +6 %", { execute: 6 }],
      Artificier: ["Réglage fin", "ATK d’équipe +2 %", { teamAtk: 2 }],
      Druide: ["Sève vitale", "soins +5 % et PV +2 %", { heal: 5, hp: 2 }],
      Occultiste: ["Marque discrète", "dégâts +4 %", { dmg: 4 }],
    };
    UNITS.forEach((unit) => { if (!PASSIVE_INFO[unit.id]) PASSIVE_INFO[unit.id] = PASSIVE_BY_CLASS[unit.cls] || ["Détermination", "dégâts +3 %", { dmg: 3 }]; });
    const CLASS_BONUS = {
      Chevalier: "Encaisse : ripostes subies réduites de 25 %",
      Berserker: "Enragé : +20 % dégâts sous 50 % PV",
      Mage: "Arcane : dégâts +30 % et Ultime recharge plus vite",
      Archer: "Viseur : critiques à 35 % (au lieu de 25 %)",
      "Rôdeur": "Esquive : 25 % de chance d'éviter une riposte",
      "Héros": "Protagoniste : +5 % de dégâts à chaque tour qui passe (montée en puissance)",
      "Soigneur": "Cure : soigne l'allié le plus blessé (30 % d'ATK) au lieu d'attaquer",
      "Défenseur": "Rempart : dégâts subis par toute l'équipe réduits de 10 % tant qu'il est debout",
      "Tueur": "Tueur de géants : +30 % de dégâts, mais attire les ripostes en priorité",
      "Artificier": "Ingénieur : renforce l’ATK de l’équipe et accélère la jauge",
      "Druide": "Gardien sylvestre : soigne les alliés et renforce leur endurance",
      "Occultiste": "Voile : maudit l’ennemi et amplifie les dégâts d’exécution",
    };
    const SKILL_INFO = {
      gauvin: ["Serment d'acier", "renvoie 30 % des dégâts de la riposte qu'il subit"],
      aldric: ["Bannière de Hautefeuille", "+10 % d'ATK pour toute l'équipe tant qu'il est debout"],
      morgane: ["Runes de sagesse", "l'Ultime se charge +5 % par carte jouée"],
      kaelith: ["Pluie d'étoiles", "ses cartes Rapide infligent 40 % de dégâts en plus"],
      draven: ["Frénésie du dernier souffle", "enragé dès 70 % PV (+30 % au lieu de +20 %)"],
      seraphine: ["Aurore", "bouclier : 20 % de chance de dévier chaque riposte"],
      ravenne: ["Sceau maudit", "chaque carte Arcane maudit l'ennemi : +10 % dégâts, cumulable"],
      aelis: ["Salve des mille flèches", "critiques à 50 % de chance (au lieu de 35 %)"],
      kairo: ["Charge du dragon", "15 % de chance de frapper deux fois"],
      okatsuro: ["Ombres jumelles", "esquive les ripostes à 40 % (au lieu de 25 %)"],
      barrok: ["Poing élastique", "renvoie 35 % des dégâts de la riposte qu'il subit"],
      enzo: ["Déflagration", "ses Brut enflamment l'ennemi : 4 % PV max/tour, 3 cumuls max"],
      kargan: ["Fureur titanesque", "enragé dès 80 % PV (+35 % de dégâts)"],
      valen: ["Gardien du trône", "+30 % d'ATK permanent quand un allié tombe K.O."],
      edele: ["Prière du printemps", "ses soins sont majorés de 50 %"],
      nadila: ["Pharmacie d'herbes", "chaque soin recharge +5 % d'Ultime"],
      bastien: ["Mur de Hautefeuille", "son encaissement vaut 15 % (au lieu de 10 %)"],
      orlan: ["Lames de l'aube", "+45 % de dégâts (au lieu de +30 %)"],
      raiden: ["Exécution", "+100 % de dégâts contre un ennemi sous 25 % PV"],
      rin: ["Destin noirci", "+8 % de dégâts par tour qui passe (au lieu de +5 %)"],
      vespera: ["Veillées", "chaque carte jouée recharge +6 % d'Ultime"],
      takumi: ["Garde-rapprochée", "renvoie 20 % des dégâts de la riposte qu'il subit"],
      graal: ["Héritage des braises", "+5 %/tour, renvoie 20 % des ripostes et soigne 8 % des dégâts infligés"],
    };
    const TRAIN_OPPONENTS = [
      { key: "bois", name: "Mannequin de bois", type: "Muraille", hp: 20000, atk: 780 },
      { key: "fer", name: "Mannequin de fer", type: "Golem", hp: 34000, atk: 1500 },
      { key: "boss", name: "Boss simulé", type: "Sorcier", hp: 52000, atk: 2300 },
    ];
    const byId = (id) => UNITS.find((u) => u.id === id);
    const RELICS = {
      arme: { name: "Lame du Raid", effect: "ATK du héros équipé", cost: { couronne: 8, larme: 10 } },
      talisman: { name: "Talisman des saisons", effect: "Soins du héros équipé", cost: { coeur: 14, poussiere: 20 } },
      grimoire: { name: "Grimoire des failles", effect: "Jauge et dégâts du héros équipé", cost: { larme: 16, sceau: 4 } },
      bottes: { name: "Bottes du vent long", effect: "Esquive du héros équipé", cost: { eclat: 18, couronne: 4 } },
      armure: { name: "Écaille du Dragon", effect: "PV du héros équipé", cost: { eclat: 20, coeur: 15 } },
      etendard: { name: "Étendard des trois phases", effect: "Jauge d’Ultime du héros", cost: { couronne: 12, sceau: 5 } },
      anneau: { name: "Anneau des serments", effect: "Critique du héros équipé", cost: { larme: 14, sceau: 6 } },
      orbe: { name: "Orbe des braises", effect: "Dégâts du héros équipé", cost: { coeur: 18, larme: 10 } },
    };
    const RELIC_TIERS = [
      { key: "N", label: "Normale", color: "#7d869c" },
      { key: "R", label: "Rare", color: "#4f9eff" },
      { key: "SR", label: "Épique", color: "#b06ee8" },
      { key: "SSR", label: "Légendaire", color: "#e3b23c" },
    ];
    const RELIC_MAIN = {
      arme: { stat: "atk", label: "ATK du héros", values: [12, 18, 26, 36] },
      armure: { stat: "hp", label: "PV du héros", values: [12, 18, 26, 36] },
      etendard: { stat: "jaugeInit", label: "Jauge du héros", values: [15, 18, 21, 24] },
      anneau: { stat: "crit", label: "Critique du héros", values: [8, 12, 16, 22] },
      orbe: { stat: "dmg", label: "Dégâts du héros", values: [8, 12, 16, 22] },
      talisman: { stat: "heal", label: "Soins du héros", values: [8, 12, 16, 22] },
      grimoire: { stat: "gauge", label: "Ultime par carte", values: [4, 6, 8, 10] },
      bottes: { stat: "esquive", label: "Esquive du héros", values: [5, 8, 11, 14] },
    };
    const RELIC_SUBS = {
      arme: [{ crit: 3 }, { renvoi: 5 }, { execute: 8 }],
      armure: [{ heal: 4 }, { esquive: 4 }, { hp: 6 }],
      etendard: [{ teamAtk: 3 }, { gauge: 2 }, { growth: 2 }],
      anneau: [{ execute: 6 }, { gauge: 3 }, { renvoi: 5 }],
      orbe: [{ teamAtk: 4 }, { heal: 5 }, { growth: 3 }],
      talisman: [{ hp: 4 }, { gauge: 2 }, { teamAtk: 2 }],
      grimoire: [{ dmg: 3 }, { crit: 3 }, { execute: 5 }],
      bottes: [{ renvoi: 3 }, { hp: 4 }, { gauge: 2 }],
    };
    const RELIC_SETS = [
      { id: "trio", name: "Pacte du trio", need: 2, fx: { dmg: 4 }, desc: "2 reliques forgées et équipées : dégâts +4 %" },
      { id: "trinite", name: "Trinité du dragon", need: 4, fx: { dmg: 4, jaugeInit: 10 }, desc: "4 reliques forgées et équipées : dégâts +4 % et jauge de départ +10 %" },
      { id: "harmonie", name: "Harmonie parfaite", need: 4, sameTier: 3, fx: { dmg: 8 }, desc: "4 reliques équipées en rang Épique ou + : dégâts +8 %" },
      { id: "saisons", name: "Cycle des saisons", need: 3, fx: { heal: 6, gauge: 3 }, desc: "3 reliques équipées : soins +6 % et jauge +3 % par carte" },
    ];
    const RELIC_UP = { 2: { poussiere: 10 }, 3: { poussiere: 20, cristal: 5 }, 4: { poussiere: 40, cristal: 12 } };
    const RELIC_STAT_LABELS = { dmg: "Dégâts", crit: "Critique", esquive: "Esquive", renvoi: "Renvoi", execute: "Exécution", heal: "Soins", gauge: "Ultime par carte", growth: "Croissance/tour", teamAtk: "ATK d’équipe", hp: "PV du héros", jaugeInit: "Jauge du héros", atk: "ATK du héros" };
/* ---------- Calculs d'unité partagés (snapshot = {owned, evo, relics}) ---------- */

function coreFx(u, sv) {
  const fx = {};
  const add = (k, v) => { fx[k] = (fx[k] || 0) + v; };
  const passive = PASSIVE_INFO[u.id];
  if (passive) Object.keys(passive[2]).forEach((k) => add(k, passive[2][k]));
  const evo = (sv.evo && sv.evo[u.id]) || 0;
  if (evo >= 1) add("jaugeInit", 10);
  if (evo >= 2) {
    add("dmg", 8);
    const e2 = EVO2[u.cls];
    if (e2) Object.keys(e2.fx).forEach((k) => add(k, e2.fx[k]));
  }
  if (evo >= 3) {
    [EVO3, EVO3B].forEach((tbl) => {
      const t = tbl[u.cls];
      if (t) Object.keys(t.fx).forEach((k) => add(k, t.fx[k]));
    });
  }
  if (evo >= 4) {
    add("dmg", 6);
    add("jaugeInit", 5);
  }
  return fx;
}

function relicTierOf(sv, k) {
  return Math.min(Math.max(0, Math.round(Number((sv.relics || {})[k]) || 0)), 4);
}

function equipOf(sv) {
  const eq = (sv && sv.relicsEquip) || {};
  const out = {};
  Object.keys(RELIC_MAIN).forEach((k) => { out[k] = (eq[k] && sv.owned && sv.owned[eq[k]]) ? eq[k] : null; });
  return out;
}

function relicFxOf(sv) {
  const fx = {};
  const add = (k, v) => { fx[k] = (fx[k] || 0) + v; };
  const eq = equipOf(sv);
  const worn = Object.keys(RELIC_MAIN).filter((k) => relicTierOf(sv, k) >= 1 && eq[k]);
  RELIC_SETS.forEach((set) => {
    if (worn.length < set.need) return;
    if (set.sameTier && !(worn.length >= set.need && worn.every((k) => relicTierOf(sv, k) >= set.sameTier))) return;
    Object.keys(set.fx).forEach((k) => add(k, set.fx[k]));
  });
  worn.forEach((k) => {
    const tier = relicTierOf(sv, k);
    if (tier < 2) return;
    RELIC_SUBS[k].slice(0, tier - 1).forEach((sub) => { if (sub.teamAtk) add("teamAtk", sub.teamAtk); });
  });
  return fx;
}

function heroRelicFx(sv, heroId) {
  const fx = {};
  const add = (k, v) => { fx[k] = (fx[k] || 0) + v; };
  const eq = equipOf(sv);
  Object.keys(RELIC_MAIN).forEach((k) => {
    if (eq[k] !== heroId) return;
    const tier = relicTierOf(sv, k);
    if (tier < 1) return;
    const main = RELIC_MAIN[k];
    add(main.stat, main.values[tier - 1]);
    RELIC_SUBS[k].slice(0, tier - 1).forEach((sub) => Object.keys(sub).forEach((s2) => { if (s2 !== "teamAtk") add(s2, sub[s2]); }));
  });
  return fx;
}

const HERO_CLASS_BALANCE = {
  Chevalier: [1.00, 1.02], Berserker: [1.02, 0.96], Mage: [0.96, 1.02],
  Archer: [0.98, 0.98], "Rôdeur": [0.98, 1.00], "Héros": [0.96, 1.00],
  Soigneur: [1.00, 1.04], Défenseur: [1.00, 1.05], Tueur: [0.94, 0.96],
  Artificier: [1.00, 1.00], Druide: [0.94, 1.06], Occultiste: [1.02, 0.96],
};
function corePower(u, sv) {
  const count = (sv.owned && sv.owned[u.id]) || 1;
  const classBalance = HERO_CLASS_BALANCE[u.cls] || [1, 1];
  const mult = 1 + 0.08 * Math.min(count - 1, 12);
  const evo = Math.min((sv.evo && sv.evo[u.id]) || 0, 4);
  const em = 1 + 0.10 * evo;
  const rfx = relicFxOf(sv);
  const hero = heroRelicFx(sv, u.id);
  const hpFx = (1 + ((coreFx(u, sv).hp || 0) / 100)) * (1 + (hero.hp || 0) / 100);
  return { ...u, lvl: count, evo, atk: Math.round(u.atk * classBalance[0] * mult * em * (1 + ((rfx.teamAtk || 0) + (hero.atk || 0)) / 100)), hp: Math.round(u.hp * classBalance[1] * mult * em * hpFx) };
}

function evoSkillLabelsOf(u, evo) {
  const out = [];
  if (evo >= 1) out.push("Éveil I ✦ Jauge de départ +10 %");
  if (evo >= 2) {
    out.push("Éveil II ✦ Dégâts +8 %");
    if (EVO2[u.cls]) out.push("Talent ✦ " + EVO2[u.cls].label);
  }
  if (evo >= 3) {
    if (EVO3[u.cls]) out.push("Éveil III ✦ " + EVO3[u.cls].label);
    if (EVO3B[u.cls]) out.push("Talent ✦ " + EVO3B[u.cls].label);
  }
  if (evo >= 4) out.push("Éveil IV ✦ Dégâts +6 % et jauge de départ +5 %");
  return out;
}

function artSlug(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
    function portraitEscape(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
    function characterPortraitMarkup(id, name, cls, rarity) {
      const seed = String(id || name || "asteria");
      const h = hashStr(seed + "|" + name + "|" + cls);
      const pick = (arr, shift) => arr[Math.floor((h / Math.pow(2, shift)) % arr.length)];
      const skin = pick(["#f1c7a2","#d99b73","#f4d8bd","#a9684e","#e8b88e","#c98768","#f0c5a0"], 0);
      const hair = pick(["#241d2c","#493027","#b87935","#d8c18a","#e7e0d2","#8e3542","#253b50","#6b7891","#171923","#c65c32"], 4);
      const eye = pick(["#65c8d8","#8eaf72","#a78be8","#c58a43","#d8dce8","#d65b69"], 8);
      const cloth = pick(["#344b72","#684b82","#315c58","#7b3d42","#4a5368","#87653c","#26364e","#725f9c"], 12);
      const accent = ({ "Chevalier":"#e4b85e", "Mage":"#a88af0", "Archer":"#72c995", "Berserker":"#e4774f", "Rôdeur":"#68b9a2", "Héros":"#e8c66c", "Soigneur":"#72d6bd", "Défenseur":"#9db4cf", "Tueur":"#d96a8c", "Artificier":"#d7a85a", "Druide":"#3bd4a0", "Occultiste":"#9b79d0" })[cls] || "#d6b77a";
      const skin2 = pick(["#f7d8c2","#c98768","#e7b28d","#b9785b"], 16);
      const hairShape = Math.floor((h / 65536) % 5);
      const fringe = [
        "M29 54 Q24 19 59 17 Q94 18 91 55 L79 47 Q68 31 54 42 L42 58 Z",
        "M27 58 Q17 22 51 15 Q88 12 94 48 L81 43 Q74 55 58 45 Q42 37 27 58 Z",
        "M25 62 Q20 31 39 20 Q73 4 91 34 L89 62 L76 45 Q60 54 48 43 L34 65 Z",
        "M30 48 Q37 12 65 17 Q94 19 91 50 Q75 35 65 41 Q47 34 30 48 Z",
        "M24 59 Q21 16 59 13 Q100 17 96 62 L83 53 Q72 40 60 48 Q42 39 24 59 Z"
      ][hairShape];
      const classGear = cls === "Artificier" ? '<path d="M60 7 70 27 93 30 76 46 80 70 60 59 40 70 44 46 27 30 50 27Z" fill="none" stroke="' + accent + '" stroke-width="5"/><circle cx="60" cy="39" r="7" fill="' + accent + '"/>' : cls === "Druide" ? '<path d="M60 12Q94 29 75 55Q60 70 45 55Q26 29 60 12Z" fill="' + accent + '" opacity=".9"/><path d="M60 22V67M60 45L43 34M60 53L77 39" stroke="#e6f4ce" stroke-width="3"/>' : cls === "Occultiste" ? '<path d="M60 8 68 31 92 36 70 50 74 75 60 60 46 75 50 50 28 36 52 31Z" fill="' + accent + '" opacity=".9"/><circle cx="60" cy="43" r="7" fill="#f3e8ff"/>' : cls === "Mage" ? '<path d="M25 44 L60 5 L95 44 L82 39 L60 19 L38 39 Z" fill="' + accent + '" opacity=".9"/><circle cx="60" cy="27" r="5" fill="#d9c8ff"/>' :
        cls === "Archer" || cls === "Rôdeur" ? '<path d="M15 37 Q-1 67 19 94 Q27 102 29 89 Q12 65 28 46" fill="none" stroke="' + accent + '" stroke-width="4"/><path d="M15 37 L30 47" stroke="#f2e7c7" stroke-width="2"/>' :
        cls === "Berserker" || cls === "Tueur" ? '<path d="M27 82 L8 55 L28 61 L36 48 L42 75 Z M93 82 L112 55 L92 61 L84 48 L78 75 Z" fill="' + accent + '"/>' :
        cls === "Soigneur" ? '<circle cx="60" cy="19" r="14" fill="none" stroke="' + accent + '" stroke-width="3"/><path d="M60 10 V28 M51 19 H69" stroke="' + accent + '" stroke-width="3"/>' :
        '<path d="M25 81 L35 62 L47 72 L60 61 L73 72 L85 62 L96 82 L88 111 L32 111 Z" fill="' + accent + '" opacity=".85"/>';
      const idSafe = portraitEscape(artSlug(seed));
      return '<svg class="portrait-art hero-art" data-portrait-id="' + idSafe + '" viewBox="0 0 120 140" role="img" aria-label="Portrait de ' + portraitEscape(name) + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg-' + idSafe + '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + cloth + '"/><stop offset="1" stop-color="#111827"/></linearGradient><linearGradient id="cape-' + idSafe + '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="' + accent + '"/><stop offset="1" stop-color="' + cloth + '"/></linearGradient></defs><rect x="2" y="2" width="116" height="136" rx="18" fill="url(#bg-' + idSafe + ')"/><path d="M7 111 Q60 71 113 111 V136 H7Z" fill="#101827" opacity=".6"/><circle cx="60" cy="55" r="43" fill="' + accent + '" opacity=".13"/><path d="M13 140 Q15 103 38 94 L60 104 L83 94 Q107 104 108 140Z" fill="url(#cape-' + idSafe + ')"/><path d="M39 89 L60 103 L81 89 L92 140 H28Z" fill="' + cloth + '" stroke="' + accent + '" stroke-width="2"/>' + classGear + '<path d="M43 83 L77 83 L80 101 Q60 116 40 101Z" fill="' + skin2 + '"/><path d="M30 52 Q28 26 60 23 Q91 25 90 56 L84 81 Q76 99 60 99 Q43 98 35 80Z" fill="' + skin + '" stroke="#342b36" stroke-width="2"/><path d="M29 58 Q19 47 28 39 Q20 12 55 13 Q93 8 94 42 Q99 51 90 64 L82 43 Q65 35 51 42 Q40 48 29 58Z" fill="' + hair + '"/><path d="' + fringe + '" fill="' + hair + '"/><path d="M42 63 Q49 58 55 63 M66 63 Q73 58 79 63" fill="none" stroke="#4a2d2b" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="49" cy="68" rx="3.2" ry="2.4" fill="' + eye + '"/><ellipse cx="72" cy="68" rx="3.2" ry="2.4" fill="' + eye + '"/><path d="M60 69 L57 79 L63 80" fill="none" stroke="#a56f5d" stroke-width="2"/><path d="M52 87 Q60 ' + (90 + Math.floor((h / 1024) % 5)) + ' 69 86" fill="none" stroke="#7d3f48" stroke-width="2.4" stroke-linecap="round"/><path d="M31 61 Q23 69 35 81 M89 61 Q97 69 85 81" fill="none" stroke="' + hair + '" stroke-width="7" stroke-linecap="round"/><path d="M38 104 L60 116 L82 104" fill="none" stroke="' + accent + '" stroke-width="3"/><path d="M16 121 L31 111 L37 140 H12Z M104 121 L89 111 L83 140 H108Z" fill="' + accent + '" opacity=".85"/><circle cx="' + (pick([27,93,60,37,83], 20)) + '" cy="' + (pick([115,122,128], 24)) + '" r="3" fill="' + eye + '"/><rect x="5" y="5" width="110" height="130" rx="15" fill="none" stroke="' + accent + '" stroke-width="' + (rarity >= 3 ? 3 : 1.5) + '" opacity=".9"/></svg>';
    }
    function heroPortraitMarkup(id) {
      const unit = UNITS.find((u) => u.id === id);
      return characterPortraitMarkup(id, unit ? unit.name : String(id || "Héros"), unit ? unit.cls : "Héros", unit ? unit.r : 1);
    }
    function enemyPortraitMarkup(type, name) {
      const seed = "enemy-" + String(type || "monstre") + "-" + String(name || type || "ennemi");
      const h = hashStr(seed);
      const pick = (arr, shift) => arr[Math.floor((h / Math.pow(2, shift)) % arr.length)];
      const hide = pick(["#7d9b8a","#4b7890","#8e658f","#9a6548","#6f7a9e","#a18c58","#536b58","#a94d50"], 0);
      const dark = pick(["#17212b","#24202d","#32231e","#1d293b","#302b24"], 4);
      const eye = pick(["#ffcf68","#ff6f61","#9df4ff","#dca6ff","#d7f47b"], 8);
      const horn = pick(["#d5c3a0","#b9d1db","#e4a36f","#b4a1db","#d7d9c9"], 12);
      const spikes = Math.floor((h / 65536) % 4);
      const horns = [
        '<path d="M37 48 Q10 39 17 12 Q34 24 43 39 M82 48 Q110 36 102 10 Q84 24 77 40" fill="' + horn + '" stroke="' + dark + '" stroke-width="3"/>',
        '<path d="M39 44 L27 9 L52 34 M80 44 L94 8 L68 34" fill="' + horn + '" stroke="' + dark + '" stroke-width="3"/>',
        '<path d="M40 43 Q18 18 36 5 Q42 23 55 33 M78 43 Q100 18 84 5 Q77 23 64 33" fill="' + horn + '" stroke="' + dark + '" stroke-width="3"/>',
        '<path d="M38 46 L12 30 L31 58 M82 46 L108 30 L89 58" fill="' + horn + '" stroke="' + dark + '" stroke-width="4"/>'
      ][spikes];
      const idSafe = portraitEscape(artSlug(seed));
      return '<svg class="portrait-art enemy-art" data-portrait-id="' + idSafe + '" viewBox="0 0 120 140" role="img" aria-label="Portrait de ' + portraitEscape(name || type) + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="enemy-' + idSafe + '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + hide + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient></defs><rect x="2" y="2" width="116" height="136" rx="17" fill="url(#enemy-' + idSafe + ')"/><circle cx="60" cy="63" r="48" fill="' + eye + '" opacity=".1"/>' + horns + '<path d="M14 140 Q16 99 37 94 L60 105 L84 94 Q105 100 108 140Z" fill="' + dark + '" stroke="' + horn + '" stroke-width="2"/><path d="M31 51 Q27 23 60 20 Q94 23 90 55 L83 92 Q74 111 60 111 Q43 110 36 91Z" fill="' + hide + '" stroke="' + dark + '" stroke-width="4"/><path d="M35 55 Q25 31 48 25 L60 34 L73 22 Q97 34 86 57 L79 46 L68 53 L60 44 L48 55Z" fill="' + dark + '"/><path d="M38 65 L55 61 L51 74Z M82 65 L65 61 L69 74Z" fill="' + eye + '" stroke="' + dark + '" stroke-width="2"/><ellipse cx="48" cy="67" rx="3" ry="4" fill="#1b1720"/><ellipse cx="72" cy="67" rx="3" ry="4" fill="#1b1720"/><path d="M60 69 L54 88 L66 88Z" fill="' + dark + '"/><path d="M43 91 Q60 ' + (99 + Math.floor((h / 1024) % 7)) + ' 77 91 L72 103 L48 103Z" fill="#211923" stroke="' + horn + '" stroke-width="2"/><path d="M49 93 L54 101 L59 93 L64 101 L70 93" fill="none" stroke="' + horn + '" stroke-width="2"/><path d="M25 112 L39 98 L45 140 H13Z M95 112 L81 98 L75 140 H107Z" fill="' + hide + '"/><path d="M22 117 L33 110 M98 117 L87 110" stroke="' + horn + '" stroke-width="4"/><rect x="5" y="5" width="110" height="130" rx="14" fill="none" stroke="' + eye + '" stroke-width="2.5"/></svg>';
    }

/* ---------- Données partagées (consommées par l'app Personnages) ---------- */
OS.asteriaData = { RARITY, CARD, TIER, ENEMY_NAMES, ENEMY_TYPES, ENEMY_BALANCE, UNITS, CLASS_BONUS, SKILL_INFO, COLLECTION_REWARDS, LOOT, RAID_PHASES, RAID_BOTS, EVO_REQ, EVO4_REQ, EVO2, EVO3, EVO3B, RELICS, PASSIVE_INFO, RELIC_TIERS, RELIC_MAIN, RELIC_SUBS, RELIC_SETS, RELIC_UP, RELIC_STAT_LABELS, RECYCLE_GAIN, TRAIN_OPPONENTS, heroPortraitMarkup, enemyPortraitMarkup, relicFxOf, heroRelicFx, byId, equipOf, coreFx, corePower, evoSkillLabelsOf, hashStr, raidRwOf, raidLeaderboard, diffUnlockedSt, matKeyOf };

OS.asteriaData.teamSynergyInfo = function () {
  return [
    { classes: ["Mage", "Archer"], name: "Convergence arcanique", effect: "+8 % dégâts d'équipe" },
    { classes: ["Chevalier", "Soigneur"], name: "Serment protecteur", effect: "−10 % dégâts reçus" },
    { classes: ["Berserker", "Rôdeur"], name: "Traque coordonnée", effect: "+6 % dégâts d'équipe" },
    { classes: ["Artificier", "Druide"], name: "Atelier vivant", effect: "+4 % ATK et −5 % dégâts reçus" },
    { classes: ["Druide", "Occultiste"], name: "Cycle du voile", effect: "−6 % dégâts reçus" },
    { classes: ["Artificier", "Occultiste"], name: "Mécanique interdite", effect: "+8 % dégâts d'équipe" },
  ];
};
OS.asteriaData.elementInfo = function () {
  return {
    cards: Object.fromEntries(Object.entries(CARD).map(([key, card]) => [key, { label: card.label, element: card.element }])),
    elements: ELEMENTS,
    enemyAffinity: ENEMY_AFFINITY,
  };
};



OS.registerApp({
  id: "asteria",
  name: "Astéria",
  icon: "⚔️",
  color: "#6b4f9e",
  render(body) {
    body.classList.add("padend");
    const app = this;
    app.onClose = () => clearTyping();

    /* ---------- Données ---------- */


    function unitFx(u) {
      const fx = coreFx(u, save);
      const add = (k, v) => { fx[k] = (fx[k] || 0) + v; };
      const teamDmg = relicFxOf(save).dmg;
      if (teamDmg) add("dmg", teamDmg);
      const hero = heroRelicFx(save, u.id);
      ["jaugeInit", "crit", "esquive", "renvoi", "execute", "heal", "gauge", "growth", "dmg"].forEach((k) => {
        if (hero[k]) add(k, hero[k]);
      });
      return fx;
    }





    function gainLoot(gains) {
      return Object.keys(gains).filter((k) => gains[k] > 0).map((k) => {
        save.loot[k] = (save.loot[k] || 0) + gains[k];
        return "+" + gains[k] + " " + LOOT[k].name;
      }).join(", ");
    }

    function classMatGains(n) {
      const team = (battle && battle.units && battle.units.length) ? battle.units : teamUnits();
      const pool = {};
      team.forEach((u) => { if (u.cls) pool[u.cls] = true; });
      const keys = Object.keys(pool).length ? Object.keys(pool) : ["Chevalier"];
      const gains = {};
      for (let i = 0; i < n; i++) {
        const k = matKeyOf(keys[Math.floor(Math.random() * keys.length)]);
        gains[k] = (gains[k] || 0) + 1;
      }
      return gains;
    }


    function unitPower(u) { return corePower(u, save); }

    function initialGauge(team, cap, extra) {
      return Math.min(cap, team.reduce((s, u) => s + (unitFx(u).jaugeInit || 0), 0) + (relicFxOf(save).jaugeInit || 0) + (extra || 0));
    }

    /*
     * Astéria 2.0 : espace de sauvegarde isolé.
     * Aucun import automatique depuis "asteria" ou "epopee" :
     * la nouvelle progression démarre volontairement de zéro.
     * Les anciennes données restent intactes dans leurs clés historiques.
     */
    const SAVE_PREFIX = "asteria-v2";
    // Nettoyage unique des anciennes sauvegardes Astéria/Épopée.
    // Les préférences globales du téléphone ne sont pas concernées.
    (function clearLegacyGameSavesOnce() {
      const cleanupKey = "phoneos:asteria-v2-legacy-cleanup";
      try {
        if (localStorage.getItem(cleanupKey) === "done") return;
        [
          "phoneos:asteria", "phoneos:asteria-story", "phoneos:asteria-daily",
          "phoneos:asteria-raid", "phoneos:asteria-infinite-best",
          "phoneos:epopee", "phoneos:epopee-story", "phoneos:epopee-daily",
          "phoneos:epopee-raid", "phoneos:infinite-best"
        ].forEach((key) => localStorage.removeItem(key));
        localStorage.setItem(cleanupKey, "done");
      } catch (_) {
        // Si le stockage est indisponible, la nouvelle sauvegarde reste isolée.
      }
    })();
    let infiniteBest = OS.store.get(SAVE_PREFIX + "-infinite-best", 0);

    function loadSave() {
      const saved = OS.store.get(SAVE_PREFIX, null);
      if (saved && saved.schemaVersion === 2) return saved;
      return {
        schemaVersion: 2,
        quartz: 30,
        owned: { bron: 1, tilia: 1, nerys: 1 },
        team: ["bron", "tilia", "nerys"],
      };
    }
    let save = loadSave();
    if (!save.pity) save.pity = {};
    if (!save.collected) save.collected = [];
    if (!save.loot) save.loot = {};
    if (!save.evo) save.evo = {};
    if (!save.relics) save.relics = {};
    if (!save.relicsEquip) save.relicsEquip = {};
    Object.keys(RELIC_MAIN).forEach((k) => {
      const wornId = save.relicsEquip[k];
      if (wornId && (!save.owned || !save.owned[wornId])) save.relicsEquip[k] = null;
    });
    function persist() { OS.store.set(SAVE_PREFIX, save); }

    let storyState = OS.store.get(SAVE_PREFIX + "-story", { done: 0, music: false, diff: "facile" });
    if (!storyState.diff) storyState.diff = "facile";
    if (!Array.isArray(storyState.cleared)) storyState.cleared = [];
    if (!diffUnlockedSt(storyState, storyState.diff)) storyState.diff = "facile";
    function persistStory() { OS.store.set(SAVE_PREFIX + "-story", storyState); }

    /* ---------- Missions quotidiennes ---------- */

    const DAILY_TYPES = [
      { t: "cards", label: "Jouer 30 cartes en combat", goal: 30, reward: 20 },
      { t: "pulls", label: "Invoquer 10 héros", goal: 10, reward: 25 },
      { t: "wins", label: "Gagner 3 quêtes", goal: 3, reward: 30 },
      { t: "heals", label: "Soigner 8 fois", goal: 8, reward: 20 },
      { t: "floor", label: "Atteindre l'étage 3 en Mode Infini", goal: 3, reward: 25 },
      { t: "story", label: "Vaincre 1 boss d'histoire", goal: 1, reward: 40 },
    ];
    function todayKey() {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    let daily = OS.store.get(SAVE_PREFIX + "-daily", null);
    function persistDaily() { OS.store.set(SAVE_PREFIX + "-daily", daily); }
    function ensureDaily() {
      const tk = todayKey();
      if (!daily || daily.date !== tk) {
        const picks = DAILY_TYPES.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        daily = { date: tk, missions: picks.map((d) => ({ t: d.t, label: d.label, goal: d.goal, reward: d.reward, p: 0, claimed: false })) };
        persistDaily();
      }
    }
    function trackDaily(type, amt, absolute) {
      if (battle && battle.mode === "train") return;
      if (!daily) return;
      daily.missions.forEach((m) => {
        if (m.t !== type || m.claimed) return;
        m.p = absolute === "abs" ? Math.max(m.p, amt) : Math.min(m.goal, m.p + (amt || 1));
      });
      persistDaily();
    }
    /* ---------- Raid hebdomadaire ---------- */

    function weekKey() {
      const d = new Date();
      const t = new Date(d.getFullYear(), 0, 1);
      const wk = Math.ceil(((d - t) / 86400000 + t.getDay() + 1) / 7);
      return d.getFullYear() + "-S" + wk;
    }
    let raid = OS.store.get(SAVE_PREFIX + "-raid", null);
    function persistRaid() { OS.store.set(SAVE_PREFIX + "-raid", raid); }
    function ensureRaid() {
      const wk = weekKey();
      if (!raid || raid.week !== wk) {
        raid = { week: wk, elixirs: (raid && raid.elixirs) || 0, cleared: 0, claimed: false, lastChest: raid ? raid.lastChest : "" };
      }
    }

    function raidPanel() {
      ensureRaid();
      const wrap = document.createElement("div");
      wrap.className = "raid-panel";
      const h = document.createElement("div");
      h.className = "team-hint";
      h.textContent = "Raid hebdomadaire — 3 phases qui enchaînent, impossible de soigner entre deux ;";
      wrap.appendChild(h);
      const chips = document.createElement("div");
      chips.className = "raid-chips";
      RAID_PHASES.forEach((ph, i) => {
        const c = document.createElement("span");
        c.className = "raid-chip" + (raid.cleared >= i + 1 ? " done" : "");
        c.textContent = (raid.cleared >= i + 1 ? "✓ " : "⚔ ") + "P" + (i + 1) + " " + ph.name;
        chips.appendChild(c);
      });
      wrap.appendChild(chips);
      const info = document.createElement("div");
      info.className = "team-hint";
      info.textContent = "Élixirs de raid : " + (raid.elixirs || 0) + " — farmés en Difficile, Infini (tous les 5 étages) et Histoire (Enfer/Enfer+). Équipe restaurée entre les phases.";
      wrap.appendChild(info);
      const enter = document.createElement("button");
      enter.className = "pull-btn";
      enter.textContent = "⚔ Entrer dans le Raid (1 Élixir)";
      if ((raid.elixirs || 0) < 1) enter.disabled = true;
      enter.addEventListener("click", () => startRaid());
      wrap.appendChild(enter);
      const board = raidLeaderboard(raid.week, raid.cleared);
      const boardBox = document.createElement("div");
      boardBox.className = "raid-board";
      const bt = document.createElement("div");
      bt.className = "team-hint";
      bt.textContent = "🏆 Classement hebdo du raid — votre rang : " + board.rank + "/8 · bonus au coffre : +" + raidRwOf(board.rank) + " ◆";
      boardBox.appendChild(bt);
      board.entries.forEach((e, i) => {
        const r = document.createElement("div");
        r.className = "raid-board-row" + (e.you ? " me" : "") + (i === 0 ? " first" : "");
        r.innerHTML = '<span class="rb-rank">' + (i + 1) + (i === 0 ? "\u1d49\u02b3" : "\u1d49") + '</span><span class="rb-name">' + e.name + '</span><span class="rb-score">' + e.score + "</span>";
        boardBox.appendChild(r);
      });
      wrap.appendChild(boardBox);
      if (raid.cleared >= 1 && !raid.claimed) {
        const chest = document.createElement("button");
        chest.className = "pull-btn claim-btn raid-chest";
        chest.textContent = "🎁 Coffre hebdomadaire : +" + 30 * raid.cleared + " ◆ + " + raidRwOf(board.rank) + " ◆ (rang " + board.rank + ") et matières";
        chest.addEventListener("click", () => {
          const gains = [
            { couronne: 5, poussiere: 5 },
            { couronne: 10, larme: 3, poussiere: 8, cristal: 3 },
            { couronne: 10, larme: 3, sceau: 3, poussiere: 12, cristal: 5 },
          ][Math.min(raid.cleared, 3) - 1];
          const boardC = raidLeaderboard(raid.week, raid.cleared);
          const bonus = raidRwOf(boardC.rank);
          const qz = 30 * raid.cleared;
          save.quartz += qz + bonus;
          const line = gainLoot(gains);
          raid.claimed = true;
          raid.lastChest = "Coffre réclamé : +" + qz + " ◆ + " + bonus + " ◆ (rang " + boardC.rank + ") · " + line;
          persist();
          persistRaid();
          OS.sfx.play("unlock");
          OS.notify("🎁", "#3bd4c4", "Coffre hebdomadaire", "+" + qz + " ◆ + " + bonus + " ◆ (rang " + boardC.rank + ") · " + line, 5000);
          renderQuests();
        });
        wrap.appendChild(chest);
      } else if (raid.claimed) {
        const done = document.createElement("div");
        done.className = "team-hint";
        done.textContent = (raid.lastChest || "Coffre déjà réclamé cette semaine. Revenez la semaine prochaine !") + " Nouveau coffre la semaine prochaine.";
        wrap.appendChild(done);
      }
      return wrap;
    }

    /* ---------- Événements du week-end ---------- */

    const EVENTS = {
      fortune: { name: "Week-end de fortune", desc: "récompenses de victoire ×2", icon: "💰" },
      invoqueurs: { name: "Week-end des invocateurs", desc: "taux SSR doublé", icon: "✨" },
    };
    function eventInfo() {
      const d = new Date();
      const forced = OS.store.get("event-debug", "");
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      const kind = forced && EVENTS[forced] ? forced : weekend ? (d.getDate() < 16 ? "fortune" : "invoqueurs") : null;
      return kind ? { k: kind, ...EVENTS[kind] } : null;
    }
    function eventMult() {
      const ev = eventInfo();
      return ev && ev.k === "fortune" ? 2 : 1;
    }
    function eventSsrBoost() {
      const ev = eventInfo();
      return ev && ev.k === "invoqueurs" ? 2 : 1;
    }

    function dailyPanel() {
      ensureDaily();
      const wrap = document.createElement("div");
      wrap.className = "daily-panel";
      const h = document.createElement("div");
      h.className = "team-hint";
      h.textContent = "Missions du jour — renouvelées chaque jour réel :";
      wrap.appendChild(h);
      daily.missions.forEach((m) => {
        const line = document.createElement("div");
        line.className = "daily-mission" + (m.claimed ? " claimed" : "");
        const done = m.p >= m.goal;
        line.innerHTML = "<b>" + m.label + "</b><small>" + Math.min(m.p, m.goal) + " / " + m.goal + (m.claimed ? " · ✓ réclamé" : "") + "</small>";
        if (done && !m.claimed) {
          const b = document.createElement("button");
          b.className = "pull-btn claim-btn";
          b.textContent = "+" + m.reward + " ◆";
          b.addEventListener("click", () => {
            m.claimed = true;
            save.quartz += m.reward;
            persist();
            persistDaily();
            OS.sfx.play("unlock");
            renderQuests();
          });
          line.appendChild(b);
        }
        wrap.appendChild(line);
      });
      return wrap;
    }

    /* ---------- Squelette UI ---------- */

    const tabsRow = document.createElement("div");
    tabsRow.className = "gacha-tabs";
    const tabSummon = tab("Invoquer");
    const tabTeam = tab("Équipe");
    const tabTraining = tab("Entraînement");
    const tabCollection = tab("Collection");
    const tabBattle = tab("Quêtes");
    const tabStory = tab("Histoire");
    tabsRow.append(tabSummon, tabTeam, tabTraining, tabCollection, tabBattle, tabStory);

    function tab(label) {
      const b = document.createElement("button");
      b.textContent = label;
      b.addEventListener("click", () => {
        OS.sfx.play("ui");
        if (label === "Invoquer") renderSummon();
        else if (label === "Équipe") renderTeam();
        else if (label === "Entraînement") renderTraining();
        else if (label === "Collection") renderCollection();
        else if (label === "Histoire") renderStory();
        else renderQuests();
      });
      return b;
    }
    function setActiveTab(btn) {
      [tabSummon, tabTeam, tabTraining, tabCollection, tabBattle, tabStory].forEach((b) => b.classList.toggle("active", b === btn));
    }

    body.append(tabsRow);
    const content = document.createElement("div");
    content.className = "gacha-content";
    body.appendChild(content);

    /* ---------- Gacha ---------- */

    function rollUnit(pool) {
      const base = (pool || UNITS).filter((u) => u.id !== "graal");
      const roll = Math.random();
      const ssrRate = 0.05 * eventSsrBoost();
      const wanted = roll < ssrRate ? 3 : roll < 0.25 ? 2 : 1;
      const arr = base.filter((u) => u.r === wanted).length
        ? base.filter((u) => u.r === wanted)
        : [2, 1, 3].map((r) => base.filter((u) => u.r === r)).find((a) => a.length) || base;
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const FEATURED_BANNERS = [
      { id: "forge", name: "Les maîtres de la forge", hero: "elyndra", color: "#b47b42", desc: "Elyndra en vedette · Artificier" },
      { id: "saison", name: "Le pacte de la sève-lune", hero: "maelis", color: "#398f6b", desc: "Maélis en vedette · Druide" },
      { id: "voile", name: "Les secrets du crépuscule", hero: "nyxar", color: "#7551b8", desc: "Nyxar en vedette · Occultiste" },
    ];
    OS.asteriaData.FEATURED_BANNERS = FEATURED_BANNERS;
    function featuredPull(banner, n) {
      const cost = n === 1 ? 3 : 30;
      if (save.quartz < cost) { notifyGacha("Pas assez de quartz pour cette bannière."); return []; }
      save.quartz -= cost;
      trackDaily("pulls", n);
      const results = [];
      const ssrPool = UNITS.filter(u => u.r === 3 && u.id !== "graal");
      for (let i = 0; i < n; i++) {
        const pityKey = "featured-" + banner.id;
        const ssrPityKey = pityKey + "-ssr";
        const guaranteeKey = pityKey + "-guarantee";
        save.pity[pityKey] = (save.pity[pityKey] || 0) + 1;
        save.pity[ssrPityKey] = (save.pity[ssrPityKey] || 0) + 1;
        let unit;
        if (save.pity[pityKey] >= 100) {
          unit = byId(banner.hero);
          save.pity[pityKey] = 0;
          save.pity[ssrPityKey] = 0;
          save.pity[guaranteeKey] = 0;
        } else {
          unit = save.pity[ssrPityKey] >= 50 ? ssrPool[Math.floor(Math.random() * ssrPool.length)] : rollUnit();
          if (unit.r === 3) {
            save.pity[ssrPityKey] = 0;
            if ((save.pity[guaranteeKey] || 0) > 0 || Math.random() < 0.5) {
              unit = byId(banner.hero);
              save.pity[guaranteeKey] = 0;
            } else {
              save.pity[guaranteeKey] = 1;
            }
          }
        }
        if (!unit) unit = ssrPool[Math.floor(Math.random() * ssrPool.length)];
        save.owned[unit.id] = (save.owned[unit.id] || 0) + 1;
        results.push(unit);
      }
      if (save.team.filter(id => save.owned[id]).length < 3) save.team = Object.keys(save.owned).slice(0, 3);
      persist();
      return results;
    }

    function classPull(cls, n) {
      const cost = n === 1 ? 5 : 45;
      if (save.quartz < cost) {
        notifyGacha("Pas assez de quartz ! Gagnez-en en quête.");
        return [];
      }
      save.quartz -= cost;
      trackDaily("pulls", n);
      const pool = UNITS.filter((u) => u.cls === cls && u.id !== "graal");
      const ssr = pool.filter((u) => u.r === 3);
      const results = [];
      for (let i = 0; i < n; i++) {
        save.pity[cls] = (save.pity[cls] || 0) + 1;
        let unit;
        if (ssr.length && save.pity[cls] >= 30) {
          unit = ssr[Math.floor(Math.random() * ssr.length)];
          save.pity[cls] = 0;
        } else {
          unit = rollUnit(pool);
          if (unit.r === 3) save.pity[cls] = 0;
        }
        save.owned[unit.id] = (save.owned[unit.id] || 0) + 1;
        results.push(unit);
      }
      persist();
      return results;
    }

    function pull(n) {
      if (save.quartz < (n === 1 ? 3 : 30)) {
        notifyGacha("Pas assez de quartz ! Gagnez-en en quête.");
        return [];
      }
      save.quartz -= n === 1 ? 3 : 30;
      trackDaily("pulls", n);
      const results = [];
      for (let i = 0; i < n; i++) {
        save.pity.banniere = (save.pity.banniere || 0) + 1;
        let unit;
        if (save.pity.banniere >= 50) {
          const ssrAge = UNITS.filter((u) => u.r === 3 && u.id !== "graal");
          unit = ssrAge[Math.floor(Math.random() * ssrAge.length)];
          save.pity.banniere = 0;
        } else {
          unit = rollUnit();
          if (unit.r === 3) save.pity.banniere = 0;
        }
        save.owned[unit.id] = (save.owned[unit.id] || 0) + 1;
        results.push(unit);
      }
      if (save.team.filter((id) => save.owned[id]).length < 3 && save.quartz >= 0) {
        save.team = Object.keys(save.owned).slice(0, 3);
      }
      persist();
      return results;
    }

    let portalOwnershipFilter = "all";
    function renderPortalDetails(cls, results) {
      const panel = content.querySelector(".portal-detail") || document.createElement("div");
      panel.className = "portal-detail";
      panel.innerHTML = "";
      const pool = UNITS.filter((u) => u.cls === cls && u.id !== "graal");
      const ssrRate = 0.05 * eventSsrBoost();
      const weights = { 3: ssrRate, 2: 0.25 - ssrRate, 1: 0.75 };
      const actual = { 1: 0, 2: 0, 3: 0 };
      [3, 2, 1].forEach((wanted) => {
        const fallback = pool.filter((u) => u.r === wanted).length ? wanted : [2, 1, 3].find((r) => pool.some((u) => u.r === r));
        if (fallback) actual[fallback] += weights[wanted];
      });
      const heading = document.createElement("div");
      heading.className = "portal-detail-head";
      heading.innerHTML = "<strong>Portail " + cls + "</strong><span>Personnages disponibles dans ce portail</span>";
      panel.appendChild(heading);
      const rates = document.createElement("div");
      rates.className = "portal-rates";
      [3, 2, 1].forEach((r) => {
        const chip = document.createElement("span");
        chip.className = "portal-rate r" + r;
        chip.textContent = RARITY[r].label + " · " + (actual[r] * 100).toFixed(1).replace(".", ",") + " %";
        rates.appendChild(chip);
      });
      panel.appendChild(rates);
      const pity = document.createElement("div");
      pity.className = "team-hint";
      const hasSsr = pool.some((u) => u.r === 3);
      pity.textContent = "Pity du portail : " + (save.pity[cls] || 0) + "/30" + (hasSsr ? ((save.pity[cls] || 0) >= 29 ? " · prochain tirage SSR garanti" : " · SSR garanti au 30e tirage") : " · aucun SSR dans cette classe");
      panel.appendChild(pity);
      const filterWrap = document.createElement("label");
      filterWrap.className = "portal-owned-filter";
      filterWrap.innerHTML = "<span>Afficher les personnages</span>";
      const ownership = document.createElement("select");
      [["all","Tous"],["owned","Possédés"],["missing","Non possédés"]].forEach(([value,label]) => { const option = document.createElement("option"); option.value = value; option.textContent = label; ownership.appendChild(option); });
      ownership.value = portalOwnershipFilter;
      ownership.addEventListener("change", () => { portalOwnershipFilter = ownership.value; renderPortalDetails(cls, results); });
      filterWrap.appendChild(ownership);
      panel.appendChild(filterWrap);
      const list = document.createElement("div");
      list.className = "roster col-grid portal-roster";
      const visiblePool = pool.filter((u) => portalOwnershipFilter === "all" || (portalOwnershipFilter === "owned" ? !!save.owned[u.id] : !save.owned[u.id]));
      const count = document.createElement("div");
      count.className = "team-hint portal-count";
      count.textContent = visiblePool.length + " / " + pool.length + " personnages affichés";
      panel.appendChild(count);
      if (!visiblePool.length) { const empty = document.createElement("div"); empty.className = "team-hint"; empty.textContent = "Aucun personnage dans cette catégorie."; list.appendChild(empty); }
      visiblePool.slice().sort((a,b) => b.r-a.r || a.name.localeCompare(b.name)).forEach((u) => list.appendChild(unitCard(u)));
      panel.appendChild(list);
      const actions = document.createElement("div");
      actions.className = "pull-row";
      [1, 10].forEach((n) => {
        const b = document.createElement("button");
        b.className = "pull-btn";
        b.textContent = "Invoquer " + (n === 1 ? "×1 — 5 ◆" : "×10 — 45 ◆");
        b.addEventListener("click", () => {
          const got = classPull(cls, n);
          if (!got.length) return;
          content.querySelector(".quartz-bar").replaceWith(quartzBar());
          const portalBtn = [...content.querySelectorAll(".portal-btn")].find((x) => x.dataset.portal === cls);
          if (portalBtn) portalBtn.innerHTML = "Portail " + cls + "<br><small>pity " + (save.pity[cls] || 0) + "/30</small>";
          OS.sfx.play(got.some((u) => u.r === 3) ? "ssr" : "gacha");
          renderPortalDetails(cls, got);
        });
        actions.appendChild(b);
      });
      panel.appendChild(actions);
      if (results && results.length) {
        const resultBox = document.createElement("div");
        resultBox.className = "pull-results";
        results.forEach((u) => resultBox.appendChild(unitCard(u)));
        panel.appendChild(resultBox);
      }
      if (!panel.isConnected) content.appendChild(panel);
    }

    function renderSummon() {
      OS.sfx.setTheme("summon");
      setActiveTab(tabSummon);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const banner = document.createElement("div");
      banner.className = "banner";
      banner.innerHTML = '<div class="banner-title">Bannière des héros</div><div class="banner-sub"></div>';
      content.appendChild(banner);
      updateBannerPity();

      const buttons = document.createElement("div");
      buttons.className = "pull-row";
      const single = pullBtn("Invoquer ×1 — 3 ◆", 1);
      const multi = pullBtn("Invoquer ×10 — 30 ◆", 10);
      buttons.append(single, multi);
      content.appendChild(buttons);

      const featuredTitle = document.createElement("div");
      featuredTitle.className = "team-hint";
      featuredTitle.textContent = "Bannières thématiques — héros SSR en vedette · pity SSR 50 · héros vedette garanti à 100";
      content.appendChild(featuredTitle);
      const featuredGrid = document.createElement("div");
      featuredGrid.className = "featured-banner-grid";
      FEATURED_BANNERS.forEach((fb) => {
        const card = document.createElement("section");
        card.className = "featured-banner";
        card.style.borderColor = fb.color;
        const hero = byId(fb.hero);
        const title = document.createElement("strong");
        title.textContent = fb.name;
        const desc = document.createElement("small");
        desc.textContent = fb.desc + " · SSR " + (save.pity["featured-" + fb.id + "-ssr"] || 0) + "/50 · vedette " + (save.pity["featured-" + fb.id] || 0) + "/100";
        card.append(title, desc);
        if (hero) card.appendChild(unitCard(hero));
        [1, 10].forEach((n) => {
          const btn = document.createElement("button");
          btn.className = "pull-btn";
          btn.textContent = "Invoquer ×" + n + " · " + (n === 1 ? "3" : "30") + " ◆";
          btn.addEventListener("click", () => {
            const got = featuredPull(fb, n);
            if (!got.length) return;
            content.querySelector(".quartz-bar").replaceWith(quartzBar());
            let resultBox = card.querySelector(".featured-results");
            if (!resultBox) { resultBox = document.createElement("div"); resultBox.className = "featured-results"; card.appendChild(resultBox); }
            resultBox.innerHTML = "";
            got.forEach(unit => resultBox.appendChild(unitCard(unit)));
            desc.textContent = fb.desc + " · SSR " + (save.pity["featured-" + fb.id + "-ssr"] || 0) + "/50 · vedette " + (save.pity["featured-" + fb.id] || 0) + "/100";
            OS.sfx.play(got.some(u => u.r === 3) ? "ssr" : "gacha");
          });
          card.appendChild(btn);
        });
        featuredGrid.appendChild(card);
      });
      content.appendChild(featuredGrid);

      const portalTitle = document.createElement("div");
      portalTitle.className = "team-hint";
      portalTitle.textContent = "Portails de classe — 5 ◆ l'invocation · SSR garanti à 30 (pity par portail)";
      content.appendChild(portalTitle);
      const grid = document.createElement("div");
      grid.className = "portal-grid";
      [...new Set(UNITS.map((u) => u.cls))].forEach((cls) => {
        const b = document.createElement("button");
        b.className = "pull-btn portal-btn";
        b.dataset.portal = cls;
        b.innerHTML = "Portail " + cls + "<br><small>pity " + (save.pity[cls] || 0) + "/30</small>";
        b.addEventListener("click", () => {
          grid.querySelectorAll(".portal-btn").forEach((btn) => btn.classList.toggle("active", btn === b));
          renderPortalDetails(cls);
        });
        grid.appendChild(b);
      });
      content.appendChild(grid);

      const result = document.createElement("div");
      result.className = "pull-results";
      content.appendChild(result);
    }

    function updateBannerPity() {
      const sub = content.querySelector(".banner-sub");
      if (sub) sub.innerHTML = "5 % SSR · 20 % SR · 75 % R · SSR garanti à 50 invocations (<b>pity " + (save.pity.banniere || 0) + "/50</b>)";
    }

    function pullBtn(label, n) {
      const b = document.createElement("button");
      b.className = "pull-btn";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        const got = pull(n);
        if (!got.length) return;
        e.target.closest(".gacha-content").querySelector(".quartz-bar").replaceWith(quartzBar());
        const box = e.target.closest(".gacha-content").querySelector(".pull-results");
        box.innerHTML = "";
        got.forEach((u) => box.appendChild(unitCard(u)));
        updateBannerPity();
        OS.sfx.play(got.some((u) => u.r === 3) ? "ssr" : "gacha");
      });
      return b;
    }

    function evoSkillLabels(u, evo) { return evoSkillLabelsOf(u, evo); }

    function unitCard(u) {
      const p = unitPower(u);
      const stars = "★".repeat(p.evo || 0);
      const passive = PASSIVE_INFO[u.id];
      const ultimate = CLASS_ULTIMATE[u.cls] || CLASS_ULTIMATE.Héros;
      const evoLines = evoSkillLabels(u, p.evo || 0);
      const c = document.createElement("div");
      c.className = "unit-card r" + u.r;
      c.innerHTML =
        '<div class="unit-portrait">' + heroPortraitMarkup(u.id) + '</div>' +
        '<div class="unit-rarity">' + RARITY[u.r].label + (p.lvl > 1 ? " · Niveau " + p.lvl : "") + "</div>" +
        '<div class="unit-name">' + u.name + (stars ? ' <span class="evo-stars">' + stars + "</span>" : "") + "</div>" +
        '<div class="unit-cls">' + u.cls + (p.lvl > 1 || p.evo ? " · +" + Math.round((p.atk / u.atk - 1) * 100) + " %" : "") + "</div>" +
        (SKILL_INFO[u.id] ? '<div class="unit-skill">✦ ' + SKILL_INFO[u.id][0] + ' — ' + SKILL_INFO[u.id][1] + '</div>' : "") +
        (passive ? '<div class="unit-passive">✧ Passif : ' + passive[0] + " — " + passive[1] + "</div>" : "") +
        '<div class="unit-ultimate">✦ Ultime de classe : ' + ultimate.name + " · tous les " + ultimate.turns + " tours</div>" +
        (evoLines.length ? '<div class="unit-evo">' + evoLines.join("<br>") + "</div>" : "") +
        '<div class="unit-stats">ATK ' + p.atk + " · PV " + p.hp + "</div>";
      return c;
    }

    function quartzBar() {
      const b = document.createElement("div");
      b.className = "quartz-bar";
      b.textContent = "◆ Quartz : " + save.quartz;
      const ev = eventInfo();
      if (ev) {
        const chip = document.createElement("span");
        chip.className = "event-chip";
        chip.textContent = ev.icon + " " + ev.name + " — " + ev.desc;
        b.appendChild(chip);
      }
      return b;
    }

    function notifyGacha(msg) {
      content.querySelector(".gacha-error")?.remove();
      const err = document.createElement("div");
      err.className = "gacha-error";
      err.textContent = msg;
      content.appendChild(err);
    }

    /* ---------- Équipe ---------- */

    function renderTeam() {
      OS.sfx.setTheme("forge");
      setActiveTab(tabTeam);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Touchez une unité pour l'ajouter ou la retirer de l'équipe (3 max)";
      content.appendChild(hint);

      const help = document.createElement("div");
      help.className = "class-help";
      Object.keys(CLASS_BONUS).forEach((cls) => {
        const line = document.createElement("div");
        line.innerHTML = "<b>" + cls + "</b> — " + CLASS_BONUS[cls];
        help.appendChild(line);
      });
      content.appendChild(help);

      const box = document.createElement("div");
      box.className = "roster";
      content.appendChild(box);

      const sorted = UNITS.filter((u) => save.owned[u.id]).map(unitPower).sort((a, b) => b.r - a.r || b.atk - a.atk);
      sorted.forEach((u) => {
        const card = unitCard(u);
        card.classList.add("selectable");
        if (save.team.includes(u.id)) card.classList.add("in-team");
        card.addEventListener("click", () => {
          if (save.team.includes(u.id)) {
            save.team = save.team.filter((id) => id !== u.id);
          } else if (save.team.length < 3) {
            save.team.push(u.id);
          }
          persist();
          renderTeam();
        });
        box.appendChild(card);
      });

      content.appendChild(lootBar());
      content.appendChild(forgePanel());
      content.appendChild(recyclePanel());
      content.appendChild(relicPanel());
    }

    function relicPreviewLabel(k, heroId) {
      const un = byId(heroId);
      if (!un || relicTierOf(save, k) < 1) return "";
      const sv2 = { ...save, relicsEquip: { ...save.relicsEquip, [k]: heroId } };
      const main = RELIC_MAIN[k];
      if (main.stat === "atk") {
        const now = corePower(un, save);
        const after = corePower(un, sv2);
        return " (ATK " + now.atk + " → " + after.atk + ")";
      }
      if (main.stat === "hp") {
        const now = corePower(un, save);
        const after = corePower(un, sv2);
        return " (PV " + now.hp + " → " + after.hp + ")";
      }
      const v = (heroRelicFx(sv2, heroId)[main.stat] || 0) - (heroRelicFx(save, heroId)[main.stat] || 0);
      return " (" + RELIC_STAT_LABELS[main.stat] + " +"+ v +" %)";
    }

    function relicTierChip(tier) {
      if (tier < 1) return "";
      const t = RELIC_TIERS[tier - 1];
      return '<span class="tag-chip" style="background:' + t.color + '">' + t.key + " · " + t.label + "</span>";
    }

    function relicLine(k) {
      const rel = RELICS[k];
      const tier = relicTierOf(save, k);
      const line = document.createElement("div");
      line.className = "forge-line relic-line" + (tier >= 1 ? " ready" : "");

      const main = RELIC_MAIN[k];
      let statsTxt = "";
      if (tier >= 1) {
        statsTxt += "<div class=\"forge-req\"><b>Principale :</b> " + main.label + " +" + main.values[tier - 1] + " %</div>";
        const subs = RELIC_SUBS[k].slice(0, tier - 1);
        if (subs.length) {
          const txt = subs.map((sub) => RELIC_STAT_LABELS[Object.keys(sub)[0]] + " +" + Object.values(sub)[0] + " %").join(" · ");
          statsTxt += '<div class="forge-req"><b>Sous-stats :</b> ' + txt + "</div>";
        } else {
          statsTxt += '<div class="forge-req"><small>Aucune sous-stat — améliorez la relique pour en débloquer</small></div>';
        }
      }

      let actionTxt = "";
      let btn = null;
      if (tier < 1) {
        const cost = rel.cost;
        const can = Object.keys(cost).every((c) => (save.loot[c] || 0) >= cost[c]);
        const req = Object.keys(cost).map((c) =>
          '<span class="' + ((save.loot[c] || 0) >= cost[c] ? "ok" : "ko") + '">' + cost[c] + "× " + (LOOT[c] ? LOOT[c].name : c) + "</span>"
        ).join(" ");
        actionTxt = '<div class="forge-req">' + req + "</div>";
        btn = { label: "⚒ Forger", cost: cost, next: tier + 1 };
      } else if (tier < 4) {
        const cost = RELIC_UP[tier + 1];
        const can = Object.keys(cost).every((c) => (save.loot[c] || 0) >= cost[c]);
        const req = Object.keys(cost).map((c) =>
          '<span class="' + ((save.loot[c] || 0) >= cost[c] ? "ok" : "ko") + '">' + cost[c] + "× " + (LOOT[c] ? LOOT[c].name : c) + "</span>"
        ).join(" ");
        actionTxt = '<div class="forge-req">' + req + "</div>";
        btn = { label: "⬆ Améliorer (→ " + RELIC_TIERS[tier].key + ")", cost: cost, next: tier + 1 };
      } else {
        actionTxt = '<div class="forge-req"><b>✓ Rang maximal</b></div>';
      }

      line.innerHTML =
        '<div class="relic-visual"><img loading="lazy" alt="" src="assets/asteria/equipment/' + k + '.svg"></div><div class="relic-details"><div class="unit-name">' + rel.name + " " + relicTierChip(tier) + "</div>" +
        (tier < 1 ? '<div class="forge-evo">' + rel.effect + " (au rang N)</div>" : "") +
        statsTxt + actionTxt;

      line.innerHTML += "</div>";
      if (tier >= 1) {
        const wornId = save.relicsEquip[k] || "";
        const holder = wornId ? byId(wornId) : null;
        const status = document.createElement("div");
        status.className = "forge-evo relic-equip";
        status.innerHTML = "<b>✓ Forgée</b> — " + (holder ? "💎 " + holder.name : "aucun porteur");
        const lbl = document.createElement("span");
        lbl.textContent = "      Équiper sur : ";
        const sel = document.createElement("select");
        sel.className = "relic-equip-select";
        ["", ...Object.keys(save.owned || {})].forEach((id) => {
          const un = id ? byId(id) : null;
          if (id && !un) return;
          const op = document.createElement("option");
          op.value = id;
          op.textContent = un ? un.name + (id !== wornId ? relicPreviewLabel(k, id) : "") : "— aucun —";
          sel.appendChild(op);
        });
        sel.value = wornId;
        sel.addEventListener("change", () => {
          save.relicsEquip[k] = sel.value || null;
          persist();
          renderTeam();
        });
        status.appendChild(lbl);
        status.appendChild(sel);
        line.appendChild(status);
      }

      if (btn) {
        const b = document.createElement("button");
        b.className = "pull-btn";
        b.textContent = btn.label;
        b.disabled = !Object.keys(btn.cost).every((c) => (save.loot[c] || 0) >= btn.cost[c]);
        b.addEventListener("click", () => {
          Object.keys(btn.cost).forEach((c) => { save.loot[c] = (save.loot[c] || 0) - btn.cost[c]; });
          save.relics[k] = btn.next;
          persist();
          OS.sfx.play(btn.next === 1 ? "unlock" : "ssr");
          renderTeam();
        });
        line.appendChild(b);
      }
      return line;
    }

    function relicPanel() {
      const wrap = document.createElement("div");
      wrap.className = "forge-panel relic-panel";
      const h = document.createElement("h3");
      h.textContent = "Reliquaire du raid — 8 reliques, chacune s’équipe sur un héros";
      wrap.appendChild(h);
      wrap.appendChild(relicLine("arme"));
      wrap.appendChild(relicLine("armure"));
      wrap.appendChild(relicLine("etendard"));
      wrap.appendChild(relicLine("anneau"));
      wrap.appendChild(relicLine("orbe"));
      wrap.appendChild(relicLine("talisman"));
      wrap.appendChild(relicLine("grimoire"));
      wrap.appendChild(relicLine("bottes"));

      const h2 = document.createElement("h3");
      h2.textContent = "Bonus d'ensemble";
      wrap.appendChild(h2);
      RELIC_SETS.forEach((set) => {
        const forged = Object.keys(RELIC_MAIN).filter((k) => relicTierOf(save, k) >= 1 && equipOf(save)[k]);
        const ok = forged.length >= set.need && (!set.sameTier || forged.every((k) => relicTierOf(save, k) >= set.sameTier));
        const line = document.createElement("div");
        line.className = "forge-line relic-line set-line" + (ok ? " ready" : "");
        line.innerHTML =
          '<div class="unit-name">' + (ok ? "✓ " : "◇ ") + set.name + "</div>" +
          '<div class="forge-req">' + set.desc + (ok ? " — <b>actif !</b>" : "") + "</div>";
        wrap.appendChild(line);
      });
      return wrap;
    }

    function lootBar() {
      const div = document.createElement("div");
      div.className = "loot-bar";
      Object.keys(LOOT).forEach((k) => {
        const chip = document.createElement("span");
        chip.className = "loot-chip";
        chip.innerHTML = '<span class="loot-dot" style="background:' + LOOT[k].color + '"></span>' + LOOT[k].name + " ×" + (save.loot[k] || 0);
        div.appendChild(chip);
      });
      return div;
    }

    function forgePanel() {
      const wrap = document.createElement("div");
      wrap.className = "forge-panel";
      const h = document.createElement("h3");
      h.textContent = "Forge d'évolution — +10 % ATK/PV par évolution (max ★★★★)";
      wrap.appendChild(h);

      const candidates = UNITS.filter((u) => save.owned[u.id] && u.id !== "graal" && (save.evo[u.id] || 0) < 4)
        .slice().sort((a, b) => b.r - a.r || a.name.localeCompare(b.name));
      if (!candidates.length) {
        const done = document.createElement("div");
        done.className = "team-hint";
        done.textContent = "Toutes vos unités évolutives sont au maximum (★\u2605\u2605\u2605) — le Graal est déjà au-delà.";
        wrap.appendChild(done);
        return wrap;
      }
      candidates.forEach((u) => {
        const evo = save.evo[u.id] || 0;
        const req = evo === 3 ? { [matKeyOf(u.cls)]: EVO4_REQ[u.r] } : EVO_REQ[u.r][evo] || {};
        const can = Object.keys(req).every((k) => (save.loot[k] || 0) >= req[k]);
        const nextEvoLabel = ({
          1: "Éveil I ✦ Jauge de départ +10 %",
          2: "Éveil II ✦ Dégâts +8 %" + (EVO2[u.cls] ? " + Talent ✦ " + EVO2[u.cls].label : ""),
          3: (EVO3[u.cls] ? "Éveil III ✦ " + EVO3[u.cls].label : "") + (EVO3B[u.cls] ? " + Talent ✦ " + EVO3B[u.cls].label : ""),
          4: "Éveil IV ✦ Dégâts +6 % et jauge de départ +5 %",
        })[evo + 1];
        const line = document.createElement("div");
        line.className = "forge-line" + (can ? " ready" : "");
        line.innerHTML =
          '<div class="unit-name">' + u.name + "</div>" +
          '<div class="forge-evo">' + "★".repeat(evo) + "→ " + "★".repeat(evo + 1) + " \u00b7 +10 % ATK/PV \u00b7 " + nextEvoLabel + "</div>" +
          '<div class="forge-req">' + Object.keys(req).map((k) => {
            const ok = (save.loot[k] || 0) >= req[k];
            return '<span class="' + (ok ? "ok" : "ko") + '">' + req[k] + "× " + LOOT[k].name + "</span>";
          }).join(" · ") + "</div>";
        const b = document.createElement("button");
        b.className = "pull-btn claim-btn";
        b.textContent = "Évoluer";
        b.disabled = !can;
        if (can) {
          b.addEventListener("click", () => {
            Object.keys(req).forEach((k) => { save.loot[k] -= req[k]; });
            save.evo[u.id] = (save.evo[u.id] || 0) + 1;
            persist();
            OS.sfx.play("unlock");
            renderTeam();
          });
        }
        line.appendChild(b);
        wrap.appendChild(line);
      });
      return wrap;
    }

    /* ---------- Entraînement ---------- */

    let trainPick = null;

    function renderTraining() {
      OS.sfx.setTheme("training");
      setActiveTab(tabTraining);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Mode Entraînement — testez chaque héros, même non possédé, dans un vrai duel contre un adversaire équilibré. Aucun gain ni perte sur votre sauvegarde.";
      content.appendChild(hint);

      // Une fois un héros choisi, le laboratoire devient un écran de combat dédié.
      // Le roster complet reste dans l'écran de sélection, pas au-dessus du combat.
      if (battle && battle.mode === "train") {
        const selected = document.createElement("div");
        selected.className = "roster training-selected";
        const selectedCard = unitCard(battle.units[0]);
        selectedCard.classList.add("in-team");
        selected.appendChild(selectedCard);
        content.appendChild(selected);
        const change = document.createElement("button");
        change.className = "pull-btn";
        change.textContent = "↩ Changer de héros";
        change.addEventListener("click", () => { battle = null; renderTraining(); });
        content.appendChild(change);
        content.appendChild(battleView());
        return;
      }

      const box = document.createElement("div");
      box.className = "roster";
      content.appendChild(box);

      UNITS.slice().sort((a, b) => b.r - a.r || a.cls.localeCompare(b.cls) || a.atk - b.atk).forEach((u) => {
        const card = unitCard(u);
        card.classList.add("selectable");
        if (!save.owned[u.id]) card.classList.add("locked");
        if (trainPick === u.id) card.classList.add("in-team");
        card.addEventListener("click", () => { trainPick = u.id; startTrainingBattle(); });
        box.appendChild(card);
      });

      const oppHint = document.createElement("div");
      oppHint.className = "team-hint";
      oppHint.textContent = trainPick ? "Héros sélectionné : " + byId(trainPick).name + " · Lancez un duel réel contre un adversaire aléatoire." : "Choisissez un héros pour commencer le test.";
      content.appendChild(oppHint);
      const row = document.createElement("div");
      row.className = "pull-row";
      const start = document.createElement("button");
      start.className = "pull-btn tier-infini";
      start.textContent = "⚔ Tester ce héros contre un mob aléatoire";
      start.disabled = !trainPick;
      start.addEventListener("click", startTrainingBattle);
      row.appendChild(start);
      content.appendChild(row);
      if (battle && battle.mode === "train") content.appendChild(battleView());
    }

    function startTrainingBattle() {
      const u = trainPick ? byId(trainPick) : null;
      if (!u) return;
      const unit = corePower(u, save);
      const types = Object.keys(ENEMY_TYPES);
      const type = types[Math.floor(Math.random() * types.length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const op = {
        name, type,
        hp: Math.max(9000, Math.round(unit.atk * 50)),
        atk: Math.max(120, Math.round(unit.hp * 0.05)),
      };
      battle = {
        mode: "train",
        trainingDamage: 0,
        floor: 1,
        enemy: { name: op.name, type: op.type, ...enemyStats(op.type, op.hp, op.atk) },
        tier: "train",
        units: [unit],
        hp: [unit.hp],
        gauge: Math.min(60, unitFx(unit).jaugeInit || 0),
        picks: 0,
        guard: false,
        curse: 0,
        burn: 0,
        valenFury: 0,
        breakGauge: 0,
        intent: enemyIntent(type),
        log: ["----- DUEL D'ENTRAÎNEMENT : " + unit.name + " contre " + op.name + " [" + type + "] · combat réel · aucun gain/perte -----"],
      };
      battle.heroStacks = [unit.cls === "Héros" ? 0 : -1];
      newHand();
      OS.sfx.play("ult");
      renderBattle();
    }

    function recyclePanel() {
      const wob = UNITS.filter((u) => u.id !== "graal" && (save.owned[u.id] || 0) >= 2)
        .slice().sort((a, b) => b.r - a.r || a.name.localeCompare(b.name));
      if (!wob.length) return document.createElement("div");
      const wrap = document.createElement("div");
      wrap.className = "forge-panel recycle-panel";
      const h = document.createElement("h3");
      h.textContent = "Recyclage des doublons — échangez un doublon contre un matériau de sa classe";
      wrap.appendChild(h);
      wob.forEach((u) => {
        const line = document.createElement("div");
        line.className = "forge-line";
        line.innerHTML =
          '<div class="unit-name">' + u.name + " <small>(" + RARITY[u.r].label + ")</small></div>" +
          '<div class="forge-req">' + (save.owned[u.id] || 0) + " doublons · recyclage : +" + RECYCLE_GAIN[u.r] + " " + LOOT[matKeyOf(u.cls)].name + "</div>";
        const b = document.createElement("button");
        b.className = "pull-btn claim-btn";
        b.textContent = "♻ Recycler ×1";
        b.addEventListener("click", () => {
          save.owned[u.id] = (save.owned[u.id] || 1) - 1;
          save.loot[matKeyOf(u.cls)] = (save.loot[matKeyOf(u.cls)] || 0) + RECYCLE_GAIN[u.r];
          persist();
          OS.sfx.play("ui");
          renderTeam();
        });
        line.appendChild(b);
        wrap.appendChild(line);
      });
      return wrap;
    }

    /* ---------- Collection ---------- */

    let collectionFilters = { cls: "all", rarity: "all", ownership: "all" };

    function renderCollection() {
      OS.sfx.setTheme("collection");
      setActiveTab(tabCollection);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const total = UNITS.length;
      const have = UNITS.filter((u) => save.owned[u.id]).length;
      const pct = Math.round((have / total) * 100);
      const prog = document.createElement("div");
      prog.className = "col-progress";
      prog.innerHTML = '<div class="col-bar"><div class="col-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="team-hint">Collection : ' + have + " / " + total + " (" + pct + " %)</div>";
      content.appendChild(prog);

      const rew = document.createElement("div");
      rew.className = "collect-rewards";
      COLLECTION_REWARDS.forEach((rw) => {
        const line = document.createElement("div");
        line.className = "collect-line";
        const done = pct >= rw.pct;
        const claimed = save.collected.includes(rw.pct);
        const lab = document.createElement("div");
        lab.innerHTML = "<b>" + rw.pct + " %</b> — " + rw.quartz + " ◆ " + (claimed ? "✓ réclamé" : "");
        line.appendChild(lab);
        if (done && !claimed) {
          const b = document.createElement("button");
          b.className = "pull-btn claim-btn";
          b.textContent = "Réclamer " + rw.quartz + " ◆";
          b.addEventListener("click", () => {
            save.collected.push(rw.pct);
            save.quartz += rw.quartz;
            persist();
            OS.sfx.play("unlock");
            renderCollection();
          });
          line.appendChild(b);
        }
        rew.appendChild(line);
      });
      content.appendChild(rew);

      const filters = document.createElement("div");
      filters.className = "collection-filters";
      const makeFilter = (label, key, options) => {
        const wrap = document.createElement("label");
        wrap.className = "collection-filter";
        const caption = document.createElement("span");
        caption.textContent = label;
        const select = document.createElement("select");
        options.forEach((o) => { const opt = document.createElement("option"); opt.value = o.value; opt.textContent = o.label; select.appendChild(opt); });
        select.value = collectionFilters[key];
        select.addEventListener("change", () => { collectionFilters[key] = select.value; renderCollection(); });
        wrap.append(caption, select);
        filters.appendChild(wrap);
      };
      makeFilter("Classe", "cls", [{value:"all",label:"Toutes les classes"}, ...[...new Set(UNITS.map((u)=>u.cls))].sort().map((v)=>({value:v,label:v}))]);
      makeFilter("Rareté", "rarity", [{value:"all",label:"Toutes les raretés"}, ...Object.keys(RARITY).sort((a,b)=>Number(b)-Number(a)).map((v)=>({value:v,label:RARITY[v].label}))]);
      makeFilter("Possession", "ownership", [{value:"all",label:"Tous les héros"}, {value:"owned",label:"Possédés"}, {value:"missing",label:"Non possédés"}]);
      content.appendChild(filters);
      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Tous les héros du jeu — touchez une carte pour ouvrir sa fiche";
      content.appendChild(hint);
      const grid = document.createElement("div");
      grid.className = "roster col-grid";
      const filteredUnits = UNITS.filter((u) => (collectionFilters.cls === "all" || u.cls === collectionFilters.cls) && (collectionFilters.rarity === "all" || String(u.r) === collectionFilters.rarity) && (collectionFilters.ownership === "all" || (collectionFilters.ownership === "owned" ? !!save.owned[u.id] : !save.owned[u.id])));
      if (!filteredUnits.length) { const empty = document.createElement("div"); empty.className = "team-hint"; empty.textContent = "Aucun personnage ne correspond à ces filtres."; grid.appendChild(empty); }
      filteredUnits.slice().sort((a, b) => b.r - a.r || a.cls.localeCompare(b.cls) || a.atk - b.atk).forEach((u) => {
        if (save.owned[u.id]) {
          const card = unitCard(u);
          card.addEventListener("click", () => OS.heroes.open(u.id));
          grid.appendChild(card);
          return;
        }
        const c = document.createElement("div");
        c.className = "unit-card locked r" + u.r;
        c.innerHTML =
          '<div class="unit-portrait">' + heroPortraitMarkup(u.id) + '</div>' +
          '<div class="unit-rarity">' + RARITY[u.r].label + "</div>" +
          '<div class="unit-name">' + u.name + "</div>" +
          '<div class="unit-cls">Non invoqué…</div>' +
          '<div class="unit-stats">ATK ??? · PV ???</div>';
        c.addEventListener("click", () => OS.heroes.open(u.id));
        grid.appendChild(c);
      });
      content.appendChild(grid);
    }

    /* ---------- Quêtes et combat ---------- */

    let battle = null;

    function teamUnits() {
      const units = save.team.map(byId).filter(Boolean).filter((u) => save.owned[u.id]).map(unitPower);
      return units.slice(0, 3);
    }

    function renderQuests() {
      OS.sfx.setTheme("battle");
      setActiveTab(tabBattle);
      content.innerHTML = "";
      content.appendChild(quartzBar());
      content.appendChild(dailyPanel());
      content.appendChild(raidPanel());

      const team = teamUnits();
      if (team.length < 1) {
        content.innerHTML += '<div class="team-hint">Aucune équipe. Invoquez des héros d\'abord.</div>';
        return;
      }

      const title = document.createElement("div");
      title.className = "team-hint";
      title.textContent = "Équipe : " + team.map((u) => u.name).join(" · ");
      content.appendChild(title);

      const row = document.createElement("div");
      row.className = "pull-row";
      const infiniteHint = document.createElement("div");
      infiniteHint.className = "team-hint infinite-scaling-hint";
      infiniteHint.textContent = "Infini : +18 % PV par étage, ATQ croissante avec des paliers tous les 5 étages. Quartz et butin augmentent avec la profondeur.";
      content.appendChild(infiniteHint);
      Object.keys(TIER).forEach((key) => {
        const t = TIER[key];
        const b = document.createElement("button");
        b.className = "pull-btn tier-" + key;
        b.innerHTML = t.infinite
          ? "Mode Infini<br><small>→ record : étage " + infiniteBest + "</small>"
          : "Quête " + t.label + "<br><small>→ " + t.reward + " ◆</small>";
        b.addEventListener("click", () => startBattle(key));
        row.appendChild(b);
      });
      content.appendChild(row);

      if (battle) content.appendChild(battleView());
    }

    function renderBattle() {
      if (battle && battle.mode === "train") renderTraining();
      else renderQuests();
    }

    function enemyPortrait(type, name) { return enemyPortraitMarkup(type, name); }

    function enemyIntent(type) {
      const intents = {
        "Brute": ["Frappe écrasante", "Cible le héros le plus blessé · dégâts élevés"],
        "Assassin": ["Marque mortelle", "Vise le héros avec la plus forte ATK · risque de critique"],
        "Sorcier": ["Déflagration", "Attaque toute l'équipe"],
        "Capitaine": ["Ordre de charge", "Frappe une cible puis augmente sa propre ATK"],
        "Golem": ["Poing de pierre", "Frappe lente et puissante · armure renforcée"],
        "Oracle": ["Prière régénératrice", "Récupère des PV puis attaque"],
        "Muraille": ["Percée du bastion", "Frappe une cible · défense élevée"],
        "Invocateur": ["Appel des ombres", "Deux frappes sur des héros"],
        "Fantassin": ["Rafale martiale", "Deux frappes rapides"],
        "Nécromant": ["Drain funeste", "Se soigne puis attaque"],
        "Banshee": ["Hurlement spectral", "Réduit la jauge d'Ultime puis attaque"],
        "Sanguinaire": ["Traque des blessés", "Vise le héros ayant le moins de PV en proportion"],
        "Colosse de givre": ["Onde glaciale", "Frappe une cible"],
        "Duelliste": ["Danse des lames", "Vise le héros le plus offensif"],
        "Artilleur": ["Barrage incandescent", "Frappe toute l’équipe"],
        "Alchimiste": ["Fiole corrosive", "Empoisonne puis se soigne"],
        "Sentinelle": ["Mur prismatique", "Frappe et se protège"],
        "Prédateur": ["Bond du chasseur", "Vise le héros le plus blessé"],
        "Chronomancien": ["Sablier brisé", "Réduit la jauge d’Ultime"],
      };
      return intents[type] || ["Attaque", "Frappe un héros au hasard"];
    }

    function startBattle(key) {
      const team = teamUnits();
      const t = TIER[key];
      const types = Object.keys(ENEMY_TYPES);
      const etype = types[Math.floor(Math.random() * types.length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const golemMult = etype === "Golem" ? 1.15 : 1;
      const scale = key === "infini" ? Math.pow(1.16, 0) : 1;
      battle = {
        mode: key === "infini" ? "infini" : "quest",
        floor: 1,
        enemy: { name, type: etype, ...enemyStats(etype, t.hp * scale, t.atk * (key === "infini" ? 1.08 : 1)) },
        tier: key,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: 0,
        picks: 0,
        guard: false,
        curse: 0,
        burn: 0,
        valenFury: 0,
        log: ["----- " + name + " [" + etype + "] apparaît · " + ENEMY_TYPES[etype].desc + " -----"],
      };
      battle.guard = false;
      battle.intent = enemyIntent(etype);
      battle.gauge = initialGauge(team, 60);
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      renderQuests();
    }

    function startRaid() {
      ensureRaid();
      if ((raid.elixirs || 0) < 1) return;
      const team = teamUnits();
      if (!team.length) return;
      raid.elixirs--;
      persistRaid();
      const ph = RAID_PHASES[0];
      battle = {
        mode: "raid",
        raidPhase: 1,
        enemy: { name: ph.name, type: ph.type, ...enemyStats(ph.type, ph.hp, ph.atk) },
        tier: "raid",
        units: team,
        hp: team.map((u) => u.hp),
        gauge: 0,
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        log: [],
      };
      if (ph.elite) battle.elite = ph.elite;
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      battle.intent = enemyIntent(ph.type);
      battle.log.unshift("----- RAID · Phase 1/3 : " + ph.name + " -----" );
      if (battle.elite) battle.log.unshift("[Élite] " + battle.elite.name + " : " + battle.elite.desc);
      battle.gauge = initialGauge(team, 60);
      OS.sfx.play("ult");
      renderQuests();
    }

    function newHand() {
      const deck = [];
      battle.units.forEach((u, idx) => u.cards.forEach((type) => deck.push({ type, idx })));
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      battle.hand = deck.slice(0, 5);
      battle.picks = 0;
      if (battle.heroStacks) {
        aliveIdx().forEach((i) => {
          if (battle.heroStacks[i] >= 0) battle.heroStacks[i]++;
        });
      }
    }

    function aliveIdx() {
      return battle.hp.map((v, i) => (v > 0 ? i : -1)).filter((i) => i >= 0);
    }

    function playCard(cardIdx) {
      if (!battle || battle.picks >= 3) return;
      const card = battle.hand[cardIdx];
      if (!card) return;
      battle.hand.splice(cardIdx, 1);
      battle.picks++;

      const c = CARD[card.type];
      const u = battle.units[card.idx];
      const gi = aliveIdx().includes(card.idx) ? card.idx : aliveIdx()[0];
      const unit = battle.units[gi];

      if (u.cls === "Soigneur" || (u.cls === "Druide" && card.type === "B")) {
        trackDaily("cards");
        trackDaily("heals");
        const fdxHeal = (unitFx(u).heal || 0) / 100;
        const needy = aliveIdx().sort((a, b) => battle.hp[a] - battle.hp[b]);
        const wi = needy[0];
        const heal = Math.round(unit.atk * (u.cls === "Druide" ? 0.22 : 0.30) * (u.id === "edele" ? 1.5 : 1) * (1 + fdxHeal) * (0.9 + Math.random() * 0.2));
        const healed = Math.min(battle.units[wi].hp - battle.hp[wi], heal);
        battle.hp[wi] = Math.min(battle.units[wi].hp, battle.hp[wi] + heal);
        battle.log.unshift(unit.name + " soigne " + battle.units[wi].name + " (+" + healed + " PV)");
        battle.gauge = Math.min(100, battle.gauge + 12);
        if (u.id === "nadila") battle.gauge = Math.min(100, battle.gauge + 5);
        OS.sfx.play("heal");
        if (battle.picks >= 3) enemyTurn();
        renderBattle();
        return;
      }

      trackDaily("cards");
      const fx = unitFx(u);
      let dmg = Math.round(unit.atk * c.mult * (0.9 + Math.random() * 0.3));
      dmg = Math.round(dmg * teamAtkMult() * (battle.storyMult || 1));
      if (fx.dmg) dmg = Math.round(dmg * (1 + fx.dmg / 100));
      let crit = false;
      const critBase = (u.cls === "Archer" ? 0.35 : 0.25) + (fx.crit || 0) / 100;
      const critChance = card.type === "V" ? (u.id === "aelis" ? 0.5 + (fx.crit || 0) / 100 : critBase) : 0;
      if (card.type === "V" && Math.random() < critChance) { dmg *= 2; crit = true; }
      if (u.cls === "Mage" && card.type === "B") dmg = Math.round(dmg * 1.25);
      if (u.cls === "Occultiste" && card.type === "B") { battle.curse = Math.min(4, (battle.curse || 0) + 1); battle.log.unshift(u.name + " tisse une marque du voile."); }
      if (u.cls === "Berserker") {
        const threshold = u.id === "draven" ? 0.7 : 0.5;
        const rage = (u.id === "draven" ? 1.3 : 1.2) + (fx.rage || 0) / 100;
        if (battle.hp[gi] < u.hp * threshold) dmg = Math.round(dmg * rage);
      }
      if (u.cls === "Tueur") dmg = Math.round(dmg * (u.id === "orlan" ? 1.35 : 1.22));
      if (u.id === "raiden" && battle.enemy.hp / battle.enemy.maxHp < 0.25) dmg = Math.round(dmg * 2);
      const execBonus = ((fx.execute || 0) + (fx.fureur || 0)) / 100;
      if (execBonus && battle.enemy.hp / battle.enemy.maxHp < 0.5) dmg = Math.round(dmg * (1 + execBonus));
      if (u.cls === "Héros" && battle.heroStacks && battle.heroStacks[gi] > 1) {
        const heroGrowth = ((u.id === "rin" || u.id === "graal") ? 0.05 : 0.04) + (fx.growth || 0) / 100;
        dmg = Math.round(dmg * (1 + heroGrowth * (battle.heroStacks[gi] - 1)));
      }
      if (u.id === "kaelith" && card.type === "V") dmg = Math.round(dmg * 1.4);

      const gaugeGain = (card.type === "B" ? (u.cls === "Mage" ? 28 : 22) : 8) + (fx.gauge || 0);
      battle.gauge = Math.min(100, battle.gauge + (battle.elite && battle.elite.id === "oriflamme" ? Math.round(gaugeGain * 0.8) : gaugeGain));
      if (u.id === "morgane") battle.gauge = Math.min(100, battle.gauge + 5);
      if (u.id === "vespera") battle.gauge = Math.min(100, battle.gauge + 6);
      if (u.id === "ravenne" && card.type === "B") {
        battle.curse++;
        battle.log.unshift(unit.name + " maudit l'ennemi (+" + (battle.curse * 10) + " % dégâts)");
      }

      OS.sfx.play(crit ? "crit" : card.type === "V" ? "quick" : card.type === "B" ? "arcane" : "hit");

      const hits = (u.id === "kairo" && Math.random() < 0.15) ? 2 : 1;
      let totalDealt = 0;
      for (let h = 0; h < hits; h++) {
        totalDealt += hitEnemy(hits === 2 ? Math.round(dmg * 0.75) : dmg, unit.name, (crit ? "CRIT ! " : "") + c.label + (hits === 2 && h === 1 ? " (double frappe !)" : ""), c.element);
        if (battle.enemy.hp <= 0) break;
      }
      if (u.id === "graal" && totalDealt > 0 && battle.enemy.hp > 0) {
        const graalTarget = aliveIdx().sort((a, b) => battle.hp[a] - battle.hp[b])[0];
        const healedD = Math.min(battle.units[graalTarget].hp - battle.hp[graalTarget], Math.round(totalDealt * 0.08 * (1 + (fx.heal || 0) / 100)));
        if (healedD > 0) {
          battle.hp[graalTarget] += healedD;
          battle.log.unshift(unit.name + " canalise les braises : soigne " + battle.units[graalTarget].name + " (+" + healedD + " PV)");
        }
      }
      if (u.id === "enzo" && card.type === "R" && battle.enemy.hp > 0) {
        battle.burn = Math.min(3, battle.burn + 1);
        battle.log.unshift(unit.name + " enflamme l'ennemi (brûlure ×" + battle.burn + ")");
      }

      if (battle.enemy.hp <= 0) return endBattle(true);
      if (battle.picks >= 3) enemyTurn();
      renderBattle();
    }

    function unitName(list) {
      return list.map((u) => u.name).join(" et ");
    }

    function teamSynergies() {
      const alive = battle.units.filter((u, i) => battle.hp[i] > 0);
      const classes = new Set(alive.map((u) => u.cls));
      const pairs = [];
      if (classes.has("Mage") && classes.has("Archer")) pairs.push({ id: "precision", name: "Convergence arcanique", desc: "+8 % dégâts d'équipe", atk: 0.08 });
      if (classes.has("Chevalier") && classes.has("Soigneur")) pairs.push({ id: "serment", name: "Serment protecteur", desc: "−10 % dégâts reçus", guard: 0.10 });
      if (classes.has("Berserker") && classes.has("Rôdeur")) pairs.push({ id: "traque", name: "Traque coordonnée", desc: "+6 % dégâts d'équipe", atk: 0.06 });
      if (classes.has("Artificier") && classes.has("Druide")) pairs.push({ id: "atelier-vivant", name: "Atelier vivant", desc: "+4 % ATK · −5 % dégâts reçus", atk: 0.04, guard: 0.05 });
      if (classes.has("Druide") && classes.has("Occultiste")) pairs.push({ id: "cycle-voile", name: "Cycle du voile", desc: "−6 % dégâts reçus", guard: 0.06 });
      if (classes.has("Artificier") && classes.has("Occultiste")) pairs.push({ id: "mecanique-interdite", name: "Mécanique interdite", desc: "+8 % dégâts d'équipe", atk: 0.08 });
      return pairs;
    }

    function teamAtkMult() {
      let mult = 1;
      teamSynergies().forEach((synergy) => { mult += synergy.atk || 0; });
      battle.units.forEach((u, i) => {
        if (battle.hp[i] > 0) {
          if (u.id === "aldric") mult += 0.10;
          const fx = unitFx(u);
          if (fx.teamAtk) mult += fx.teamAtk / 100;
        }
      });
      mult += battle.valenFury * 0.30;
      mult += battle.ultAtk || 0;
      return mult;
    }

    function hitEnemy(base, actorName, label, element) {
      let dmg = base;
      const affinity = ENEMY_AFFINITY[battle.enemy.type] || "arcane";
      if (element && ELEMENTS[element]) {
        if (ELEMENTS[element].strong === affinity) {
          dmg = Math.round(dmg * 1.25);
          battle.log.unshift("✧ Faiblesse exploitée : " + ELEMENTS[element].label + " frappe fort contre " + ELEMENTS[affinity].label + " (+25 %)");
        } else if (ELEMENTS[element].weak === affinity) {
          dmg = Math.round(dmg * 0.80);
          battle.log.unshift("Résistance : " + ELEMENTS[affinity].label + " atténue " + ELEMENTS[element].label + " (−20 %)");
        }
        if (battle.lastElement && battle.lastElement !== element) {
          dmg = Math.round(dmg * 1.15);
          battle.log.unshift("⚡ Réaction élémentaire : " + ELEMENTS[battle.lastElement].label + " + " + ELEMENTS[element].label + " (+15 %)");
        }
        battle.lastElement = element;
      }
      if (battle.enemy.type === "Golem") dmg = Math.round(dmg * 0.84);
      else if (battle.enemy.type === "Muraille") dmg = Math.round(dmg * 0.9);
      else if (battle.enemy.type === "Colosse de givre") dmg = Math.round(dmg * 0.88);
      else if (battle.enemy.type === "Sentinelle" && battle.enemy.guardTurns) dmg = Math.round(dmg * 0.82);
      dmg = Math.round(dmg * (1 + 0.10 * battle.curse));
      if (battle.mode === "train") battle.trainingDamage = (battle.trainingDamage || 0) + dmg;
      battle.enemy.hp = Math.max(0, battle.enemy.hp - dmg);
      battle.log.unshift(actorName + " (" + label + ") → " + dmg + " dégâts");

      // Jauge de rupture : les assauts coordonnés peuvent interrompre la riposte.
      if (battle.enemy.hp > 0 && !battle.staggered) {
        battle.breakGauge = (battle.breakGauge || 0) + dmg;
        const threshold = Math.max(1, Math.round(battle.enemy.maxHp * 0.28));
        if (battle.breakGauge >= threshold) {
          battle.breakGauge = 0;
          battle.staggered = true;
          battle.log.unshift("✦ RUPTURE ! " + battle.enemy.name + " est déséquilibré : sa prochaine action est interrompue.");
          OS.sfx.play("crit");
        }
      }
      return dmg;
    }

    function useUltimate() {
      if (!battle || battle.gauge < 100 || battle.picks >= 3) return;
      const si = aliveIdx().sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
      const strongest = battle.units[si];
      const heroMult = battle.heroStacks && battle.heroStacks[si] > 1 ? (1 + (strongest.id === "rin" || strongest.id === "graal" ? 0.08 : 0.05) * (battle.heroStacks[si] - 1)) : 1;
      const dmg = Math.round(strongest.atk * 2.4 * heroMult * (1 + (unitFx(strongest).dmg || 0) / 100) * teamAtkMult() * (battle.storyMult || 1) * (0.95 + Math.random() * 0.1));
      // Les ultimes passent par le même pipeline que les cartes : résistances,
      // malédiction et jauge de rupture restent cohérentes quel que soit le type d’attaque.
      hitEnemy(dmg, strongest.name, "Ultime", null);
      battle.gauge = 0;
      battle.picks = 3;
      OS.sfx.play("ult");
      if (battle.enemy.hp <= 0) return endBattle(true);
      enemyTurn();
      renderBattle();
    }

    function attackAlly(ti, raw) {
      const target = battle.units[ti];
      const dodgeChance = (target.id === "okatsuro" ? 0.40 : target.cls === "Rôdeur" ? 0.25 : 0) + (unitFx(target).esquive || 0) / 100;
      if (Math.random() < dodgeChance) {
        battle.log.unshift(target.name + " esquive la riposte !");
        return 0;
      }
      if (battle.ultDodge > 0) { battle.ultDodge--; battle.log.unshift("Pas spectral : l’attaque est esquivée !"); return 0; }
      const shieldBearer = battle.units.findIndex((u, i) => u.id === "seraphine" && battle.hp[i] > 0);
      if (shieldBearer !== ti && shieldBearer !== -1 && Math.random() < 0.20) {
        battle.log.unshift("Séraphine dévie l'attaque avec son bouclier !");
        return 0;
      }
      let dmg = battle.guard ? Math.round(raw * 0.65) : raw;
      if (battle.ultShield > 0) dmg = Math.round(dmg * (1 - battle.ultShield));
      const protection = teamSynergies().find((synergy) => synergy.guard);
      if (protection) {
        dmg = Math.round(dmg * (1 - protection.guard));
        battle.log.unshift(protection.name + " : dégâts réduits de " + Math.round(protection.guard * 100) + " %");
      }
      const defenders = battle.units.filter((u, i) => u.cls === "Défenseur" && battle.hp[i] > 0);
      if (defenders.length) {
        const cut = Math.min(0.30, defenders.reduce((s, u) => s + (u.id === "bastien" ? 0.15 : 0.10) + (unitFx(u).rempart || 0) / 100, 0));
        dmg = Math.round(dmg * (1 - cut));
        battle.log.unshift(unitName(defenders) + " encaisse : dégâts réduits de " + Math.round(cut * 100) + " %");
      }
      if (target.cls === "Chevalier") dmg = Math.round(dmg * 0.75);
      battle.hp[ti] = Math.max(0, battle.hp[ti] - dmg);
      battle.log.unshift(battle.enemy.name + " frappe " + target.name + " → " + dmg + " dégâts");
      if (battle.elite && battle.elite.id === "siphon" && dmg > 0) {
        const heal = Math.round(dmg * 0.5);
        battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + heal);
        battle.log.unshift("Siphon d'âmes : le boss absorbe " + heal + " PV");
      }

      const RENVOI = {
        gauvin: ["serment d'acier (renvoi)", 0.30],
        barrok: ["poing élastique (renvoi)", 0.35],
        takumi: ["garde-rapprochée (renvoi)", 0.20],
        graal: ["héritage des braises (renvoi)", 0.20],
      };
      const renvoiPct = RENVOI[target.id] ? RENVOI[target.id][1] + (unitFx(target).renvoi || 0) / 100 : (unitFx(target).renvoi || 0) / 100;
      if (renvoiPct > 0 && battle.enemy.hp > 0) {
        hitEnemy(Math.round(dmg * renvoiPct), target.name, RENVOI[target.id] ? RENVOI[target.id][0] : "passif (renvoi)");
      }
      if (battle.hp[ti] === 0 && battle.enemy.hp > 0) {
        battle.log.unshift(target.name + " tombe K.O.");
        const valenAlive = battle.units.some((u, i) => u.id === "valen" && battle.hp[i] > 0);
        if (valenAlive) {
          battle.valenFury++;
          battle.log.unshift("Valen rugit de douleur : +" + (battle.valenFury * 30) + " % d'ATK pour lui");
        }
      }
      return dmg;
    }

    const CLASS_ULTIMATE = {
      Chevalier: { turns: 4, name: "Serment inébranlable", power: 1.45, shield: 0.12 },
      Berserker: { turns: 3, name: "Rage du dernier rempart", power: 2.45 },
      Mage: { turns: 4, name: "Déluge arcanique", power: 2.05, gauge: 16 },
      Archer: { turns: 3, name: "Pluie perforante", power: 2.1 },
      "Rôdeur": { turns: 3, name: "Pas du prédateur", power: 1.65, dodge: 1 },
      "Héros": { turns: 4, name: "Éveil du protagoniste", power: 1.8, gauge: 10 },
      Soigneur: { turns: 4, name: "Sanctuaire vivant", power: 0.65, heal: 0.16 },
      Défenseur: { turns: 5, name: "Bastion absolu", power: 1.0, shield: 0.22 },
      Tueur: { turns: 3, name: "Sentence du géant", power: 2.8, execute: 1.2 },
      Artificier: { turns: 4, name: "Surcharge de l’atelier", power: 1.55, teamAtk: 0.10 },
      Druide: { turns: 4, name: "Floraison primordiale", power: 1.0, heal: 0.12 },
      Occultiste: { turns: 4, name: "Éclipse du voile", power: 1.9, curse: 1 },
    };
    OS.asteriaData.CLASS_ULTIMATE = CLASS_ULTIMATE;
    function resolveHeroUltimates() {
      if (!Array.isArray(battle.heroUltimates)) battle.heroUltimates = battle.units.map(() => 0);
      battle.units.forEach((unit, i) => {
        if (battle.hp[i] <= 0) return;
        const spec = CLASS_ULTIMATE[unit.cls] || CLASS_ULTIMATE.Héros;
        battle.heroUltimates[i] = (battle.heroUltimates[i] || 0) + 1;
        if (battle.heroUltimates[i] < spec.turns) return;
        battle.heroUltimates[i] = 0;
        if (spec.heal) {
          aliveIdx().forEach(j => { battle.hp[j] = Math.min(battle.units[j].hp, battle.hp[j] + Math.round(battle.units[j].hp * spec.heal)); });
          battle.log.unshift(unit.name + " déclenche " + spec.name + " : l’équipe récupère des PV.");
        }
        if (spec.shield) { battle.ultShield = Math.max(battle.ultShield || 0, spec.shield); battle.log.unshift(unit.name + " déclenche " + spec.name + " : bouclier d’équipe."); }
        if (spec.dodge) battle.ultDodge = Math.max(battle.ultDodge || 0, spec.dodge);
        if (spec.teamAtk) battle.ultAtk = Math.max(battle.ultAtk || 0, spec.teamAtk);
        if (spec.gauge) battle.gauge = Math.min(100, battle.gauge + spec.gauge);
        if (spec.curse) battle.curse = Math.min(4, (battle.curse || 0) + spec.curse);
        if (spec.power && battle.enemy.hp > 0) {
          let mult = spec.power;
          if (spec.execute && battle.enemy.hp / battle.enemy.maxHp < 0.35) mult *= spec.execute;
          const dmg = Math.round(unit.atk * mult * teamAtkMult() * (1 + (unitFx(unit).dmg || 0) / 100));
          hitEnemy(dmg, unit.name, spec.name, unit.cls === "Mage" || unit.cls === "Occultiste" ? "arcane" : unit.cls === "Druide" ? "nature" : unit.cls === "Berserker" ? "feu" : null);
          OS.sfx.play("ult");
        }
      });
    }
    function resolveEnemyUltimate() {
      if (!battle || battle.enemy.hp <= 0) return;
      const targets = aliveIdx();
      if (!targets.length) return;
      const type = battle.enemy.type;
      const spec = ({
        Brute: ["Impact sismique", 1.1], Assassin: ["Exécution silencieuse", 1.2],
        Sorcier: ["Cataclysme", 0.45], Capitaine: ["Ordre de massacre", 0.9],
        Golem: ["Écrasement tellurique", 1.15], Oracle: ["Jugement des marées", 0.7],
        Muraille: ["Bélier du bastion", 0.95], Invocateur: ["Légion des ombres", 0.8],
        Fantassin: ["Frappe de cohorte", 0.85], Nécromant: ["Moisson des âmes", 0.9],
        Banshee: ["Cri de l’outre-tombe", 0.7], Sanguinaire: ["Festin rouge", 1.2],
        "Colosse de givre": ["Hiver éternel", 0.75], Duelliste: ["Lame du jugement", 1.1],
        Artilleur: ["Pluie de braises", 0.5], Alchimiste: ["Grand mélange", 0.65],
        Sentinelle: ["Prisme inviolable", 0.9], Prédateur: ["Chasse ultime", 1.2],
        Chronomancien: ["Arrêt du temps", 0.75]
      })[type] || ["Ravage", 0.9];
      battle.log.unshift("⚠ ULTIME ENNEMI — " + spec[0] + " !");
      if (["Sorcier", "Artilleur", "Chronomancien"].includes(type)) {
        targets.forEach(i => attackAlly(i, Math.round(battle.enemy.atk * spec[1])));
        if (type === "Chronomancien") battle.gauge = Math.max(0, battle.gauge - 20);
      } else {
        const target = targets.slice().sort((a,b) => battle.hp[a] / battle.units[a].hp - battle.hp[b] / battle.units[b].hp)[0];
        attackAlly(target, Math.round(battle.enemy.atk * spec[1]));
      }
      if (["Oracle", "Nécromant", "Alchimiste"].includes(type)) battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + Math.round(battle.enemy.maxHp * 0.08));
      OS.sfx.play("ult");
    }

    function enemyTurn() {
      const targets = aliveIdx();
      if (!targets.length) return endBattle(false);
      battle.turn = (battle.turn || 0) + 1;
      resolveHeroUltimates();
      if (battle.enemy.hp <= 0) return endBattle(true);
      if (!battle.staggered && battle.turn % 4 === 0) resolveEnemyUltimate();
      if (!aliveIdx().length) return endBattle(false);
      // Une rupture annule la riposte annoncée, mais n'efface pas les dégâts périodiques.
      if (battle.staggered) {
        battle.staggered = false;
        battle.log.unshift("⛓ " + battle.enemy.name + " perd son tour : rupture de posture !");
        if (battle.burn > 0 && battle.enemy.hp > 0) {
          const burnDmg = Math.round(battle.enemy.maxHp * 0.04 * battle.burn);
          battle.enemy.hp = Math.max(0, battle.enemy.hp - burnDmg);
          battle.log.unshift("Brûlure → " + burnDmg + " dégâts");
          if (battle.enemy.hp <= 0) return endBattle(true);
        }
        battle.guard = false;
        battle.intent = enemyIntent(battle.enemy.type);
        newHand();
        return;
      }
      const type = battle.enemy.type;
      let ti;
      switch (type) {
        case "Brute": {
          const tkBrute = targets.filter((i) => battle.units[i].cls === "Tueur");
          ti = tkBrute.length ? tkBrute[0] : targets.sort((a, b) => battle.hp[a] - battle.hp[b])[0];
          attackAlly(ti, Math.round(battle.enemy.atk * 1.2 * (0.85 + Math.random() * 0.25)));
          break;
        }
        case "Assassin":
          ti = targets.sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
          let raw = battle.enemy.atk * (0.8 + Math.random() * 0.3);
          if (Math.random() < 0.2) {
            raw *= 1.8;
            attackAlly(ti, Math.round(raw));
            battle.log.unshift("Assassinat critique !");
          } else {
            attackAlly(ti, Math.round(raw));
          }
          break;
        case "Sorcier":
          battle.log.unshift("Le Sorcier embrase toute l'équipe !");
          targets.forEach((i) => {
            attackAlly(i, Math.round(battle.enemy.atk * 0.6 * (0.9 + Math.random() * 0.25)));
          });
          break;
        case "Capitaine":
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * (0.8 + Math.random() * 0.4)));
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.04);
          battle.log.unshift("Le Capitaine joue de la corne : il frappe plus fort au tour suivant (+4 %)");
          break;
        case "Oracle": {
          const heal = Math.round(battle.enemy.maxHp * 0.04);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + heal);
          battle.log.unshift("L'Oracle prie : +" + heal + " PV régénérés");
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.85 * (0.8 + Math.random() * 0.4)));
          break;
        }
        case "Invocateur": {
          const tkInv = targets.filter((i) => battle.units[i].cls === "Tueur");
          ti = tkInv.length && Math.random() < 0.4 ? tkInv[0] : targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.75 * (0.8 + Math.random() * 0.4)));
          const restants = aliveIdx();
          if (restants.length) {
            const t2 = restants[Math.floor(Math.random() * restants.length)];
            attackAlly(t2, Math.round(battle.enemy.atk * 0.5 * (0.8 + Math.random() * 0.4)));
            battle.log.unshift("Rituel : une ombre invoquée frappe à son tour !");
          }
          break;
        }
        case "Fantassin": {
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.6 * (0.85 + Math.random() * 0.25)));
          const restantsD = aliveIdx();
          if (restantsD.length) attackAlly(restantsD[Math.floor(Math.random() * restantsD.length)], Math.round(battle.enemy.atk * 0.6 * (0.85 + Math.random() * 0.25)));
          battle.log.unshift("Rythme de fer : le Fantassin frappe deux fois !");
          break;
        }
        case "Nécromant": {
          const healN = Math.round(battle.enemy.maxHp * 0.03);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + healN);
          battle.log.unshift("Juste funeste : le Nécromant absorbe " + healN + " PV");
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.9 * (0.8 + Math.random() * 0.4)));
          break;
        }
        case "Banshee": {
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.88));
          battle.log.unshift("Hurlement : la Banshee draine 12 % de votre jauge d'Ultime !");
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.85 * (0.8 + Math.random() * 0.4)));
          break;
        }
        case "Sanguinaire": {
          const ts = targets.slice().sort((a, b) => (battle.hp[a] / battle.units[a].hp) - (battle.hp[b] / battle.units[b].hp));
          ti = ts[0];
          attackAlly(ti, Math.round(battle.enemy.atk * 1.35 * (0.85 + Math.random() * 0.25)));
          battle.log.unshift("Soif de sang : le Sanguinaire s'acharne sur les blessés !");
          break;
        }
        case "Colosse de givre": {
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * (0.8 + Math.random() * 0.25)));
          break;
        }
        case "Duelliste":
          ti = targets.slice().sort((a,b) => battle.units[b].atk - battle.units[a].atk)[0];
          attackAlly(ti, Math.round(battle.enemy.atk * 1.05));
          battle.enemy.critBoost = 1;
          battle.log.unshift("Danse des lames : le Duelliste prépare une frappe critique.");
          break;
        case "Artilleur":
          battle.log.unshift("Barrage incandescent : toute l’équipe est visée !");
          targets.forEach(i => attackAlly(i, Math.round(battle.enemy.atk * 0.48)));
          break;
        case "Alchimiste": {
          battle.poison = Math.min(3, (battle.poison || 0) + 1);
          const heal = Math.round(battle.enemy.maxHp * 0.025);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + heal);
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.75));
          battle.log.unshift("Transmutation : poison ×" + battle.poison + " · +" + heal + " PV.");
          break;
        }
        case "Sentinelle":
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.8));
          battle.enemy.guardTurns = 1;
          battle.log.unshift("Formation prismatique : la Sentinelle se protège.");
          break;
        case "Prédateur": {
          const injured = targets.slice().sort((a,b) => battle.hp[a] / battle.units[a].hp - battle.hp[b] / battle.units[b].hp);
          ti = injured[0];
          attackAlly(ti, Math.round(battle.enemy.atk * 1.25));
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.03);
          break;
        }
        case "Chronomancien":
          battle.gauge = Math.max(0, battle.gauge - 18);
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.82));
          battle.log.unshift("Distorsion temporelle : −18 % de jauge.");
          break;
        default: {
          const tk = targets.filter((i) => battle.units[i].cls === "Tueur");
          if (tk.length && Math.random() < 0.6) ti = tk[0];
          else ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.9 * (0.8 + Math.random() * 0.4)));
        }
      }
      if (battle.poison > 0 && battle.enemy.hp > 0) {
        aliveIdx().forEach(i => { const pd = Math.round(battle.units[i].hp * 0.025 * battle.poison); battle.hp[i] = Math.max(0, battle.hp[i] - pd); });
        battle.log.unshift("Poison alchimique : l’équipe subit des dégâts périodiques.");
      }
      if (battle.burn > 0 && battle.enemy.hp > 0) {
        const burnDmg = Math.round(battle.enemy.maxHp * 0.04 * battle.burn);
        battle.enemy.hp = Math.max(0, battle.enemy.hp - burnDmg);
        battle.log.unshift("Brûlure → " + burnDmg + " dégâts");
        if (battle.enemy.hp <= 0) return endBattle(true);
      }
      if (battle.enemy.hp > 0 && battle.elite) {
        if (battle.elite.id === "meute") {
          const remaining = aliveIdx();
          if (remaining.length) {
            const t2 = remaining[Math.floor(Math.random() * remaining.length)];
            attackAlly(t2, Math.round(battle.enemy.atk * 0.6 * (0.8 + Math.random() * 0.4)));
            battle.log.unshift("Chasse en meute : un second prédateur bondit !");
          }
        } else if (battle.elite.id === "massue") {
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.06);
          battle.log.unshift("Massue écrasante : +6 % d'ATK (cumul)");
        } else if (battle.elite.id === "oriflamme") {
          battle.log.unshift("L'oriflamme maudite opprime vos cartes…");
        } else if (battle.elite.id === "souffle") {
          battle.log.unshift("Souffle de cendres : l'équipe étouffe sous les braises !");
          aliveIdx().forEach((i) => {
            battle.hp[i] = Math.max(0, battle.hp[i] - Math.round(battle.units[i].hp * 0.03));
            if (battle.hp[i] === 0) battle.log.unshift(battle.units[i].name + " tombe K.O.");
          });
        } else if (battle.elite.id === "veil") {
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.88));
          battle.log.unshift("Voile d'ombre : votre jauge d'Ultime est drainée !");
        }
      }
      if (!aliveIdx().length) return endBattle(false);
      battle.ultShield = Math.max(0, (battle.ultShield || 0) - 1);
      if (battle.enemy.guardTurns) battle.enemy.guardTurns--;
      battle.guard = false;
      battle.intent = enemyIntent(battle.enemy.type);
      newHand();
    }

    function endBattle(win) {
      if (battle.mode === "train") {
        battle.over = true;
        battle.log.unshift(win ? "Adversaire vaincu ! Test réussi — aucun gain ni progression enregistrée." : "Votre héros est K.O. — test terminé, aucune perte ni progression enregistrée.");
        OS.sfx.play(win ? "victory" : "defeat");
        renderBattle();
        return;
      }
      if (win && battle.mode === "infini") return advanceFloor();
      if (win && battle.mode === "raid" && battle.raidPhase < 3) {
        raid.cleared = Math.max(raid.cleared || 0, battle.raidPhase);
        persistRaid();
        const ph = RAID_PHASES[battle.raidPhase];
        battle.raidPhase++;
        battle.enemy = { name: ph.name, type: ph.type, ...enemyStats(ph.type, ph.hp, ph.atk) };
        battle.elite = ph.elite;
        battle.hp = battle.units.map((u) => u.hp);
        battle.breakGauge = 0;
        battle.staggered = false;
        battle.guard = false;
        battle.intent = enemyIntent(ph.type);
        battle.gauge = Math.min(100, battle.gauge + 30);
        battle.curse = 0;
        battle.burn = 0;
        const wonPhases = battle.raidPhase - 1;
        gainLoot({ cristal: 1, ...classMatGains(1) });
        battle.log.unshift("Phase " + wonPhases + " franchie ! +1 Cristal de relique. L'équipe est restaurée.");
        battle.log.unshift("----- RAID · Phase " + battle.raidPhase + "/3 : " + ph.name + " -----");
        if (battle.elite) battle.log.unshift("[Élite] " + battle.elite.name + " : " + battle.elite.desc);
        newHand();
        renderBattle();
        return;
      }
      let reward;
      if (battle.mode === "infini") {
        // Récompense progressive : le gain suit la courbe de danger sans exploser.
        reward = Math.round(3 + battle.floor * 2 + Math.pow(battle.floor, 1.28));
        if (battle.floor > infiniteBest) {
          infiniteBest = battle.floor;
          OS.store.set(SAVE_PREFIX + "-infinite-best", infiniteBest);
          battle.log.unshift("Nouveau record d'étages : " + infiniteBest + " !");
        }
      } else if (battle.mode === "histoire") {
        reward = win ? battle.enemy.reward : 2;
        if (win && battle.storyBoss) {
          battle.freshWin = storyState.done <= battle.storyChapter;
          storyState.done = Math.max(storyState.done, battle.storyChapter + 1);
          storyState.bossBeaten = storyState.bossBeaten || {};
          const diffIdx = Math.max(0, Object.keys(STORY_DIFFS).indexOf(storyState.diff));
          const before = bannersUnlockedCount();
          storyState.bossBeaten[battle.storyChapter] = Math.max(storyState.bossBeaten[battle.storyChapter] || 0, diffIdx + 1);
          persistStory();
          const after = bannersUnlockedCount();
          if (after > before) {
            save.quartz += 25;
            persist();
            battle.log.unshift("✦ Bannière débloquée : " + BANNERS[after - 1].name + " (+25 ◆)");
            OS.notify("🏆", "#6b4f2a", "Salle des trophées", "Bannière débloquée : " + BANNERS[after - 1].name, 5000);
          }
          if (battle.storyChapter === STORY.length - 1 && !storyState.cleared.includes(storyState.diff)) {
            storyState.cleared.push(storyState.diff);
            persistStory();
            const nxt = DIFF_ORDER[DIFF_ORDER.indexOf(storyState.diff) + 1];
            if (nxt) battle.log.unshift("✨ Difficulté " + STORY_DIFFS[storyState.diff].label + " terminée — " + STORY_DIFFS[nxt].label + " déverrouillée !");
            else battle.log.unshift("✨ Histoire entièrement bouclée en Enfer+ : il n'y a rien au-dessus.");
          }
          if (battle.storyChapter === 11 && storyState.diff === "enferPlus" && !save.owned.graal) {
            save.owned.graal = 1;
            save.quartz += 50;
            persist();
            OS.sfx.play("ssr");
            OS.notify("✦", "#8c2f2f", "Le Graal", "Astrée, Héritière des braises (SS) vous rejoint !", 6000);
            battle.log.unshift("✦ Dragon des cendres vaincu en Enfer+ : Astrée, Héritière des braises (SS) rejoint votre collection ! (+50 ◆)");
          }
          const gains = { larme: diffIdx >= 4 ? 3 : diffIdx >= 2 ? 2 : 1 };
          if (diffIdx === 3) gains.couronne = 1;
          if (diffIdx >= 4) gains.couronne = 2;
          if (diffIdx >= 4) gains.elixir = storyState.diff === "enferPlus" ? 2 : 1;
          if (diffIdx >= 4 && storyState.diff === "enferPlus") gains.sceau = 2;
          gains.poussiere = 2 + Math.floor(diffIdx / 2);
          if (diffIdx >= 4) gains.cristal = storyState.diff === "enferPlus" ? 2 : 1;
          else if (diffIdx >= 2) gains.cristal = 1;
          Object.assign(gains, classMatGains(1 + Math.floor(diffIdx / 2)));
          battle.log.unshift("Butin : " + gainLoot(gains));
          battle.log.unshift("Boss vaincu ! Le récit continue (+" + reward + " ◆)");
          trackDaily("story");
        } else if (win) {
          const chapterTier = Math.floor((battle.storyChapter || 0) / 3);
          const gains = { larme: 1 + Math.floor(chapterTier / 2), poussiere: 1 + chapterTier };
          if (chapterTier >= 1) gains.eclat = 1;
          if (chapterTier >= 2) gains.cristal = 1;
          Object.assign(gains, classMatGains(1 + Math.floor(chapterTier / 2)));
          battle.log.unshift("Butin d'escarmouche : " + gainLoot(gains));
          battle.log.unshift("Escarmouche remportée ! Le chemin est dégagé.");
        }
      } else if (battle.mode === "raid") {
        reward = win ? 40 : 10;
        if (win) {
          raid.cleared = 3;
          persistRaid();
          battle.log.unshift("Raid terminé ! Le coffre hebdomadaire est réclamable dans les Quêtes.");
          if (!raid.clearedNotified) {
            raid.clearedNotified = true;
            persistRaid();
            OS.notify("⚔", "#3bd4c4", "Raid hebdomadaire", "3/3 phases ! Coffre réclamable dans Quêtes.", 5000);
          }
        } else {
          raid.cleared = Math.max(raid.cleared || 0, battle.raidPhase - 1);
          persistRaid();
          battle.log.unshift("Le Raid s'arrête ici… (" + Math.max(0, battle.raidPhase - 1) + "/3 phases) — reprenez avec un autre Élixir.");
        }
      } else {
        reward = win ? TIER[battle.tier].reward : 2;
        if (win) {
          const gains = { eclat: battle.tier === "facile" ? 1 : battle.tier === "normal" ? 2 : 3 };
          if (battle.tier === "normal" && Math.random() < 0.3) gains.eclat++;
          gains.poussiere = battle.tier === "facile" ? 1 : 2;
          if (battle.tier === "dur") { gains.couronne = 1; gains.elixir = 1; gains.cristal = 1; }
          Object.assign(gains, classMatGains(battle.tier === "facile" ? 1 : battle.tier === "normal" ? 2 : 3));
          battle.log.unshift("Butin : " + gainLoot(gains));
          trackDaily("wins");
        }
      }
      if (win && eventMult() > 1) {
        reward = Math.round(reward * eventMult());
        battle.log.unshift("💰 " + EVENTS.fortune.name + " : récompense doublée !");
      }
      OS.sfx.play(win ? "victory" : "defeat");
      save.quartz += reward;
      persist();
      battle.log.unshift(win ? "Victoire ! +" + reward + " ◆" : "Défaite… +" + reward + " ◆ (réconfort)");
      battle.over = true;
      renderBattle();
    }

    function advanceFloor() {
      const clearedFloor = battle.floor;
      const baseQuartz = Math.round(3 + clearedFloor * 2 + Math.pow(clearedFloor, 1.28));
      const quartzReward = Math.round(baseQuartz * eventMult());
      save.quartz += quartzReward;
      persist();
      if (clearedFloor > infiniteBest) {
        infiniteBest = clearedFloor;
        OS.store.set(SAVE_PREFIX + "-infinite-best", infiniteBest);
        battle.log.unshift("Nouveau record d'étages : " + infiniteBest + " !");
      }
      battle.log.unshift("Récompense de l'étage " + clearedFloor + " : +" + quartzReward + " ◆");
      battle.floor++;
      trackDaily("floor", battle.floor, "abs");
      const flGain = {
        coeur: 1 + Math.floor((battle.floor - 1) / 6),
        poussiere: 1 + Math.floor((battle.floor - 1) / 4),
        ...classMatGains(1 + Math.floor((battle.floor - 1) / 5)),
      };
      if (battle.floor % 5 === 0) {
        flGain.elixir = 1 + Math.floor(battle.floor / 20);
        flGain.cristal = 1 + Math.floor(battle.floor / 25);
      }
      battle.log.unshift("Butin : " + gainLoot(flGain));
      persist();
      const quartzPreview = Math.round(3 + battle.floor * 2 + Math.pow(battle.floor, 1.28));
      battle.log.unshift("--- Étage " + battle.floor + " franchi · prochaine victoire : +" + quartzPreview + " ◆ ---");
      battle.hp = battle.units.map((u, i) => Math.min(u.hp, battle.hp[i] + Math.round(u.hp * 0.25)));
      battle.gauge = Math.min(100, battle.gauge + 15);
      battle.curse = 0;
      battle.burn = 0;
      // Courbe infinie : PV et ATQ montent à chaque étage ; les paliers
      // renforcent davantage l'ATQ pour obliger à adapter la composition.
      const scale = Math.pow(1.18, battle.floor - 1);
      const attackScale = Math.pow(1.105, battle.floor - 1) * (1 + Math.floor((battle.floor - 1) / 5) * 0.06);
      const etype = Object.keys(ENEMY_TYPES)[Math.floor(Math.random() * Object.keys(ENEMY_TYPES).length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const golemMult = etype === "Golem" ? 1.15 : 1;
      battle.enemy = { name, type: etype, ...enemyStats(etype, TIER.infini.hp * scale, TIER.infini.atk * attackScale) };
      battle.log.unshift(battle.enemy.name + " [" + etype + "] arrive · " + ENEMY_TYPES[etype].desc);
      newHand();
      renderBattle();
    }

    function bar(label, cur, max, cls) {
      const wrap = document.createElement("div");
      wrap.className = "hp-row " + (cls || "");
      const pct = Math.round((cur / max) * 100);
      const inner = pct > 50 ? "high" : pct > 20 ? "mid" : "low";
      wrap.innerHTML =
        '<div class="hp-label">' + label + "</div>" +
        '<div class="hp-track"><div style="width:' + pct + '%" class="hp-fill ' + inner + '"></div></div>' +
        '<div class="hp-num">' + cur + "/" + max + "</div>";
      return wrap;
    }

    function battleView() {
      const view = document.createElement("div");
      view.className = "battle";
      if (battle.mode === "train") {
        const lab = document.createElement("div");
        lab.className = "team-hint";
        lab.textContent = "Duel réel · l'adversaire riposte après vos 3 actions. Victoire et K.O. possibles ; aucune récompense ni perte de progression.";
        view.appendChild(lab);
        const score = document.createElement("div");
        score.className = "training-score";
        score.innerHTML = "<strong>Dégâts cumulés</strong><span>" + (battle.trainingDamage || 0).toLocaleString("fr-FR") + " infligés · Ennemi : " + Math.max(0, battle.enemy.hp).toLocaleString("fr-FR") + " PV · Héros : " + Math.max(0, battle.hp[0]).toLocaleString("fr-FR") + " PV · " + battle.picks + "/3 actions</span>";
        view.appendChild(score);
      }

      if (battle.over) {
        const won = battle.enemy.hp <= 0;
        const done = document.createElement("div");
        done.className = "battle-result " + (won ? "win" : "lose");
        done.textContent = won ? "VICTOIRE" : "DÉFAITE";
        view.appendChild(done);
        if (battle.mode === "histoire") {
          const row = document.createElement("div");
          row.className = "battle-actions";
          if (won) {
            const cont = document.createElement("button");
            cont.className = "pull-btn story-next";
            cont.textContent = battle.storyBoss ? "Continuer l'histoire ▸" : "Poursuivre le niveau ▸";
            cont.addEventListener("click", onStoryContinue);
            row.appendChild(cont);
          } else {
            const retry = document.createElement("button");
            retry.className = "pull-btn tier-infini story-boss";
            retry.textContent = "⚔ Réessayer";
            retry.addEventListener("click", onStoryRetry);
            row.appendChild(retry);
            const quit = document.createElement("button");
            quit.className = "pull-btn";
            quit.textContent = "↩ Renoncer";
            quit.addEventListener("click", renderStory);
            row.appendChild(quit);
          }
          view.appendChild(row);
        }
        if (battle.mode === "raid") {
          const row = document.createElement("div");
          row.className = "battle-actions";
          const quit = document.createElement("button");
          quit.className = "pull-btn";
          quit.textContent = "↩ Quitter le raid";
          quit.addEventListener("click", () => { battle = null; renderQuests(); });
          row.appendChild(quit);
          view.appendChild(row);
        }
        if (battle.mode === "train") {
          const row = document.createElement("div");
          row.className = "battle-actions";
          const quit = document.createElement("button");
          quit.className = "pull-btn";
          quit.textContent = "♢ Retour à l'entraînement";
          quit.addEventListener("click", () => { battle = null; renderTraining(); });
          row.appendChild(quit);
          view.appendChild(row);
        }
      } else {
        if (battle.mode === "train") {
          const exit = document.createElement("button");
          exit.className = "pull-btn";
          exit.textContent = "↩ Quitter le test et revenir à l'entraînement";
          exit.addEventListener("click", () => { battle = null; renderTraining(); });
          const exitRow = document.createElement("div");
          exitRow.className = "battle-actions";
          exitRow.appendChild(exit);
          view.appendChild(exitRow);
        }
        const floorTag = battle.mode === "infini" ? " · Étage " + battle.floor
          : battle.mode === "histoire" ? " · " + (battle.storyBoss ? "Boss d'histoire" : "Escarmouche d'histoire") + " · " + battle.diffLabel
          : battle.mode === "raid" ? " · RAID · Phase " + battle.raidPhase + "/3"
          : "";
        view.insertBefore(battleSceneArt(), view.firstChild);
        const enemyPortraitBox = document.createElement("div");
        enemyPortraitBox.className = "battle-enemy-art";
        enemyPortraitBox.innerHTML = '<div class="enemy-portrait-frame">' + enemyPortrait(battle.enemy.type, battle.enemy.name) + '</div><div><strong>' + battle.enemy.name + '</strong><span>' + battle.enemy.type + '</span></div>';
        view.appendChild(enemyPortraitBox);
        view.appendChild(bar(battle.enemy.name + " · " + battle.enemy.type + floorTag, battle.enemy.hp, battle.enemy.maxHp, "enemy"));
        const breakMax = Math.max(1, Math.round(battle.enemy.maxHp * 0.28));
        const breakValue = Math.min(100, Math.round((battle.breakGauge || 0) / breakMax * 100));
        const breakWrap = document.createElement("div");
        breakWrap.className = "hp-row break-gauge";
        breakWrap.innerHTML = '<div class="hp-label">Rupture</div><div class="hp-track"><div class="hp-fill" style="width:' + breakValue + '%"></div></div><div class="hp-num">' + breakValue + '%</div>';
        view.appendChild(breakWrap);
        if (battle.staggered) {
          const broken = document.createElement("div");
          broken.className = "battle-break-alert";
          broken.textContent = "⛓ Ennemi déséquilibré — prochaine action interrompue";
          view.appendChild(broken);
        }
        const intent = battle.intent || enemyIntent(battle.enemy.type);
        const intentBox = document.createElement("div");
        intentBox.className = "battle-intent";
        intentBox.innerHTML = '<strong>⚠ Prochaine action : ' + intent[0] + '</strong><span>' + intent[1] + '</span>';
        view.appendChild(intentBox);
        const affinity = ENEMY_AFFINITY[battle.enemy.type] || "arcane";
        const affinityBox = document.createElement("div");
        affinityBox.className = "battle-affinity";
        affinityBox.textContent = ELEMENTS[affinity].icon + " Affinité ennemie : " + ELEMENTS[affinity].label + " · Faiblesse : " + (ELEMENTS[affinity].weak ? ELEMENTS[ELEMENTS[affinity].weak].label : "aucune");
        view.appendChild(affinityBox);
        const synergies = teamSynergies();
        if (synergies.length) {
          const synergyBox = document.createElement("div");
          synergyBox.className = "battle-synergy";
          synergyBox.innerHTML = "<strong>Synergie active</strong><span>" + synergies.map((x) => x.name + " · " + x.desc).join(" / ") + "</span>";
          view.appendChild(synergyBox);
        }

        const ultimateStatus = document.createElement("div");
        ultimateStatus.className = "team-hint ultimate-status";
        const charge = Array.isArray(battle.heroUltimates) ? battle.heroUltimates : battle.units.map(() => 0);
        ultimateStatus.textContent = "Ultimes de classe : " + battle.units.map((unit, i) => { const spec = CLASS_ULTIMATE[unit.cls] || CLASS_ULTIMATE.Héros; return unit.name + " " + Math.min(charge[i] || 0, spec.turns) + "/" + spec.turns; }).join(" · ") + " | Ultime ennemi : " + (4 - ((battle.turn || 0) % 4)) + " tour(s)";
        view.appendChild(ultimateStatus);

        const gwrap = document.createElement("div");
        gwrap.className = "hp-row gauge";
        gwrap.innerHTML =
          '<div class="hp-label">Ultime</div>' +
          '<div class="hp-track"><div style="width:' + battle.gauge + '%" class="hp-fill gauge-fill"></div></div>' +
          '<div class="hp-num">' + battle.gauge + "%</div>";
        view.appendChild(gwrap);

        battle.units.forEach((u, i) => {
          if (battle.hp[i] > 0) view.appendChild(bar(u.name, battle.hp[i], u.hp, "ally"));
          else {
            const ko = document.createElement("div");
            ko.className = "hp-row ko";
            ko.innerHTML = '<div class="hp-label">' + u.name + " — K.O.</div>";
            view.appendChild(ko);
          }
        });

        const hand = document.createElement("div");
        hand.className = "card-hand";
        battle.hand.forEach((card, i) => {
          const b = document.createElement("button");
          const c = CARD[card.type];
          b.className = "hand-card type-" + card.type;
          b.innerHTML = "<b>" + c.label + "</b><span>" + battle.units[card.idx].name + "</span>";
          b.addEventListener("click", () => playCard(i));
          hand.appendChild(b);
        });
        view.appendChild(hand);

        const actions = document.createElement("div");
        actions.className = "battle-actions";
        const ult = document.createElement("button");
        ult.className = "pull-btn ult" + (battle.gauge < 100 ? " disabled" : "");
        ult.textContent = "✦ Ultime (" + battle.gauge + "%)";
        ult.addEventListener("click", useUltimate);
        actions.appendChild(ult);
        const guard = document.createElement("button");
        guard.className = "pull-btn" + (battle.guard ? " disabled" : "");
        guard.textContent = battle.guard ? "🛡 Garde active" : "🛡 Garde d'équipe (1 action)";
        guard.disabled = battle.guard || battle.picks >= 3;
        guard.addEventListener("click", () => {
          if (!battle || battle.guard || battle.picks >= 3) return;
          battle.guard = true;
          battle.picks++;
          battle.log.unshift("🛡 L'équipe se met en garde : les dégâts reçus sont réduits de 35 % jusqu'à la fin du tour ennemi.");
          if (battle.picks >= 3) enemyTurn();
          renderBattle();
        });
        actions.appendChild(guard);
        view.appendChild(actions);
        if (battle.mode === "train") {
          const trow = document.createElement("div");
          trow.className = "battle-actions";
          const tquit = document.createElement("button");
          tquit.className = "pull-btn";
          tquit.textContent = "♢ Abandonner l'entraînement";
          tquit.addEventListener("click", () => { battle = null; renderTraining(); });
          trow.appendChild(tquit);
          view.appendChild(trow);
        }
      }

      const log = document.createElement("div");
      log.className = "battle-log";
      battle.log.slice(0, 8).forEach((line) => {
        const row = document.createElement("div");
        row.textContent = line;
        log.appendChild(row);
      });
      view.appendChild(log);
      return view;
    }

    /* ---------- Mode Histoire ---------- */

    const BLESSINGS = {
      fleches: "Lames affûtées (+10 % de dégâts en boss)",
      runes: "Runes allumées (+25 % d'Ultime au début des boss)",
      courage: "Vœu de courage (Ultime à 50 % au début des boss)",
      os: "Médaillon d'os (boss à −10 % de PV)",
      charge: "Charge frontale (+15 % de dégâts en boss)",
      nuit: "Tactique nocturne (Ultime à 50 % au début des boss)",
    };
    const BLESSING_FX = {
      fleches: { mult: 1.10 },
      charge: { mult: 1.15 },
      runes: { gauge: 25 },
      courage: { gauge: 50 },
      nuit: { gauge: 50 },
      os: { hpMult: 0.90 },
    };

    const STORY_DIFFS = {
      facile: { label: "Facile", hp: 0.55, atk: 0.60, rw: 0.5 },
      moyen: { label: "Moyen", hp: 1, atk: 1, rw: 1 },
      difficile: { label: "Difficile", hp: 1.6, atk: 1.45, rw: 1.5 },
      impossible: { label: "Impossible", hp: 2.3, atk: 1.9, rw: 2.5 },
      enfer: { label: "Enfer", hp: 3.2, atk: 2.4, rw: 4 },
      enferPlus: { label: "Enfer+", hp: 4.2, atk: 3, rw: 6, elite: true },
    };

    const BANNERS = [
      { name: "Bannière du Chemin", color: "#2f7a4f" },
      { name: "Bannière des Trois Volontaires", color: "#2f5f8f" },
      { name: "Bannière du Serment", color: "#a06a2c" },
      { name: "Bannière de la Caldeira", color: "#8c2f39" },
      { name: "Bannière du Dragon Rouge", color: "#d33b2f" },
      { name: "Bannière des Failles", color: "#7551b8" },
      { name: "Bannière de la Sève-Lune", color: "#398f6b" },
      { name: "Bannière du Dernier Sablier", color: "#3d627f" },
    ];
    const BOSS_IDX = [1, 3, 6, 9, 11, 18, 20, 22];

    function bannersUnlockedCount() {
      const beaten = storyState.bossBeaten || {};
      let n = 0;
      for (let t = 0; t < BANNERS.length; t++) {
        if (BOSS_IDX.every((i) => (beaten[i] || 0) >= Math.min(t + 1, Object.keys(STORY_DIFFS).length))) n = Math.min(t + 1, DIFFS.length);
      }
      return n;
    }

    function bannerSvg(color, dim) {
      return '<svg class="mini-banner" viewBox="0 0 40 56" preserveAspectRatio="xMidYMid meet">' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="' + color + '" opacity="' + (dim ? "0.28" : "1") + '"/>' +
        '<path d="M6 2 H34 V44 L20 34 L6 44 Z" fill="none" stroke="#0e1322"/>' +
        '<rect x="6" y="8" width="28" height="3" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.85") + '"/>' +
        '<circle cx="20" cy="20" r="5.5" fill="#e3b23c" opacity="' + (dim ? "0.15" : "0.9") + '"/>' +
        '</svg>';
    }

    const STORY = [
      /* --- Acte I --- */
      {
        act: "Acte I — La route du nord",
        title: "L'appel du village",
        scene: { sky: "dawn", ground: "village", sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 205 },
          { cls: "Berserker", color: "#c34a2f", x: 248, flip: true },
        ] },
        events: [
          { t: "Le village de Hautefeuille s'éveille sous une aube de lave. L'an dernier, le roi a rappelé ses chevaliers : plus personne ne protège la frontière du nord." },
          { s: "Orwen", t: "Les bêtes descendent des collines chaque nuit. Et quelque chose de plus grand brûle là-haut — le ciel sent le soufre jusqu'ici." },
          { s: "Dame Elise", t: "Alors nous irons nous-mêmes. Trois volontaires, une route, et pas un denier du roi." },
          { t: "Vous regardez vos compagnons : la force, l'arcane, la vitesse. La route du nord commence." },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "La patrouille des ombres",
        scene: { sky: "night", ground: "foret", stars: true, sunX: 250, actors: [
          { cls: "Berserker", color: "#c34a2f", x: 120 },
          { cls: "Archer", color: "#3ba75c", x: 160, flip: true },
        ] },
        events: [
          { t: "À la lisière du bois, les corbeaux se taisent d'un seul coup. Des ombres encerclent le chemin, lourdes de chaînes." },
          { s: "Orwen", t: "Ce ne sont pas des loups. Ces ombres portaient des chaînes — quelqu'un les envoie sur nous." },
          { boss: { name: "Meute d'ombre", type: "Brute", hp: 9000, atk: 1050, reward: 12, elite: { id: "meute", name: "Chasse en meute", desc: "un second prédateur frappe chaque tour" }, intro: "La meute se jette sur vous. Premier vrai combat." } },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "La croix des rôdeurs",
        scene: { sky: "forest", ground: "canopee2", sunX: 250, actors: [
          { cls: "Rôdeur", color: "#4f9eff", x: 160 },
          { cls: "Mage", color: "#3b6bd4", x: 205, flip: true },
        ] },
        events: [
          { t: "Au carrefour des chasseurs, une croix de flèches plantées dans un tronc marque la route sûre. Les rôdeurs d'autrefois y laissaient toujours un don." },
          { s: "Kaeren", t: "La forêt donne sa protection à qui laisse un don. Choisissons le nôtre." },
          { q: "Quel don laissez-vous au carrefour ?", opts: [
            { label: "Affûter les lames", blessing: "fleches" },
            { label: "Allumer les runes", blessing: "runes" },
          ] },
        ],
      },
      {
        act: "Acte I — La route du nord",
        title: "Le chef de guerre Gortak",
        scene: { sky: "dawn", ground: "foret", sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 120 },
          { cls: "Berserker", color: "#c34a2f", x: 160, flip: true },
        ] },
        events: [
          { s: "Dame Elise", t: "Voilà qui menait la meute. Un chef de guerre ceinturé de chaînes brisées, congédié des guerres du sud." },
          { s: "Gortak", t: "PETITS SEIGNEURS. VOTRE ROI VOUS A VENDUS. MOI, JE VOUS OFFRE LA GUERRE." },
          { s: "Orwen", t: "Il annonce ça comme un cadeau. Répondons-lui." },
          { boss: { name: "Gortak, chef de guerre", type: "Brute", hp: 14000, atk: 1350, reward: 18, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" }, intro: "Gortak lève sa masse de fer. Le sol en tremble." } },
        ],
      },
      /* --- Acte II --- */
      {
        act: "Acte II — La forêt des mille flèches",
        title: "La forêt qui parle",
        scene: { sky: "forest", ground: "canopee2", sunX: 250, actors: [
          { cls: "Mage", color: "#3b6bd4", x: 160 },
          { cls: "Archer", color: "#3ba75c", x: 205, flip: true },
        ] },
        events: [
          { t: "La forêt avale le bruit. Des milliers de flèches anciennes hérissent les troncs, plantées là par des rôdeurs oubliés." },
          { s: "Lia", t: "Chaque flèche pointe une direction sûre. Suivez les pointes, jamais les yeux." },
          { s: "Kaeren", t: "Les archers d'autrefois veillaient encore, il y a un mois. Maintenant, il n'y a plus que nous." },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le sanctuaire des murmures",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 160, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 170 },
          { cls: "Soigneur", color: "#e3b23c", x: 215, flip: true },
        ] },
        events: [
          { t: "Au sommet des marches, un sanctuaire qu'aucun cartographe n'a nommé. Dans la pierre, des runes murmurent dans une langue morte." },
          { s: "Morgane", t: "Les murmures disent : le dragon des cendres dort sous la montagne. Nos ancêtres l'ont scellé, et le sceau faiblit." },
          { s: "Morgane", t: "Le sanctuaire aide qui lui laisse une offrande. Dépêchez-vous : le sceau agonise." },
          { q: "Quelle offrande déposez-vous ?", opts: [
            { label: "Le médaillon d'os", blessing: "os" },
            { label: "Le vœu de courage", blessing: "courage" },
          ] },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le spectre des urnes",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 250, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 170 },
        ] },
        events: [
          { t: "Les urnes du sanctuaire se fissurent. Une voix froide monte de la poussière — une voix qui a oublié d'être humaine." },
          { s: "Séraphine", t: "Un gardien corrompu. Il a veillé ici pendant des siècles, et il ne supporte plus d'être réveillé." },
          { boss: { name: "Spectre des urnes", type: "Sorcier", hp: 24000, atk: 1800, reward: 25, elite: { id: "siphon", name: "Siphon d'âmes", desc: "se soigne de la moitié des dégâts infligés" }, intro: "Le spectre embrase le parvis de runes bleues." } },
        ],
      },
      {
        act: "Acte II — La forêt des mille flèches",
        title: "Le serment",
        scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 130 },
          { cls: "Archer", color: "#3ba75c", x: 175 },
          { cls: "Mage", color: "#6b4f9e", x: 220, flip: true },
        ] },
        events: [
          { s: "Séraphine", t: "Nous avons survécu au pire. Ce qui nous attend dort sous la montagne." },
          { s: "Sir Gauvin", t: "Alors gravez-le. Sur la pierre, sur les mains, partout où la peur pourra le lire." },
          { t: "Chacun grave trois mots sur le porche du sanctuaire : avancer, ou mourir en chemin." },
        ],
      },
      /* --- Acte III --- */
      {
        act: "Acte III — Le dragon des cendres",
        title: "L'escalier de lave",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, actors: [
          { cls: "Berserker", color: "#c34a2f", x: 140 },
          { cls: "Chevalier", color: "#e3b23c", x: 185, flip: true },
        ] },
        events: [
          { t: "Mille marches taillées dans la roche chaude. À chaque palier, l'air brûle un peu plus, et le murmure des runes s'éteint." },
          { s: "Draven", t: "Enfin quelque chose d'honnête. Ici, au moins, on verra l'ennemi venir." },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le chevalier de cendres",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, actors: [
          { cls: "Chevalier", color: "#c34a2f", x: 170 },
          { cls: "Chevalier", color: "#e3b23c", x: 215, flip: true },
        ] },
        events: [
          { s: "Sir Gauvin", t: "Un chevalier de nos couleurs, figé face à la montagne. Il contemple le dragon depuis cent ans." },
          { s: "Le chevalier de cendres", t: "NI L'ORAGE, NI LA LAVE, NI LE DRAGON. VOUS SEULS RESSEMBLEZ À UNE MENACE." },
          { boss: { name: "Chevalier de cendres", type: "Capitaine", hp: 30000, atk: 2050, reward: 30, elite: { id: "oriflamme", name: "Oriflamme maudite", desc: "votre Ultime se charge 20 % moins vite" }, intro: "Le chevalier lève son oriflamme brûlée : il gagnera en force à chaque tour." } },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le dragon des cendres",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, dragon: [176, 96], actors: [
          { cls: "Berserker", color: "#c34a2f", x: 110 },
          { cls: "Chevalier", color: "#e3b23c", x: 150 },
          { cls: "Mage", color: "#6b4f9e", x: 188, flip: true },
        ] },
        events: [
          { t: "Un ciel de braises. Aucun soleil n'éclaire ce versant : seule la caldeira rouge arrose la montagne d'une lumière fauve." },
          { s: "Le dragon des cendres", t: "PETITS RÔDEURS. VOUS AVEZ RALLUMÉ LES RUNES. VENEZ DONC JOUER." },
          { s: "Draven", t: "Enfin quelque chose à ma taille." },
          { q: "Comment entrez-vous dans la caldeira ?", opts: [
            { label: "Charger d'un coup", blessing: "charge" },
            { label: "Attendre la nuit", blessing: "nuit" },
          ] },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le vent du sud",
        scene: { sky: "ash", ground: "vulkan", sunX: 250, dragon: [176, 96], actors: [
          { cls: "Berserker", color: "#c34a2f", x: 110 },
          { cls: "Chevalier", color: "#e3b23c", x: 150 },
          { cls: "Mage", color: "#6b4f9e", x: 188, flip: true },
        ] },
        events: [
          { t: "Les ailes se déploient au-dessus du nuage de cendres. Chaque battement fait trembler le sol comme un tambour de guerre." },
          { boss: { name: "Dragon des cendres", type: "Brute", hp: 42000, atk: 2250, reward: 40, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" }, intro: "Le boss final. Toute la légende tient dans ce combat." } },
          { t: "Le dragon s'effondre en une pluie de braises. Sur l'horizon, pour la première fois depuis un an, le ciel se lève clair." },
          { s: "Dame Elise", t: "La route du nord est ouverte. Qu'on raconte que trois volontaires l'ont faite." },
          { t: "FIN — La légende du dragon des cendres, qu'un village nomme encore celle des Trois Volontaires." },
        ],
      },
      /* --- Acte IV --- */
      {
        act: "Acte IV — Les braises d'avant",
        title: "Le passant sans visage",
        scene: { sky: "night", ground: "foret", stars: true, sunX: 60, actors: [
          { cls: "Archer", color: "#3ba75c", x: 120 },
          { cls: "Chevalier", color: "#e3b23c", x: 160, flip: true },
        ] },
        events: [
          { t: "Le village chante ce soir. Mais sur la route du sud, un passant sans visage demande à chacun les mêmes mots : « Souviens-tu du premier serment ? »" },
          { s: "Orwen", t: "Il ne marche pas, il glisse. Et là où il est passé, même les braises du feu de camp restent grises." },
          { s: "Dame Elise", t: "Il efface ce qu'il touche. Alors parlons-lui de la forge et des bannières : on ne peut pas tout effacer d'un coup." },
          { boss: { name: "Nomade sans visage", type: "Banshee", hp: 46000, atk: 2350, reward: 42, elite: { id: "veil", name: "Voile d'ombre", desc: "draine 12 % de votre jauge d'Ultime à chaque tour" }, intro: "Le visage vide fixe votre serment. Il veut le rendre gris." } },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "Les cendres qui prient",
        scene: { sky: "ash", ground: "sanctuaire", sunX: 250, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 120 },
          { cls: "Soigneur", color: "#3bd4a0", x: 160, flip: true },
        ] },
        events: [
          { t: "Au sanctuaire du cratère, de vieilles robes veillent dans l'encens. Elles réclament le retour de leur « crépuscule doré » — le brasier d'avant la guerre." },
          { s: "Kaeren", t: "Leur juste est noirci : elles prient les cendres elles-mêmes. Elles ne veulent pas de la paix, elles veulent un dieu mort." },
          { boss: { name: "Prêtre des braises", type: "Nécromant", hp: 50000, atk: 2500, reward: 45, intro: "Le juste funeste buvra vos forces. Frappez sans relâche." } },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "Le golem du serment",
        scene: { sky: "forest", ground: "canopee3", sunX: 250, actors: [
          { cls: "Défenseur", color: "#9fb0c8", x: 120 },
          { cls: "Berserker", color: "#c34a2f", x: 160, flip: true },
        ] },
        events: [
          { t: "Les pierres du vieux pont se soulèvent une à une et s'assemblent en une silhouette colossale. Un golem dressé par un serment que personne n'a jamais levé." },
          { s: "Gortak", t: "CE GARDIEN A SERMENTÉ AVANT VOUS, ET SES MAÎTRES SONT MORTS. FRAPPEZ : LIBÉREZ-LE DE SA TÂCHE !" },
          { q: "Comment aider ce vieux gardien à se libérer ?", opts: [
            { label: "Rallumer les runes des originels", blessing: "runes" },
            { label: "Le relever à mains nues, face à lui", blessing: "courage" },
          ] },
          { boss: { name: "Golem du serment", type: "Golem", hp: 54000, atk: 2600, reward: 48, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" }, intro: "Le golem baisse sa garde pour vous écouter : il en profite pour frapper." } },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "La triade de fer",
        scene: { sky: "dawn", ground: "village", sunX: 250, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 120 },
          { cls: "Rôdeur", color: "#4f9eff", x: 160, flip: true },
        ] },
        events: [
          { t: "Trois fantassins d'élite, alignés d'un seul pas, se présentent comme la garde morte des serments anciens. Les villages les racontent comme des fables." },
          { s: "Dame Elise", t: "Trois d'un coup, qui portent des armes que je reconnais — celles de notre armurerie du serment." },
          { s: "Orwen", t: "Ils frappent ensemble. Une seule seconde d'écart, et leur formation de fer ne suffit plus." },
          { boss: { name: "La triade de fer", type: "Fantassin", hp: 58000, atk: 2700, reward: 50, elite: { id: "meute", name: "Chasse en meute", desc: "un second prédateur frappe chaque tour" }, intro: "Trois fantassins qui frappent en même temps. Attention au second coup." } },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "Le sanguinaire des cratères",
        scene: { sky: "ash", ground: "vulkan", sunX: 60, actors: [
          { cls: "Berserker", color: "#c34a2f", x: 120 },
          { cls: "Archer", color: "#3ba75c", x: 160, flip: true },
        ] },
        events: [
          { t: "Au fond du dernier cratère, dans la poussière sèche, attend ce que les villages nomment le Sanguinaire : une hache de braise qui traque les blessés." },
          { s: "Kaeren", t: "Il suit les blessures, il sait les trouver. Alors soignez-vous entre deux coups, ou tenez debout jusqu'au bout." },
          { boss: { name: "Sanguinaire des cratères", type: "Sanguinaire", hp: 62000, atk: 2850, reward: 52, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" }, intro: "L'ordre de braise chasse les blessés. Restez debout." } },
        ],
      },
      /* --- Epilogue --- */
      {
        act: "Epilogue — Les origines",
        title: "Les trois qui restaient debout",
        scene: { sky: "dawn", ground: "sanctuaire", sunX: 160, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 120 },
          { cls: "Mage", color: "#6b4f9e", x: 160, flip: true },
        ] },
        events: [
          { t: "Sous le cratère refroidi, vos lanternes trouvent un sanctuaire que personne n'avait vu depuis un siècle. Trois statues veillent sur une muraille de serments." },
          { t: "Sur le socle, une inscription : « Trois restèrent debout : la lame, la rune et l'ordre. Ils forgèrent les premières reliques et portèrent les premières bannières. »" },
          { s: "Dame Elise", t: "La lame, la rune et l'ordre. C'est nous. C'était eux avant nous — et avant eux, d'autres. Il y a toujours eu des volontaires." },
          { t: "La plus vieille statue se penche vers vous, et le sanctuaire raconte : bien avant les rois défaillants, un premier dragon descendit du nord, et trois volontaires restèrent debout pour lui tenir tête." },
          { t: "Leur serment fut le premier. La Lame du Raid, l'Étendard des trois phases, les runes et l'orbe : tout ce que la Forge répare aujourd'hui a été forgé par leur main, transmis de génération en génération." },
          { t: "Le souffle du sanctuaire se soulève d'un coup : du fond de la dalle, l'écho du premier dragon se lève comme un défi jeté au temps." },
          { boss: { name: "Écho du premier dragon", type: "Sorcier", hp: 66000, atk: 3000, reward: 55, intro: "Le souvenir brûle plus fort que la cendre. Regardez-le endurer, puis tomber." } },
          { t: "L'écho retombe en poussière tiède. Sur la muraille, une dernière ligne s'allume : « Trois restèrent debout, et le monde se souvint. »" },
          { t: "FIN DE L'EPILOGUE — Astéria commence toujours par trois volontaires : ceux qui restent debout. La suite, c'est vous qui la perpétuez." },
        ],
      },
    ];

    STORY.push(
      { act: "Acte V — Les royaumes fracturés", title: "La forge des étoiles", scene: { sky: "dawn", ground: "ruines", sunX: 210, actors: [{ cls: "Artificier", color: "#d7a85a", x: 120 }, { cls: "Mage", color: "#6b4f9e", x: 165, flip: true }] }, events: [
        { t: "Au-delà du sanctuaire, les anciennes routes se brisent en fragments suspendus. Une forge céleste pulse au rythme d’un cœur mécanique." },
        { s: "Elyndra", t: "Cette forge ne fabrique pas des armes. Elle répare les serments que le temps a déchirés." },
        { fight: { name: "Sentinelle prismatique", type: "Sentinelle", hp: 69000, atk: 2550, reward: 62, intro: "La forge teste votre maîtrise des nouveaux rôles." } },
        { s: "Toren", t: "Les runes répondent ! Mais quelqu’un a détourné le noyau pour ouvrir une faille." },
        { boss: { name: "L’Architecte des failles", type: "Chronomancien", hp: 82000, atk: 2900, reward: 72, intro: "Il plie les secondes pour empêcher votre prochain mouvement." } },
        { t: "La forge se rallume. Une nouvelle bannière apparaît dans le ciel, marquant le début d’une guerre plus ancienne que les royaumes." }
      ]},
      { act: "Acte V — Les royaumes fracturés", title: "La forêt qui se souvient", scene: { sky: "forest", ground: "canopee3", sunX: 80, actors: [{ cls: "Druide", color: "#3bd4a0", x: 120 }, { cls: "Archer", color: "#3ba75c", x: 165, flip: true }] }, events: [
        { t: "La forêt de Lune-Racine s’étend sous une voûte de feuilles argentées. Chaque arbre porte un souvenir qui n’appartient à personne." },
        { s: "Maélis", t: "La forêt ne vous attaque pas. Elle vous montre ce que vous avez oublié. Écoutez avant de frapper." },
        { fight: { name: "Prédateur nocturne", type: "Prédateur", hp: 73500, atk: 2700, reward: 66 } },
        { s: "Sylwen", t: "La sève est empoisonnée. Quelqu’un a planté une graine de néant au cœur des racines." },
        { boss: { name: "Reine des épines", type: "Alchimiste", hp: 90000, atk: 3050, reward: 78, elite: { id: "siphon", name: "Sève vorace", desc: "absorbe une partie des dégâts infligés" } } },
        { t: "La graine se dissout. La forêt rend les souvenirs volés et ouvre un passage vers les royaumes fracturés." }
      ]},
      { act: "Acte VI — Le voile des ombres", title: "Les cloches sans écho", scene: { sky: "night", ground: "sanctuaire", stars: true, sunX: 240, actors: [{ cls: "Occultiste", color: "#7d5bb5", x: 120 }, { cls: "Chevalier", color: "#e3b23c", x: 165, flip: true }] }, events: [
        { t: "Dans la cité engloutie, les cloches sonnent sans produire de son. Les habitants marchent comme s’ils attendaient une seconde qui ne vient jamais." },
        { s: "Vhal", t: "Le voile n’est pas une porte. C’est une dette. Chaque pouvoir emprunté réclame quelque chose en retour." },
        { fight: { name: "Alchimiste du néant", type: "Alchimiste", hp: 79000, atk: 2850, reward: 70 } },
        { s: "Nyxar", t: "Le maître du voile se nourrit des noms effacés. Ne lui donnez pas le vôtre." },
        { boss: { name: "Le Collecteur de noms", type: "Nécromant", hp: 98000, atk: 3250, reward: 86, elite: { id: "veil", name: "Dette des ombres", desc: "draine une partie de la jauge à chaque tour" } } },
        { t: "Les cloches retrouvent leur voix. Au loin, le sablier du monde se fissure une nouvelle fois." }
      ]},
      { act: "Acte VI — Le voile des ombres", title: "La marche des armées", scene: { sky: "ash", ground: "vulkan", sunX: 60, actors: [{ cls: "Défenseur", color: "#9fb0c8", x: 120 }, { cls: "Berserker", color: "#c34a2f", x: 165, flip: true }] }, events: [
        { t: "Trois armées avancent vers la faille. Les bannières se mélangent dans la fumée, mais les ordres viennent d’une seule voix." },
        { s: "Aldric", t: "Nous ne gagnerons pas en frappant plus fort. Il faut tenir la ligne et laisser les soigneurs respirer." },
        { fight: { name: "Canonnière cendrée", type: "Artilleur", hp: 85000, atk: 3000, reward: 75 } },
        { s: "Bastien", t: "La ligne tient. Pour combien de temps ? Le commandant approche." },
        { boss: { name: "Maréchal des trois armées", type: "Capitaine", hp: 108000, atk: 3450, reward: 94 } },
        { t: "Les armées déposent leurs armes. Une carte ancienne révèle le chemin vers l’horloge du monde." }
      ]},
      { act: "Acte VII — L’horloge du monde", title: "Les secondes volées", scene: { sky: "night", ground: "ruines", stars: true, sunX: 220, actors: [{ cls: "Mage", color: "#6b4f9e", x: 120 }, { cls: "Artificier", color: "#d7a85a", x: 165, flip: true }] }, events: [
        { t: "Au sommet de l’horloge, les aiguilles tournent dans des directions opposées. Chaque seconde arrachée au monde devient une créature." },
        { s: "Elyndra", t: "Le mécanisme peut nous rendre le temps perdu, mais il faut briser ses six verrous." },
        { fight: { name: "Duelliste des failles", type: "Duelliste", hp: 93000, atk: 3250, reward: 82 } },
        { s: "Nyxar", t: "Je reconnais cette magie. Le Chronarque ne veut pas régner : il veut empêcher toute fin." },
        { boss: { name: "Chronarque", type: "Chronomancien", hp: 118000, atk: 3650, reward: 105, elite: { id: "oriflamme", name: "Seconde captive", desc: "ralentit la recharge de l’Ultime" } } },
        { t: "L’horloge s’arrête. Le silence qui suit ressemble enfin à la paix." }
      ]},
      { act: "Acte VII — L’horloge du monde", title: "Le dernier engrenage", scene: { sky: "dawn", ground: "sanctuaire", sunX: 190, actors: [{ cls: "Druide", color: "#3bd4a0", x: 120 }, { cls: "Occultiste", color: "#7d5bb5", x: 165, flip: true }] }, events: [
        { t: "Une dernière roue tourne sous le sanctuaire. Elle porte les noms de tous ceux qui ont combattu depuis le premier serment." },
        { s: "Maélis", t: "Le temps ne nous appartient pas. Mais nos choix, eux, peuvent rester." },
        { fight: { name: "Garde astral", type: "Sentinelle", hp: 101000, atk: 3450, reward: 90 } },
        { s: "Astrée", t: "Je sens les braises répondre. Ce pouvoir n’est pas fait pour durer éternellement : il doit passer à quelqu’un d’autre." },
        { boss: { name: "Le Premier Témoin", type: "Prédateur", hp: 128000, atk: 3850, reward: 118 } },
        { t: "Le dernier engrenage se fige. Les royaumes ne sont plus séparés : ils partagent désormais une même histoire." }
      ]},
      { act: "Epilogue II — Un monde relié", title: "Une bannière pour demain", scene: { sky: "dawn", ground: "village", sunX: 130, actors: [{ cls: "Chevalier", color: "#e3b23c", x: 120 }, { cls: "Mage", color: "#6b4f9e", x: 165, flip: true }] }, events: [
        { t: "Des années ont passé. Les routes sont ouvertes, les écoles de combat accueillent de nouveaux visages et les reliques ne sont plus réservées aux rois." },
        { s: "Dame Elise", t: "Nous avons commencé à trois. Regardez-les : ils sont des centaines à porter le serment." },
        { fight: { name: "Épreuve des volontaires", type: "Fantassin", hp: 112000, atk: 3600, reward: 98 } },
        { s: "Astrée", t: "Une bannière n’est pas un morceau de tissu. C’est la promesse de ne pas laisser quelqu’un seul face aux ténèbres." },
        { boss: { name: "L’Écho de demain", type: "Sorcier", hp: 140000, atk: 4050, reward: 130 } },
        { t: "FIN — Les braises ne s’éteignent pas tant que quelqu’un choisit de les transmettre. Une nouvelle aventure commence." }
      ]}
    );

    // Chaque chapitre devient un véritable niveau : une escarmouche jouable
    // est insérée dans le parcours, avant le boss lorsqu'il y en a un.
    OS.asteriaData.STORY = STORY;
    const STORY_SKIRMISH_TYPES = ["Brute", "Assassin", "Sorcier", "Capitaine", "Fantassin", "Nécromant", "Banshee", "Golem", "Oracle", "Duelliste", "Artilleur", "Alchimiste"];
    STORY.forEach((chapter, index) => {
      if (chapter.events.some((event) => event.fight)) return;
      const bossIndex = chapter.events.findIndex((event) => event.boss);
      const insertAt = bossIndex >= 0 ? Math.max(1, bossIndex - 1) : Math.max(1, Math.min(2, chapter.events.length - 1));
      const type = STORY_SKIRMISH_TYPES[index % STORY_SKIRMISH_TYPES.length];
      chapter.events.splice(insertAt, 0, {
        fight: {
          name: ["Éclaireur des ombres", "Garde renégat", "Traqueur des runes", "Sentinelle corrompue"][index % 4] + " · " + (index + 1),
          type,
          hp: 3000 + index * 650,
          atk: 420 + index * 35,
          reward: 5 + index * 2,
          intro: "La route est barrée. Une escarmouche vous attend avant de poursuivre."
        }
      });
    });

    let storyScene = null;
    let typeTimer = null;

    function clearTyping() {
      if (typeTimer) { clearInterval(typeTimer); typeTimer = null; }
    }

    function storyBackBtn() {
      const b = document.createElement("button");
      b.className = "story-back";
      b.textContent = "↩ Tous les chapitres";
      b.addEventListener("click", () => { OS.sfx.play("page"); renderStory(); });
      return b;
    }

    function storyMusicToggle() {
      const b = document.createElement("button");
      b.className = "music-toggle";
      b.textContent = "♪ Musique : " + (storyState.music ? "ON" : "OFF");
      b.addEventListener("click", () => {
        storyState.music = !storyState.music;
        persistStory();
        OS.sfx.setMusic(storyState.music);
        renderStory();
      });
      return b;
    }

    function storyChapterList() {
      const acts = [];
      STORY.forEach((ch, i) => {
        if (!acts.length || acts[acts.length - 1].name !== ch.act) acts.push({ name: ch.act, heads: [], first: i });
      });
      const wrap = document.createElement("div");
      acts.forEach((act) => {
        const head = document.createElement("div");
        head.className = "story-act";
        head.textContent = act.name;
        wrap.appendChild(head);
        const list = document.createElement("div");
        list.className = "story-list";
        STORY.forEach((ch, i) => {
          if (ch.act !== act.name) return;
          const c = document.createElement("button");
          const locked = i > storyState.done;
          const done = i < storyState.done;
          c.className = "story-chapter" + (locked ? " locked" : "") + (done ? " done" : "");
          const regionArt = ["foret", "volcan", "ruines"][i % 3];
          c.innerHTML = '<span class="story-chapter-art"><img loading="lazy" alt="" src="assets/asteria/scenes/' + regionArt + '.svg"></span><span class="story-chapter-copy"><b>' + (i + 1) + ". " + ch.title + '</b><small>' + (done ? "✓ terminé" : locked ? "verrouillé" : "▶ jouer") + "</small></span>";
          if (!locked) c.addEventListener("click", () => { OS.sfx.play("page"); openScene(i); });
          list.appendChild(c);
        });
        wrap.appendChild(list);
      });
      return wrap;
    }

    function renderStory() {
      OS.sfx.setTheme("story");
      clearTyping();
      // Une victoire/défaite d'histoire est terminée : sortir du combat avant
      // de revenir à la carte évite de conserver une équipe de combat obsolète.
      if (battle && battle.mode === "histoire" && battle.over) battle = null;
      setActiveTab(tabStory);
      content.innerHTML = "";
      content.appendChild(quartzBar());
      if (storyState.music) OS.sfx.setMusic(true);

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Mode Histoire — " + STORY.length + " chapitres jouables : dialogues, escarmouches, boss et progression."
      content.appendChild(hint);

      const shelf = document.createElement("div");
      shelf.className = "story-banners";
      BANNERS.forEach((bn, t) => {
        const slot = document.createElement("div");
        const unlocked = bannersUnlockedCount() > t;
        slot.className = "banner-slot" + (unlocked ? " unlocked" : " locked");
        slot.innerHTML = bannerSvg(bn.color, !unlocked) + "<span>" + (unlocked ? bn.name : "Bannière scellée") + "</span>";
        shelf.appendChild(slot);
      });
      content.appendChild(shelf);

      const diffTitle = document.createElement("div");
      diffTitle.className = "team-hint";
      diffTitle.textContent = "Difficulté des boss d'histoire :";
      content.appendChild(diffTitle);
      const diffRow = document.createElement("div");
      diffRow.className = "pull-row diff-row";
      Object.keys(STORY_DIFFS).forEach((key) => {
        const d = STORY_DIFFS[key];
        const b = document.createElement("button");
        const locked = !diffUnlockedSt(storyState, key);
        b.className = "pull-btn tier-" + key + (storyState.diff === key ? " active-diff" : "") + (locked ? " locked" : "");
        b.innerHTML = locked
          ? d.label + "<br><small>🔒 toute l'histoire d'abord en " + STORY_DIFFS[key === "enferPlus" ? "enfer" : key].label.toLowerCase() + "</small>"
          : d.label + "<br><small>boss ×" + String(d.hp).replace(".", ",") + " · ◆ ×" + String(d.rw).replace(".", ",") + "</small>";
        if (!locked) b.addEventListener("click", () => {
          storyState.diff = key;
          persistStory();
          document.dispatchEvent(new Event("asteria-diff"));
          OS.sfx.play("ui");
          renderStory();
        });
        diffRow.appendChild(b);
      });
      content.appendChild(diffRow);

      if (storyState.blessing) {
        const bl = document.createElement("div");
        bl.className = "story-blessing";
        bl.textContent = "✧ Bénédiction : " + BLESSINGS[storyState.blessing];
        content.appendChild(bl);
      }

      content.appendChild(storyMusicToggle());
      content.appendChild(storyChapterList());
    }

    function openScene(i, step) {
      storyScene = { idx: i, step: step || 0 };
      renderScene();
    }

    function typeCurrentLine(el, text) {
      const storyRaw = OS.store.get("story-speed", null);
      const raw = storyRaw === null || storyRaw === "instant" ? OS.store.get("game-speed", 1) : storyRaw;
      if (storyRaw === "instant") {
        el.textContent = text;
        return;
      }
      const speed = Math.max(0.5, Number(raw) || 1);
      let pos = Math.min(2, text.length);
      el.textContent = text.slice(0, pos);
      typeTimer = setInterval(() => {
        pos += 2;
        el.textContent = text.slice(0, pos);
        if (pos % 8 === 0) OS.sfx.play("type");
        if (pos >= text.length) {
          el.textContent = text;
          clearTyping();
        }
      }, Math.max(8, Math.round(30 / speed)));
    }

    function renderScene() {
      OS.sfx.setTheme("story");
      clearTyping();
      setActiveTab(tabStory);
      if (!storyScene || !STORY[storyScene.idx] || !STORY[storyScene.idx].events[storyScene.step]) {
        renderStory();
        return;
      }
      const ch = STORY[storyScene.idx];
      const ev = ch.events[storyScene.step];
      content.innerHTML = "";
      content.appendChild(quartzBar());
      content.appendChild(storyBackBtn());

      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(sceneWithTeam(ch.scene));
      content.appendChild(art);
      const actorStrip = document.createElement("div");
      actorStrip.className = "story-actor-strip";
      const cast = [];
      ch.events.forEach((event) => {
        if (event.s && !cast.some((entry) => entry.name === event.s)) cast.push({ name: event.s, boss: false });
        if (event.boss && !cast.some((entry) => entry.name === event.boss.name)) cast.push({ name: event.boss.name, boss: true, type: event.boss.type });
        if (event.fight && !cast.some((entry) => entry.name === event.fight.name)) cast.push({ name: event.fight.name, boss: true, type: event.fight.type });
      });
      cast.forEach((actor) => {
        const actorCard = document.createElement("div");
        actorCard.className = "story-actor";
        const known = UNITS.find((u) => u.name === actor.name);
        const bossEvent = ch.events.find((event) => (event.boss || event.fight) && ((event.boss || event.fight).name === actor.name || actor.name.toLowerCase().includes((event.boss || event.fight).name.toLowerCase()) || (event.boss || event.fight).name.toLowerCase().startsWith(actor.name.toLowerCase())));
        const isEnemy = actor.boss || !!bossEvent || actor.name === "Gortak";
        const portrait = isEnemy
          ? enemyPortraitMarkup(actor.type || (bossEvent && bossEvent.boss.type) || "Brute", actor.name)
          : heroPortraitMarkup(known ? known.id : "story-" + artSlug(actor.name));
        actorCard.innerHTML = portrait + '<span>' + portraitEscape(actor.name) + '</span>';
        actorStrip.appendChild(actorCard);
      });
      if (actorStrip.childElementCount) content.appendChild(actorStrip);

      const title = document.createElement("div");
      title.className = "story-title";
      title.textContent = (storyScene.idx + 1) + ". " + ch.title;
      content.appendChild(title);

      if (ev.q) {
        const text = document.createElement("div");
        text.className = "story-text";
        const line = document.createElement("div");
        line.className = "story-line current";
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.q);

        const box = document.createElement("div");
        box.className = "story-choices";
        ev.opts.forEach((o) => {
          const opt = document.createElement("button");
          opt.className = "story-choice";
          opt.innerHTML = "<b>" + o.label + "</b><small>" + BLESSINGS[o.blessing] + "</small>";
          opt.addEventListener("click", () => {
            storyState.blessing = o.blessing;
            persistStory();
            OS.sfx.play("unlock");
            advanceScene();
          });
          box.appendChild(opt);
        });
        content.appendChild(box);
      } else if (ev.boss || ev.fight) {
        const encounter = ev.boss || ev.fight;
        const isBoss = !!ev.boss;
        const text = document.createElement("div");
        text.className = "story-text";
        const line = document.createElement("div");
        line.className = "story-line current";
        text.appendChild(line);
        content.appendChild(text);
        const bossPortrait = document.createElement("div");
        bossPortrait.className = "story-boss-portrait";
        bossPortrait.innerHTML = enemyPortraitMarkup(encounter.type, encounter.name) + '<span>' + encounter.name + " · " + encounter.type + '</span>';
        content.appendChild(bossPortrait);
        typeCurrentLine(line, encounter.intro);

        const boss = document.createElement("button");
        boss.className = "pull-btn tier-infini story-boss";
        boss.textContent = isBoss ? "⚔ Affronter le boss : " + encounter.name : "⚔ Combattre : " + encounter.name;
        boss.addEventListener("click", () => startStoryBattle(encounter, isBoss));
        content.appendChild(boss);
      } else {
        const text = document.createElement("div");
        text.className = "story-text";
        if (ev.s) {
          const speaker = document.createElement("div");
          speaker.className = "story-speaker-card";
          const known = UNITS.find((u) => u.name === ev.s);
          const bossEvent = ch.events.find((event) => event.boss && (event.boss.name === ev.s || ev.s.toLowerCase().includes(event.boss.name.toLowerCase()) || event.boss.name.toLowerCase().startsWith(ev.s.toLowerCase())));
          const speakerPortrait = bossEvent || ev.s === "Gortak"
            ? enemyPortraitMarkup((bossEvent && bossEvent.boss.type) || "Brute", ev.s)
            : heroPortraitMarkup(known ? known.id : "story-" + artSlug(ev.s));
          speaker.innerHTML = speakerPortrait + '<span>' + portraitEscape(ev.s) + '</span>';
          text.appendChild(speaker);
        }
        const line = document.createElement("div");
        line.className = "story-line current" + (ev.s ? "" : " narration");
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.t);

        const next = document.createElement("button");
        next.className = "pull-btn story-next";
        next.textContent = "Suivant ▸";
        next.addEventListener("click", advanceScene);
        content.appendChild(next);
      }
    }

    function advanceScene() {
      const ch = STORY[storyScene.idx];
      if (storyScene.step < ch.events.length - 1) {
        storyScene.step++;
        OS.sfx.play("page");
        renderScene();
      } else {
        const gained = completeChapter(storyScene.idx);
        renderDoneChapter(storyScene.idx, gained > 0 ? "+8 ◆ gagnés" : "déjà lu");
      }
    }

    function completeChapter(i) {
      if (storyState.done <= i) {
        storyState.done = i + 1;
        persistStory();
        save.quartz += 8;
        persist();
        OS.sfx.play("unlock");
        return 8;
      }
      return 0;
    }

    function renderDoneChapter(i, subtitle) {
      OS.sfx.setTheme("story");
      clearTyping();
      setActiveTab(tabStory);
      const ch = STORY[i];
      if (!ch) { renderStory(); return; }
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(sceneWithTeam(ch.scene));
      content.appendChild(art);

      const done = document.createElement("div");
      done.className = "battle-result win";
      done.textContent = i === STORY.length - 1 ? "✓ FIN DE L'HISTOIRE — " + subtitle : "✓ CHAPITRE TERMINÉ — " + subtitle;
      content.appendChild(done);

      if (i + 1 < STORY.length) {
        const nx = document.createElement("button");
        nx.className = "pull-btn story-next";
        nx.textContent = "Chapitre suivant ▸";
        nx.addEventListener("click", () => { OS.sfx.play("page"); openScene(i + 1); });
        content.appendChild(nx);
      }
      content.appendChild(storyBackBtn());
    }

    function teamSceneActors() {
      const src = battle && battle.mode ? battle.units : teamUnits();
      return src.map((u, i) => ({ cls: u.cls, color: RARITY[u.r] ? RARITY[u.r].color : "#e3b23c", x: 30 + i * 46, flip: false, evo: (save.evo && save.evo[u.id]) || 0 }));
    }
    function sceneWithTeam(cfg) {
      return { ...cfg, actors: (cfg.actors || []).concat(teamSceneActors()) };
    }

    function battleSceneArt() {
      const idx = battle.storyChapter !== undefined ? battle.storyChapter : (storyScene ? storyScene.idx : 0);
      const cfg = STORY[idx] ? STORY[idx].scene : STORY[0].scene;
      const full = battle.mode === "histoire" ? sceneWithTeam(cfg) : { ...cfg, actors: teamSceneActors() };
      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(full);
      return art;
    }

    function startStoryBattle(cfg, isBoss) {
      const team = teamUnits();
      if (!team.length) { renderStory(); return; }
      const fx = BLESSING_FX[storyState.blessing] || {};
      const d = STORY_DIFFS[storyState.diff] || STORY_DIFFS.facile;
      if (!cfg || !Number.isFinite(cfg.hp) || !Number.isFinite(cfg.atk)) { renderStory(); return; }
      const hp = Math.round(cfg.hp * (fx.hpMult || 1) * d.hp);
      storyScene = { idx: storyScene ? storyScene.idx : 0, step: storyScene ? storyScene.step : 0 };
      battle = {
        mode: "histoire",
        tier: "histoire",
        storyChapter: storyScene.idx,
        storyStep: storyScene.step,
        bossCfg: cfg,
        storyBoss: !!isBoss,
        storyMult: fx.mult || 1,
        floor: storyScene.idx + 1,
        enemy: { name: cfg.name, type: cfg.type, ...enemyStats(cfg.type, hp, Math.round(cfg.atk * d.atk)), reward: Math.max(2, Math.round(cfg.reward * d.rw)) },
        diffLabel: d.label,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: initialGauge(team, 100, fx.gauge || 0),
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        log: [],
      };
      if (d.elite && cfg.elite) battle.elite = cfg.elite;
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      battle.log.unshift("----- " + cfg.name + " [" + (isBoss ? "Boss" : "Escarmouche") + " d'histoire · " + d.label + "] · récompense : " + battle.enemy.reward + " ◆ -----");
      if (battle.elite) battle.log.unshift("[Enfer+] " + battle.elite.name + " : " + battle.elite.desc);
      if (battle.elite) OS.sfx.play("arcane");
      OS.sfx.play("ult");
      renderQuests();
    }

    function onStoryContinue() {
      if (!battle || battle.mode !== "histoire" || !battle.over || !battle.enemy || battle.enemy.hp > 0) return;
      const idx = battle.storyChapter;
      const step = battle.storyStep + 1;
      const fresh = !!battle.freshWin;
      storyScene = { idx, step };
      if (step >= STORY[idx].events.length) renderDoneChapter(idx, fresh ? "boss vaincu !" : "niveau terminé");
      else renderScene();
    }

    function onStoryRetry() {
      if (!battle || battle.mode !== "histoire" || !battle.over || battle.enemy.hp <= 0) return;
      storyScene = { idx: battle.storyChapter, step: battle.storyStep };
      openScene(battle.storyChapter, battle.storyStep);
    }
    /* ---------- API de données exposée dès le chargement ---------- */
    
    OS.asteriaData.storyDiffs = function () {
      const st = OS.store.get(SAVE_PREFIX + "-story", {});
      const beaten = st.bossBeaten || {};
      let bn = 0;
      for (let t = 0; t < 5; t++) {
        if (BOSS_IDX.every((i) => (beaten[i] || 0) >= Math.min(t + 1, DIFFS.length))) bn = Math.min(t + 1, DIFFS.length);
      }
      return Object.keys(STORY_DIFFS).map((key) => ({
        key,
        label: STORY_DIFFS[key].label,
        locked: !diffUnlockedSt(st, key),
        active: (st.diff || "facile") === key,
      }));
    };
    OS.asteriaData.setStoryDiff = function (key) {
      const st = OS.store.get(SAVE_PREFIX + "-story", {});
      const infos = OS.asteriaData.storyDiffs();
      const info = infos.find((d) => d.key === key);
      if (!info || info.locked) return false;
      st.diff = key;
      if (st.done === undefined) st.done = 0;
      OS.store.set(SAVE_PREFIX + "-story", st);
      document.dispatchEvent(new Event("asteria-diff"));
      return true;
    };

    /* ---------- Démarrage ---------- */
    persist();
    ensureDaily();
    ensureRaid();
    renderSummon();
  },
});
