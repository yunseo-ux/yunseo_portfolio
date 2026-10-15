export function initCloneCoding() {
    const section = document.querySelector('.clone-coding');
    if (!section) return;
    const track = section.querySelector('.clone-coding-track');
    const windowElement = section.querySelector('.clone-coding-window');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
        frame = 0;
        const style = getComputedStyle(windowElement);
        const available = windowElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const distance = Math.max(0, track.scrollWidth - available);
        const pinned = window.innerWidth > 800 && window.innerHeight > 600 && !reduced.matches && distance > 1;
        section.classList.toggle('clone-coding--pinned', pinned);
        section.style.setProperty('--clone-scroll-distance', `${distance * 1.8 + 250}px`);
        if (!pinned) { track.style.transform = ''; return; }
        const range = section.offsetHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / range));
        track.style.transform = `translateX(${-distance * progress}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
}
