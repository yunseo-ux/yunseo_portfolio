const clipFront = new URL('./assets/clip-front.svg', import.meta.url).href;
const clipBack = new URL('./assets/clip-back.svg', import.meta.url).href;

export function initPhotoRail() {
    const section = document.querySelector('.photo-rail');
    if (!section) return;
    const viewport = section.querySelector('.photo-rail-viewport');
    const stage = section.querySelector('.photo-rail-stage');
    const rope = section.querySelector('.photo-rail-rope');
    const holder = section.querySelector('.photo-rail-frames');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const angles = [-12, 7.5, -4, 13, -9, 3.5];
    const frames = angles.map((_, index) => {
        const frame = document.createElement('div');
        frame.className = 'photo-rail-frame';
        frame.setAttribute('role', 'listitem');
        frame.setAttribute('aria-label', `사진을 넣을 프레임 ${index + 1}`);
        frame.innerHTML = `<img class="photo-rail-clip photo-rail-clip--back" src="${clipBack}" alt="" /><div class="photo-rail-paper"><div class="photo-rail-placeholder"></div></div><img class="photo-rail-clip photo-rail-clip--front" src="${clipFront}" alt="" />`;
        holder.append(frame);
        return frame;
    });
    let points = [];
    const readRope = async () => {
        // Measure the visible line, including the SVG's nested transforms.
        // The original SVG remains the displayed artwork.
        const image = new Image();
        image.src = rope.data;
        try { await image.decode(); } catch { return; }
        const canvas = document.createElement('canvas');
        canvas.width = 4219;
        canvas.height = 152;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        points = Array.from({ length: 1201 }, (_, index) => {
            const x = Math.round(index * (canvas.width - 1) / 1200);
            let best = 0, y = 65;
            for (let row = 0; row < canvas.height; row++) {
                const offset = (row * canvas.width + x) * 4;
                const darkness = pixels[offset + 3] * (765 - pixels[offset] - pixels[offset + 1] - pixels[offset + 2]);
                if (darkness > best) { best = darkness; y = row; }
            }
            return { x, y };
        });
        schedule();
    };
    let scale = 1;
    let spacing = 620;
    let startX = 0;
    let distance = 0;
    let ropeLeft = 0;
    let ropeTop = 0;
    let frame = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const update = () => {
        frame = 0;
        const scroll = -section.getBoundingClientRect().top;
        const drawingDistance = viewport.clientHeight * .6;
        const lineProgress = preference.matches ? 1 : clamp(scroll / drawingDistance);
        const revealEdge = (viewport.clientWidth * lineProgress - ropeLeft) / scale;
        rope.style.clipPath = lineProgress === 1 ? 'none' : lineProgress === 0 ? 'inset(0 100% 0 0)' : `inset(0 ${Math.max(0, 4218.81 - revealEdge)}px 0 0)`;
        holder.style.opacity = lineProgress === 1 ? '1' : '0';
        const progress = preference.matches ? 0 : clamp((scroll - drawingDistance) / Math.max(1, section.offsetHeight - viewport.offsetHeight - drawingDistance));
        frames.forEach((photo, index) => {
            const x = startX + spacing * index - distance * progress;
            const localX = (x - ropeLeft) / scale;
            let y = 65;
            if (points.length) {
                let low = 0, high = points.length - 1;
                while (low < high) { const mid = (low + high) >> 1; if (points[mid].x < localX) low = mid + 1; else high = mid; }
                y = points[low].y;
            }
            const swing = preference.matches ? 0 : Math.sin(progress * Math.PI * 3 + index * 1.7) * 1.3;
            photo.style.transform = `translate3d(${x - 135.2615 * scale}px, ${ropeTop + y * scale + 28 * scale}px, 0) scale(${scale}) rotate(${angles[index] + swing}deg)`;
        });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
        scale = Math.min(1, Math.max(.66, viewport.clientWidth / 1920), viewport.clientHeight / 800);
        spacing = 620 * scale;
        startX = preference.matches ? 190 * scale : viewport.clientWidth + 280 * scale;
        distance = startX + spacing * (frames.length - 1) + 280 * scale;
        ropeTop = viewport.clientHeight * .34;
        ropeLeft = (viewport.clientWidth - 4218.81 * scale) / 2;
        section.style.setProperty('--photo-rail-distance', `${viewport.clientHeight * .6 + Math.max(1000, distance * 2.7)}px`);
        section.style.setProperty('--photo-scale', scale);
        section.style.setProperty('--photo-rope-top', `${ropeTop}px`);
        section.style.setProperty('--photo-rope-left', `${ropeLeft}px`);
        stage.style.width = preference.matches ? `${startX + spacing * (frames.length - 1) + 190 * scale}px` : '';
        update();
    };
    rope.addEventListener('load', readRope);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', measure);
    measure();
    if (rope.contentDocument?.documentElement?.tagName === 'svg') readRope();
}
