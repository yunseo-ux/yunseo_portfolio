import { gsap } from '../../../node_modules/gsap/index.js';

const artwork = new URL('./assets/loading-artwork.png', import.meta.url).href;
const labelArtwork = new URL('./assets/loading-label-source.png', import.meta.url).href;
const dotYellow = new URL('./assets/loading-dot-yellow.svg', import.meta.url).href;
const dotBlue = new URL('./assets/loading-dot-blue.svg', import.meta.url).href;
const dotLast = new URL('./assets/loading-dot-last.svg', import.meta.url).href;
const image = (extra = '') => `<image href="${artwork}" width="587" height="441" ${extra}/>`;

export function initLoadingScreen() {
    if (!window.__portfolioShouldLoad) {
        return { finish: async () => {}, dispose() {} };
    }
    const root = document.documentElement;
    root.classList.add('portfolio-loading');
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-loader';
    // Reveal the supplied crayon pixels through a stroke mask; no character layer.
    overlay.innerHTML = `<span class="portfolio-loader-status" role="status" aria-live="polite">포트폴리오를 불러오고 있습니다.</span>
    <div class="portfolio-loader-content">
      <svg class="portfolio-loader-scene" viewBox="163 164 402 183" aria-hidden="true">
        <defs>
          <mask id="loading-trail-mask" maskUnits="userSpaceOnUse" x="205" y="248" width="245" height="95"><path class="portfolio-loader-trace" d="M215 317C253 334 321 320 356 300C373 290 396 266 381 258C372 251 367 269 367 269C356 249 341 265 353 279C373 300 414 287 441 269" fill="none" stroke="white" stroke-width="12" stroke-linecap="round"/></mask>
          <clipPath id="loading-star-clip"><path d="M410 172H558V321H410V290L442 270L425 246Z"/></clipPath>
        </defs>
        <g mask="url(#loading-trail-mask)">${image()}</g>
        <g class="portfolio-loader-star">${image('clip-path="url(#loading-star-clip)"')}</g>
      </svg>
      <svg class="portfolio-loader-label" viewBox="904 749 202 41" aria-hidden="true">
        <defs>
          <clipPath id="loading-word-clip"><rect x="904" y="749" width="157" height="41"/></clipPath>
          ${[0, 1, 2].map(index => `<clipPath id="loading-ellipsis-${index}"><rect x="${1061 + index * 15}" y="749" width="15" height="41"/></clipPath>`).join('')}
        </defs>
        <image href="${labelArtwork}" width="2048" height="1152" preserveAspectRatio="none" clip-path="url(#loading-word-clip)"/>
        ${[0, 1, 2].map(index => `<g class="portfolio-loader-ellipsis"><image href="${labelArtwork}" width="2048" height="1152" preserveAspectRatio="none" clip-path="url(#loading-ellipsis-${index})"/></g>`).join('')}
      </svg>
      <div class="portfolio-loader-dots" aria-hidden="true">${[dotYellow, dotBlue, dotBlue, dotLast].map(source => `<img class="portfolio-loader-dot" src="${source}" width="14" height="14" alt="" />`).join('')}</div>
    </div>`;
    document.body.append(overlay);
    const content = document.querySelector('#root');
    const previousInert = content?.inert ?? false;
    if (content) content.inert = true;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const star = overlay.querySelector('.portfolio-loader-star');
    const trace = overlay.querySelector('.portfolio-loader-trace');
    const dots = overlay.querySelectorAll('.portfolio-loader-dot');
    const ellipsis = overlay.querySelectorAll('.portfolio-loader-ellipsis');
    const length = trace.getTotalLength();
    trace.style.strokeDasharray = `${length}`;
    trace.style.strokeDashoffset = `${length}`;
    let twinkle, dotLoop, ellipsisLoop, drawing;
    let released = false;
    let finishing = false;
    let resolveRelease;
    const releasedReady = new Promise(resolve => { resolveRelease = resolve; });
    const unlock = () => {
        if (released) return;
        released = true;
        resolveRelease();
        root.classList.remove('portfolio-loading', 'portfolio-loading--revealing');
        if (content) content.inert = previousInert;
        overlay.remove();
        clearTimeout(window.__portfolioLoadingFallback);
        [twinkle, dotLoop, ellipsisLoop, drawing].forEach(animation => animation?.kill());
        gsap.killTweensOf([star, ...dots, ...ellipsis, overlay]);
    };
    const safety = setTimeout(unlock, 20000);
    const readyEvent = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
    const artworkReady = Promise.all([artwork, labelArtwork, dotYellow, dotBlue, dotLast].map(source => {
        const picture = new Image();
        picture.src = source;
        return picture.decode().catch(() => {});
    }));
    artworkReady.then(() => {
        if (released || finishing) return;
        if (preference.matches) {
            trace.style.strokeDashoffset = '0';
            gsap.set([star, ...dots, ...ellipsis], { opacity: 1 });
            return;
        }
        dotLoop = gsap.timeline({ repeat: -1 });
        dots.forEach((dot, index) => dotLoop.to(dot, { opacity: 1, duration: .15 }, index * .38).to(dot, { opacity: 0, duration: .18 }, index * .38 + .18));
        ellipsisLoop = gsap.timeline({ repeat: -1, repeatDelay: .2 })
            .to(ellipsis, { opacity: 1, duration: .12, stagger: .23 })
            .to(ellipsis, { opacity: 0, duration: .12 }, '+=.32');
        drawing = gsap.timeline()
            .to(trace, { strokeDashoffset: 0, duration: .85, ease: 'sine.inOut' })
            .fromTo(star, { opacity: 0, scale: .93, svgOrigin: '475 255' }, { opacity: 1, scale: 1, duration: .25, ease: 'power2.out' })
            .add(() => { twinkle = gsap.to(star, { opacity: .5, scale: .97, svgOrigin: '475 255', duration: .6, repeat: -1, yoyo: true, ease: 'sine.inOut' }); });
    });
    const stopMotion = () => {
        if (!preference.matches) return;
        [twinkle, dotLoop, ellipsisLoop].forEach(animation => animation?.kill());
        drawing?.progress(1);
        twinkle?.kill();
        gsap.set([star, ...dots, ...ellipsis], { opacity: 1, rotation: 0, y: 0 });
    };
    preference.addEventListener('change', stopMotion);
    return {
        async finish() {
            const heroReady = Promise.all([...content.querySelectorAll('.portfolio-hero img')].map(picture => picture.decode().catch(() => {})));
            await Promise.race([Promise.all([readyEvent, document.fonts?.ready, heroReady]), releasedReady]);
            if (released) return;
            finishing = true;
            dotLoop?.kill(); ellipsisLoop?.kill(); twinkle?.kill(); drawing?.kill();
            root.classList.add('portfolio-loading--revealing');
            await new Promise(resolve => {
                gsap.to(overlay, { opacity: 0, duration: preference.matches ? 0 : .3, ease: 'power2.inOut', onComplete: resolve });
            });
            clearTimeout(safety);
            preference.removeEventListener('change', stopMotion);
            unlock();
        },
        dispose() { clearTimeout(safety); preference.removeEventListener('change', stopMotion); unlock(); },
    };
}
