export function initCloneCoding() {
    const section = document.querySelector('.clone-coding');
    if (!section) return;
    const track = section.querySelector('.clone-coding-track');
    const windowElement = section.querySelector('.clone-coding-window');
    const heading = section.querySelector('.clone-coding-heading');
    const cursor = document.createElement('span');
    cursor.className = 'clone-link-cursor';
    cursor.textContent = 'LINK';
    cursor.hidden = true;
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const hideCursor = () => { cursor.hidden = true; };
    section.querySelectorAll('.clone-coding-card').forEach(card => {
        card.addEventListener('pointermove', event => {
            if (!finePointer.matches || event.pointerType === 'touch') return;
            cursor.style.color = card.hostname === 'musign-five.vercel.app' ? '#111111' : '#ffffff';
            cursor.style.transform = `translate(${event.clientX + 10}px, ${event.clientY + 10}px)`;
            cursor.hidden = false;
        });
        card.addEventListener('pointerleave', hideCursor);
        card.addEventListener('pointerdown', hideCursor);
    });
    window.addEventListener('scroll', hideCursor, { passive: true });
    window.addEventListener('blur', hideCursor);
    const headingHold = document.createElement('div');
    headingHold.className = 'clone-heading-hold';
    section.prepend(headingHold);
    headingHold.append(heading);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let headingObserver;
    if (!reduced.matches) {
        heading.classList.add('clone-heading--animated');
        headingObserver = new IntersectionObserver(entries => {
            if (!entries.some(entry => entry.isIntersecting)) return;
            heading.classList.add('clone-heading--visible');
            headingObserver.disconnect();
        }, { threshold: .55 });
        headingObserver.observe(heading);
    }
    reduced.addEventListener('change', () => {
        if (!reduced.matches) return;
        headingObserver?.disconnect();
        heading.classList.remove('clone-heading--animated');
    });
    let frame = 0;
    const update = () => {
        frame = 0;
        const style = getComputedStyle(windowElement);
        const available = windowElement.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const distance = Math.max(0, track.scrollWidth - available);
        const pinned = window.innerWidth > 800 && window.innerHeight > 600 && !reduced.matches && distance > 1;
        section.classList.toggle('clone-coding--pinned', pinned);
        const introDistance = headingHold.offsetHeight;
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
