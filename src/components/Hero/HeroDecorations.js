// Only the newly added Figma vectors: the existing title, pen and wave are untouched.
const artwork = [
    [75, 1208.7, 343.97, 45.0975, 66.3253, 0, .04],
    [76, 1249.4, 385.98, 29.3008, 40.4143, 0, .12],
    [77, 614.03, 352.08, 79.5909, 116.879, 0, .08],
    [78, 1740.5, 398.637, 200.427, 160.513, 0, .32],
    [79, 1585.22, 553.9, 66.53, 37.665, 0, .22],
    [80, 1534.643, 161.57, 387.658, 196.1, 0, .18],
    [81, -2.48, 668.03, 1638.4, 296.09, 0, .26],
    [82, -16.4, 415.511, 258.873, 195.588, 0, .16],
    [83, 265.1, 403.16, 56.303, 56.0709, 0, .13],
    [84, 1555.1, 636, 56.303, 56.0709, 27, .29],
    [85, 297.73, 244.61, 128.496, 74.917, 0, .2],
    [86, 425.402, 632.788, 24.722, 42.949, 1.09, .31],
];
const assets = import.meta.env ? import.meta.glob('./assets/decoration-*.svg', { eager: true, query: '?url', import: 'default' }) : {};
const textures = import.meta.env ? import.meta.glob('./assets/decoration-texture-*.webp', { eager: true, query: '?url', import: 'default' }) : {};
const ns = 'http://www.w3.org/2000/svg';
const element = (name, attributes = {}) => {
    const node = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
};

