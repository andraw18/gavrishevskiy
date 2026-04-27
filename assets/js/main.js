
// CURSOR
const cur = document.getElementById('cur');
let mx = window.innerWidth * 0.5;
let my = window.innerHeight * 0.5;
if (cur) {
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  document.querySelectorAll('a,button,.svc-row,.bc,.tr-row').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
}

// PAGE WARP + RED DISTORTION
(function(){
  const body = document.body;
  if (!body || body.dataset.warpInit === '1') return;
  body.dataset.warpInit = '1';

  const root = document.getElementById('pageRoot');
  if (!root) return;

  const triggerWarp = () => {
    const cold = Math.random() < 0.28;
    root.classList.toggle('ice-warp', cold);
    root.classList.toggle('red-warp', !cold);
    window.setTimeout(() => root.classList.remove('red-warp'), 1150);
    window.setTimeout(() => root.classList.remove('ice-warp'), 1150);
  };

  window.setTimeout(triggerWarp, 4500);
  const loop = () => {
    const wait = 14000 + Math.random() * 14000;
    window.setTimeout(() => {
      if (Math.random() < 0.9) triggerWarp();
      loop();
    }, wait);
  };
  loop();
})();

// HERO VIDEO LOOP
(function(){
  const video = document.getElementById('heroVideo');
  if (!video) return;
  video.loop = true;
  video.setAttribute('loop', '');
  const safePlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  video.addEventListener('loadedmetadata', safePlay, { once: true });
  safePlay();
})();

// HERO CMS SYNC
(function(){
  const STORAGE_KEY = 'garvishensky_cms';
  const safeJson = (raw) => {
    try { return JSON.parse(raw || '{}'); } catch { return {}; }
  };

  const applyHeroData = () => {
    const data = safeJson(localStorage.getItem(STORAGE_KEY));
    const hero = data.hero || {};
    const desiredLine1 = 'GAVRISHEVSKIY©';

    const line1 = document.querySelector('.hero .h-line1');
    const line2 = document.querySelector('.hero .h-line2');
    const btns = Array.from(document.querySelectorAll('.hero .h-actions a'));

    if (hero.line1 === 'GAVRISHEVSKY©' || !hero.line1) {
      hero.line1 = desiredLine1;
      data.hero = hero;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }

    if (line1) line1.textContent = hero.line1 || desiredLine1;
    if (line2 && hero.line2) line2.textContent = hero.line2;

    if (btns[0] && hero.btn1Text) btns[0].textContent = hero.btn1Text;
    if (btns[0] && hero.btn1Link) btns[0].setAttribute('href', hero.btn1Link);
    if (btns[1] && hero.btn2Text) btns[1].textContent = hero.btn2Text;
    if (btns[1] && hero.btn2Link) btns[1].setAttribute('href', hero.btn2Link);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHeroData, { once: true });
  } else {
    applyHeroData();
  }
})();

// LAZY VIDEOS
(function(){
  const videos = Array.from(document.querySelectorAll('video[data-lazy-video]'));
  if (!videos.length) return;

  const loadVideo = (video) => {
    if (video.dataset.lazyLoaded === '1') return;
    const sources = Array.from(video.querySelectorAll('source[data-src]'));
    if (!sources.length) return;

    sources.forEach(source => {
      source.src = source.dataset.src;
      delete source.dataset.src;
    });

    video.dataset.lazyLoaded = '1';
    video.load();
    if (video.autoplay) {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(loadVideo);
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '180px 0px' });

  videos.forEach(video => io.observe(video));
})();

// VISUAL CLIP CARDS
(function(){
  const cards = Array.from(document.querySelectorAll('.vg-card'));
  if (!cards.length) return;

  const pauseCard = (card) => {
    const video = card.querySelector('video');
    if (!video) return;
    video.pause();
    card.classList.remove('is-playing');
  };

  const pauseOthers = (current) => {
    cards.forEach(card => {
      if (card !== current) pauseCard(card);
    });
  };

  const playCard = (card) => {
    const video = card.querySelector('video');
    if (!video) return;
    pauseOthers(card);
    card.classList.add('is-playing');
    video.muted = false;
    video.volume = 1;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  cards.forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.vg-play');
    if (!video || !playBtn) return;

    video.pause();

    card.addEventListener('mouseenter', () => playCard(card));
    card.addEventListener('mouseleave', () => pauseCard(card));

    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      video.muted = false;
      video.volume = 1;
      if (video.paused) {
        playCard(card);
      } else {
        pauseCard(card);
      }
    });
  });
})();

