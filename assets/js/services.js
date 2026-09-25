
// lazy video load
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

// reveal
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.04});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

// filter
function flt(cat,btn){
  document.querySelectorAll('.fb-item').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.sc[data-cat]').forEach(card=>{
    const show=cat==='all'||card.dataset.cat===cat;
    card.style.transition='opacity .35s,transform .35s';
    card.style.opacity=show?'1':'0.15';
    card.style.pointerEvents=show?'auto':'none';
  });
}

// scroll to anchor
if(location.hash){
  setTimeout(()=>{
    const el=document.getElementById(location.hash.slice(1));
    if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
  },400);
}
