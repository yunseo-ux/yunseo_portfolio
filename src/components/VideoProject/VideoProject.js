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
    const items = [...section.querySelectorAll('.video-project-media')].map(button => ({
        button, video: button.querySelector('video'), hint: button.querySelector('.video-project-hint'),
    }));
    const resetSound = ({ button, video, hint }) => {
        video.muted = true;
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', `${video.getAttribute('aria-label')} 소리 켜기`);
        hint.textContent = matchMedia('(hover: hover)').matches ? 'HOVER TO PLAY · CLICK FOR SOUND' : 'TAP TO PLAY WITH SOUND';
    };
    const stop = item => {
        item.video.pause();
        resetSound(item);
    };
    const play = item => {
        // Load the video only after hover or click, keeping startup lightweight.
        if (!item.video.getAttribute('src')) {
            const base = import.meta.env?.BASE_URL;
            item.video.src = base ? `${base}${item.video.dataset.src.slice(1)}` : `/public${item.video.dataset.src}`;
        }
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
        const { button, video, hint } = item;
        resetSound(item);
        button.addEventListener('pointerenter', event => {
            if (event.pointerType === 'touch') return;
            resetSound(item);
            play(item);
        }, options);
        button.addEventListener('pointerleave', event => {
            if (event.pointerType !== 'touch') stop(item);
        }, options);
        button.addEventListener('blur', () => stop(item), options);
        button.addEventListener('click', () => {
            const enableSound = video.paused || video.muted;
            items.forEach(other => { if (other !== item) stop(other); });
            video.muted = !enableSound;
            button.setAttribute('aria-pressed', String(enableSound));
            button.setAttribute('aria-label', `${video.getAttribute('aria-label')} 소리 ${enableSound ? '끄기' : '켜기'}`);
            hint.textContent = enableSound ? 'SOUND ON · CLICK TO MUTE' : 'SOUND OFF · CLICK FOR SOUND';
            play(item);
        }, options);
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) stop(items.find(item => item.button === entry.target));
        });
    });
    items.forEach(item => observer.observe(item.button));
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) items.forEach(stop);
    }, options);
    window.addEventListener('pagehide', event => {
        items.forEach(stop);
        if (!event.persisted) { observer.disconnect(); controller.abort(); cancelAnimationFrame(frame); }
    }, options);
}