// MINI SYNTH
(function(){
  const btn = document.getElementById('soundBtn');
  const panel = document.getElementById('synthPanel');
  const closeBtn = document.getElementById('synthClose');
  const loopBtn = document.getElementById('synLoopBtn');
  const pads = Array.from(document.querySelectorAll('.syn-pad'));
  if (!btn || !panel) return;

  const NOTE_FREQ = {
    C3: 130.81, 'C#3': 138.59, D3: 146.83, 'D#3': 155.56, E3: 164.81,
    F3: 174.61, 'F#3': 185.00, G3: 196.00, 'G#3': 207.65, A3: 220.00,
    'A#3': 233.08, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00,
    C5: 523.25, D5: 587.33
  };
  const loopSeq = ['C3','E3','G3','A3','G3','E3','D3','C3'];
  const KEY_MAP = {
    KeyA: 'C3',
    KeyW: 'C#3',
    KeyS: 'D3',
    KeyE: 'D#3',
    KeyD: 'E3',
    KeyF: 'F3',
    KeyT: 'F#3',
    KeyG: 'G3',
    KeyY: 'G#3',
    KeyH: 'A3',
    KeyU: 'A#3',
    KeyJ: 'B3',
    KeyK: 'C4'
  };

  let ctx = null;
  let master = null;
  let loopTimer = null;
  let loopOn = false;
  let panelOpen = false;
  let step = 0;
  const padByCode = new Map();

  const setBtnState = (open) => {
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-pressed', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Закрыть синтезатор' : 'Открыть синтезатор');
  };

  const ensureAudio = async () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.14;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value = 24;
      comp.ratio.value = 3.6;
      comp.attack.value = 0.008;
      comp.release.value = 0.22;

      const wet = ctx.createGain();
      wet.gain.value = 0.12;

      const dry = ctx.createGain();
      dry.gain.value = 1;

      const convolver = ctx.createConvolver();
      const irLen = Math.min(ctx.sampleRate * 1.6, ctx.sampleRate * 2.2);
      const impulse = ctx.createBuffer(2, irLen, ctx.sampleRate);
      for (let c = 0; c < impulse.numberOfChannels; c++) {
        const ch = impulse.getChannelData(c);
        for (let i = 0; i < irLen; i++) {
          const decay = Math.pow(1 - i / irLen, 2.8);
          ch[i] = (Math.random() * 2 - 1) * decay * (c === 0 ? 0.65 : 0.55);
        }
      }
      convolver.buffer = impulse;

      master.connect(dry);
      master.connect(convolver);
      convolver.connect(wet);
      dry.connect(comp);
      wet.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') await ctx.resume();
  };

  const playTone = (freq, dur = 0.22, type = 'triangle', gainVal = 0.12) => {
    if (!ctx || !master) return;
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const amp = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    const pan = ctx.createStereoPanner?.();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc3.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);
    osc2.frequency.setValueAtTime(freq * 2, t);
    osc3.frequency.setValueAtTime(freq * 3, t);
    osc2.detune.setValueAtTime(-3, t);
    osc3.detune.setValueAtTime(4, t);

    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(Math.max(gainVal * 0.95, 0.0003), t + 0.006);
    amp.gain.exponentialRampToValueAtTime(Math.max(gainVal * 0.58, 0.0002), t + Math.max(dur * 0.42, 0.08));
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.22);

    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(Math.min(5200, freq * 10), t);
    filt.frequency.exponentialRampToValueAtTime(Math.min(2400, freq * 5.8), t + Math.min(dur * 0.7, 0.28));
    filt.Q.value = 1.1;

    if (pan) {
      pan.pan.setValueAtTime((Math.random() * 0.5) - 0.25, t);
      osc1.connect(filt);
      osc2.connect(filt);
      osc3.connect(filt);
      filt.connect(amp);
      amp.connect(pan);
      pan.connect(master);
    } else {
      osc1.connect(filt);
      osc2.connect(filt);
      osc3.connect(filt);
      filt.connect(amp);
      amp.connect(master);
    }

    const sub = ctx.createOscillator();
    const subAmp = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 0.5, t);
    subAmp.gain.setValueAtTime(0.0001, t);
    subAmp.gain.exponentialRampToValueAtTime(Math.min(gainVal * 0.22, 0.04), t + 0.015);
    subAmp.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.2);
    sub.connect(subAmp);
    if (pan) subAmp.connect(pan); else subAmp.connect(master);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    sub.start(t);
    osc1.stop(t + dur + 0.34);
    osc2.stop(t + dur + 0.34);
    osc3.stop(t + dur + 0.34);
    sub.stop(t + dur + 0.34);
  };

  const flashPad = (pad) => {
    if (!pad) return;
    pad.classList.add('active');
    window.setTimeout(() => pad.classList.remove('active'), 160);
  };

  const playPad = async (pad) => {
    if (!pad) return;
    await openPanel();
    const note = pad.dataset.note || 'C4';
    const freq = NOTE_FREQ[note] || NOTE_FREQ.C4;
    playTone(freq, 0.38, 'triangle', note === 'C3' ? 0.1 : 0.085);
    flashPad(pad);
  };

  const openPanel = async () => {
    await ensureAudio();
    panel.classList.add('on');
    panel.setAttribute('aria-hidden', 'false');
    panelOpen = true;
    setBtnState(true);
  };

  const closePanel = () => {
    panel.classList.remove('on');
    panel.setAttribute('aria-hidden', 'true');
    panelOpen = false;
    setBtnState(false);
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
    loopOn = false;
    if (loopBtn) {
      loopBtn.classList.remove('on');
      loopBtn.textContent = 'Loop: off';
    }
  };

  const startLoop = async () => {
    await openPanel();
    if (loopTimer) return;
    loopOn = true;
    loopBtn?.classList.add('on');
    if (loopBtn) loopBtn.textContent = 'Loop: on';
    step = 0;
    playTone(NOTE_FREQ[loopSeq[0]], 0.44, 'triangle', 0.1);
    loopTimer = window.setInterval(() => {
      if (!loopOn) return;
      const note = loopSeq[step % loopSeq.length];
      const freq = NOTE_FREQ[note];
      const accent = step % 4 === 0 ? 0.12 : 0.085;
      playTone(freq, 0.38, 'triangle', accent);
      step = (step + 1) % loopSeq.length;
    }, 360);
  };

  const stopLoop = () => {
    loopOn = false;
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
    if (loopBtn) {
      loopBtn.classList.remove('on');
      loopBtn.textContent = 'Loop: off';
    }
  };

  btn.addEventListener('click', async () => {
    if (panelOpen) {
      closePanel();
    } else {
      await openPanel();
    }
  });

  closeBtn?.addEventListener('click', closePanel);
  loopBtn?.addEventListener('click', () => {
    if (loopOn) {
      stopLoop();
    } else {
      startLoop().catch(() => {});
    }
  });

  pads.forEach(pad => {
    const code = pad.dataset.code;
    if (code) padByCode.set(code, pad);
    pad.addEventListener('click', () => { playPad(pad).catch(() => {}); });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panelOpen) closePanel();
    if (e.repeat) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/i.test(e.target.tagName)) return;
    const pad = padByCode.get(e.code);
    if (!pad) return;
    e.preventDefault();
    playPad(pad).catch(() => {});
  });
})();

