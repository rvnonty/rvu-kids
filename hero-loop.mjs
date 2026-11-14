const MEDIA_PATH = '/assets/rvu-hero-loop.mp4';
const bookLink = document.querySelector('.hero-book-figure .book');
const hero = document.querySelector('.hero-art');
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);

if (bookLink && hero && !saveData && !prefersReduced.matches) {
  (async () => {
    try {
      const availability = await fetch(MEDIA_PATH, { method: 'HEAD', cache: 'default' });
      if (!availability.ok || !String(availability.headers.get('content-type') || '').includes('video')) return;
      const video = document.createElement('video');
      video.className = 'hero-loop-video';
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.poster = '/assets/cover-480.webp';
      video.setAttribute('aria-hidden', 'true');
      video.setAttribute('tabindex', '-1');
      video.setAttribute('disablepictureinpicture', '');
      video.setAttribute('disableremoteplayback', '');
      let visible = true;
      let failed = false;
      const enabled = () => !document.hidden && visible && !prefersReduced.matches && !document.documentElement.classList.contains('motion-paused');
      const sync = () => {
        if (failed) return;
        if (enabled()) video.play().catch(() => {});
        else video.pause();
      };
      const onPlaying = () => {
        if (enabled()) {
          bookLink.classList.add('has-live-video');
          hero.dataset.heroMedia = 'video';
        }
      };
      const onError = () => {
        failed = true;
        bookLink.classList.remove('has-live-video');
        hero.dataset.heroMedia = 'poster';
        video.remove();
      };
      video.addEventListener('playing', onPlaying);
      video.addEventListener('error', onError);
      bookLink.append(video);
      video.src = MEDIA_PATH;
      const visibility = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? true;
        sync();
      }, { threshold: 0.08 });
      visibility.observe(hero);
      const state = new MutationObserver(sync);
      state.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      document.addEventListener('visibilitychange', sync);
      prefersReduced.addEventListener?.('change', sync);
      window.addEventListener('pagehide', () => video.pause(), { once: true });
      sync();
    } catch {
      hero.dataset.heroMedia = 'poster';
    }
  })();
}
