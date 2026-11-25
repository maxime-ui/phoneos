/* Astéria — moteur audio (Web Audio, synthèse pure, aucun fichier) */
"use strict";

OS.sfx = (() => {
  let ctx = null;
  let masterGain = null;
  let volume = Math.max(0, Math.min(100, Number(OS.store.get("volume", 60)) || 0));
  let musicOn = false;
  let musicVoice = null;
  let muted = OS.store.get("sound-muted", false);

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
      } catch {
        ctx = null;
        return null;
      }
    }
    if (ctx && !masterGain) {
      masterGain = ctx.createGain();
      masterGain.gain.value = volume / 100;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function beep(opts) {
    if (muted) return;
    const c = ac();
    if (!c || !musicOn && opts.music !== undefined) return;
    const t0 = c.currentTime + (opts.delay || 0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type || "sine";
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.slideTo), t0 + (opts.dur || 0.15));
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(opts.vol || 0.15, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (opts.dur || 0.15));
    osc.connect(gain).connect(masterGain || c.destination);
    osc.start(t0);
    osc.stop(t0 + (opts.dur || 0.15) + 0.05);
  }

  function noise(dur, vol, filterFreq) {
    if (muted) return;
    const c = ac();
    if (!c) return;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFreq || 900;
    const gain = c.createGain();
    gain.gain.value = vol || 0.18;
    src.connect(filter).connect(gain).connect(masterGain || c.destination);
    src.start();
  }

  function play(name) {
    switch (name) {
      case "hit": beep({ freq: 200, slideTo: 90, dur: 0.12, type: "square", vol: 0.12 }); noise(0.08, 0.12, 700); break;
      case "crit": beep({ freq: 320, slideTo: 1400, dur: 0.16, type: "sawtooth", vol: 0.14 }); noise(0.14, 0.2, 2400); break;
      case "arcane": beep({ freq: 480, slideTo: 960, dur: 0.22, type: "sine", vol: 0.13 }); break;
      case "quick": beep({ freq: 700, slideTo: 1100, dur: 0.09, type: "triangle", vol: 0.11 }); break;
      case "ult":
        beep({ freq: 160, slideTo: 60, dur: 0.5, type: "sawtooth", vol: 0.18 });
        beep({ freq: 320, slideTo: 1200, dur: 0.4, type: "sine", vol: 0.12, delay: 0.1 });
        noise(0.5, 0.2, 1600);
        break;
      case "victory":
        [523, 659, 784, 1047].forEach((f, i) => beep({ freq: f, dur: 0.18, type: "triangle", vol: 0.13, delay: i * 0.13 }));
        break;
      case "defeat":
        beep({ freq: 260, slideTo: 130, dur: 0.5, type: "sawtooth", vol: 0.13 });
        beep({ freq: 180, slideTo: 90, dur: 0.7, type: "sawtooth", vol: 0.1, delay: 0.25 });
        break;
      case "gacha":
        [660, 880].forEach((f, i) => beep({ freq: f, dur: 0.12, type: "sine", vol: 0.12, delay: i * 0.1 }));
        break;
      case "ssr":
        [523, 659, 784, 1047, 1319].forEach((f, i) => beep({ freq: f, dur: 0.22, type: "triangle", vol: 0.14, delay: i * 0.11 }));
        [262, 392].forEach((f, i) => beep({ freq: f, dur: 0.5, type: "sine", vol: 0.08, delay: 0.6 + i * 0.2 }));
        break;
      case "page": noise(0.12, 0.06, 3200); break;
      case "type": beep({ freq: 880 + Math.random() * 200, dur: 0.015, type: "square", vol: 0.015 }); break;
      case "heal":
        beep({ freq: 660, slideTo: 880, dur: 0.18, type: "sine", vol: 0.1 });
        beep({ freq: 990, dur: 0.22, type: "sine", vol: 0.07, delay: 0.12 });
        break;
      case "ui": beep({ freq: 520, dur: 0.06, type: "sine", vol: 0.07 }); break;
      case "unlock":
        [392, 523, 659].forEach((f, i) => beep({ freq: f, dur: 0.15, type: "sine", vol: 0.12, delay: i * 0.09 }));
        break;
    }
  }

  /* Musique : boucle chiptune pentatonique */
  const SCALE = [220, 261.6, 293.7, 329.6, 392, 440, 523.3];
  const MELODY = [0, 3, 5, 3, 7, 5, 3, 2, 0, 2, 3, 5, 3, 7, 10, 7, 5, 3, 2, 0, 2, 3, 7, 5];
  const BASS = [110, 110, 130.8, 98];
  const THEMES = {
    default: { melody: MELODY, bass: BASS },
    summon: { melody: [0, 3, 5, 7, 10, 7, 5, 3, 2, 5, 7, 10, 12, 10, 7, 5], bass: [110, 146.8, 164.8, 130.8] },
    forge: { melody: [0, 0, 3, 5, 3, 7, 5, 3, 0, 2, 5, 7, 5, 3, 2, 0], bass: [82.4, 110, 98, 73.4] },
    training: { melody: [0, 2, 4, 5, 7, 5, 4, 2, 0, 4, 5, 7, 9, 7, 5, 4], bass: [98, 110, 130.8, 110] },
    collection: { melody: [0, 5, 3, 7, 5, 10, 7, 5, 3, 7, 5, 10, 12, 10, 7, 3], bass: [130.8, 110, 146.8, 98] },
    battle: { melody: [0, 2, 0, 5, 3, 7, 5, 2, 0, 3, 5, 7, 10, 7, 5, 2], bass: [73.4, 73.4, 98, 82.4] },
    story: { melody: [0, 3, 5, 3, 2, 0, 2, 5, 7, 5, 3, 2, 0, 2, 3, 5], bass: [82.4, 98, 110, 73.4] },
  };
  let currentTheme = "default";
  let bar = 0;

  function scheduleBar() {
    if (!musicOn || muted) return;
    const c = ac();
    if (!c) return;
    const beat = 0.14 / Math.max(0.5, OS.store.get("game-speed", 1));
    for (let i = 0; i < 8; i++) {
      const theme = THEMES[currentTheme] || THEMES.default;
      const step = theme.melody[(bar * 8 + i) % theme.melody.length];
      if (step !== null) {
        beep({ freq: SCALE[step % SCALE.length] * (step >= 7 ? 2 : 1), dur: beat * 0.9, type: "triangle", vol: 0.045, music: true, delay: i * beat });
      }
    }
    const theme = THEMES[currentTheme] || THEMES.default;
    beep({ freq: theme.bass[bar % theme.bass.length], dur: beat * 6, type: "sine", vol: 0.07, music: true });
    bar++;
    musicVoice = setTimeout(scheduleBar, beat * 8 * 1000);
  }

  return {
    play,
    setVolume(v) {
      const value = Number(v);
      volume = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
      if (masterGain) masterGain.gain.setTargetAtTime(volume / 100, ctx.currentTime, 0.015);
    },
    get volume() { return volume; },
    setMuted(v) {
      if (muted === !!v) return;
      muted = !!v;
      OS.store.set("sound-muted", v);
      if (v && musicVoice) {
        clearTimeout(musicVoice);
        musicVoice = null;
      } else if (!v && musicOn) {
        scheduleBar();
      }
    },
    setTheme(theme) {
      if (!THEMES[theme] || currentTheme === theme) return;
      currentTheme = theme;
      if (musicOn && !muted) {
        if (musicVoice) clearTimeout(musicVoice);
        musicVoice = null;
        scheduleBar();
      }
    },
    get theme() { return currentTheme; },
    setMusic(on) {
      on = !!on;
      if (musicOn === on) return;
      musicOn = on;
      if (!on && musicVoice) {
        clearTimeout(musicVoice);
        musicVoice = null;
      } else if (on) {
        scheduleBar();
      }
    },
    get musicPlaying() { return musicOn; },
  };
})();
