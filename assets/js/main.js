
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

// TRACK PLAYER
(function(){
  const btn = document.getElementById('soundBtn');
  if (!btn) return;

  const NOTE_FREQ = {
    C2: 65.41,
    D2: 73.42,
    Eb2: 77.78,
    F2: 87.31,
    G2: 98.00,
    Ab2: 103.83,
    Bb1: 58.27,
    C3: 130.81
  };

  const seq = [
    {kick:true,bass:'C2',hat:false},
    {kick:false,bass:'Eb2',hat:true},
    {kick:false,bass:'G2',hat:false},
    {kick:true,bass:'Bb1',hat:true},
    {kick:false,bass:'C2',hat:false},
    {kick:false,bass:'Ab2',hat:true},
    {kick:false,bass:'G2',hat:false},
    {kick:true,bass:'F2',hat:true}
  ];

  let ctx = null;
  let master = null;
  let timer = null;
  let playing = false;
  let step = 0;
  const stepMs = 340;

  const setState = (on) => {
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Остановить трек' : 'Включить трек');
  };

  const ensureAudio = async () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.12;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -24;
      comp.knee.value = 22;
      comp.ratio.value = 3.6;
      comp.attack.value = 0.006;
      comp.release.value = 0.18;

      const send = ctx.createGain();
      send.gain.value = 0.14;
      const dry = ctx.createGain();
      dry.gain.value = 1;

      const delay = ctx.createDelay(0.32);
      delay.delayTime.value = 0.12;
      const fb = ctx.createGain();
      fb.gain.value = 0.22;
      delay.connect(fb);
      fb.connect(delay);

      master.connect(dry);
      master.connect(send);
      send.connect(delay);
      delay.connect(comp);
      fb.connect(comp);
      dry.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') await ctx.resume();
  };

  const env = (gainNode, t, a = 0.004, d = 0.26, s = 0.5, r = 0.18, peak = 1) => {
    gainNode.gain.cancelScheduledValues(t);
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(peak * s, 0.0001), t + a + d);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + a + d + r);
  };

  const kick = (t) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = 'sine';
    o.frequency.setValueAtTime(148, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.13);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(240, t);
    g.gain.value = 0.001;
    env(g, t, 0.003, 0.1, 0.35, 0.16, 1);
    o.connect(f);
    f.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.35);
  };

  const bass = (freq, t) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, t);
    o.detune.setValueAtTime(-3, t);
    f.type = 'lowpass';
    f.frequency.setValueAtTime(Math.min(900, freq * 7.5), t);
    f.Q.value = 1.2;
    env(g, t, 0.006, 0.2, 0.55, 0.2, 0.78);
    o.connect(f);
    f.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + 0.62);
  };

  const hat = (t) => {
    const noise = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.08), ctx.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 2);
    noise.buffer = buf;
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    f.type = 'highpass';
    f.frequency.setValueAtTime(5200, t);
    env(g, t, 0.002, 0.035, 0.18, 0.06, 0.18);
    noise.connect(f);
    f.connect(g);
    g.connect(master);
    noise.start(t);
    noise.stop(t + 0.09);
  };

  const tick = () => {
    const t = ctx.currentTime + 0.015;
    const slot = seq[step % seq.length];
    if (slot.kick) kick(t);
    if (slot.bass) bass(NOTE_FREQ[slot.bass] || 65.41, t);
    if (slot.hat) hat(t + 0.02);
    step = (step + 1) % seq.length;
  };

  const start = async () => {
    await ensureAudio();
    if (playing) return;
    playing = true;
    setState(true);
    tick();
    timer = window.setInterval(tick, stepMs);
  };

  const stop = () => {
    playing = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    setState(false);
  };

  btn.addEventListener('click', () => {
    if (playing) stop();
    else start().catch(() => {});
  });
})();

// BEGINNER ADVICE MODAL
(function(){
  const btn = document.getElementById('adviceBtn');
  const modal = document.getElementById('adviceModal');
  if (!btn || !modal) return;

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
