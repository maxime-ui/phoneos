/* App : Astéria — gacha + combat au tour par tour (personnages fictifs) */
"use strict";

    const RARITY = { 1: { label: "R", color: "#7d869c" }, 2: { label: "SR", color: "#4f9eff" }, 3: { label: "SSR", color: "#e3b23c" }, 4: { label: "SS", color: "#ff8c5a" } };
    const CARD = { R: { label: "Brut", color: "#c34a2f", mult: 1.5 }, B: { label: "Arcane", color: "#3b6bd4", mult: 1.0 }, V: { label: "Rapide", color: "#3ba75c", mult: 0.8 } };
    const TIER = {
      facile: { label: "Facile", hp: 7600, atk: 830, reward: 5 },
      normal: { label: "Normal", hp: 16200, atk: 1430, reward: 10 },
      dur: { label: "Difficile", hp: 30300, atk: 2210, reward: 20 },
      infini: { label: "Infini", hp: 7600, atk: 830, reward: 0, infinite: true },
    };
    const ENEMY_NAMES = ["Gobelin ancien", "Chevalier déchu", "Dragon des cendres", "Spectre des marais", "Colosse de pierre", "Sorcière du brouillard", "Basilic", "Seigneur liche", "Fantassin d'élite", "Nécromant errant", "Banshee des marais", "Sanguinaire du brasier", "Colosse de givre", "Ombre du serment", "Drakônide des cratères", "Faucheur d'équinoxe", "Gardien des runes brisées", "Cultiste de la veille", "Vouivre des cimes", "Marcheur de cendres", "Prêtre du cratère", "Sillon du néant"];

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
      "mat_Invocateur": { name: "Cendre d'Invocateur", color: "#8f6bd9" },
      "mat_Valkyrie": { name: "Plume de Valkyrie", color: "#ffce6a" },
    };

    const RECYCLE_GAIN = { 1: 2, 2: 4, 3: 8 };
    const RAID_PHASES = [
      { name: "Gardien de la trempe", type: "Golem", hp: 71000, atk: 2960, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" } },
      { name: "Commandant du feu", type: "Capitaine", hp: 108000, atk: 3660, elite: { id: "siphon", name: "Siphon d'âmes", desc: "se soigne de la moitié des dégâts infligés" } },
      { name: "Cœur du dragon", type: "Sorcier", hp: 168000, atk: 4350, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" } },
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
      "Invocateur": { fx: { gauge: 6 }, label: "Jauge +6 % par carte" },
      "Valkyrie": { fx: { heal: 12 }, label: "Soins +12 %" },
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
      "Invocateur": { fx: { teamAtk: 6 }, label: "ATK d'équipe +6 %" },
      "Valkyrie": { fx: { renvoi: 8 }, label: "Renvoi +8 %" },
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
      "Invocateur": { fx: { gauge: 5 }, label: "Jauge +5 % par carte" },
      "Valkyrie": { fx: { hp: 9 }, label: "PV max +9 %" },
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
      graal: ["Héritière des braises", "dégâts +16 % et jauge de départ +22 %", { dmg: 16, jaugeInit: 22 }],
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
      thassar: ["Etreinte du soir", "jauge +6 % par carte", { gauge: 6 }],
      sylvara: ["Souffle des cimes", "esquive +12 %", { esquive: 12 }],
      mahoro: ["Balance parfaite", "PV max +10 %", { hp: 10 }],
      ignarra: ["Chaleur retenue", "dégâts +9 %", { dmg: 9 }],
      alethe: ["Serment ailé", "renvoie 10 %", { renvoi: 10 }],
      sablier: ["Sable turnissant", "critique +8 %", { crit: 8 }],
      annelie: ["Sérénité", "soins +8 %", { heal: 8 }],
      hedda: ["Clou de fer", "PV max +7 %", { hp: 7 }],
      hachiro: ["Coupe-bise", "dégâts +7 %", { dmg: 7 }],
      germain: ["Étoupe douce", "jauge +3 % par carte", { gauge: 3 }],
      tulio: [" enthousiasme de porte", "renvoie 6 %", { renvoi: 6 }],
      oswald: ["Vigie", "critique +5 %", { crit: 5 }],
      marguerite: ["Fleur de fer", "PV max +5 %", { hp: 5 }],
      piou: ["Chant d'alcôve", "jauge +3 % par carte", { gauge: 3 }],
    };
    const ENEMY_CLASSES = {
      "Humain": "Guerriers et stratèges — offensive organisée",
      "Arcaniste": "Lanceurs de sorts — dégâts de zone et malaises",
      "Élémentaire": "Créatures de roche et de givre — forteresses lentes",
      "Mort-vivant": "Dévoreurs d'énergie — ils boivent vos forces",
      "Spectre": "Lamentations draineuses — ils volent votre élan",
      "Bestial": "Bêtes de la caldeira — frénésie et crocs",
    };
    const ENEMY_TYPES = {
      "Brute": { desc: "Frappe fort le membre le plus blessé", cls: "Humain", ultEvery: 5, ultName: "Fauchage brutal", ultDesc: "coup à 180 % sur le plus blessé" },
      "Assassin": { desc: "Traque l'attaquant le plus dangereux, critiques fréquents", cls: "Humain", ultEvery: 4, ultName: "Dance des lames", ultDesc: "trois coups rapides sur le plus dangereux" },
      "Sorcier": { desc: "Brûle toute l'équipe à chaque tour", cls: "Arcaniste", ultEvery: 5, ultName: "Incinération", ultDesc: "tempête de feu sur toute l'équipe" },
      "Capitaine": { desc: "Se renforce de 4 % à chacun de ses tours", cls: "Humain", ultEvery: 5, ultName: "Ordre de charge", ultDesc: "+10 % d'ATK permanents et coup lourd" },
      "Golem": { desc: "Carapace : subit 20 % de dégâts en moins, frappe plus lentement", cls: "Élémentaire", ultEvery: 6, ultName: "Grand séisme", ultDesc: "secousse ignorante de carapace sur toute l'équipe" },
      "Oracle": { desc: "Prie à chaque tour : régénère 4 % de ses PV max", cls: "Arcaniste", ultEvery: 5, ultName: "Litanie suprême", ultDesc: "soigne 12 % de ses PV max puis frappe" },
      "Muraille": { desc: "Bastion : subit 10 % de dégâts en moins", cls: "Élémentaire", ultEvery: 6, ultName: "Onde de bastion", ultDesc: "réverbère : draine la jauge d'Ultime et frappe" },
      "Invocateur": { desc: "Rituel : appelle une ombre qui frappe une seconde fois", cls: "Arcaniste", ultEvery: 4, ultName: "Légion d'ombres", ultDesc: "trois ombres frappent en même temps" },
      "Fantassin": { desc: "Rythme de fer : frappe deux fois, mais plus légèrement", cls: "Humain", ultEvery: 4, ultName: "Salve de piques", ultDesc: "quatre coups rapides en ligne" },
      "Nécromant": { desc: "Juste funeste : se soigne 3 % de ses PV max puis frappe", cls: "Mort-vivant", ultEvery: 5, ultName: "Moisson noire", ultDesc: "draine chaque héros et se soigne du total" },
      "Banshee": { desc: "Hurlement : draine 12 % de la jauge d'Ultime de l'équipe", cls: "Spectre", ultEvery: 5, ultName: "Cri du deuil", ultDesc: "hurlement qui vole 30 % de la jauge d'Ultime" },
      "Sanguinaire": { desc: "Soif de sang : frappe très fort les membres les plus blessés", cls: "Humain", ultEvery: 5, ultName: "Mise à mort", ultDesc: "coup à 220 % sur le plus blessé" },
      "Colosse de givre": { desc: "Carapace de givre : subit 15 % de dégâts en moins", cls: "Élémentaire", ultEvery: 6, ultName: "Blizzard", ultDesc: "glace toute l'équipe et ralentit la jauge" },
      "Drakônide": { desc: "Descend en piqué : coup lourd puis vol de vie", cls: "Bestial", ultEvery: 6, ultName: "Vol de sang", ultDesc: "piqué brutal qui soigne le drakônide" },
      "Faucheur": { desc: "Exécution : décapite les héros sous 40 % PV", cls: "Spectre", ultEvery: 5, ultName: "Crépuscule de la faux", ultDesc: "tranche l'allié le plus bas, presque critique" },
      "Gardien des runes": { desc: "Grave un bouclier : réduit ses dégâts subis pendant 2 tours", cls: "Élémentaire", ultEvery: 6, ultName: "Mur runique", ultDesc: "carapace renforcée et contre-coup" },
      "Cultiste": { desc: "Chant du retour : grandit et draine la jauge", cls: "Mort-vivant", ultEvery: 5, ultName: "Chant du dévoilement", ultDesc: "le culte s'étend : dégâts de zone et jauge pratée" },
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

      /* --- Vague 4 : Invocateur & Valkyrie + renforts --- */
      /* --- SSR --- */
      { id: "thassar", name: "Thassar le Nécrologue", r: 3, cls: "Invocateur", atk: 1840, hp: 9900, cards: ["B", "B", "R"] },
      { id: "sylvara", name: "Sylvara, voix des bois", r: 3, cls: "Rôdeur", atk: 1990, hp: 9400, cards: ["V", "V", "R"] },
      { id: "mahoro", name: "Mahoro le Balancier", r: 3, cls: "Héros", atk: 1970, hp: 10800, cards: ["R", "B", "V"] },
      { id: "ignarra", name: "Ignarra, braise vivante", r: 3, cls: "Mage", atk: 1870, hp: 9600, cards: ["B", "R", "B"] },
      { id: "alethe", name: "Aléthé, aile d'orage", r: 3, cls: "Valkyrie", atk: 1710, hp: 11500, cards: ["R", "B", "B"] },
      /* --- SR --- */
      { id: "osric", name: "Osric", r: 2, cls: "Invocateur", atk: 1310, hp: 8600, cards: ["B", "R", "V"] },
      { id: "saoirse", name: "Saoirse", r: 2, cls: "Valkyrie", atk: 1210, hp: 9300, cards: ["R", "V", "B"] },
      { id: "brennus", name: "Brennus", r: 2, cls: "Berserker", atk: 1730, hp: 8500, cards: ["R", "R", "V"] },
      { id: "tanith", name: "Tanith", r: 2, cls: "Archer", atk: 1600, hp: 8400, cards: ["V", "V", "R"] },
      { id: "moreno", name: "Moreno la Lame-Ronde", r: 2, cls: "Tueur", atk: 1770, hp: 8000, cards: ["R", "V", "V"] },
      { id: "beatrix", name: "Béatrix", r: 2, cls: "Chevalier", atk: 1560, hp: 9700, cards: ["R", "B", "V"] },
      { id: "fennec", name: "Fennec", r: 2, cls: "Rôdeur", atk: 1550, hp: 8600, cards: ["V", "R", "V"] },
      { id: "liore", name: "Liore", r: 2, cls: "Soigneur", atk: 1170, hp: 8900, cards: ["B", "V", "B"] },
      /* --- R --- */
      { id: "petronille", name: "Pétronille", r: 1, cls: "Soigneur", atk: 860, hp: 7300, cards: ["B", "V", "V"] },
      { id: "brigant", name: "Brigant", r: 1, cls: "Tueur", atk: 1160, hp: 6800, cards: ["R", "V", "B"] },
      { id: "ursule", name: "Ursule", r: 1, cls: "Défenseur", atk: 810, hp: 10100, cards: ["R", "B", "V"] },
      { id: "timon", name: "Timon", r: 1, cls: "Mage", atk: 955, hp: 7500, cards: ["B", "B", "V"] },
      { id: "yrsa", name: "Yrsa", r: 1, cls: "Rôdeur", atk: 1010, hp: 7350, cards: ["V", "V", "B"] },
      { id: "hakim", name: "Hakim", r: 1, cls: "Archer", atk: 1085, hp: 6700, cards: ["V", "R", "B"] },
      { id: "borvik", name: "Borvik", r: 1, cls: "Berserker", atk: 1150, hp: 6900, cards: ["R", "R", "V"] },
      { id: "adela", name: "Adela", r: 1, cls: "Chevalier", atk: 1000, hp: 8300, cards: ["B", "R", "V"] },

      /* --- SS exclusive : Le Graal (Dragon des cendres en Enfer+) --- */
      { id: "graal", name: "Astrée, Héritière des braises", r: 4, cls: "Héros", atk: 2600, hp: 15300, cards: ["R", "R", "R"] },
    ];
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
      "Invocateur": "Ombre fidèle : une ombre frappe en plus à chaque carte (12 % de l'ATK) et l'Ultime se charge mieux",
      "Valkyrie": "Aile d'orage : chaque carte soigne légèrement l'allié le plus blessé et tous les 7 tours, plonge en un éclair",
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
      graal: ["Héritage des braises", "+8 %/tour, renvoie 32 % des ripostes et soigne 18 % des dégâts infligés"],
    };
    const TRAIN_OPPONENTS = [
      { key: "bois", name: "Mannequin de bois", type: "Muraille", hp: 21500, atk: 830 },
      { key: "fer", name: "Mannequin de fer", type: "Golem", hp: 36500, atk: 1600 },
      { key: "boss", name: "Boss simulé", type: "Sorcier", hp: 56000, atk: 2470 },
    ];
    const byId = (id) => UNITS.find((u) => u.id === id);
    const RELICS = {
      arme: { name: "Lame du Raid", effect: "ATK du héros équipé", cost: { couronne: 8, larme: 10 } },
      armure: { name: "Écaille du Dragon", effect: "PV du héros équipé", cost: { eclat: 20, coeur: 15 } },
      etendard: { name: "Étendard des trois phases", effect: "Jauge d’Ultime du héros", cost: { couronne: 12, sceau: 5 } },
      anneau: { name: "Anneau des serments", effect: "Critique du héros équipé", cost: { larme: 14, sceau: 6 } },
      orbe: { name: "Orbe des braises", effect: "Dégâts du héros équipé", cost: { coeur: 18, larme: 10 } },
      creuset: { name: "Creuset des serments", effect: "Soins du héros équipé", cost: { coeur: 12, couronne: 5 } },
      carcan: { name: "Carcan des origines", effect: "Esquive du héros équipé", cost: { eclat: 18, sceau: 4 } },
      egide: { name: "Égide de Hautefeuille", effect: "Renvoi du héros équipé", cost: { eclat: 14, coeur: 8 } },
    };
    const RELIC_TIERS = [
      { key: "N", label: "Normale", color: "#7d869c" },
      { key: "R", label: "Rare", color: "#4f9eff" },
      { key: "SR", label: "Épique", color: "#b06ee8" },
      { key: "SSR", label: "Légendaire", color: "#e3b23c" },
    ];
    const RELIC_MAIN = {
      arme: { stat: "atk", label: "ATK du héros", values: [14, 20, 27, 38] },
      armure: { stat: "hp", label: "PV du héros", values: [14, 20, 27, 38] },
      etendard: { stat: "jaugeInit", label: "Jauge du héros", values: [15, 19, 22, 26] },
      anneau: { stat: "crit", label: "Critique du héros", values: [9, 13, 17, 23] },
      orbe: { stat: "dmg", label: "Dégâts du héros", values: [9, 13, 17, 23] },
      creuset: { stat: "heal", label: "Soins du héros", values: [10, 16, 22, 30] },
      carcan: { stat: "esquive", label: "Esquive du héros", values: [8, 12, 17, 24] },
      egide: { stat: "renvoi", label: "Renvoi du héros", values: [10, 15, 20, 27] },
    };
    const RELIC_SUBS = {
      arme: [{ crit: 3 }, { renvoi: 5 }, { execute: 8 }],
      armure: [{ heal: 4 }, { esquive: 4 }, { hp: 6 }],
      etendard: [{ teamAtk: 3 }, { gauge: 2 }, { growth: 2 }],
      anneau: [{ execute: 6 }, { gauge: 3 }, { renvoi: 5 }],
      orbe: [{ teamAtk: 4 }, { heal: 5 }, { growth: 3 }],
      creuset: [{ hp: 5 }, { gauge: 2 }, { teamAtk: 3 }],
      carcan: [{ crit: 3 }, { renvoi: 4 }, { execute: 6 }],
      egide: [{ heal: 3 }, { hp: 5 }, { growth: 2 }],
    };
    const RELIC_SETS = [
      { id: "trio", name: "Pacte du trio", need: 2, fx: { dmg: 4 }, desc: "2 reliques forgées et équipées : dégâts +4 %" },
      { id: "trinite", name: "Trinité du dragon", need: 4, fx: { dmg: 4, jaugeInit: 10 }, desc: "4 reliques forgées et équipées : dégâts +4 % et jauge de départ +10 %" },
      { id: "harmonie", name: "Harmonie parfaite", need: 4, sameTier: 3, fx: { dmg: 8 }, desc: "4 reliques équipées en rang Épique ou + : dégâts +8 %" },
      { id: "ombre", name: "Pacte d'ombre", need: 2, sameTier: 3, fx: { esquive: 6 }, desc: "2 reliques équipées en rang Épique ou + : esquive +6 %" },
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

const CLASS_BAL = {
  Chevalier: { coefHp: 1.04 },
  Berserker: { coefAtk: 1.03 },
  Mage: { coefAtk: 1.04, coefHp: 0.98 },
  Archer: { coefAtk: 1.02 },
  "Rôdeur": { coefHp: 1.01 },
  "Héros": { coefAtk: 1.02, coefHp: 1.02 },
  "Soigneur": { coefAtk: 1.05, coefHp: 1.04 },
  "Défenseur": { coefHp: 1.05 },
  "Tueur": { coefAtk: 1.02, coefHp: 0.99 },
  "Invocateur": { coefHp: 1.02 },
  "Valkyrie": { },
};

function corePower(u, sv) {
  const count = (sv.owned && sv.owned[u.id]) || 1;
  const mult = 1 + 0.08 * Math.min(count - 1, 12);
  const evo = Math.min((sv.evo && sv.evo[u.id]) || 0, 4);
  const em = 1 + 0.10 * evo;
  const bal = CLASS_BAL[u.cls] || {};
  const rfx = relicFxOf(sv);
  const hero = heroRelicFx(sv, u.id);
  const hpFx = (1 + ((coreFx(u, sv).hp || 0) / 100)) * (1 + (hero.hp || 0) / 100);
  return { ...u, lvl: count, evo, atk: Math.round(u.atk * mult * em * (bal.coefAtk || 1) * (1 + ((rfx.teamAtk || 0) + (hero.atk || 0)) / 100)), hp: Math.round(u.hp * mult * em * (bal.coefHp || 1) * hpFx) };
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

/* ---------- Données partagées (consommées par l'app Personnages) ---------- */
OS.asteriaData = { RARITY, CARD, TIER, ENEMY_NAMES, ENEMY_TYPES, UNITS, CLASS_BONUS, SKILL_INFO, COLLECTION_REWARDS, LOOT, RAID_PHASES, RAID_BOTS, EVO_REQ, EVO4_REQ, EVO2, EVO3, EVO3B, RELICS, PASSIVE_INFO, RELIC_TIERS, RELIC_MAIN, RELIC_SUBS, RELIC_SETS, RELIC_UP, RELIC_STAT_LABELS, RECYCLE_GAIN, TRAIN_OPPONENTS, relicFxOf, heroRelicFx, byId, equipOf, coreFx, corePower, evoSkillLabelsOf, hashStr, raidRwOf, raidLeaderboard, diffUnlockedSt, matKeyOf };


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

    let infiniteBest = OS.store.get("infinite-best", 0);

    function loadSave() {
      ["", "-story", "-daily", "-raid"].forEach(function (suffix) {
        const legacy = OS.store.get("epopee" + suffix, null);
        if (legacy !== null && OS.store.get("asteria" + suffix, null) === null) OS.store.set("asteria" + suffix, legacy);
      });
      const saved = OS.store.get("asteria", null);
      if (saved) return saved;
      return { quartz: 30, owned: { bron: 1, tilia: 1, nerys: 1 }, team: ["bron", "tilia", "nerys"] };
    }
    let save = loadSave();
    if (!save.pity) save.pity = {};
    if (!save.pity30) save.pity30 = {};
    if (!save.collected) save.collected = [];
    if (!save.loot) save.loot = {};
    if (!save.evo) save.evo = {};
    if (!save.relics) save.relics = {};
    if (!save.relicsEquip) save.relicsEquip = {};
    Object.keys(RELIC_MAIN).forEach((k) => {
      const wornId = save.relicsEquip[k];
      if (wornId && (!save.owned || !save.owned[wornId])) save.relicsEquip[k] = null;
    });
    function persist() { OS.store.set("asteria", save); }

    let storyState = OS.store.get("asteria-story", { done: 0, music: false, diff: "facile" });
    if (!storyState.diff) storyState.diff = "facile";
    if (!Array.isArray(storyState.cleared)) storyState.cleared = [];
    if (!diffUnlockedSt(storyState, storyState.diff)) storyState.diff = "facile";
    function persistStory() { OS.store.set("asteria-story", storyState); }

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
    let daily = OS.store.get("asteria-daily", null);
    function persistDaily() { OS.store.set("asteria-daily", daily); }
    function ensureDaily() {
      const tk = todayKey();
      if (!daily || daily.date !== tk) {
        const picks = DAILY_TYPES.slice().sort(() => Math.random() - 0.5).slice(0, 3);
        daily = { date: tk, missions: picks.map((d) => ({ t: d.t, label: d.label, goal: d.goal, reward: d.reward, p: 0, claimed: false })) };
        persistDaily();
      }
    }
    function trackDaily(type, amt, absolute) {
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
    let raid = OS.store.get("asteria-raid", null);
    function persistRaid() { OS.store.set("asteria-raid", raid); }
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
        const pityThr = save.pity30[cls] ? 50 : 30;
        if (ssr.length && save.pity[cls] >= pityThr) {
          unit = ssr[Math.floor(Math.random() * ssr.length)];
          save.pity[cls] = 0;
          save.pity30[cls] = true;
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

    function renderSummon() {
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

      const portalTitle = document.createElement("div");
      portalTitle.className = "team-hint";
      portalTitle.textContent = "Portails de classe — 5 ◆ l'invocation · pity : SSR garanti à 30 la première fois, puis à 50 définitivement (reset à chaque SSR)";
      content.appendChild(portalTitle);
      const grid = document.createElement("div");
      grid.className = "portal-grid";
      [...new Set(UNITS.map((u) => u.cls))].forEach((cls) => {
        const b = document.createElement("button");
        b.className = "pull-btn portal-btn";
        b.innerHTML = "Portail " + cls + "<br><small>pity " + (save.pity[cls] || 0) + "/" + (save.pity30[cls] ? 50 : 30) + "</small>";
        b.addEventListener("click", () => {
          const got = classPull(cls, 1);
          if (!got.length) return;
          content.querySelector(".quartz-bar").replaceWith(quartzBar());
          OS.sfx.play(got.some((u) => u.r === 3) ? "ssr" : "gacha");
          grid.querySelectorAll(".portal-btn").forEach((btn, i) => {
            const c = [...new Set(UNITS.map((u) => u.cls))][i];
            btn.innerHTML = "Portail " + c + "<br><small>pity " + (save.pity[c] || 0) + "/" + (save.pity30[c] ? 50 : 30) + "</small>";
          });
          const box = content.querySelector(".pull-results");
          box.innerHTML = "";
          got.forEach((u) => box.appendChild(unitCard(u)));
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
      const evoLines = evoSkillLabels(u, p.evo || 0);
      const c = document.createElement("div");
      c.className = "unit-card r" + u.r;
      c.innerHTML =
        '<div class="unit-rarity">' + RARITY[u.r].label + (p.lvl > 1 ? " · Niveau " + p.lvl : "") + "</div>" +
        '<div class="unit-name">' + u.name + (stars ? ' <span class="evo-stars">' + stars + "</span>" : "") + "</div>" +
        '<div class="unit-cls">' + u.cls + (p.lvl > 1 || p.evo ? " · +" + Math.round((p.atk / u.atk - 1) * 100) + " %" : "") + "</div>" +
        (SKILL_INFO[u.id] ? '<div class="unit-skill">✦ ' + SKILL_INFO[u.id][0] + ' — ' + SKILL_INFO[u.id][1] + '</div>' : "") +
        (passive ? '<div class="unit-passive">✧ Passif : ' + passive[0] + " — " + passive[1] + "</div>" : "") +
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
        '<div class="unit-name">' + rel.name + " " + relicTierChip(tier) + "</div>" +
        (tier < 1 ? '<div class="forge-evo">' + rel.effect + " (au rang N)</div>" : "") +
        statsTxt + actionTxt;

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
      h.textContent = "Reliquaire du raid — " + Object.keys(RELICS).length + " reliques, chacune s’équipe sur un héros";
      wrap.appendChild(h);
      Object.keys(RELICS).forEach((k) => wrap.appendChild(relicLine(k)));

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
      setActiveTab(tabTraining);
      content.innerHTML = "";
      content.appendChild(quartzBar());

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Mode Entraînement — testez tous les héros, même non possédés. Aucun gain, aucune perte : pure simulation.";
      content.appendChild(hint);

      const box = document.createElement("div");
      box.className = "roster";
      content.appendChild(box);

      UNITS.slice().sort((a, b) => b.r - a.r || a.cls.localeCompare(b.cls) || a.atk - b.atk).forEach((u) => {
        const card = unitCard(u);
        card.classList.add("selectable");
        if (!save.owned[u.id]) card.classList.add("locked");
        if (trainPick === u.id) card.classList.add("in-team");
        card.addEventListener("click", () => { trainPick = u.id; renderTraining(); });
        box.appendChild(card);
      });

      const oppHint = document.createElement("div");
      oppHint.className = "team-hint";
      oppHint.textContent = "Adversaire d'entraînement :";
      content.appendChild(oppHint);
      const row = document.createElement("div");
      row.className = "pull-row";
      TRAIN_OPPONENTS.forEach((op) => {
        const b = document.createElement("button");
        b.className = "pull-btn tier-infini";
        b.innerHTML = op.name + "<br><small>" + op.type + " · " + op.hp + " PV · atk " + op.atk + "</small>";
        b.addEventListener("click", () => startTrainingBattle(op));
        row.appendChild(b);
      });
      content.appendChild(row);
      if (battle && battle.mode === "train" && battle.over) content.appendChild(battleView());
    }

    function startTrainingBattle(op) {
      const u = trainPick ? byId(trainPick) : null;
      if (!u) return;
      const unit = corePower(u, save);
      battle = {
        mode: "train",
        floor: 1,
        enemy: { name: op.name, type: op.type, hp: op.hp, maxHp: op.hp, atk: op.atk },
        tier: "train",
        units: [unit],
        hp: [unit.hp],
        gauge: Math.min(60, unitFx(unit).jaugeInit || 0),
        picks: 0,
        curse: 0,
        burn: 0,
        turns: 0,
        elanAtk: 0,
        teamShield: 0,
        techElanActive: 0,
        valenFury: 0,
        techElan: 0,
        runeShield: 0,
        guardShell: 0,
        log: ["----- ENTRAÎNEMENT : " + unit.name + " contre " + op.name + " [aucun gain] -----"],
      };
      battle.heroStacks = [unit.cls === "Héros" ? 0 : -1];
      newHand();
      OS.sfx.play("ult");
      renderQuests();
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

    function renderCollection() {
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

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Tous les héros du jeu — les non possédés sont grisés (touchez un héros pour sa fiche)";
      content.appendChild(hint);
      const grid = document.createElement("div");
      grid.className = "roster col-grid";
      UNITS.slice().sort((a, b) => b.r - a.r || a.cls.localeCompare(b.cls) || a.atk - b.atk).forEach((u) => {
        if (save.owned[u.id]) {
          const card = unitCard(u);
          card.addEventListener("click", () => OS.heroes.open(u.id));
          grid.appendChild(card);
          return;
        }
        const c = document.createElement("div");
        c.className = "unit-card locked r" + u.r;
        c.innerHTML =
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
        enemy: { name, type: etype, hp: Math.round(t.hp * golemMult * scale), maxHp: Math.round(t.hp * golemMult * scale), atk: Math.round(t.atk * (key === "infini" ? 1.08 : 1)) },
        tier: key,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: 0,
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        turns: 0,
        elanAtk: 0,
        teamShield: 0,
        techElanActive: 0,
        log: ["----- " + name + " [" + etype + " · " + (ENEMY_TYPES[etype].cls || "?") + "] apparaît · " + ENEMY_TYPES[etype].desc + " -----"],
      };
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
        enemy: { name: ph.name, type: ph.type, hp: ph.hp, maxHp: ph.hp, atk: ph.atk },
        tier: "raid",
        units: team,
        hp: team.map((u) => u.hp),
        gauge: 0,
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        turns: 0,
        elanAtk: 0,
        teamShield: 0,
        techElanActive: 0,
        log: [],
      };
      if (ph.elite) battle.elite = ph.elite;
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
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

      if (u.cls === "Soigneur") {
        trackDaily("cards");
        trackDaily("heals");
        const fdxHeal = (unitFx(u).heal || 0) / 100;
        const needy = aliveIdx().sort((a, b) => battle.hp[a] - battle.hp[b]);
        const wi = needy[0];
        const heal = Math.round(unit.atk * 0.30 * (u.id === "edele" ? 1.5 : 1) * (1 + fdxHeal) * (0.9 + Math.random() * 0.2));
        const healed = Math.min(battle.units[wi].hp - battle.hp[wi], heal);
        battle.hp[wi] = Math.min(battle.units[wi].hp, battle.hp[wi] + heal);
        battle.log.unshift(unit.name + " soigne " + battle.units[wi].name + " (+" + healed + " PV)");
        battle.gauge = Math.min(100, battle.gauge + 12);
        if (u.id === "nadila") battle.gauge = Math.min(100, battle.gauge + 5);
        OS.sfx.play("heal");
        if (battle.picks >= 3) enemyTurn();
        renderQuests();
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
      if (u.cls === "Mage" && card.type === "B") dmg = Math.round(dmg * 1.3);
      if (u.cls === "Berserker") {
        const threshold = u.id === "draven" ? 0.7 : 0.5;
        const rage = (u.id === "draven" ? 1.3 : 1.2) + (fx.rage || 0) / 100;
        if (battle.hp[gi] < u.hp * threshold) dmg = Math.round(dmg * rage);
      }
      if (u.cls === "Tueur") dmg = Math.round(dmg * (u.id === "orlan" ? 1.45 : 1.30));
      if (u.id === "raiden" && battle.enemy.hp / battle.enemy.maxHp < 0.25) dmg = Math.round(dmg * 2);
      const execBonus = ((fx.execute || 0) + (fx.fureur || 0)) / 100;
      if (execBonus && battle.enemy.hp / battle.enemy.maxHp < 0.5) dmg = Math.round(dmg * (1 + execBonus));
      if (u.cls === "Héros" && battle.heroStacks && battle.heroStacks[gi] > 1) {
        const heroGrowth = ((u.id === "rin" || u.id === "graal") ? 0.08 : 0.05) + (fx.growth || 0) / 100;
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
        totalDealt += hitEnemy(hits === 2 ? Math.round(dmg * 0.75) : dmg, unit.name, (crit ? "CRIT ! " : "") + c.label + (hits === 2 && h === 1 ? " (double frappe !)" : ""));
        if (battle.enemy.hp <= 0) break;
      }
      if (u.id === "graal" && totalDealt > 0 && battle.enemy.hp > 0) {
        const graalTarget = aliveIdx().sort((a, b) => battle.hp[a] - battle.hp[b])[0];
        const healedD = Math.min(battle.units[graalTarget].hp - battle.hp[graalTarget], Math.round(totalDealt * 0.18 * (1 + (fx.heal || 0) / 100)));
        if (healedD > 0) {
          battle.hp[graalTarget] += healedD;
          battle.log.unshift(unit.name + " canalise les braises : soigne " + battle.units[graalTarget].name + " (+" + healedD + " PV)");
        }
      }
      if (u.id === "enzo" && card.type === "R" && battle.enemy.hp > 0) {
        battle.burn = Math.min(3, battle.burn + 1);
        battle.log.unshift(unit.name + " enflamme l'ennemi (brûlure ×" + battle.burn + ")");
      }
      if (u.cls === "Invocateur" && battle.enemy.hp > 0) {
        hitEnemy(Math.round(unit.atk * 0.12), unit.name, "ombre fidèle");
      }
      if (u.cls === "Valkyrie" && aliveIdx().length) {
        const needyV = aliveIdx().sort((a, b) => battle.hp[a] - battle.hp[b])[0];
        const hV2 = Math.round(unit.atk * 0.10 * (1 + (fx.heal || 0) / 100));
        const healedV2 = Math.min(battle.units[needyV].hp - battle.hp[needyV], hV2);
        if (healedV2 > 0) {
          battle.hp[needyV] += healedV2;
          battle.log.unshift(unit.name + " dépose une plume d'orage : " + battle.units[needyV].name + " (+" + healedV2 + " PV)");
        }
      }

      if (battle.enemy.hp <= 0) return endBattle(true);
      if (battle.picks >= 3) enemyTurn();
      renderQuests();
    }

    function unitName(list) {
      return list.map((u) => u.name).join(" et ");
    }

    function teamAtkMult() {
      let mult = 1;
      battle.units.forEach((u, i) => {
        if (battle.hp[i] > 0) {
          if (u.id === "aldric") mult += 0.10;
          const fx = unitFx(u);
          if (fx.teamAtk) mult += fx.teamAtk / 100;
        }
      });
      mult += (battle.valenFury || 0) * 0.30;
      mult += (battle.elanAtk || 0) / 100;
      return mult;
    }

    function hitEnemy(base, actorName, label) {
      let dmg = base;
      if (battle.enemy.type === "Golem") dmg = Math.round(dmg * 0.8);
      else if (battle.enemy.type === "Muraille") dmg = Math.round(dmg * 0.9);
      else if (battle.enemy.type === "Colosse de givre") dmg = Math.round(dmg * 0.85);
      if ((battle.runeShield || 0) > 0) dmg = Math.round(dmg * 0.7);
      if ((battle.guardShell || 0) > 0) dmg = Math.round(dmg * 0.75);
      dmg = Math.round(dmg * (1 + 0.10 * battle.curse));
      battle.enemy.hp = Math.max(0, battle.enemy.hp - dmg);
      battle.log.unshift(actorName + " (" + label + ") → " + dmg + " dégâts");
      return dmg;
    }

    function useUltimate() {
      if (!battle || battle.gauge < 100 || battle.picks >= 3) return;
      const si = aliveIdx().sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
      const strongest = battle.units[si];
      const heroMult = battle.heroStacks && battle.heroStacks[si] > 1 ? (1 + (strongest.id === "rin" || strongest.id === "graal" ? 0.08 : 0.05) * (battle.heroStacks[si] - 1)) : 1;
      const dmg = Math.round(strongest.atk * 2.4 * heroMult * (1 + (unitFx(strongest).dmg || 0) / 100) * teamAtkMult() * (battle.storyMult || 1) * (0.95 + Math.random() * 0.1));
      battle.enemy.hp = Math.max(0, battle.enemy.hp - dmg);
      battle.gauge = 0;
      battle.picks = 3;
      OS.sfx.play("ult");
      battle.log.unshift("✦ ULTIME de " + strongest.name + " → " + dmg + " dégâts !");
      if (battle.enemy.hp <= 0) return endBattle(true);
      enemyTurn();
      renderQuests();
    }

    function attackAlly(ti, raw) {
      const target = battle.units[ti];
      if (battle.techElanActive && Math.random() < battle.techElanActive) {
        battle.log.unshift(target.name + " surfe sur les flammes : l'élan de Rôdeur esquive la riposte !");
        return 0;
      }
      const dodgeChance = (target.id === "okatsuro" ? 0.40 : target.cls === "Rôdeur" ? 0.25 : 0) + (unitFx(target).esquive || 0) / 100;
      if (Math.random() < dodgeChance) {
        battle.log.unshift(target.name + " esquive la riposte !");
        return 0;
      }
      if ((battle.teamShield || 0) > 0) {
        raw = Math.round(raw * (1 - battle.teamShield));
        battle.log.unshift("Bouclier de serment : dégâts réduits de " + Math.round(battle.teamShield * 100) + " %");
        battle.teamShield = 0;
      }
      const shieldBearer = battle.units.findIndex((u, i) => u.id === "seraphine" && battle.hp[i] > 0);
      if (shieldBearer !== ti && shieldBearer !== -1 && Math.random() < 0.20) {
        battle.log.unshift("Séraphine dévie l'attaque avec son bouclier !");
        return 0;
      }
      let dmg = raw;
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
        graal: ["héritage des braises (renvoi)", 0.32],
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

    function enemyUltimate() {
      const type = battle.enemy.type;
      const targets = aliveIdx();
      if (!targets.length) return;
      OS.sfx.play("ult");
      const eDef = ENEMY_TYPES[type] || {};
      battle.log.unshift("⟈ ULTIME ennemie : " + type + " — " + (eDef.ultName || "Antique") + " (" + (eDef.ultDesc || "") + ")");
      switch (type) {
        case "Brute":
          attackAlly(targets.sort((a, b) => battle.hp[a] - battle.hp[b])[0], Math.round(battle.enemy.atk * 1.8));
          break;
        case "Assassin":
          for (let i = 0; i < 3; i++) {
            const rest = aliveIdx();
            if (!rest.length) break;
            const tA = rest.sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
            attackAlly(tA, Math.round(battle.enemy.atk * 0.75 * (0.9 + Math.random() * 0.2)));
          }
          break;
        case "Sorcier":
          aliveIdx().forEach((i) => {
            attackAlly(i, Math.round(battle.enemy.atk * 0.9));
            battle.hp[i] = Math.max(0, battle.hp[i] - Math.round(battle.units[i].hp * 0.05));
            if (battle.hp[i] === 0) battle.log.unshift(battle.units[i].name + " tombe K.O.");
          });
          break;
        case "Capitaine":
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.10);
          attackAlly(targets[0], Math.round(battle.enemy.atk * 1.2));
          break;
        case "Golem":
          aliveIdx().forEach((i) => attackAlly(i, Math.round(battle.enemy.atk * 0.85)));
          break;
        case "Oracle": {
          const healO = Math.round(battle.enemy.maxHp * 0.12);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + healO);
          attackAlly(targets[0], Math.round(battle.enemy.atk * 0.95));
          break;
        }
        case "Muraille":
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.82));
          attackAlly(targets[Math.floor(Math.random() * targets.length)], Math.round(battle.enemy.atk * 1.1));
          break;
        case "Invocateur":
          for (let i = 0; i < 3; i++) {
            const rest = aliveIdx();
            if (!rest.length) break;
            attackAlly(rest[Math.floor(Math.random() * rest.length)], Math.round(battle.enemy.atk * 0.55));
          }
          break;
        case "Fantassin":
          for (let i = 0; i < 4; i++) {
            const rest = aliveIdx();
            if (!rest.length) break;
            attackAlly(rest[Math.floor(Math.random() * rest.length)], Math.round(battle.enemy.atk * 0.5));
          }
          break;
        case "Nécromant": {
          let drained = 0;
          aliveIdx().forEach((i) => {
            const d = Math.round(battle.units[i].hp * 0.06);
            battle.hp[i] = Math.max(0, battle.hp[i] - d);
            drained += d;
            if (battle.hp[i] === 0) battle.log.unshift(battle.units[i].name + " tombe K.O.");
          });
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + drained);
          battle.log.unshift("Moisson noire : " + Math.round(drained) + " PV absorbés");
          break;
        }
        case "Banshee":
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.7));
          break;
        case "Sanguinaire":
          attackAlly(targets.sort((a, b) => battle.hp[a] - battle.hp[b])[0], Math.round(battle.enemy.atk * 2.2));
          break;
        case "Colosse de givre":
          aliveIdx().forEach((i) => attackAlly(i, Math.round(battle.enemy.atk * 0.75)));
          battle.gauge = Math.max(0, battle.gauge - 10);
          break;
        case "Drakônide": {
          const tiD = targets[Math.floor(Math.random() * targets.length)];
          const dealt = attackAlly(tiD, Math.round(battle.enemy.atk * 1.6));
          const healD = Math.round(dealt * 0.4);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + healD);
          battle.log.unshift("Vol de sang : le drake absorbe " + healD + " PV");
          break;
        }
        case "Faucheur": {
          const low = targets.slice().sort((a, b) => (battle.hp[a] / battle.units[a].hp) - (battle.hp[b] / battle.units[b].hp))[0];
          let rawF = battle.enemy.atk * 1.5;
          if (battle.hp[low] / battle.units[low].hp < 0.4) rawF *= 1.5;
          attackAlly(low, Math.round(rawF));
          break;
        }
        case "Gardien des runes":
          battle.guardShell = 3;
          attackAlly(targets[Math.floor(Math.random() * targets.length)], Math.round(battle.enemy.atk * 0.9));
          battle.log.unshift("Carapace runique active pendant 3 tours");
          break;
        case "Cultiste":
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.05);
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.85));
          aliveIdx().forEach((i) => attackAlly(i, Math.round(battle.enemy.atk * 0.6)));
          break;
        default:
          attackAlly(targets[Math.floor(Math.random() * targets.length)], Math.round(battle.enemy.atk * 1.4));
      }
    }

    function heroElan() {
      const alive = aliveIdx();
      if (!alive.length || battle.enemy.hp <= 0) return;
      const si = alive.slice().sort((a, b) => battle.units[b].atk - battle.units[a].atk)[0];
      const u = battle.units[si];
      const fx = unitFx(u);
      const elanStamp = "⟈ ÉLAN " + u.name;
      switch (u.cls) {
        case "Chevalier":
          battle.teamShield = 0.35;
          battle.log.unshift(elanStamp + " : serment d'acier — prochaine riposte réduite de 35 %");
          break;
        case "Défenseur":
          battle.teamShield = 0.45;
          battle.log.unshift(elanStamp + " : bastion — prochaine riposte réduite de 45 %");
          break;
        case "Berserker":
          hitEnemy(Math.round(u.atk * 1.4 * (1 + (fx.dmg || 0) / 100) * teamAtkMult()), u.name, "ÉLAN (frénésie)");
          break;
        case "Mage":
          hitEnemy(Math.round(u.atk * 1.2 * (1 + (fx.dmg || 0) / 100) * teamAtkMult()), u.name, "ÉLAN (arcane)");
          battle.gauge = Math.min(100, battle.gauge + 15);
          break;
        case "Archer": {
          let dA = Math.round(u.atk * 1.6 * (1 + (fx.dmg || 0) / 100) * teamAtkMult() * 2 * 0.5);
          hitEnemy(dA, u.name, "ÉLAN (tir critique)");
          break;
        }
        case "Rôdeur":
          battle.techElan = 0.5;
          battle.log.unshift(elanStamp + " : voile vert — la moitié des ripostes du prochain tour seront esquivées");
          break;
        case "Héros":
          battle.elanAtk = (battle.elanAtk || 0) + 10;
          battle.log.unshift(elanStamp + " : ralliement — ATK d'équipe +10 % (définitif)");
          break;
        case "Soigneur": {
          alive.forEach((i) => {
            const h = Math.round(u.atk * 0.35 * (1 + (fx.heal || 0) / 100));
            const healed = Math.min(battle.units[i].hp - battle.hp[i], h);
            if (healed > 0) {
              battle.hp[i] += healed;
              battle.log.unshift(elanStamp + " : soins d'équipe (+" + healed + " à " + battle.units[i].name + ")");
            }
          });
          break;
        }
        case "Tueur": {
          let dT = Math.round(u.atk * 1.8 * (1 + (fx.dmg || 0) / 100) * teamAtkMult());
          if (battle.enemy.hp / battle.enemy.maxHp < 0.5) dT = Math.round(dT * 1.3);
          hitEnemy(dT, u.name, "ÉLAN (mise à mort)");
          break;
        }
        case "Invocateur":
          hitEnemy(Math.round(u.atk * 0.9), u.name, "ÉLAN (ombre)");
          hitEnemy(Math.round(u.atk * 0.9), u.name, "ÉLAN (seconde ombre)");
          break;
        case "Valkyrie": {
          const weak = alive.slice().sort((a, b) => battle.hp[a] - battle.hp[b])[0];
          const hV = Math.round(u.atk * 0.6 * (1 + (fx.heal || 0) / 100));
          const healedV = Math.min(battle.units[weak].hp - battle.hp[weak], hV);
          if (healedV > 0) {
            battle.hp[weak] += healedV;
            battle.log.unshift(elanStamp + " : plonge et soigne " + battle.units[weak].name + " (+" + healedV + " PV)");
          }
          hitEnemy(Math.round(u.atk * 0.6 * (1 + (fx.dmg || 0) / 100) * teamAtkMult()), u.name, "ÉLAN (aile d'orage)");
          break;
        }
        default:
          hitEnemy(Math.round(u.atk * 1.2), u.name, "ÉLAN");
      }
      OS.sfx.play("crit");
    }

    function enemyTurn() {
      const targets = aliveIdx();
      if (!targets.length) return endBattle(false);
      battle.turns = (battle.turns || 0) + 1;
      if ((battle.runeShield || 0) > 0) battle.runeShield--;
      if ((battle.guardShell || 0) > 0) battle.guardShell--;
      battle.techElanActive = battle.techElan || 0;
      battle.techElan = 0;
      const type = battle.enemy.type;
      const eDef = ENEMY_TYPES[type] || {};
      if (battle.turns % (eDef.ultEvery || 6) === 0) {
        enemyUltimate();
        if (!aliveIdx().length) return endBattle(false);
        if (battle.enemy.hp <= 0) return endBattle(true);
      }
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
        case "Drak\u00f4nide": {
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.95 * (0.85 + Math.random() * 0.25)));
          battle.log.unshift("Descend en piqu\u00e9 : le Drak\u00f4nide plonge de haut !");
          break;
        }
        case "Faucheur": {
          const tsF = targets.slice().sort((a, b) => (battle.hp[a] / battle.units[a].hp) - (battle.hp[b] / battle.units[b].hp));
          ti = tsF[0];
          let rawF = battle.enemy.atk * 1.1;
          if (battle.hp[ti] / battle.units[ti].hp < 0.4) rawF *= 1.8;
          attackAlly(ti, Math.round(rawF * (0.9 + Math.random() * 0.2)));
          if (battle.hp[ti] / battle.units[ti].hp < 0.4) battle.log.unshift("Ex\u00e9cution : la faux s'abat sur " + battle.units[ti].name + " !");
          break;
        }
        case "Gardien des runes": {
          battle.runeShield = 2;
          battle.log.unshift("Le Gardien grave un bouclier runique !");
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.8 * (0.85 + Math.random() * 0.25)));
          break;
        }
        case "Cultiste": {
          battle.gauge = Math.max(0, Math.round(battle.gauge * 0.94));
          ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.95 * (0.85 + Math.random() * 0.3)));
          battle.log.unshift("Chant du retour : votre jauge faiblit, le culte monte !");
          break;
        }
        default: {
          const tk = targets.filter((i) => battle.units[i].cls === "Tueur");
          if (tk.length && Math.random() < 0.6) ti = tk[0];
          else ti = targets[Math.floor(Math.random() * targets.length)];
          attackAlly(ti, Math.round(battle.enemy.atk * 0.9 * (0.8 + Math.random() * 0.4)));
        }
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
        } else if (battle.elite.id === "execu") {
          const low = aliveIdx().sort((a, b) => (battle.hp[a] / battle.units[a].hp) - (battle.hp[b] / battle.units[b].hp))[0];
          if (low !== undefined) {
            attackAlly(low, Math.round(battle.enemy.atk * 0.5));
            battle.log.unshift("Hache d'exécution : la faux cherche le plus blessé !");
          }
        } else if (battle.elite.id === "vol") {
          const healV = Math.round(battle.enemy.maxHp * 0.1);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + healV);
          battle.log.unshift("Vol de sang : la vouivre récupère des forces (" + healV + ")");
        } else if (battle.elite.id === "appel") {
          battle.enemy.atk = Math.round(battle.enemy.atk * 1.04);
          const healA = Math.round(battle.enemy.maxHp * 0.03);
          battle.enemy.hp = Math.min(battle.enemy.maxHp, battle.enemy.hp + healA);
          battle.log.unshift("Appel des cendres : le culte grandit (+4 % ATK, soins)");
        }
      }
      if (!aliveIdx().length) return endBattle(false);
      if (battle.turns % 7 === 0) {
        heroElan();
        if (!aliveIdx().length) return endBattle(false);
        if (battle.enemy.hp <= 0) return endBattle(true);
      }
      newHand();
    }

    function endBattle(win) {
      if (battle.mode === "train") {
        battle.over = true;
        battle.log.unshift(win ? "Mannequin détruit ! Entraînement réussi (aucun gain)." : "Le mannequin tient bon… (aucun gain)");
        OS.sfx.play(win ? "victory" : "defeat");
        renderQuests();
        return;
      }
      if (win && battle.mode === "infini") return advanceFloor();
      if (win && battle.mode === "raid" && battle.raidPhase < 3) {
        raid.cleared = Math.max(raid.cleared || 0, battle.raidPhase);
        persistRaid();
        const ph = RAID_PHASES[battle.raidPhase];
        battle.raidPhase++;
        battle.enemy = { name: ph.name, type: ph.type, hp: ph.hp, maxHp: ph.hp, atk: ph.atk };
        battle.elite = ph.elite;
        battle.hp = battle.units.map((u) => u.hp);
        battle.gauge = Math.min(100, battle.gauge + 30);
        battle.curse = 0;
        battle.burn = 0;
        battle.turns = 0;
        battle.elanAtk = 0;
        battle.teamShield = 0;
        battle.techElanActive = 0;
        battle.runeShield = 0;
        battle.guardShell = 0;
        const wonPhases = battle.raidPhase - 1;
        gainLoot({ cristal: 1, ...classMatGains(1) });
        battle.log.unshift("Phase " + wonPhases + " franchie ! +1 Cristal de relique. L'équipe est restaurée.");
        battle.log.unshift("----- RAID · Phase " + battle.raidPhase + "/3 : " + ph.name + " -----");
        if (battle.elite) battle.log.unshift("[Élite] " + battle.elite.name + " : " + battle.elite.desc);
        newHand();
        renderQuests();
        return;
      }
      let reward;
      if (battle.mode === "infini") {
        reward = Math.max(2, battle.floor * 3);
        if (battle.floor > infiniteBest) {
          infiniteBest = battle.floor;
          OS.store.set("infinite-best", infiniteBest);
          battle.log.unshift("Nouveau record d'étages : " + infiniteBest + " !");
        }
      } else if (battle.mode === "histoire") {
        reward = win ? battle.enemy.reward : 2;
        if (win) {
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
      renderQuests();
    }

    function advanceFloor() {
      battle.floor++;
      trackDaily("floor", battle.floor, "abs");
      const flGain = { coeur: 1, poussiere: 1, ...classMatGains(1) };
      if (battle.floor % 5 === 0) { flGain.elixir = 1; flGain.cristal = 1; }
      battle.log.unshift("Butin : " + gainLoot(flGain));
      battle.log.unshift("--- Étage " + battle.floor + " franchi ---");
      battle.hp = battle.units.map((u, i) => Math.min(u.hp, battle.hp[i] + Math.round(u.hp * 0.25)));
      battle.gauge = Math.min(100, battle.gauge + 15);
      battle.curse = 0;
      battle.burn = 0;
      const scale = Math.pow(1.18, battle.floor - 1);
      const etype = Object.keys(ENEMY_TYPES)[Math.floor(Math.random() * Object.keys(ENEMY_TYPES).length)];
      const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
      const golemMult = etype === "Golem" ? 1.15 : 1;
      battle.enemy = { name, type: etype, hp: Math.round(TIER.infini.hp * golemMult * scale), maxHp: Math.round(TIER.infini.hp * golemMult * scale), atk: Math.round(TIER.infini.atk * Math.pow(1.09, battle.floor)) };
      battle.log.unshift(battle.enemy.name + " [" + etype + "] arrive · " + ENEMY_TYPES[etype].desc);
      newHand();
      renderQuests();
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
            cont.textContent = "Continuer l'histoire ▸";
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
        const floorTag = battle.mode === "infini" ? " · Étage " + battle.floor
          : battle.mode === "histoire" ? " · Boss d'histoire · " + battle.diffLabel
          : battle.mode === "raid" ? " · RAID · Phase " + battle.raidPhase + "/3"
          : "";
        view.insertBefore(battleSceneArt(), view.firstChild);
        view.appendChild(bar(battle.enemy.name + " · " + battle.enemy.type + floorTag, battle.enemy.hp, battle.enemy.maxHp, "enemy"));

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
      { name: "Bannière du Général", color: "#4a4f60" },
      { name: "Bannière de la Vouivre", color: "#3b6b6f" },
      { name: "Bannière de l'Archonte", color: "#7d3bd4" },
    ];
    const BOSS_IDX = [1, 3, 6, 9, 11, 12, 20, 21];

    function bannerUnlockedAt(t, beaten) {
      if (t >= 5) return (beaten[BOSS_IDX[t]] || 0) >= 6;
      return BOSS_IDX.every((i) => (beaten[i] || 0) >= t + 1);
    }

    function bannersUnlockedCount() {
      const beaten = storyState.bossBeaten || {};
      let n = 0;
      for (let t = 0; t < BANNERS.length; t++) {
        if (bannerUnlockedAt(t, beaten)) n = t + 1;
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
          { boss: { name: "Meute d'ombre", type: "Brute", hp: 9700, atk: 1120, reward: 12, elite: { id: "meute", name: "Chasse en meute", desc: "un second prédateur frappe chaque tour" }, intro: "La meute se jette sur vous. Premier vrai combat." } },
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
          { boss: { name: "Gortak, chef de guerre", type: "Brute", hp: 15000, atk: 1450, reward: 18, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" }, intro: "Gortak lève sa masse de fer. Le sol en tremble." } },
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
          { boss: { name: "Spectre des urnes", type: "Sorcier", hp: 25900, atk: 1930, reward: 25, elite: { id: "siphon", name: "Siphon d'âmes", desc: "se soigne de la moitié des dégâts infligés" }, intro: "Le spectre embrase le parvis de runes bleues." } },
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
          { boss: { name: "Chevalier de cendres", type: "Capitaine", hp: 32400, atk: 2210, reward: 30, elite: { id: "oriflamme", name: "Oriflamme maudite", desc: "votre Ultime se charge 20 % moins vite" }, intro: "Le chevalier lève son oriflamme brûlée : il gagnera en force à chaque tour." } },
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
          { boss: { name: "Dragon des cendres", type: "Brute", hp: 45400, atk: 2430, reward: 40, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" }, intro: "Le boss final. Toute la légende tient dans ce combat." } },
          { t: "Le dragon s'effondre en une pluie de braises. Sur l'horizon, pour la première fois depuis un an, le ciel se lève clair." },
          { s: "Dame Elise", t: "La route du nord est ouverte. Qu'on raconte que trois volontaires l'ont faite." },
          { t: "FIN — La légende du dragon des cendres, qu'un village nomme encore celle des Trois Volontaires." },
        ],
      },
      /* --- Acte III (suite) --- */
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le général de cendre",
        scene: { sky: "ash", ground: "vulkan", sunX: 60, actors: [
          { cls: "Chevalier", color: "#e3b23c", x: 120 },
          { cls: "Archer", color: "#3ba75c", x: 160, flip: true },
        ] },
        events: [
          { t: "L'armure du dragon ne meurt pas seule : ce qui restait de sa garde se rassemble sous une grande faux noire. Le Général des cendres a servi le brasier plus longtemps que vous ne vivez." },
          { s: "Le Général des cendres", t: "LE DRAGON VIVRA DANS LA CENDRE QUE VOUS ÊTES. GENOUX À TERRE, OU QUE LA FAUX VOUS RÉCOLTE." },
          { s: "Draven", t: "C'est drôle : j'allais te dire exactement la même chose, mais à l'envers." },
          { boss: { name: "Général des cendres", type: "Faucheur", hp: 46800, atk: 2520, reward: 44, elite: { id: "execu", name: "Hache d'exécution", desc: "chaque tour, la faux cherche le héros le plus blessé" }, intro: "La faux siffle. Elle connaît les blessures avant vous." } },
          { t: "Le Général tombe à genoux et se dissout en une pluie de cendre tiède. Sous l'armure vide, il ne reste qu'un médaillon gravé d'une flamme." },
          { s: "Dame Elise", t: "Ce médaillon… il a la même patine que nos plus vieilles reliques. La cendre attendait quelque chose — quelqu'un." },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "La descendance des braises",
        scene: { sky: "dawn", ground: "sanctuaire", sunX: 160, actors: [
          { cls: "Soigneur", color: "#3bd4a0", x: 120 },
          { cls: "Mage", color: "#6b4f9e", x: 160, flip: true },
        ] },
        events: [
          { t: "Au feu de camp, le médaillon se met à vibrer. Une flamme douce s'en échappe, haute comme une enfant, et se donne un visage. « Astrée », murmure-t-elle. « La cendre est de ma famille. »" },
          { s: "Astrée", t: "Il y a un an, le dragon brûlait le nord. Aujourd'hui sa cendre parle. Écoutez-la : quelque chose veut se relever à sa place." },
          { s: "Kaeren", t: "Une descendante du brasier, qui choisit notre camp ? Le nord n'a pas fini de surprendre." },
          { s: "Astrée", t: "Le brasier n'a jamais voulu détruire. On l'a détourné. Je viens réparer ce qu'on a fait de ma famille — et j'apprendrai à vos côtés." },
          { q: "Comment accueillez-vous Astrée ?", opts: [
            { label: "Une place au feu de camp", blessing: "runes" },
            { label: "Une arme et un serment", blessing: "courage" },
          ] },
          { t: "Astrée s'assied près du feu. Dans le ciel, les braises dessinent la première constellation nouvelle : le serment grandit." },
        ],
      },
      {
        act: "Acte III — Le dragon des cendres",
        title: "Le camp des braises",
        scene: { sky: "night", ground: "village", stars: true, sunX: 60, actors: [
          { cls: "Rôdeur", color: "#4f9eff", x: 120 },
          { cls: "Berserker", color: "#c34a2f", x: 160, flip: true },
        ] },
        events: [
          { t: "Les volontaires accourent du sud. Deux rumeurs courent plus vite qu'eux : une aile immense au-dessus des cimes, et des voix qui chantent au fond des cratères." },
          { s: "Orwen", t: "Une vouivre et un culte. La cendre se réorganise plus vite que nous ne la balayons." },
          { s: "Astrée", t: "Alors préparons tout : reliques réparées, bannières neuves. Le sud nous attend dès l'aube." },
          { q: "Que dites-vous aux volontaires réunis ?", opts: [
            { label: "« Nous marchons à l'aube »", blessing: "courage" },
            { label: "« Bandons d'abord les blessures »", blessing: "os" },
          ] },
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
          { boss: { name: "Nomade sans visage", type: "Banshee", hp: 49800, atk: 2540, reward: 42, elite: { id: "veil", name: "Voile d'ombre", desc: "draine 12 % de votre jauge d'Ultime à chaque tour" }, intro: "Le visage vide fixe votre serment. Il veut le rendre gris." } },
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
          { boss: { name: "Prêtre des braises", type: "Nécromant", hp: 54100, atk: 2700, reward: 45, intro: "Le juste funeste buvra vos forces. Frappez sans relâche." } },
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
          { boss: { name: "Golem du serment", type: "Golem", hp: 58500, atk: 2810, reward: 48, elite: { id: "massue", name: "Massue écrasante", desc: "+6 % d'ATK à chacun de ses tours" }, intro: "Le golem baisse sa garde pour vous écouter : il en profite pour frapper." } },
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
          { boss: { name: "La triade de fer", type: "Fantassin", hp: 62800, atk: 2920, reward: 50, elite: { id: "meute", name: "Chasse en meute", desc: "un second prédateur frappe chaque tour" }, intro: "Trois fantassins qui frappent en même temps. Attention au second coup." } },
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
          { boss: { name: "Sanguinaire des cratères", type: "Sanguinaire", hp: 67100, atk: 3080, reward: 52, elite: { id: "souffle", name: "Souffle de cendres", desc: "brûle toute l'équipe (3 % PV max) à chaque tour" }, intro: "L'ordre de braise chasse les blessés. Restez debout." } },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "La vouivre des cimes",
        scene: { sky: "night", ground: "canopee3", stars: true, sunX: 250, actors: [
          { cls: "Archer", color: "#3ba75c", x: 120 },
          { cls: "Chevalier", color: "#e3b23c", x: 160, flip: true },
        ] },
        events: [
          { t: "Au-dessus de la canopée, une ombre d'écailles et de braises décrit de larges cercles. La vouivre descend en piqué sur la piste des volontaires, et le sol s'embrase à son ombre." },
          { s: "Astrée", t: "Une fille du brasier, mais retournée : elle boit la douleur du monde et la rend en flammes. Son creur n'est plus qu'un nid de braises." },
          { s: "Astrée", t: "Frappez fort, frappez vite : tout ce qu'elle vole, elle le garde." },
          { boss: { name: "Vouivre des braises", type: "Drakônide", hp: 69600, atk: 3150, reward: 57, elite: { id: "vol", name: "Vol de sang", desc: "se soigne de 10 % de ses PV max à chaque tour" }, intro: "La vouivre plonge. Son ombre brûle plus fort que son feu." } },
          { t: "La vouivre s'effondre sur la piste, devient cendre à son tour. Les cimes rendent le silence qu'elles avaient prêté au bruit." },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "Le culte du retour",
        scene: { sky: "ash", ground: "sanctuaire", sunX: 250, actors: [
          { cls: "Mage", color: "#6b4f9e", x: 120 },
          { cls: "Défenseur", color: "#9fb0c8", x: 160, flip: true },
        ] },
        events: [
          { t: "Dans le grand cratère, le chant est devenu un chœur. Une hése de robes noires ahane un rituel neuf : rendre son corps à la cendre, lui redonner un Coeur de braise." },
          { s: "Astrée", t: "L'Archonte. Ils veulent mon ancêtre à nouveau, mais version esclave : un dieu de cendre à leur botte. Ça, je ne le permettrai jamais." },
          { s: "Kaeren", t: "Alors arrachons-leur leur chœur. Sans voix, un culte n'est qu'un tas de robes." },
          { boss: { name: "Archonte des cendres", type: "Cultiste", hp: 73600, atk: 3280, reward: 60, elite: { id: "appel", name: "Appel des cendres", desc: "gagne de la force et se remet à chaque tour" }, intro: "Le chœur se tait d'un coup. L'Archonte s'avance, et la cendre se dresse en muraille." } },
          { t: "Le chant meurt avec l'Archonte. Les robes s'enfuient dans la fumée, et le cratère rend enfin un air tiède et libre." },
        ],
      },
      {
        act: "Acte IV — Les braises d'avant",
        title: "Le feu qui choisit",
        scene: { sky: "dawn", ground: "sanctuaire", sunX: 160, actors: [
          { cls: "Héros", color: "#d8a63b", x: 120 },
          { cls: "Mage", color: "#6b4f9e", x: 160, flip: true },
        ] },
        events: [
          { t: "Toutes les bannières battent ensemble sur le sanctuaire. Astrée se tient debout face au brasier central, et le brasier se tait pour l'écouter." },
          { s: "Astrée", t: "Voilà ce que j'ai compris chez vous : le brasier n'est pas une arme, c'est une promesse. Je choisis la vôtre — celle qui reste debout." },
          { q: "Que dit la légende sur ce jour ?", opts: [
            { label: "« Le brasier a choisi »", blessing: "runes" },
            { label: "« Les volontaires ont choisi »", blessing: "courage" },
          ] },
          { t: "Le brasier s'incline doucement, comme un serment rendu. Derrière la muraille, quelque chose de très ancien commence à se réveiller." },
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
          { boss: { name: "Écho du premier dragon", type: "Sorcier", hp: 71500, atk: 3240, reward: 55, intro: "Le souvenir brûle plus fort que la cendre. Regardez-le endurer, puis tomber." } },
          { t: "L'écho retombe en poussière tiède. Sur la muraille, une dernière ligne s'allume : « Trois restèrent debout, et le monde se souvint. »" },
          { t: "FIN DE L'EPILOGUE — Astéria commence toujours par trois volontaires : ceux qui restent debout. La suite, c'est vous qui la perpétuez." },
        ],
      },
    ];

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
        OS.sfx.setMusic(!OS.sfx.musicPlaying);
        storyState.music = OS.sfx.musicPlaying;
        persistStory();
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
          c.innerHTML = "<b>" + (i + 1) + ". " + ch.title + "</b><small>" + (done ? "✓ terminé" : locked ? "verrouillé" : "▶ jouer") + "</small>";
          if (!locked) c.addEventListener("click", () => { OS.sfx.play("page"); openScene(i); });
          list.appendChild(c);
        });
        wrap.appendChild(list);
      });
      return wrap;
    }

    function renderStory() {
      clearTyping();
      setActiveTab(tabStory);
      content.innerHTML = "";
      content.appendChild(quartzBar());
      if (storyState.music) OS.sfx.setMusic(true);

      const hint = document.createElement("div");
      hint.className = "team-hint";
      hint.textContent = "Mode Histoire — trois volontaires sur la route du nord.";
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
      clearTyping();
      const ch = STORY[storyScene.idx];
      const ev = ch.events[storyScene.step];
      content.innerHTML = "";
      content.appendChild(quartzBar());
      content.appendChild(storyBackBtn());

      const art = document.createElement("div");
      art.className = "story-art-box";
      art.innerHTML = OS.art.scene(sceneWithTeam(ch.scene));
      content.appendChild(art);

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
      } else if (ev.boss) {
        const text = document.createElement("div");
        text.className = "story-text";
        const line = document.createElement("div");
        line.className = "story-line current";
        text.appendChild(line);
        content.appendChild(text);
        typeCurrentLine(line, ev.boss.intro);

        const boss = document.createElement("button");
        boss.className = "pull-btn tier-infini story-boss";
        boss.textContent = "⚔ Engager : " + ev.boss.name;
        boss.addEventListener("click", () => startStoryBattle(ev.boss));
        content.appendChild(boss);
      } else {
        const text = document.createElement("div");
        text.className = "story-text";
        if (ev.s) {
          const sp = document.createElement("div");
          sp.className = "story-speaker";
          sp.textContent = ev.s;
          text.appendChild(sp);
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
      clearTyping();
      const ch = STORY[i];
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

    function startStoryBattle(cfg) {
      const team = teamUnits();
      if (!team.length) { renderStory(); return; }
      const fx = BLESSING_FX[storyState.blessing] || {};
      const d = STORY_DIFFS[storyState.diff || "moyen"];
      const hp = Math.round(cfg.hp * (fx.hpMult || 1) * d.hp);
      storyScene = { idx: storyScene ? storyScene.idx : 0, step: storyScene ? storyScene.step : 0 };
      battle = {
        mode: "histoire",
        tier: "histoire",
        storyChapter: storyScene.idx,
        storyStep: storyScene.step,
        bossCfg: cfg,
        storyMult: fx.mult || 1,
        floor: storyScene.idx + 1,
        enemy: { name: cfg.name, type: cfg.type, hp, maxHp: hp, atk: Math.round(cfg.atk * d.atk), reward: Math.max(2, Math.round(cfg.reward * d.rw)) },
        diffLabel: d.label,
        units: team,
        hp: team.map((u) => u.hp),
        gauge: initialGauge(team, 100, fx.gauge || 0),
        picks: 0,
        curse: 0,
        burn: 0,
        valenFury: 0,
        turns: 0,
        elanAtk: 0,
        teamShield: 0,
        techElanActive: 0,
        log: [],
      };
      if (d.elite && cfg.elite) battle.elite = cfg.elite;
      newHand();
      battle.heroStacks = team.map((u) => (u.cls === "Héros" ? 0 : -1));
      battle.log.unshift("----- " + cfg.name + " [Boss d'histoire · " + d.label + "] · récompense : " + battle.enemy.reward + " ◆ -----");
      if (battle.elite) battle.log.unshift("[Enfer+] " + battle.elite.name + " : " + battle.elite.desc);
      if (battle.elite) OS.sfx.play("arcane");
      OS.sfx.play("ult");
      renderQuests();
    }

    function onStoryContinue() {
      const idx = battle.storyChapter;
      const step = battle.storyStep + 1;
      const fresh = !!battle.freshWin;
      storyScene = { idx, step };
      if (step >= STORY[idx].events.length) renderDoneChapter(idx, fresh ? "boss vaincu !" : "déjà lu");
      else renderScene();
    }

    function onStoryRetry() {
      storyScene = { idx: battle.storyChapter, step: battle.storyStep };
      openScene(battle.storyChapter, battle.storyStep);
    }

    /* ---------- API diffé pour la barre supérieure ---------- */
    OS.asteriaData.storyDiffs = function () {
      const st = OS.store.get("asteria-story", {});
      const beaten = st.bossBeaten || {};
      let bn = 0;
      for (let t = 0; t < BANNERS.length; t++) {
        if (bannerUnlockedAt(t, beaten)) bn = t + 1;
      }
      return Object.keys(STORY_DIFFS).map((key) => ({
        key,
        label: STORY_DIFFS[key].label,
        locked: !diffUnlockedSt(st, key),
        active: (st.diff || "facile") === key,
      }));
    };
    OS.asteriaData.setStoryDiff = function (key) {
      const st = OS.store.get("asteria-story", {});
      const infos = OS.asteriaData.storyDiffs();
      const info = infos.find((d) => d.key === key);
      if (!info || info.locked) return false;
      st.diff = key;
      if (st.done === undefined) st.done = 0;
      OS.store.set("asteria-story", st);
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