export function initHeroDecorations() {
    const hero = document.querySelector('.portfolio-hero');
    if (!hero || hero.querySelector('.hero-decorations')) return;
    const controller = new AbortController();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;
    const originalOverflow = root.style.overflowY;
    const originalGutter = root.style.scrollbarGutter;
    let pinned = !reduced.matches && scrollY < 2 && (!location.hash || location.hash === '#home');
    let pinTimeout;
    const releasePin = () => {
        if (!pinned) return;
        pinned = false;
        clearTimeout(pinTimeout);
        root.style.overflowY = originalOverflow;
        root.style.scrollbarGutter = originalGutter;
    };
    if (pinned) {
        root.style.scrollbarGutter = 'stable';
        root.style.overflowY = 'hidden';
        pinTimeout = setTimeout(releasePin, 12000);
    }
    document.querySelectorAll('.hero-menu a').forEach(link => {
        link.addEventListener('click', releasePin, { signal: controller.signal });
    });
    reduced.addEventListener('change', () => { if (reduced.matches) releasePin(); }, { signal: controller.signal });
    const hold = document.createElement('div');
    hold.className = 'hero-drawing-scroll';
    hero.before(hold);
    hold.append(hero);
    const layer = document.createElement('div');
    layer.className = 'hero-decorations';
    layer.setAttribute('aria-hidden', 'true');
    hero.append(layer);
    let visible = false;
    const updateMotion = () => {
        hero.classList.toggle('hero-illustrations-moving', visible && !document.hidden && !reduced.matches);
        schedule();
    };
    const visibilityObserver = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        updateMotion();
    });
    visibilityObserver.observe(hero);
    document.addEventListener('visibilitychange', updateMotion, { signal: controller.signal });
    reduced.addEventListener('change', updateMotion, { signal: controller.signal });
    const drawings = [];
    let frame = 0;
    let disposed = false;
    let elapsed = 0;
    let ready = false;
    let penReady = reduced.matches;
    let lastPaint = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const render = time => {
        frame = 0;
        if (disposed) return;
        if (!ready) return;
        if (!reduced.matches && !penReady) return;
        if (!reduced.matches && (!visible || document.hidden)) { lastPaint = 0; return; }
        const delta = lastPaint ? Math.min(time - lastPaint, 64) : 0;
        elapsed += delta;
        lastPaint = time;
        const settled = reduced.matches || elapsed >= 1125;
        drawings.forEach(drawing => {
            const order = artwork.findIndex(item => item[0] === drawing.id);
            const value = reduced.matches ? 1 : clamp((elapsed - order * 45) / 630);
            if (drawing.progress === value) return;
            drawing.progress = value;
            drawing.fillReveal?.setAttribute('opacity', clamp((value - .72) / .28));
            drawing.slot.classList.toggle('hero-decoration--drawn', value === 1);
            drawing.strokes.forEach(({ path, length }) => path.setAttribute('stroke-dashoffset', length * (1 - value)));
            if ((drawing.lastValue === 1) !== (value === 1)) {
                if (value === 1) drawing.group.removeAttribute('mask');
                else drawing.group.setAttribute('mask', `url(#hero-mask-${drawing.id})`);
            }
            if ((drawing.lastValue > 0) !== (value > 0)) drawing.slot.style.visibility = value > 0 ? 'visible' : 'hidden';
            drawing.lastValue = value;
        });
        if (settled) releasePin();
        if (!settled) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    window.addEventListener('portfolio:hero-pen-ready', () => {
        penReady = true;
        lastPaint = 0;
        schedule();
    }, { once: true, signal: controller.signal });
    const measure = () => {
        hold.style.height = 'auto';
        drawings.forEach(({ svg, nativeWidth, nativeHeight, slot }) => {
            const scale = Math.min(slot.offsetWidth / nativeWidth, slot.offsetHeight / nativeHeight);
            svg.style.transform = `scale(${scale})`;
        });
        schedule();
    };
    Promise.all(artwork.map(async ([id, x, y, w, h, rotation, delay]) => {
        const url = assets[`./assets/decoration-${id}.svg`] || new URL(`./assets/decoration-${id}.svg`, import.meta.url).href;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw Error(`Hero vector ${id}: ${response.status}`);
        const source = await response.text();
        const document = new DOMParser().parseFromString(source, 'image/svg+xml');
        const svg = document.documentElement;
        if (svg.localName !== 'svg' || disposed) return;
        const nativeWidth = parseFloat(svg.getAttribute('width'));
        const nativeHeight = parseFloat(svg.getAttribute('height'));
        const paths = [...svg.querySelectorAll('path')];
        const bitmap = textures[`./assets/decoration-texture-${id}.webp`] || new URL(`./assets/decoration-texture-${id}.webp`, import.meta.url).href;
        const texture = new Image();
        texture.src = bitmap;
        await texture.decode();
        if (disposed) return;
        const defs = element('defs');
        const mask = element('mask', { id: `hero-mask-${id}`, 'mask-type': 'alpha', maskUnits: 'userSpaceOnUse', x: '-10', y: '-10', width: nativeWidth + 20, height: nativeHeight + 20 });
        // Figma pencil vectors consist of ordered brush stamps; their definition
        // path is only the grain stamp, not the illustration's drawing path.
        const points = [...svg.querySelectorAll('mask use')].map(stamp => {
            const match = stamp.getAttribute('transform')?.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
            return match ? match[1] + ',' + match[2] : null;
        }).filter(Boolean);
        const trace = element('polyline', {
            points: points.join(' '), fill: 'none', stroke: 'white',
            'stroke-width': Math.max(9, Math.min(nativeWidth, nativeHeight) * .075),
            'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        });
        mask.append(trace);
        const fillReveal = paths.some(path => !path.closest('defs'))
            ? element('rect', { width: nativeWidth, height: nativeHeight, fill: 'white', opacity: 0 }) : null;
        if (fillReveal) mask.append(fillReveal);
        const group = element('g', { mask: `url(#hero-mask-${id})` });
        group.append(element('image', { href: bitmap, width: nativeWidth, height: nativeHeight }));
        defs.append(mask);
        svg.replaceChildren(defs, group);
        const slot = window.document.createElement('div');
        slot.className = 'hero-decoration';
        slot.dataset.vector = id;
        slot.style.cssText = `left:${x / 19.2}%;top:${y / 10.8}%;width:${w / 19.2}%;height:${h / 10.8}%;rotate:${rotation}deg;visibility:hidden`;
        svg.classList.add('hero-decoration-svg');
        slot.append(window.document.importNode(svg, true));
        layer.append(slot);
        const mounted = slot.firstElementChild;
        const strokes = [...mounted.querySelectorAll('mask polyline')].map(path => {
            const length = path.getTotalLength();
            path.setAttribute('stroke-dasharray', length);
            path.setAttribute('stroke-dashoffset', length);
            return { path, length };
        });
        drawings.push({ id, slot, svg: mounted, group: mounted.lastElementChild, nativeWidth, nativeHeight, strokes, fillReveal: mounted.querySelector('mask rect'), delay, progress: -1 });
    })).then(() => {
        ready = true;
        hero.dataset.illustrationsReady = 'true';
        window.dispatchEvent(new Event('portfolio:hero-artwork-ready'));
        measure();
    }).catch(error => {
        releasePin();
        if (!disposed) console.error('Hero illustrations:', error);
    });
    window.addEventListener('resize', measure, { signal: controller.signal });
    reduced.addEventListener('change', measure, { signal: controller.signal });
    measure();
    window.addEventListener('pagehide', event => {
        if (event.persisted) return;
        disposed = true;
        releasePin();
        controller.abort();
        visibilityObserver.disconnect();
        cancelAnimationFrame(frame);
    }, { signal: controller.signal });
}
