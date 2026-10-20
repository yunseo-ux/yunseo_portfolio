export function initProjectPreview() {
    const mouse = matchMedia('(hover: hover) and (pointer: fine)');
    const cursor = document.createElement('span');
    cursor.className = 'project-preview-cursor';
    cursor.textContent = 'VIEW';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
    const hideCursor = () => cursor.classList.remove('is-visible');
    const moveCursor = event => {
        if (!mouse.matches || event.pointerType === 'touch') return;
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        cursor.classList.add('is-visible');
    };
    addEventListener('scroll', hideCursor, { passive: true });
    addEventListener('blur', hideCursor);
    mouse.addEventListener('change', hideCursor);
    document.querySelectorAll('.project-preview-photo[href]').forEach(link => {
        link.addEventListener('pointerenter', moveCursor);
        link.addEventListener('pointermove', moveCursor);
        link.addEventListener('pointerleave', hideCursor);
        link.addEventListener('pointercancel', hideCursor);
        link.addEventListener('click', event => {
            hideCursor();
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            const target = document.getElementById(link.hash.slice(1));
            if (!target) return;
            event.preventDefault();
            history.pushState(null, '', link.hash);
            if (target.closest('.personal-project-gallery') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
                dispatchEvent(new CustomEvent('portfolio:project-navigate', { detail: { id: target.id } }));
            } else {
                const destination = target.closest('.team-project-gallery') || target;
                scrollTo({ top: destination.getBoundingClientRect().top + scrollY, left: 0, behavior: 'instant' });
            }
        });
    });
}
