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
            duration: element.matches('.hero-pen') ? 400 : star ? 850 : handwriting ? 450 : picture ? 1500 : 950,
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
            if (element.matches('.hero-pen')) window.dispatchEvent(new Event('portfolio:hero-pen-ready'));
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
    const reveal = (elements, progress, direction) => {
        const eased = 1 - (1 - progress) ** 3;
        elements.forEach(element => {
            element.style.opacity = String(progress);
            element.style.clipPath = '';
            element.style.translate = `${direction * (1 - eased) * 260}px 0`;
        });
    };
    let frame = 0;
    const update = () => {
        frame = 0;
        if (preference.matches) {
            [...paper, ...photo].forEach(element => {
                element.style.opacity = '';
                element.style.clipPath = '';
                element.style.translate = '';
            });
            section.style.top = '';
            return;
        }
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        section.style.top = window.innerWidth > 800
            ? `${(window.innerHeight - section.offsetHeight) / 2}px`
            : (-vertical) + 'px';
        const scroll = -wrapper.getBoundingClientRect().top - vertical;
        reveal(paper, clamp(scroll / 600), -1);
        reveal(photo, clamp((scroll - 700) / 650), 1);
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
    let frame = 0;
    const update = () => {
        frame = 0;
        const vertical = Math.max(0, section.offsetHeight - window.innerHeight);
        section.style.setProperty('--intro-pin-top', -vertical + 'px');
        const distance = wrapper.offsetHeight - section.offsetHeight;
        const scroll = -wrapper.getBoundingClientRect().top - vertical;
        const progress = preference.matches ? 1 : clamp(scroll / Math.max(1, Math.min(2200, distance - vertical)));
        lines.forEach((line, index) => {
            const fill = clamp((progress - index * .16) / .24);
            line.style.setProperty('--intro-fill', fill * 100 + '%');
            line.style.clipPath = '';
        });
        if (copy) copy.style.clipPath = '';
        stars.forEach((star, index) => {
            star.style.clipPath = '';
            star.style.opacity = clamp((progress - .58 - index * .06) / .16);
        });
        const highlightProgress = preference.matches ? 1 : clamp((scroll - 1700) / 850);
        if (highlight) highlight.style.clipPath = 'inset(0 ' + (1 - highlightProgress) * 100 + '% 0 0)';
        details.forEach(element => { element.style.clipPath = ''; });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    update();
}
