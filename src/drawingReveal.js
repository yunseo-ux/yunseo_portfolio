const targets = [
    '.hero-title > span', '.hero-pen', '.intro-heading > span', '.intro-copy',
    '.intro-process', '.introduction-art', '.introduction-content h2', '.introduction-content p',
    '.team-project-slogan h2', '.team-project-slogan-label', '.team-project-slogan-character',
    '.team-project-slogan-line', '.team-project-slogan-star',
    '.personal-overview-visual',
    '.team-research-paper', '.team-research-tape',
    '.team-background-label', '.team-background-canvas h2', '.team-background-copy',
    '.team-research-labels', '.team-research-subtitle', '.team-research-canvas h2', '.team-research-copy',
    '.team-placeholder-labels', '.team-placeholder-subtitle', '.team-placeholder-canvas h2', '.team-placeholder-copy',
    '.team-additional-subtitle', '.team-additional-canvas h2', '.team-planning-menu', '.team-planning-copy',
    '.team-structure-menu', '.team-structure-copy',
    '.personal-project-label', '.personal-project-slogan h2', '.personal-project-character',
    '.personal-overview-page', '.personal-overview-canvas h2', '.personal-website-button',
    '.personal-overview-canvas h3', '.personal-overview-brief', '.personal-overview-direction', '.personal-overview-contribution',
    '.app-project-character', '.app-project-label', '.app-project-canvas h2',
    '.software-skills-heading h2', '.software-skills-heading > p', '.software-skills-tools > li',
    '.software-skills-paper',
];

export function initDrawingReveal() {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    const staticStart = document.querySelector('.personal-overview');
    const elements = [...document.querySelectorAll(targets.join(','))]
        .filter(element => !element.closest('.portfolio-intro, .introduction, .approach, .team-project-slogan, .personal-project-slogan, .team-project-gallery, .team-project-screen-scroll'))
        .filter(element => !staticStart || !(staticStart.contains(element) || (staticStart.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)));
    const active = new Map();
    const frames = [
        { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0, 0 0)' },
        { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 100%, 0 100%)', offset: .45 },
        { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%)' },
    ];
    const reveal = element => {
        if (preference.matches) return;
        active.get(element)?.cancel();
        element.classList.remove('drawing-reveal-pending');
        const picture = element.matches('img, .team-project-visual, .team-research-paper, .introduction-art, .software-skills-paper');
        const handwriting = element.matches('.intro-heading > span');
        const star = element.matches('.intro-sparkles img');
        const animation = element.animate(handwriting ? [
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)' },
        ] : frames, {
            duration: star ? 850 : handwriting ? 450 : picture ? 1500 : 950,
            easing: handwriting ? 'steps(12, end)' : 'cubic-bezier(.25,.1,.25,1)',
            delay: Number(element.dataset.drawingDelay || 0),
            fill: 'backwards',
        });
        active.set(element, animation);
        if (handwriting) {
            element.style.setProperty('--intro-writing-delay', `${element.dataset.drawingDelay || 0}ms`);
            element.classList.add('intro-header-writing');
        }
        animation.finished.then(() => {
            element.classList.remove('intro-header-writing');
            if (active.get(element) === animation) active.delete(element);
        }).catch(() => {});
    };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (entry.target.matches('.intro-heading')) {
                entry.target.querySelectorAll(':scope > span').forEach(reveal);
                document.querySelectorAll('.intro-sparkles img').forEach(reveal);
            } else reveal(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: .12 });
    elements.forEach(element => {
        // Only animate the outermost selected layer to avoid clipping it twice.
        if (elements.some(other => other !== element && other.contains(element))) return;
        if (element.matches('.intro-heading > span')) {
            element.dataset.drawingDelay = String([...element.parentElement.children].indexOf(element) * 600);
            element.classList.add('drawing-reveal-pending');
            return;
        }
        if (element.matches('.software-skills-tools > li, .hero-title > span, .intro-heading > span')) {
            element.dataset.drawingDelay = String([...element.parentElement.children].indexOf(element) * 100);
        }
        element.classList.add('drawing-reveal-pending');
        observer.observe(element);
    });
    const introHeading = document.querySelector('.intro-heading');
    const stars = [...document.querySelectorAll('.intro-sparkles img')];
    stars.forEach((star, index) => {
        star.dataset.drawingDelay = String(1800 + index * 550);
        star.classList.add('drawing-reveal-pending');
        elements.push(star);
    });
    if (introHeading) initIntroScroll(preference);
    initAboutScroll(preference);
    // Draw newly selected research/planning images again after they load.
    const imageChanges = new MutationObserver(records => {
        records.forEach(({ target }) => {
            const slot = target.closest('.team-research-image-slot, .team-planning-image-slot, .team-placeholder-image-slot, .team-structure-image-slot');
            if (!slot || slot.closest('.team-project-gallery')) return;
            const draw = () => { if (!target.closest('.drawing-reveal-pending')) reveal(slot); };
            if (target.complete && target.naturalWidth) draw();
            else target.addEventListener('load', draw, { once: true });
        });
    });
    document.querySelectorAll('.team-research-image, .team-planning-image, .team-placeholder-image, .team-structure-image')
        .forEach(image => imageChanges.observe(image, { attributes: true, attributeFilter: ['src'] }));
    preference.addEventListener('change', () => {
        if (!preference.matches) return;
        observer.disconnect();
        imageChanges.disconnect();
        elements.forEach(element => element.classList.remove('drawing-reveal-pending'));
        active.forEach(animation => animation.cancel());
        active.clear();
    });
}

