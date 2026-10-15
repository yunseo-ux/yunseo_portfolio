export function initHeroOcean() {
    const hero = document.querySelector('.portfolio-hero');
    const wave = hero?.querySelector('.hero-wave');
    if (!wave) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('viewBox', '0 0 1920 260');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('fill', '#faf8f3');
    svg.append(path);
    wave.replaceChildren(svg);
    hero.classList.add('hero-ocean');

    let frame = 0;
    let visible = true;
    let phase = 0;
    let lastTime = null;
    let energy = 0;
    let scrollActiveUntil = 0;
    const waveY = x => 102 + Math.sin(x / 310 - phase) * (46 + energy * 19)
        + Math.sin(x / 540 + phase * .8) * (20 + energy * 7);
    const paint = time => {
        frame = 0;
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
        const scrolling = time < scrollActiveUntil;
        if (visible && !document.hidden && !preference.matches) {
            const delta = lastTime === null ? 0 : Math.min(time - lastTime, 50);
            energy += ((scrolling ? 1 : 0) - energy) * (1 - Math.exp(-delta / 300));
            phase += delta * (1 / 2800 + energy * (1 / 950 - 1 / 2800));
            lastTime = time;
        } else lastTime = null;
        let shape = '';
        for (let x = 0; x <= 1920; x += 16) {
            const y = waveY(x);
            shape += `${x ? 'L' : 'M'}${x},${y.toFixed(2)} `;
        }
        path.setAttribute('d', `${shape}L1920,260 L0,260 Z`);
        hero.style.setProperty('--ocean-rise', `${preference.matches ? 0 : -progress * rect.height * .22}px`);
        if (visible && !document.hidden && !preference.matches) frame = requestAnimationFrame(paint);
        else lastTime = null;
    };
    const refresh = () => {
        if (!frame) frame = requestAnimationFrame(paint);
    };
    const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) refresh();
        else { cancelAnimationFrame(frame); frame = 0; lastTime = null; }
    });
    observer.observe(hero);
    window.addEventListener('scroll', () => {
        scrollActiveUntil = performance.now() + 250;
        refresh();
    }, { passive: true });
    window.addEventListener('resize', refresh);
    document.addEventListener('visibilitychange', refresh);
    preference.addEventListener('change', refresh);
    paint(0);
}
