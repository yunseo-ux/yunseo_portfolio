const requests = new WeakMap();

// Keep the visible document until its replacement has finished loading.
export async function loadProjectImage(image, source) {
    const request = {};
    requests.set(image, request);
    for (let attempt = 0; attempt < 2; attempt++) {
        const url = new URL(source, document.baseURI);
        if (attempt) url.searchParams.set('retry', String(Date.now()));
        const next = new Image();
        next.src = url.href;
        try {
            await next.decode();
            if (requests.get(image) !== request) return;
            image.loading = 'eager';
            image.src = next.src;
            return;
        } catch {
            if (requests.get(image) !== request) return;
        }
    }
    console.error('프로젝트 이미지를 불러오지 못했습니다:', source);
}
