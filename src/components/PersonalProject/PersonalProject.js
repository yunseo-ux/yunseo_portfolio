const movementDoodleAssets = {
    sofa: [new URL('./assets/sofa-reveal.svg', import.meta.url).href, new URL('./assets/sofa-doodle.png', import.meta.url).href],
    lamp: [new URL('./assets/lamp-reveal.svg', import.meta.url).href, new URL('./assets/lamp-doodle.png', import.meta.url).href],
};

export function initPersonalProject() {
    const gallery = document.querySelector('.personal-project-gallery');
    const viewport = gallery?.querySelector('.personal-project-viewport');
    const track = gallery?.querySelector('.personal-project-track');
    if (!track || !viewport) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const panels = [...track.children];
    const starts = [];
    const isOverviewHold = panel => panel.matches('#personal-project-03, #personal-project-04');
    const holds = panels.map(panel => panel.id === 'rola-details' ? 1 : isOverviewHold(panel) ? .8 : panel.matches('.movement-details') ? .4 : .15);
    let duration = 0;
    holds.forEach((hold, index) => { starts.push(duration); duration += hold + (index < panels.length - 1 ? 1 : 0); });
    const clamp = value => Math.max(0, Math.min(1, value));
    let position = 0;
    let frame = 0;
    let lockUntil = 0;
    let lockPanel = null;
    const visited = new WeakSet();

    track.querySelectorAll('[data-movement-doodle]').forEach(async holder => {
        const [maskUrl, imageUrl] = movementDoodleAssets[holder.dataset.movementDoodle];
        try {
            const response = await fetch(maskUrl);
            if (!response.ok) throw new Error(`Failed to load ${maskUrl}`);
            const source = (await response.text()).replace(/<!--\s*Code injected by live-server\s*-->\s*<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
            const svg = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
            if (svg.localName !== 'svg') throw new Error('Invalid illustration SVG');
            svg.querySelector('image').setAttribute('href', imageUrl);
            holder.replaceChildren(document.importNode(svg, true));
        } catch (error) {
            console.error('일러스트를 불러오지 못했습니다.', error);
            const fallback = document.createElement('img');
            fallback.src = imageUrl;
            fallback.alt = '';
            holder.replaceChildren(fallback);
        }
    });

    const previews = panels.filter(panel => !panel.matches('.movement-details')).map(panel => ({ panel, screen: panel.querySelector('.team-project-laptop-screen'), visible: false }));
    const updatePreviews = () => previews.forEach(item => {
        item.panel.classList.toggle('movement-preview--playing', item.visible && !document.hidden && !preference.matches);
        if (item.screen) item.panel.style.setProperty('--movement-screen-height', `${item.screen.clientHeight}px`);
    });
    const previewObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => { const item = previews.find(p => p.panel === entry.target); if (item) item.visible = entry.intersectionRatio >= .5; });
        updatePreviews();
    }, { threshold: [0, .5] });
    previews.forEach(item => previewObserver.observe(item.panel));
    document.addEventListener('visibilitychange', updatePreviews);

    const measure = () => {
        gallery.style.setProperty('--personal-project-scale', Math.min(1, gallery.clientWidth / 1920));
        if (preference.matches) gallery.style.removeProperty('height');
        else gallery.style.height = `${viewport.offsetHeight + duration * viewport.clientWidth}px`;
        updatePreviews();
    };
    const update = () => {
        frame = 0;
        if (preference.matches) {
            track.style.removeProperty('transform');
            panels.forEach(panel => panel.classList.add('movement-doodles--draw'));
            lockUntil = 0;
            return;
        }
        const vertical = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const timeline = Math.max(0, -gallery.getBoundingClientRect().top - vertical) / viewport.clientWidth;
        position = panels.length - 1;
        for (let index = 0; index < panels.length; index++) {
            const local = timeline - starts[index];
            if (local <= holds[index]) { position = index; break; }
            if (index < panels.length - 1 && local < holds[index] + 1) {
                const move = clamp(local - holds[index]);
                position = index + move * move * (3 - 2 * move);
                break;
            }
        }
        track.style.transform = `translate3d(${-position * viewport.clientWidth}px, 0, 0)`;
        panels.forEach((panel, index) => {
            if (!panel.querySelector('.movement-doodle') && !isOverviewHold(panel)) return;
            if (Math.abs(position - index) < .001 && !visited.has(panel)) {
                panel.classList.add('movement-doodles--draw');
                visited.add(panel);
                lockPanel = panel;
                lockUntil = performance.now() + 1200;
                if (panel.id === 'rola-details') {
                    const drawing = panel.querySelector('.rola-shirt-doodle');
                    const animations = drawing?.getAnimations() ?? [];
                    if (animations.length) {
                        lockUntil = Infinity;
                        Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
                            if (lockPanel === panel && lockUntil === Infinity) lockUntil = performance.now() + 350;
                        });
                    }
                }
            } else if (Math.abs(position - index) > 1) {
                panel.classList.remove('movement-doodles--draw');
                visited.delete(panel);
            }
        });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const locked = () => !preference.matches && lockPanel && Math.abs(position - panels.indexOf(lockPanel)) < .001 && performance.now() < lockUntil;
    window.addEventListener('wheel', event => {
        if (event.ctrlKey || event.target.closest('.portfolio-chatbot')) return;
        if (event.deltaY > 0 && locked()) event.preventDefault();
        if (event.deltaY < 0) lockUntil = 0;
    }, { passive: false });
    let touchY = 0;
    window.addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY ?? 0; }, { passive: true });
    window.addEventListener('touchmove', event => {
        if (event.target.closest('.portfolio-chatbot')) return;
        const y = event.touches[0]?.clientY ?? touchY;
        if (y < touchY && locked()) event.preventDefault();
        else if (y > touchY) lockUntil = 0;
        touchY = y;
    }, { passive: false });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => { lockUntil = 0; measure(); schedule(); });
    preference.addEventListener('change', () => { measure(); schedule(); });
    const showPanel = target => {
        if (preference.matches) return;
        const panel = target?.closest('.personal-overview');
        const index = panels.indexOf(panel);
        if (index < 0) return;
        const vertical = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const top = gallery.getBoundingClientRect().top + window.scrollY + vertical + starts[index] * viewport.clientWidth;
        window.scrollTo({ top, behavior: 'instant' });
    };
    track.addEventListener('focusin', event => showPanel(event.target));
    const showHash = () => { if (window.location.hash) showPanel(document.getElementById(window.location.hash.slice(1))); };
    window.addEventListener('hashchange', showHash);
    measure();
    update();
    showHash();
}
