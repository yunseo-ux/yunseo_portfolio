import { getProjectScale } from '../../projectScale.js';

export function initHanyulProject(track) {
    const panels = [...track.querySelectorAll(':scope > .hanyul-panel')];
    const comparison = track.querySelector('.hanyul-comparison');
    const clamp = value => Math.max(0, Math.min(1, value));
    return {
        measure() {
            const scale = getProjectScale(innerWidth, innerHeight);
            panels.forEach(panel => panel.style.setProperty('--hanyul-scale', scale));
            const intro = panels[0];
            const laptop = intro?.querySelector('.team-project-visual');
            if (laptop) {
                const referenceScale = scale;
                const canvasLeft = (innerWidth - 1920 * scale) / 2;
                const canvasTop = (innerHeight - 1080 * scale) / 2;
                const targetLeft = (innerWidth - 1920 * referenceScale) / 2 + 120 * referenceScale;
                const targetTop = (innerHeight - 900 * referenceScale) / 2 + 223 * referenceScale;
                laptop.style.left = `${(targetLeft - canvasLeft) / scale}px`;
                laptop.style.top = `${(targetTop - canvasTop) / scale}px`;
                laptop.style.transform = `scale(${referenceScale / scale})`;
            }
            const screen = intro?.querySelector('.team-project-laptop-screen');
            if (screen) intro.style.setProperty('--hanyul-preview-height', `${screen.clientHeight}px`);
        },
        update(position, allPanels, comparisonProgress, reduced) {
            panels.forEach(panel => {
                const visible = reduced || Math.abs(position - allPanels.indexOf(panel)) < .35;
                panel.classList.toggle('hanyul-panel--visible', visible);
                panel.classList.toggle('team-editorial--visible', visible);
            });
            if (!comparison) return;
            const reveal = (start, end) => {
                if (reduced) return 1;
                const value = clamp((comparisonProgress - start) / (end - start));
                return value * value * (3 - 2 * value);
            };
            comparison.style.setProperty('--comparison-image', reveal(.1, .3));
            comparison.style.setProperty('--comparison-center', reveal(.34, .46));
            comparison.style.setProperty('--comparison-right', reveal(.52, .64));
            comparison.style.setProperty('--comparison-copy', reveal(.72, .84));
        },
    };
}
