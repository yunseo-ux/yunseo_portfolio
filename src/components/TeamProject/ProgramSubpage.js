export function initProgramSubpage() {
    const section = document.querySelector('.team-program');
    if (!section) return;
    const reference = document.querySelector('.team-editorial:not(.team-program) .team-editorial-preview img');
    const preview = section.querySelector('.team-program-preview img');
    const matchSpeed = () => {
        if (!reference?.naturalWidth || !preview?.naturalWidth) return;
        const distance = image => Math.max(0, image.naturalHeight / image.naturalWidth * 716 - 681);
        const referenceDistance = distance(reference);
        if (referenceDistance > 0) preview.style.setProperty('--preview-duration', `${65 * distance(preview) / referenceDistance}s`);
    };
    reference?.addEventListener('load', matchSpeed);
    preview?.addEventListener('load', matchSpeed);
    matchSpeed();
    const visible = new Set();
    const update = () => section.classList.toggle('team-editorial--visible', visible.has(section) && !document.hidden);
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) visible.add(section);
        else visible.delete(section);
        update();
    }, { threshold: .4 }).observe(section);
    document.addEventListener('visibilitychange', update);
}
