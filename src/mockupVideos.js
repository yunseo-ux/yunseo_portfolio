export function initMockupVideos() {
    const videos = [...document.querySelectorAll('.project-mockup-video')];
    const visible = new Set();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => videos.forEach(video => {
        video.muted = true;
        video.controls = reducedMotion.matches;
        if (visible.has(video) && !document.hidden && !reducedMotion.matches) {
            video.play().catch(() => {});
        } else video.pause();
    });
    const observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
            if (isIntersecting && intersectionRatio >= .25) visible.add(target);
            else visible.delete(target);
        });
        update();
    }, { threshold: [0, .25] });
    const base = import.meta.env?.BASE_URL;
    videos.forEach(video => {
        video.playbackRate = Number(video.dataset.playbackRate) || 1;
        const source = base ? `${base}${video.dataset.src.slice(1)}` : `/public${video.dataset.src}`;
        video.poster = source.replace(/\.webm$/, '.png');
        video.src = source;
        observer.observe(video);
    });
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
}
