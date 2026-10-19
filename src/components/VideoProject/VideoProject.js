export function initVideoProject() {
    const section = document.querySelector('.video-projects');
    if (!section) return;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const gallery = document.createElement('div');
    gallery.className = 'video-gallery';
    const viewport = document.createElement('div');
    viewport.className = 'video-gallery-viewport';
    const track = document.createElement('div');
    track.className = 'video-gallery-track';
    const panels = [...section.querySelectorAll('.video-project')];
    panels[0].before(gallery);
    gallery.append(viewport);
    viewport.append(track);
    track.append(...panels);
    const items = [...section.querySelectorAll('.video-project-media')].map(media => ({
        media, video: media.querySelector('video'), hint: media.querySelector('.video-project-hint'),
    }));
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fullscreenVideo = () => items.some(({ video }) => document.fullscreenElement === video);
    const updateControls = ({ media, video, hint }) => {
        video.controls = !hover.matches || media.matches(':hover, :focus-within') || document.fullscreenElement === video;
        hint.textContent = hover.matches && !reduced.matches
            ? 'HOVER TO PLAY · USE VIDEO CONTROLS'
            : 'USE VIDEO CONTROLS TO PLAY';
    };
    const stop = item => {
        if (document.fullscreenElement === item.video) return;
        item.video.pause();
    };
    const play = item => {
        item.video.play().catch(() => {
            if (item.video.error) item.hint.textContent = '영상을 불러오지 못했습니다. 다시 눌러주세요';
        });
    };
    const horizontal = matchMedia('(min-width: 801px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let panelWidth = 0;
    let viewportHeight = 0;
    let activePanel = 0;
    const updateGallery = () => {
        frame = 0;
        if (fullscreenVideo()) return;
        if (!horizontal.matches) return;
        const scroll = -gallery.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, scroll / viewportHeight - .7));
        track.style.transform = `translate3d(${-progress * panelWidth}px, 0, 0)`;
        const nextPanel = progress === 0 ? 0 : progress === 1 ? 1 : -1;
        if (nextPanel !== activePanel) {
            items.forEach(stop);
            activePanel = nextPanel;
        }
        panels.forEach((panel, index) => { panel.inert = index !== nextPanel; });
    };
    const scheduleGallery = () => {
        if (horizontal.matches && !frame) frame = requestAnimationFrame(updateGallery);
    };
    const measureGallery = () => {
        if (fullscreenVideo()) return;
        gallery.classList.toggle('video-gallery--pinned', horizontal.matches);
        panelWidth = viewport.clientWidth;
        viewportHeight = viewport.clientHeight;
        if (!horizontal.matches) {
            track.style.transform = '';
            panels.forEach(panel => { panel.inert = false; });
        } else updateGallery();
    };
    window.addEventListener('scroll', scheduleGallery, { ...options, passive: true });
    window.addEventListener('resize', measureGallery, options);
    horizontal.addEventListener('change', measureGallery, options);
    measureGallery();
    items.forEach(item => {
        const { media, video } = item;
        // Native controls can start playback immediately; preload=none keeps loading lazy.
        const base = import.meta.env?.BASE_URL;
        video.src = base ? `${base}${video.dataset.src.slice(1)}` : `/public${video.dataset.src}`;
        updateControls(item);
        media.addEventListener('pointerenter', event => {
            updateControls(item);
            if (event.pointerType === 'touch' || !hover.matches || reduced.matches || media.matches(':focus-within')) return;
            video.muted = true;
            play(item);
        }, options);
        media.addEventListener('pointerleave', event => {
            if (event.pointerType !== 'touch' && !media.matches(':focus-within')) stop(item);
            updateControls(item);
        }, options);
        media.addEventListener('focusin', () => updateControls(item), options);
        media.addEventListener('focusout', () => {
            if (!media.matches(':hover')) stop(item);
            updateControls(item);
        }, options);
        video.addEventListener('play', () => {
            items.forEach(other => { if (other !== item) stop(other); });
        }, options);
    });
    hover.addEventListener('change', () => items.forEach(updateControls), options);
    reduced.addEventListener('change', () => { items.forEach(stop); items.forEach(updateControls); }, options);
    document.addEventListener('fullscreenchange', () => {
        items.forEach(updateControls);
        if (!fullscreenVideo()) measureGallery();
    }, options);
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) stop(items.find(item => item.media === entry.target));
        });
    });
    items.forEach(item => observer.observe(item.media));
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) items.forEach(stop);
    }, options);
    window.addEventListener('pagehide', event => {
        items.forEach(stop);
        if (!event.persisted) { observer.disconnect(); controller.abort(); cancelAnimationFrame(frame); }
    }, options);
}