function initAboutScroll(preference) {
    const section = document.querySelector('.introduction');
    if (!section) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'introduction-scroll-track';
    section.before(wrapper);
    wrapper.append(section);
    const title = section.querySelector('h2');
    const copy = section.querySelector('.introduction-content p');
    const art = section.querySelector('.introduction-art');
    const artImage = art.querySelector('img');
    const ns = 'http://www.w3.org/2000/svg';
    const sketch = document.createElementNS(ns, 'svg');
    sketch.setAttribute('viewBox', '0 0 814.263 636.495');
    sketch.setAttribute('width', '814.263');
    sketch.setAttribute('height', '636.495');
    sketch.setAttribute('aria-hidden', 'true');
    sketch.style.display = 'block';
    sketch.style.maxWidth = 'none';
    sketch.innerHTML = '<defs><mask id="about-scribble-draw" maskUnits="userSpaceOnUse" x="0" y="0" width="814.263" height="636.495"><path d="M234 40 L582 90 L151 158 L688 122 L63 235 L648 255 L153 300 L767 351 L113 417 L657 417 L199 475 L750 526 L593 573 L236 596" fill="none" stroke="white" stroke-width="150" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></mask></defs>';
    const artwork = document.createElementNS(ns, 'image');
    artwork.setAttribute('href', artImage.getAttribute('src'));
    artwork.setAttribute('width', '814.263');
    artwork.setAttribute('height', '636.495');
    artwork.setAttribute('mask', 'url(#about-scribble-draw)');
    sketch.append(artwork);
    artImage.replaceWith(sketch);
    const drawingStroke = sketch.querySelector('path');
    drawingStroke.style.strokeDasharray = '1';
    const clamp = value => Math.max(0, Math.min(1, value));
    let frame = 0;
    const update = () => {
        frame = 0;
        if (preference.matches) {
            [title, copy, art].forEach(element => { element.style.clipPath = ''; });
            drawingStroke.style.strokeDashoffset = '0';
            return;
        }
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        section.style.top = `${-vertical}px`;
        const scroll = -wrapper.getBoundingClientRect().top - vertical;
        title.style.clipPath = '';
        copy.style.clipPath = '';
        art.style.clipPath = '';
        drawingStroke.style.strokeDashoffset = String(1 - clamp((scroll - 450) / 750));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
}

function initIntroScroll(preference) {
    const section = document.querySelector('.portfolio-intro');
    if (!section) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'intro-scroll-track';
    section.before(wrapper);
    wrapper.append(section);
    const lines = [...section.querySelectorAll('.intro-heading > span')];
    const stars = [...section.querySelectorAll('.intro-sparkles img')];
    const copy = section.querySelector('.intro-copy');
    const highlight = section.querySelector('.intro-highlighter');
    const details = [...section.querySelectorAll('.intro-divider, .intro-process')];
    const centered = document.createElement('div');
    centered.className = 'intro-scroll-main';
    centered.append(section.querySelector('.intro-heading-wrap'), section.querySelector('.intro-copy-wrap'));
    section.prepend(centered);
    const outro = document.createElement('div');
    outro.className = 'intro-scroll-outro';
    outro.append(...details);
    wrapper.after(outro);
    const all = [...lines, ...stars, copy, highlight, ...details].filter(Boolean);
    all.forEach(element => element.classList.remove('drawing-reveal-pending'));
    const clamp = value => Math.max(0, Math.min(1, value));
    const diagonal = (element, progress) => {
        if (!element) return;
        const p = clamp(progress);
        element.style.clipPath = p === 0 ? 'inset(0 100% 0 0)' : `polygon(0 0, ${Math.min(100, p * 200)}% 0, 100% ${Math.max(0, p * 200 - 100)}%, ${Math.max(0, p * 200 - 100)}% 100%, 0 ${Math.min(100, p * 200)}%)`;
    };
    let frame = 0;
    const update = () => {
        frame = 0;
        if (preference.matches) {
            all.forEach(element => { element.style.clipPath = ''; });
            return;
        }
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        section.style.setProperty('--intro-pin-top', `${-vertical}px`);
        const distance = wrapper.offsetHeight - section.offsetHeight;
        const progress = clamp((-wrapper.getBoundingClientRect().top - vertical) / Math.max(1, distance - vertical));
        const timeline = progress * 4500;
        const lineStarts = [0, 420, 1050];
        lines.forEach((line, index) => {
            const local = clamp((timeline - lineStarts[index]) / 350);
            const stepped = Math.floor(local * 12) / 12;
            line.style.clipPath = `inset(0 ${(1 - stepped) * 100}% 0 0)`;
        });
        stars.forEach((star, index) => diagonal(star, (timeline - 1950 - index * 180) / 200));
        const copyProgress = clamp((timeline - 3150) / 650);
        diagonal(copy, copyProgress);
        if (highlight) highlight.style.clipPath = `inset(0 ${(1 - clamp((timeline - 4070) / 300)) * 100}% 0 0)`;
        const outroProgress = clamp((window.innerHeight - outro.getBoundingClientRect().top) / Math.max(440, window.innerHeight * .75));
        details.forEach(element => {
            if (element.matches('.intro-divider')) {
                element.style.clipPath = `inset(0 0 ${(1 - clamp((outroProgress - .15) / .52)) * 100}% 0)`;
            } else {
                const textProgress = clamp((window.innerHeight * .75 - element.getBoundingClientRect().top) / 180);
                element.style.clipPath = `inset(0 ${(1 - textProgress) * 100}% 0 0)`;
            }
        });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
}
