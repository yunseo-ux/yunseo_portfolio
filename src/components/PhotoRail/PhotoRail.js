const clipFront = new URL('./assets/clip-front.svg', import.meta.url).href;
const clipBack = new URL('./assets/clip-back.svg', import.meta.url).href;
const photos = [
    [new URL('./assets/photo-1.jpg', import.meta.url).href, '벚꽃나무 아래에서 찍은 사진'],
    [new URL('./assets/photo-2.jpg', import.meta.url).href, '캐릭터로 꾸며진 컴퓨터 화면에서 찍은 사진'],
    [new URL('./assets/photo-3.jpg', import.meta.url).href, 'EcoAction 프로젝트 전시 사진'],
    [new URL('./assets/photo-4.jpg', import.meta.url).href, '소나무 사이에서 찍은 사진'],
    [new URL('./assets/photo-5.jpg', import.meta.url).href, '싱가포르 여행 사진'],
    [new URL('./assets/photo-6.jpg', import.meta.url).href, '전시 작품을 감상하는 사진'],
];

export function initPhotoRail() {
    const section = document.querySelector('.photo-rail');
    if (!section) return;
    const viewport = section.querySelector('.photo-rail-viewport');
    const stage = section.querySelector('.photo-rail-stage');
    const rope = section.querySelector('.photo-rail-rope');
    const holder = section.querySelector('.photo-rail-frames');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const caption = document.createElement('p');
    caption.className = 'photo-rail-caption';
    const messages = ['작은 순간에서 의미 있는 단서를 모읍니다.', '서로 다른 생각을 연결해 가능성을 넓힙니다.', '발견한 가능성을 실제 경험으로 구현합니다.'];
    caption.setAttribute('aria-label', messages.join(' '));
    const lines = messages.map(message => [...message].map(character => {
        const letter = document.createElement('span');
        letter.textContent = character === ' ' ? '\u00a0' : character;
        letter.setAttribute('aria-hidden', 'true');
        caption.append(letter);
        return letter;
    }));
    stage.append(caption);
    const angles = [-12, 7.5, -4, 13, -9, 3.5];
    const frames = angles.map((_, index) => {
        const frame = document.createElement('div');
        frame.className = 'photo-rail-frame';
        frame.setAttribute('role', 'listitem');
        frame.setAttribute('aria-label', `사진을 넣을 프레임 ${index + 1}`);
        frame.innerHTML = `<img class="photo-rail-clip photo-rail-clip--back" src="${clipBack}" alt="" /><div class="photo-rail-paper"><div class="photo-rail-placeholder"></div></div><img class="photo-rail-clip photo-rail-clip--front" src="${clipFront}" alt="" />`;
        holder.append(frame);
        const image = document.createElement('img');
        image.src = photos[index][0];
        image.alt = photos[index][1];
        image.decoding = 'async';
        frame.querySelector('.photo-rail-placeholder').append(image);
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
    let viewportWidth = 0;
    let viewportHeight = 0;
    let textWidth = 0;
    let sectionHeight = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const ropeY = x => {
        if (!points.length) return 65;
        let low = 0, high = points.length - 1;
        while (low < high) { const mid = (low + high) >> 1; if (points[mid].x < x) low = mid + 1; else high = mid; }
        return points[low].y;
    };
    const update = () => {
        frame = 0;
        // Read layout before any style writes; letter updates must not force
        // the browser to recalculate layout for every character.
        const bounds = section.getBoundingClientRect();
        if (bounds.top > viewportHeight || bounds.top + sectionHeight < 0) return;
        const scroll = -bounds.top;
        const drawingDistance = viewportHeight * .6;
        const lineProgress = preference.matches ? 1 : clamp(scroll / drawingDistance);
        const revealEdge = (viewportWidth * lineProgress - ropeLeft) / scale;
        rope.style.clipPath = lineProgress === 1 ? 'none' : lineProgress === 0 ? 'inset(0 100% 0 0)' : `inset(0 ${Math.max(0, 4218.81 - revealEdge)}px 0 0)`;
        const introDistance = drawingDistance;
        const photoDistance = Math.max(1000, distance * 2.7);
        const progress = preference.matches ? 0 : clamp((scroll - introDistance) / photoDistance);
        const lastPhotoX = startX + spacing * (frames.length - 1) - distance * progress;
        const textLeft = Math.max((viewportWidth - textWidth) / 2, lastPhotoX + 300 * scale);
        const tail = (scroll - introDistance - photoDistance) / viewportHeight;
        const firstChange = clamp((tail - .45) / .35);
        const secondChange = clamp((tail - 1.5) / .35);
        const exitProgress = clamp((tail - 2.6) / 1.6);
        const exitOffset = exitProgress * ((viewportWidth + textWidth) / 2 + 80);
        const offsets = [-firstChange * 65, (1 - firstChange - secondChange) * 65, (1 - secondChange) * 65];
        const opacities = [1 - firstChange, firstChange * (1 - secondChange), secondChange];
        lines.forEach((letters, lineIndex) => {
        const opacity = preference.matches || scroll >= introDistance ? opacities[lineIndex] : 0;
        // Invisible sentences need no path sampling or transform updates.
        if (!opacity || textLeft - exitOffset > viewportWidth + textWidth || textLeft - exitOffset + textWidth < 0) {
            letters.forEach(letter => { if (letter.style.opacity !== '0') letter.style.opacity = '0'; });
            return;
        }
        const letterWidth = textWidth / letters.length;
        letters.forEach((letter, index) => {
            const x = textLeft + letterWidth * (index + .5) - exitOffset;
            const localX = (x - ropeLeft) / scale;
            const y = ropeTop + ropeY(localX) * scale + Math.min(100, viewportHeight * .1) + offsets[lineIndex];
            const angle = Math.atan2((ropeY(localX + 24) - ropeY(localX - 24)) * scale, 48 * scale) * 180 / Math.PI;
            letter.style.transform = `translate3d(${x}px, ${y}px, 0) translateX(-50%) rotate(${angle}deg)`;
            letter.style.opacity = opacity;
        });
        });
        holder.style.opacity = preference.matches || scroll >= introDistance ? '1' : '0';
        frames.forEach((photo, index) => {
            const x = startX + spacing * index - distance * progress;
            const localX = (x - ropeLeft) / scale;
            const y = ropeY(localX);
            const swing = preference.matches ? 0 : Math.sin(progress * Math.PI * 3 + index * 1.7) * 1.3;
            photo.style.transform = `translate3d(${x - 135.2615 * scale}px, ${ropeTop + y * scale + 28 * scale}px, 0) scale(${scale}) rotate(${angles[index] + swing}deg)`;
        });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
        viewportWidth = viewport.clientWidth;
        viewportHeight = viewport.clientHeight;
        textWidth = Math.min(920, viewportWidth * .86);
        caption.style.fontSize = `${Math.min(46, textWidth / Math.max(...messages.map(message => message.length)) * 1.2)}px`;
        scale = Math.min(1, Math.max(.66, viewport.clientWidth / 1920), viewport.clientHeight / 800);
        spacing = 620 * scale;
        startX = preference.matches ? 190 * scale : viewport.clientWidth + 280 * scale;
        distance = startX + spacing * (frames.length - 1) + 280 * scale;
        ropeTop = viewport.clientHeight / 2 - (65 + 28 + 332.814 / 2) * scale;
        ropeLeft = (viewport.clientWidth - 4218.81 * scale) / 2;
        section.style.setProperty('--photo-rail-distance', `${viewport.clientHeight * 5 + Math.max(1000, distance * 2.7)}px`);
        section.style.setProperty('--photo-scale', scale);
        section.style.setProperty('--photo-rope-top', `${ropeTop}px`);
        section.style.setProperty('--photo-rope-left', `${ropeLeft}px`);
        stage.style.width = preference.matches ? `${startX + spacing * (frames.length - 1) + 190 * scale}px` : '';
        sectionHeight = section.offsetHeight;
        update();
    };
    rope.addEventListener('load', readRope);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    preference.addEventListener('change', measure);
    measure();
    if (rope.contentDocument?.documentElement?.tagName === 'svg') readRope();
}
