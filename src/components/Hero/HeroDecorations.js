// Only the newly added Figma vectors: the existing title, pen and wave are untouched.
const artwork = [
    [75, 1208.7, 343.97, 45.0975, 66.3253, 0, .04],
    [76, 1249.4, 385.98, 29.3008, 40.4143, 0, .12],
    [77, 614.03, 352.08, 79.5909, 116.879, 0, .08],
    [78, 1740.5, 398.637, 200.427, 160.513, 0, .32],
    [79, 1585.22, 553.9, 66.53, 37.665, 0, .22],
    [80, 1534.643, 161.57, 387.658, 196.1, 0, .18],
    [81, -2.48, 668.03, 799.686, 313.613, 0, .26],
    [82, -16.4, 415.511, 258.873, 195.588, 0, .16],
    [83, 265.1, 403.16, 56.303, 56.0709, 0, .13],
    [84, 1555.1, 636, 56.303, 56.0709, 27, .29],
    [85, 297.73, 244.61, 128.496, 74.917, 0, .2],
    [86, 385.402, 648.788, 24.722, 42.949, 1.09, .31],
];
const assets = import.meta.env ? import.meta.glob('./assets/decoration-*.svg', { eager: true, query: '?url', import: 'default' }) : {};
const ns = 'http://www.w3.org/2000/svg';
const element = (name, attributes = {}) => {
    const node = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
};

// Bake the original Figma brushwork once. Scroll frames never run SVG noise
// filters or repaint thousands of brush stamps.
async function pencilBitmap(source, width, height, seed) {
    const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }));
    try {
        const image = new Image();
        image.src = url;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(width * 2);
        canvas.height = Math.ceil(height * 2);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        let random = seed;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const i = (y * canvas.width + x) * 4;
                if (!data[i + 3]) continue;
                random = (Math.imul(random, 1664525) + 1013904223) >>> 0;
                const coarse = ((Math.imul(x >> 2, 374761393) ^ Math.imul(y >> 2, 668265263) ^ seed) >>> 0) % 101 / 100;
                const grain = random / 4294967296 * .4 + coarse * .6;
                const hatch = (x + y * 1.35 + Math.sin(x * .04) * 5) % 23 < 8;
                if (data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235) {
                    // Cream paper showing through loose diagonal crayon shading.
                    data[i] = 250; data[i + 1] = 247; data[i + 2] = 234;
                    data[i + 3] *= (hatch ? .82 : .32) * (.58 + grain * .42);
                } else {
                    if (data[i + 2] > data[i] && data[i] > 100) {
                        data[i] = 143; data[i + 1] = 179; data[i + 2] = 210;
                    }
                    data[i + 3] *= grain < .25 ? .1 : .52 + grain * .48;
                }
            }
        }
        context.putImageData(pixels, 0, 0);
        return canvas.toDataURL('image/webp', .95);
    } finally { URL.revokeObjectURL(url); }
}

export function initHeroDecorations() {
    const hero = document.querySelector('.portfolio-hero');
    if (!hero || hero.querySelector('.hero-decorations')) return;
    const controller = new AbortController();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const hold = document.createElement('div');
    hold.className = 'hero-drawing-scroll';
    hero.before(hold);
    hold.append(hero);
    const layer = document.createElement('div');
    layer.className = 'hero-decorations';
    layer.setAttribute('aria-hidden', 'true');
    hero.append(layer);
    const drawings = [];
    let frame = 0;
    let height = 0;
    let disposed = false;
    let progress = 0;
    let lastPaint = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const render = time => {
        frame = 0;
        if (disposed) return;
        const top = hold.getBoundingClientRect().top;
        const target = reduced.matches ? 1 : clamp(-top / Math.max(1, innerHeight * .6));
        const delta = lastPaint ? Math.min(time - lastPaint, 50) : 16.67;
        progress = reduced.matches ? target : progress + (target - progress) * (1 - Math.exp(-delta / 130));
        const settled = Math.abs(target - progress) < .0005;
        if (settled) progress = target;
        lastPaint = settled ? 0 : time;
        drawings.forEach(drawing => {
            const value = reduced.matches ? 1 : clamp((progress - drawing.delay) / .5);
            if (drawing.progress === value) return;
            drawing.progress = value;
            drawing.strokes.forEach(({ path, length }) => path.setAttribute('stroke-dashoffset', length * (1 - value)));
            if ((drawing.lastValue === 1) !== (value === 1)) {
                if (value === 1) drawing.group.removeAttribute('mask');
                else drawing.group.setAttribute('mask', `url(#hero-mask-${drawing.id})`);
            }
            if ((drawing.lastValue > 0) !== (value > 0)) drawing.slot.style.visibility = value > 0 ? 'visible' : 'hidden';
            drawing.lastValue = value;
        });
        if (!settled) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const measure = () => {
        height = hero.clientHeight;
        hold.style.height = reduced.matches ? 'auto' : `${height + innerHeight * 1.5}px`;
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
        const bitmap = await pencilBitmap(source, nativeWidth, nativeHeight, id);
        if (disposed) return;
        const defs = element('defs');
        const mask = element('mask', { id: `hero-mask-${id}`, 'mask-type': 'alpha', maskUnits: 'userSpaceOnUse', x: '-10', y: '-10', width: nativeWidth + 20, height: nativeHeight + 20 });
        paths.forEach(path => {
            const clone = path.cloneNode(false);
            clone.removeAttribute('id');
            clone.setAttribute('fill', 'none');
            clone.setAttribute('stroke', 'white');
            clone.setAttribute('stroke-width', Math.max(14, Math.min(nativeWidth, nativeHeight) * .25));
            clone.setAttribute('stroke-linecap', 'round');
            clone.removeAttribute('fill-opacity');
            mask.append(clone);
            return clone;
        });
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
        const strokes = [...mounted.querySelectorAll('mask path')].map(path => {
            const length = path.getTotalLength();
            path.setAttribute('stroke-dasharray', length);
            path.setAttribute('stroke-dashoffset', length);
            return { path, length };
        });
        drawings.push({ id, slot, svg: mounted, group: mounted.lastElementChild, nativeWidth, nativeHeight, strokes, delay, progress: -1 });
    })).then(measure).catch(error => { if (!disposed) console.error('Hero illustrations:', error); });
    window.addEventListener('scroll', schedule, { passive: true, signal: controller.signal });
    window.addEventListener('resize', measure, { signal: controller.signal });
    reduced.addEventListener('change', measure, { signal: controller.signal });
    measure();
    window.addEventListener('pagehide', event => {
        if (event.persisted) return;
        disposed = true;
        controller.abort();
        cancelAnimationFrame(frame);
    }, { signal: controller.signal });
}
