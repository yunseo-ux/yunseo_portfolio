export function initProjectPreview() {
    document.querySelectorAll('.project-preview-photo[href]').forEach(link => {
        link.addEventListener('click', event => {
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
