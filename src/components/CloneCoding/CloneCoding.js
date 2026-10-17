export function initCloneCoding() {
    const section = document.querySelector('.clone-coding');
    if (!section) return;
    const track = section.querySelector('.clone-coding-track');
    const windowElement = section.querySelector('.clone-coding-window');
    const heading = section.querySelector('.clone-coding-heading');
    section.prepend(heading);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
        frame = 0;
        const style = getComputedStyle(windowElement);
        const available = windowElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const distance = Math.max(0, track.scrollWidth - available);
        const pinned = window.innerWidth > 800 && window.innerHeight > 600 && !reduced.matches && distance > 1;
        section.classList.toggle('clone-coding--pinned', pinned);
        const introDistance = heading.offsetHeight;
        section.style.setProperty('--clone-scroll-distance', `${introDistance + distance * 1.8 + 250}px`);
        if (!pinned) {
            track.style.transform = '';
            return;
        }
        const clamp = value => Math.max(0, Math.min(1, value));
        const scroll = -section.getBoundingClientRect().top;
        const range = section.offsetHeight - window.innerHeight - introDistance;
        const progress = clamp((scroll - introDistance) / range);
        track.style.transform = `translateX(${-distance * progress}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    update();
}
