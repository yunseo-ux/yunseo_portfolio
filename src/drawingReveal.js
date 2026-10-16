const targets = [
    '.hero-pen', '.intro-heading > span', '.intro-copy',
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
        if (element.matches('.software-skills-tools > li, .intro-heading > span')) {
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
    const paper = [...section.querySelectorAll('.introduction-paper, .introduction-tape-paper')];
    const photo = [...section.querySelectorAll('.introduction-photo, .introduction-tape-top-right, .introduction-tape-bottom-left')];
    if (!paper.length || !photo.length) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'introduction-scroll-track';
    section.before(wrapper);
    wrapper.append(section);
    const clamp = value => Math.max(0, Math.min(1, value));
    const reveal = (elements, progress) => {
        elements.forEach(element => {
            element.style.opacity = String(progress);
            // Reveal the shadow together with its paper, including the area
            // outside the element's border box throughout the animation.
            const shadowMargin = 24;
            const right = (1 - progress) * (element.offsetWidth + shadowMargin * 2) - shadowMargin;
            element.style.clipPath = progress >= 1 ? '' : `inset(-${shadowMargin}px ${right}px -${shadowMargin}px -${shadowMargin}px)`;
        });
    };
    let frame = 0;
    const update = () => {
        frame = 0;
        if (preference.matches) {
            [...paper, ...photo].forEach(element => {
                element.style.opacity = '';
                element.style.clipPath = '';
            });
            section.style.top = '';
            return;
        }
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        section.style.top = (-vertical) + 'px';
        const scroll = -wrapper.getBoundingClientRect().top - vertical;
        reveal(paper, clamp(scroll / 600));
        reveal(photo, clamp((scroll - 700) / 650));
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
    let headingAnimating = false;
    let lastWheelTime = -Infinity;
    let headingGesture = false;
    const headingStops = [0, 550, 1150, 1750];
    window.addEventListener('wheel', event => {
        if (event.target.closest('.portfolio-chatbot')) return;
        if (preference.matches || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        const now = performance.now();
        const sameGesture = now - lastWheelTime < 140;
        lastWheelTime = now;
        if (headingAnimating || (headingGesture && sameGesture)) {
            event.preventDefault();
            return;
        }
        headingGesture = false;
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        const start = wrapper.getBoundingClientRect().top + window.scrollY + vertical;
        const range = Math.max(1, wrapper.offsetHeight - section.offsetHeight - vertical);
        const timeline = (window.scrollY - start) / range * 4500;
        if (timeline < -1 || timeline > 1751) return;
        const next = event.deltaY > 0
            ? headingStops.find(stop => stop > timeline + 1)
            : [...headingStops].reverse().find(stop => stop < timeline - 1);
        if (next === undefined) return;
        event.preventDefault();
        headingGesture = true;
        headingAnimating = true;
        const from = window.scrollY;
        const to = start + next / 4500 * range;
        const started = performance.now();
        const animate = time => {
            const progress = clamp((time - started) / 350);
            const eased = 1 - (1 - progress) ** 3;
            window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' });
            if (progress < 1) requestAnimationFrame(animate);
            else headingAnimating = false;
        };
        requestAnimationFrame(animate);
    }, { passive: false });
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
        const lineStarts = [0, 600, 1200];
        lines.forEach((line, index) => {
            const local = clamp((timeline - lineStarts[index]) / 550);
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
