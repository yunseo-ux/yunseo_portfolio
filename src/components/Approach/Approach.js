export function initApproach() {
    const section = document.querySelector('.approach');
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = [...section.querySelectorAll('.approach-card')];
    cards.forEach((card, index) => {
        const sheet = card.querySelector('.approach-sheet');
        const content = document.createElement('div');
        content.className = 'approach-drawing-content';
        content.append(...sheet.childNodes);
        sheet.append(content);
        card.style.setProperty('--card-delay', `${index * 950}ms`);
    });
    section.classList.add('approach-animated');
    if (!window.matchMedia('(max-width: 600px)').matches) {
        const viewport = document.createElement('div');
        viewport.className = 'approach-pin-viewport';
        viewport.append(section.querySelector('.approach-canvas'));
        section.append(viewport);
        section.classList.add('approach-pinned');
        const clamp = value => Math.max(0, Math.min(1, value));
        let frame = 0;
        const update = () => {
            const canvas = viewport.firstElementChild;
            const scale = Math.min(section.clientWidth / 1920, window.innerHeight / 1080);
            canvas.style.scale = String(scale);
            canvas.style.left = `${(section.clientWidth - 1920 * scale) / 2}px`;
            canvas.style.top = `${(window.innerHeight - 1080 * scale) / 2}px`;
            const holdDistance = 200;
            const scrollDistance = -section.getBoundingClientRect().top;
            const progress = clamp((scrollDistance - holdDistance) / (section.offsetHeight - viewport.offsetHeight - holdDistance));
            cards.forEach((card, index) => {
                const phase = progress * 3.3 - index;
                card.style.opacity = '1';
                card.style.translate = 'none';
                const fill = clamp(phase / .8);
                const leading = Math.min(100, fill * 200);
                const trailing = Math.max(0, fill * 200 - 100);
                // Include the center sheet's shadow in the reveal instead of
                // clipping it until the final frame removes the polygon.
                if (card.classList.contains('approach-card--explore')) {
                    const edge = value => value * 1.1 - 5;
                    card.style.clipPath = fill === 1 ? 'none' : fill === 0 ? 'inset(0 100% 0 0)' : `polygon(-5% -5%, ${edge(leading)}% -5%, 105% ${edge(trailing)}%, ${edge(trailing)}% 105%, -5% ${edge(leading)}%)`;
                } else {
                    card.style.clipPath = fill === 1 ? 'none' : fill === 0 ? 'inset(0 100% 0 0)' : `polygon(0 0, ${leading}% 0, 100% ${trailing}%, ${trailing}% 100%, 0 ${leading}%)`;
                }
            });
            frame = 0;
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        update();
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            if (window.matchMedia('(max-width: 600px)').matches) entry.target.style.setProperty('--card-delay', '0ms');
            entry.target.classList.add('approach-card--draw');
            observer.unobserve(entry.target);
        });
    }, { threshold: .18 });
    cards.forEach(card => observer.observe(card));
}
