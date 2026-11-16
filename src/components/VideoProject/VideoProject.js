export function initVideoProject() {
    const section = document.querySelector('.video-projects');
    if (!section) return;
    const grujamPlanLink = section.querySelector('.video-project--grujam .brand-project-link--proposal');
    const stellaProposalLink = section.querySelector('.video-project--stella .brand-project-link--proposal');
    const stellaManualLink = section.querySelector('.video-project--stella .brand-project-link--manual');
    if (grujamPlanLink && !import.meta.env?.BASE_URL) {
        grujamPlanLink.href = '/public/%EA%B7%B8%EB%A3%A8%EC%9E%A0%20BI_%EC%B5%9C%EC%A2%85%EC%82%AC%EC%97%85%EA%B3%84%ED%9A%8D%EC%84%9C.pdf';
    }
    if (!import.meta.env?.BASE_URL) {
        if (stellaProposalLink) stellaProposalLink.href = '/public/%EC%8A%A4%ED%85%94%EB%9D%BC_%EA%B8%B0%ED%9A%8D%EC%84%9C.pdf';
        if (stellaManualLink) stellaManualLink.href = '/public/%EC%8A%A4%ED%85%94%EB%9D%BC_%EB%94%94%EC%9E%90%EC%9D%B8%20%EB%A9%94%EB%89%B4%EC%96%BC.pdf';
    }
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const gallery = document.createElement('div');
    gallery.className = 'video-gallery';
    const viewport = document.createElement('div');
    viewport.className = 'video-gallery-viewport';
    const track = document.createElement('div');
    track.className = 'video-gallery-track';
    const aiLabPanels = [...section.querySelectorAll('.video-project--ai-lab-title, .video-project--ai-lab')];
    const panels = [...section.querySelectorAll('.video-project')].filter(panel => !aiLabPanels.includes(panel));
    const titleLayouts = [...section.querySelectorAll('.video-project--ai-lab-title .ai-lab-title-layout')];
    const titleStates = titleLayouts.map(layout => {
        const titlePanel = layout.closest('.video-project--ai-lab-title');
        const titleHold = document.createElement('div');
        titleHold.className = 'ai-lab-title-hold';
        titlePanel.before(titleHold);
        titleHold.append(titlePanel);
        return { layout, hold: titleHold };
    });
    panels[0].before(gallery);
    gallery.append(viewport);
    viewport.append(track);
    track.append(...panels);
    // Keep the final (Pudding World) panel pinned for one viewport of scrolling.
    gallery.style.setProperty('--video-gallery-height', `${(1 + Math.max(0, panels.length - 1) * 1.7 + 1) * 100}svh`);
    const titlePinned = matchMedia('(min-width: 901px)');
    const titleReduced = matchMedia('(prefers-reduced-motion: reduce)');
    const titleObservers = new Map();
    let titleFrame = 0;
    const updateTitleInteraction = () => {
        titleFrame = 0;
        if (!titlePinned.matches || titleReduced.matches) return;
        const clamp = value => Math.max(0, Math.min(1, value));
        titleStates.forEach(({ layout, hold }) => {
            const range = Math.max(1, hold.offsetHeight - window.innerHeight);
            const holdTop = hold.getBoundingClientRect().top;
            const progress = clamp(-holdTop / range);
            hold.classList.toggle('ai-lab-title-hold--past', holdTop <= -range);
            hold.style.setProperty('--ai-lab-pin-top', `${Math.max(0, holdTop)}px`);
            // Finish each reveal early enough to keep the complete title pinned before its detail page.
            const eyebrow = clamp(progress / .24);
            const title = clamp((progress - .08) / .32);
            layout.style.setProperty('--ai-lab-eyebrow-opacity', eyebrow);
            layout.style.setProperty('--ai-lab-eyebrow-clip', `${(1 - eyebrow) * 100}%`);
            layout.style.setProperty('--ai-lab-eyebrow-y', `${(1 - eyebrow) * 14}px`);
            layout.style.setProperty('--ai-lab-title-opacity', title);
            layout.style.setProperty('--ai-lab-title-clip', `${(1 - title) * 100}%`);
            layout.style.setProperty('--ai-lab-title-y', `${(1 - title) * 14}px`);
        });
    };
    const scheduleTitleInteraction = () => {
        if (titlePinned.matches && !titleReduced.matches && !titleFrame) titleFrame = requestAnimationFrame(updateTitleInteraction);
    };
    const clearTitleInteraction = () => {
        ['--ai-lab-eyebrow-opacity', '--ai-lab-eyebrow-clip', '--ai-lab-eyebrow-y', '--ai-lab-title-opacity', '--ai-lab-title-clip', '--ai-lab-title-y']
            .forEach(property => titleStates.forEach(({ layout }) => layout.style.removeProperty(property)));
    };
    const configureTitleInteraction = () => {
        titleObservers.forEach(observer => observer.disconnect());
        titleObservers.clear();
        clearTitleInteraction();
        titleStates.forEach(({ layout, hold }) => {
            layout.classList.remove('ai-lab-title--pending', 'ai-lab-title--revealed', 'ai-lab-title--scrolling');
            hold.classList.remove('ai-lab-title-hold--past');
            hold.style.removeProperty('--ai-lab-pin-top');
            if (titleReduced.matches) {
                layout.classList.add('ai-lab-title--revealed');
            } else if (titlePinned.matches) {
                layout.classList.add('ai-lab-title--scrolling');
            } else if ('IntersectionObserver' in window) {
                layout.classList.add('ai-lab-title--pending');
                const observer = new IntersectionObserver(entries => {
                    if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .2)) return;
                    layout.classList.remove('ai-lab-title--pending');
                    layout.classList.add('ai-lab-title--revealed');
                    observer.disconnect();
                }, { threshold: [0, .2] });
                titleObservers.set(layout, observer);
                observer.observe(layout);
            } else {
                layout.classList.add('ai-lab-title--revealed');
            }
        });
        if (titlePinned.matches && !titleReduced.matches) updateTitleInteraction();
    };
    configureTitleInteraction();
    titlePinned.addEventListener('change', configureTitleInteraction, options);
    titleReduced.addEventListener('change', configureTitleInteraction, options);
    window.addEventListener('scroll', scheduleTitleInteraction, { ...options, passive: true });
    window.addEventListener('resize', scheduleTitleInteraction, options);
    const mobileSwipe = matchMedia('(max-width: 640px)');
    const updateMobileSwipe = () => {
        gallery.classList.toggle('video-gallery--swipe', mobileSwipe.matches);
        if (mobileSwipe.matches) {
            viewport.setAttribute('role', 'region');
            viewport.setAttribute('aria-label', '영상 프로젝트. 좌우로 밀어 콘텐츠를 확인하세요.');
            viewport.tabIndex = 0;
        } else {
            viewport.removeAttribute('role');
            viewport.removeAttribute('aria-label');
            viewport.removeAttribute('tabindex');
        }
    };
    updateMobileSwipe();
    mobileSwipe.addEventListener('change', updateMobileSwipe, options);
    const items = [...section.querySelectorAll('.video-project-media')].map(media => ({
        media, video: media.querySelector('video'), hint: media.querySelector('.video-project-hint'),
    }));
    items.forEach(({ video }) => {
        const frame = document.createElement('div');
        frame.className = 'video-project-video-frame';
        video.before(frame);
        frame.append(video);
    });
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce), (max-width: 600px)');
    const fullscreenVideo = () => items.some(({ video }) => document.fullscreenElement === video);
    const updateControls = ({ media, video, hint }) => {
        video.controls = !hover.matches || media.matches(':hover, :focus-within') || document.fullscreenElement === video;
        hint.textContent = hover.matches && !reduced.matches
            ? 'HOVER FOR VIDEO CONTROLS'
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
    const visibleItems = new Set();
    const horizontal = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let panelWidth = 0;
    let viewportHeight = 0;
    let activePanel = 0;
    const syncPlayback = item => {
        const index = panels.indexOf(item.media.closest('.video-project'));
        if (document.hidden || !visibleItems.has(item) || (horizontal.matches && activePanel !== index)) {
            stop(item);
        } else if (!reduced.matches) play(item);
    };
    const updateGallery = () => {
        frame = 0;
        if (fullscreenVideo() || !horizontal.matches || !viewportHeight) return;
        const scroll = -gallery.getBoundingClientRect().top;
        const timeline = Math.max(0, scroll / viewportHeight);
        let position = panels.length - 1;
        for (let index = 0; index < panels.length - 1; index++) {
            const local = timeline - index * 1.7;
            if (local <= .7) { position = index; break; }
            if (local < 1.7) { position = index + local - .7; break; }
        }
        const nextPanel = Number.isInteger(position) ? position : -1;
        const pixelRatio = devicePixelRatio || 1;
        const offset = Math.round(-position * panelWidth * pixelRatio) / pixelRatio;
        track.style.transform = `translateX(${offset}px)`;
        track.style.willChange = nextPanel < 0 ? 'transform' : 'auto';
        if (nextPanel !== activePanel) {
            items.forEach(stop);
            activePanel = nextPanel;
            items.forEach(syncPlayback);
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
            track.style.willChange = 'auto';
            panels.forEach(panel => { panel.inert = false; });
        } else updateGallery();
    };
    window.addEventListener('scroll', scheduleGallery, { ...options, passive: true });
    window.addEventListener('resize', measureGallery, options);
    horizontal.addEventListener('change', measureGallery, options);
    measureGallery();
    const brandGallery = section.querySelector('.brand-project-gallery');
    const brandViewport = brandGallery?.querySelector('.brand-project-viewport');
    const brandTrack = brandGallery?.querySelector('.brand-project-track');
    const brandPanels = brandTrack ? [...brandTrack.querySelectorAll('.video-project--brand-detail')] : [];
    const brandSwipe = matchMedia('(max-width: 640px)');
    let brandFrame = 0;
    let brandPanelWidth = 0;
    let brandViewportHeight = 0;
    let activeBrandPanel = 0;
    const updateBrandGallery = () => {
        brandFrame = 0;
        if (!brandGallery || !brandViewport || !brandTrack || !horizontal.matches || !brandViewportHeight) return;
        const timeline = Math.max(0, -brandGallery.getBoundingClientRect().top / brandViewportHeight);
        let position = brandPanels.length - 1;
        for (let index = 0; index < brandPanels.length - 1; index++) {
            const local = timeline - index * 1.7;
            if (local <= .7) { position = index; break; }
            if (local < 1.7) { position = index + local - .7; break; }
        }
        position = Math.max(0, Math.min(brandPanels.length - 1, position));
        const nextPanel = Math.round(position);
        const pixelRatio = devicePixelRatio || 1;
        const offset = Math.round(-position * brandPanelWidth * pixelRatio) / pixelRatio;
        brandTrack.style.transform = `translateX(${offset}px)`;
        brandTrack.style.willChange = Number.isInteger(position) ? 'auto' : 'transform';
        if (nextPanel !== activeBrandPanel) activeBrandPanel = nextPanel;
        brandPanels.forEach((panel, index) => { panel.inert = index !== activeBrandPanel; });
    };
    const scheduleBrandGallery = () => {
        if (horizontal.matches && !brandFrame) brandFrame = requestAnimationFrame(updateBrandGallery);
    };
    const updateBrandSwipe = () => {
        if (!brandGallery || !brandViewport) return;
        brandGallery.classList.toggle('brand-project-gallery--swipe', brandSwipe.matches);
        if (brandSwipe.matches) {
            brandViewport.setAttribute('role', 'region');
            brandViewport.setAttribute('aria-label', '대학 프로젝트. 좌우로 밀어 장표를 확인하세요.');
            brandViewport.tabIndex = 0;
        } else {
            brandViewport.removeAttribute('role');
            brandViewport.removeAttribute('aria-label');
            brandViewport.removeAttribute('tabindex');
        }
    };
    const measureBrandGallery = () => {
        if (!brandGallery || !brandViewport || !brandTrack) return;
        brandGallery.classList.toggle('brand-project-gallery--pinned', horizontal.matches);
        brandGallery.style.setProperty('--brand-project-gallery-height', `${(1 + Math.max(0, brandPanels.length - 1) * 1.7 + 1) * 100}svh`);
        brandPanelWidth = brandViewport.clientWidth;
        brandViewportHeight = window.innerHeight;
        if (!horizontal.matches) {
            brandTrack.style.transform = '';
            brandTrack.style.willChange = 'auto';
            brandPanels.forEach(panel => { panel.inert = false; });
        } else updateBrandGallery();
    };
    updateBrandSwipe();
    brandSwipe.addEventListener('change', updateBrandSwipe, options);
    window.addEventListener('scroll', scheduleBrandGallery, { ...options, passive: true });
    window.addEventListener('resize', measureBrandGallery, options);
    horizontal.addEventListener('change', measureBrandGallery, options);
    measureBrandGallery();
    items.forEach(item => {
        const { media, video } = item;
        // Native controls can start playback immediately; preload=none keeps loading lazy.
        const base = import.meta.env?.BASE_URL;
        video.src = base ? `${base}${video.dataset.src.slice(1)}` : `/public${video.dataset.src}`;
        updateControls(item);
        media.addEventListener('pointerenter', () => updateControls(item), options);
        media.addEventListener('pointerleave', () => updateControls(item), options);
        media.addEventListener('focusin', () => updateControls(item), options);
        media.addEventListener('focusout', () => updateControls(item), options);
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
            const item = items.find(item => item.media === entry.target);
            if (entry.isIntersecting && entry.intersectionRatio >= .4) visibleItems.add(item);
            else visibleItems.delete(item);
            syncPlayback(item);
        });
    }, { threshold: [0, .4] });
    items.forEach(item => observer.observe(item.media));
    document.addEventListener('visibilitychange', () => {
        items.forEach(syncPlayback);
    }, options);
    window.addEventListener('pagehide', event => {
        items.forEach(stop);
        if (!event.persisted) { observer.disconnect(); titleObservers.forEach(titleObserver => titleObserver.disconnect()); controller.abort(); cancelAnimationFrame(frame); cancelAnimationFrame(titleFrame); cancelAnimationFrame(brandFrame); }
    }, options);
}
