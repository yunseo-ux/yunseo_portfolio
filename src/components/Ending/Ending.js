let dispose;

export async function initEnding() {
    const container = document.getElementById('portfolio-ending');
    if (!container || dispose) return;
    // JSX, React and GSAP are bundled locally: no external CDN at runtime.
    try {
        const response = await fetch('/ending/ending.js', { method: 'HEAD' });
        const moduleUrl = response.ok && /(?:java|ecma)script/.test(response.headers.get('content-type') ?? '')
            ? '/ending/ending.js' : '/public/ending/ending.js';
        const { mountEnding } = await import(/* @vite-ignore */ moduleUrl);
        dispose = mountEnding(container);
    } catch (error) {
        console.error('엔딩 인터랙션을 불러오지 못했습니다.', error);
    }
}

function cleanupEnding(event) {
    if (event.persisted) return;
    dispose?.();
    dispose = undefined;
    window.removeEventListener('pagehide', cleanupEnding);
}
window.addEventListener('pagehide', cleanupEnding);
