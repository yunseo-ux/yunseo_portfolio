export function initPersonalProject() {
    const gallery = document.querySelector('.personal-project-gallery');
    const viewport = gallery?.querySelector('.personal-project-viewport');
    const track = gallery?.querySelector('.personal-project-track');
    if (!track || !viewport) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
        frame = 0;
        gallery.style.setProperty('--personal-project-scale', Math.min(1, gallery.clientWidth / 1920));
        if (preference.matches) {
            gallery.style.removeProperty('height');
            track.style.removeProperty('transform');
            return;
        }
        const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
        gallery.style.height = `${viewport.offsetHeight + distance}px`;
        const vertical = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(distance, -gallery.getBoundingClientRect().top - vertical));
        track.style.transform = `translateX(${-progress}px)`;
    };
    const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    // Keep keyboard navigation and direct project links aligned with the visible panel.
    const showPanel = target => {
        if (preference.matches) return;
        const panel = target?.closest('.personal-overview');
        if (!panel || !track.contains(panel)) return;
        const vertical = Math.max(0, viewport.offsetHeight - window.innerHeight);
        const top = gallery.getBoundingClientRect().top + window.scrollY + vertical + panel.offsetLeft;
        window.scrollTo({ top, behavior: 'instant' });
    };
    track.addEventListener('focusin', event => showPanel(event.target));
    const showHash = () => {
        if (!window.location.hash) return;
        showPanel(document.getElementById(window.location.hash.slice(1)));
    };
    window.addEventListener('hashchange', showHash);
    update();
    showHash();
}
