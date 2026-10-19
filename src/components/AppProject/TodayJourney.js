const DESIGN_WIDTH = 4468;
const DESIGN_HEIGHT = 1080;

export function initTodayJourney(panel) {
    const line = panel.querySelector('[data-journey-line]');
    const pins = [...panel.querySelectorAll('[data-journey-pin]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pinPositions = [1894, 407, 4254];
    let width = 0;
    let target = 0;
    let drawn = 0;
    let frame = 0;
    let previous = 0;
    const clamp = value => Math.max(0, Math.min(1, value));
    const render = () => {
        line.style.clipPath = `inset(-10px ${(1 - drawn) * 100}% -10px 0)`;
        pins.forEach((pin, index) => {
            const progress = clamp((drawn - pinPositions[index] / DESIGN_WIDTH) / .035);
            pin.style.clipPath = `inset(${(1 - progress) * 100}% -10px -10px -10px)`;
        });
    };
    const draw = time => {
        const elapsed = previous ? Math.min(64, time - previous) : 16;
        previous = time;
        // Let the line follow the reader rather than jump ahead of the screens.
        drawn += (target - drawn) * (1 - Math.exp(-elapsed / 280));
        if (Math.abs(target - drawn) < .0001) drawn = target;
        render();
        frame = drawn === target ? 0 : requestAnimationFrame(draw);
        if (!frame) previous = 0;
    };
    const update = progress => {
        target = reduced.matches ? 1 : clamp(progress);
        if (reduced.matches) {
            cancelAnimationFrame(frame);
            frame = 0;
            previous = 0;
            drawn = 1;
            render();
        } else if (!frame) frame = requestAnimationFrame(draw);
    };
    const measure = viewportWidth => {
        const scale = Math.min(1, Math.max(1, innerHeight - 64) / DESIGN_HEIGHT, viewportWidth > 800 ? viewportWidth / 1920 : .75);
        width = DESIGN_WIDTH * scale;
        panel.style.setProperty('--journey-scale', scale);
        // Account for the transformed canvas so the browser selects a smooth,
        // appropriately sized raster instead of minifying an 804px screenshot.
        panel.querySelectorAll('img[srcset]').forEach(image => {
            image.sizes = `${Math.max(1, Math.ceil(image.getBoundingClientRect().width))}px`;
        });
        panel.style.flexBasis = reduced.matches ? '' : `${Math.max(viewportWidth, width)}px`;
        panel.classList.toggle('today-journey--animated', !reduced.matches);
        panel.classList.toggle('today-journey--static', reduced.matches);
        return width;
    };
    reduced.addEventListener('change', () => update(target));
    return { measure, update, get width() { return width; } };
}
