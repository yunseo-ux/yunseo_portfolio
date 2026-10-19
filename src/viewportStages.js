// Preserve the approved desktop composition at 1920 × 900 CSS pixels.
// All spacing, typography and artwork inside a stage scale together.
const REFERENCE_WIDTH = 1920;
const REFERENCE_HEIGHT = 900;

export function initViewportStages() {
    const desktop = matchMedia('(min-width: 801px)');
    const selector = [
        '.personal-project-track .personal-overview-canvas',
        '.personal-project-track .movement-details-canvas',
        '.app-gallery-track .personal-overview-canvas',
        '.personal-project-slogan-canvas',
        '.app-slogan-scroll .app-project-canvas',
        '.video-project-layout',
    ].join(',');
    const entries = [...document.querySelectorAll(selector)].map(canvas => {
        const panel = canvas.parentElement;
        const slot = document.createElement('div');
        slot.className = 'viewport-stage-slot';
        const stage = document.createElement('div');
        stage.className = 'viewport-stage';
        canvas.before(slot);
        slot.append(stage);
        stage.append(canvas);
        canvas.classList.add('viewport-stage-content');
        let top = -54;
        if (panel.matches('.app-gallery-intro')) top -= 5;
        if (panel.matches('#movement-details, #two-details, #rola-details')) top -= 7;
        if (canvas.matches('.personal-project-slogan-canvas')) top = canvas.matches('.video-project-canvas') ? 36 : 96;
        if (panel.matches('.app-detail')) top = -99;
        if (panel.matches('.app-overview--eco')) top = -59;
        if (panel.matches('.app-detail--eco')) stage.style.setProperty('--stage-content-left', '15px');
        stage.style.setProperty('--stage-content-top', `${top}px`);
        return { canvas, slot, stage, panel };
    });
    const measure = () => {
        entries.forEach(({ canvas, slot, stage, panel }) => {
            slot.classList.toggle('viewport-stage-slot--active', desktop.matches);
            if (!desktop.matches) return;
            const width = panel.clientWidth;
            const height = window.innerHeight;
            const scale = Math.min(width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT);
            slot.style.height = `${height}px`;
            stage.style.setProperty('--stage-scale', scale);
            if (canvas.matches('.video-project-layout')) {
                stage.style.setProperty('--stage-content-top', `${(REFERENCE_HEIGHT - canvas.offsetHeight) / 2 - 13}px`);
            }
        });
    };
    // ResizeObserver handles fonts and text wrapping without relying on a timeout.
    const observer = new ResizeObserver(measure);
    entries.forEach(({ canvas }) => observer.observe(canvas));
    addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    document.fonts.ready.then(measure);
    measure();
}