// BEGINNER ADVICE MODAL
(function(){
  const btn = document.getElementById('soundBtn');
  const modal = document.getElementById('adviceModal');
  if (!btn || !modal) return;

  const root = document.getElementById('pageRoot');
  const titleEl = document.getElementById('adviceStepTitle');
  const bodyEl = document.getElementById('adviceStepBody');
  const noEl = document.getElementById('adviceNo');
  const dotsEl = document.getElementById('adviceDots');
  const prevBtn = document.getElementById('advicePrev');
  const nextBtn = document.getElementById('adviceNext');
  const closeBtn = document.getElementById('adviceClose');

  const steps = [
    {
      title: 'Сделай один трек визиткой',
      body: 'Не распыляйся на пять сырых песен. Лучше один законченный релиз, который сразу объясняет, кто ты, какой у тебя вайб и почему тебя стоит запомнить.'
    },
    {
      title: 'Определи 2–3 референса заранее',
      body: 'Подбери конкретные ориентиры по звучанию, а не «что-то похожее». Так проще объяснить продюсеру, аранжировщику и дизайнеру, куда двигаться без лишних пересмотров.'
    },
    {
      title: 'Проверь звук на трёх устройствах',
      body: 'Послушай демо в наушниках, на телефоне и в машине. Если бочка, вокал и сибилянты читаются везде, значит релиз уже близок к рабочему уровню.'
    },
    {
      title: 'Сделай короткий питч о себе',
      body: 'Один абзац, где понятно: кто ты, что делаешь, в каком жанре работаешь и в чём твоя фишка. Этот текст пригодится и для заявок, и для сторис, и для презентаций.'
    },
    {
      title: 'Планируй релиз на 7 дней вперёд',
      body: 'День анонса, сниппет, релиз, первые 48 часов, реакция аудитории и повторный пуш. Релиз живёт не только в день выхода, а в сценарии вокруг него.'
    },
    {
      title: 'Подготовь пакет для публикации',
      body: 'Собери обложку, вертикальные видео, описание, теги, ссылку на пресейв и короткий текст для анонса. Когда всё лежит в одной папке, запуск идёт без паники.'
    },
    {
      title: 'Не выпускайся без обратной связи',
      body: 'Попроси 3–5 людей из своей аудитории послушать материал до релиза. Их комментарии часто подсказывают, что нужно докрутить в миксе, подаче или в первом хук-припеве.'
    }
  ];

  let index = 0;

  const renderDots = () => {
    dotsEl.innerHTML = '';
    steps.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `advice-dot${i === index ? ' on' : ''}`;
      dot.setAttribute('aria-label', `Совет ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        render();
      });
      dotsEl.appendChild(dot);
    });
  };

  const render = () => {
    const step = steps[index];
    if (!step) return;
    titleEl.textContent = step.title;
    bodyEl.textContent = step.body;
    noEl.textContent = String(index + 1).padStart(2, '0');
    renderDots();
  };

  const open = () => {
    index = 0;
    render();
    modal.classList.add('on');
    modal.setAttribute('aria-hidden', 'false');
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    document.body.classList.add('advice-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden', 'true');
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
    document.body.classList.remove('advice-open');
    document.body.style.overflow = '';
  };

  const next = () => {
    index = (index + 1) % steps.length;
    render();
  };

  const prev = () => {
    index = (index - 1 + steps.length) % steps.length;
    render();
  };

  btn.addEventListener('click', open);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.dataset.close === 'true') close();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();

// LOADER
(function(){
  const ld = document.getElementById('ld');
  if(!ld) return;
  const safeClose = () => ld.classList.add('out');
  setTimeout(safeClose, 2400);
})();

// NAV
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('stuck',scrollY>60),{passive:true});

// MOBILE
let mobOpen=false;
function toggleMob(){mobOpen=!mobOpen;document.getElementById('mobNav').classList.toggle('open',mobOpen);document.getElementById('burger').classList.toggle('open',mobOpen);document.body.style.overflow=mobOpen?'hidden':'';}
function closeMob(){mobOpen=false;document.getElementById('mobNav').classList.remove('open');document.getElementById('burger').classList.remove('open');document.body.style.overflow='';}

// WAVEFORM
const wf7=document.getElementById('wf7');
if(wf7){for(let i=0;i<18;i++){const b=document.createElement('div');b.className='wf-b';b.style.animationDelay=(Math.random()*.9)+'s';b.style.animationDuration=(.7+Math.random()*.7)+'s';wf7.appendChild(b);}}

// COUNTER
const cObs=new IntersectionObserver(es=>{es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,raw=el.textContent,num=parseFloat(raw)||0,suf=raw.replace(/[\d.]/g,'');
  let s=null;
  function step(ts){if(!s)s=ts;const pg=Math.min((ts-s)/1400,1);el.textContent=Math.round(num*(1-Math.pow(1-pg,3)))+suf;if(pg<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);cObs.unobserve(el);
});},{threshold:.5});
document.querySelectorAll('.a-stat-n').forEach(el=>cObs.observe(el));

// REVEAL
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.05});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

// PLAYER
let playing=false,prog2=0,pIv;
function playT(name,artist){
  document.getElementById('plT').textContent=name;
  document.getElementById('plA').textContent=artist;
  document.getElementById('player').classList.add('on');
  playing=true;prog2=0;document.getElementById('plPlay').textContent='⏸';
  clearInterval(pIv);
  pIv=setInterval(()=>{if(!playing)return;prog2=Math.min(prog2+.2,100);document.getElementById('plF').style.width=prog2+'%';const s=Math.floor(prog2/100*210);document.getElementById('plTime').textContent=Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60;if(prog2>=100)clearInterval(pIv);},200);
}
document.getElementById('plPlay').addEventListener('click',()=>{playing=!playing;document.getElementById('plPlay').textContent=playing?'⏸':'▶';});
function closePl(){document.getElementById('player').classList.remove('on');clearInterval(pIv);playing=false;}
