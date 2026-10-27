import { gsap } from '../../../node_modules/gsap/index.js';

const artwork = new URL('./assets/landing-character-line.svg', import.meta.url).href;
const bodyArtwork = new URL('./assets/landing-body.svg', import.meta.url).href;
const armArtwork = new URL('./assets/landing-arm-figma.svg', import.meta.url).href;
const labelArtwork = new URL('./assets/loading-label-source.png', import.meta.url).href;
const dotYellow = new URL('./assets/loading-dot-yellow.svg', import.meta.url).href;
const dotBlue = new URL('./assets/loading-dot-blue.svg', import.meta.url).href;
const dotLast = new URL('./assets/loading-dot-last.svg', import.meta.url).href;
const image = (extra = '', source = artwork) => `<image href="${source}" width="369.449" height="252.516" ${extra}/>`;

export function initLoadingScreen() {
    if (!window.__portfolioShouldLoad) {
        return { finish: async () => {}, dispose() {} };
    }
    const root = document.documentElement;
    root.classList.add('portfolio-loading');
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-loader';
    // Preserve the Figma illustration and reveal only its heart-shaped pencil line.
    overlay.innerHTML = `<span class="portfolio-loader-status" role="status" aria-live="polite">포트폴리오를 불러오고 있습니다.</span>
    <div class="portfolio-loader-content">
      <svg class="portfolio-loader-scene" viewBox="0 0 369.449 252.516" aria-hidden="true">
        <defs>
          <clipPath id="loading-character-clip"><rect width="210" height="228"/></clipPath>
          <filter id="loading-pencil-texture" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency=".72 .4" numOctaves="3" seed="12" result="paper"/>
            <feColorMatrix in="paper" type="saturate" values="0"/>
            <feComponentTransfer><feFuncA type="linear" slope=".1"/></feComponentTransfer>
            <feComposite in2="SourceAlpha" operator="in" result="grain"/>
            <feBlend in="SourceGraphic" in2="grain" mode="soft-light"/>
          </filter>
          <pattern id="loading-pencil-hatching" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <path d="M0 0V5" stroke="#8f765b" stroke-width=".55" stroke-opacity=".075"/>
            <path d="M2.1 0V5" stroke="#fffdf3" stroke-width=".8" stroke-opacity=".22"/>
          </pattern>
          <mask id="loading-body-texture-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="210" height="228" style="mask-type:alpha">${image('', bodyArtwork)}</mask>
          <mask id="loading-arm-texture-mask" maskUnits="userSpaceOnUse" x="34" y="69" width="76.9407" height="73.72" style="mask-type:alpha"><image href="${armArtwork}" x="34" y="69" width="76.9407" height="73.72"/></mask>
          <mask id="loading-trail-mask" maskUnits="userSpaceOnUse" x="102" y="136" width="275" height="124"><path class="portfolio-loader-trace" d="M110 246C167 264 244 239 267 194C280 176 281 159 274 160C269 158 267 169 265 169C248 157 241 175 256 180C287 192 336 168 360 150" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/></mask>
        </defs>
        <g class="portfolio-loader-raised-arm" transform="rotate(0 75.5 132.5)">
          <g class="portfolio-loader-arm-marks" fill="none" stroke="#675344" stroke-width="1.8" stroke-linecap="round">
            <path d="M43 72C38 76 35 82 36 87"/>
            <path d="M48 75C44 79 42 84 43 89"/>
          </g>
          <image href="${armArtwork}" x="34" y="69" width="76.9407" height="73.72" filter="url(#loading-pencil-texture)"/>
          <rect x="34" y="69" width="76.9407" height="73.72" fill="url(#loading-pencil-hatching)" mask="url(#loading-arm-texture-mask)"/>
        </g>
        <g class="portfolio-loader-character" clip-path="url(#loading-character-clip)">
          ${image('filter="url(#loading-pencil-texture)"', bodyArtwork)}
          <rect width="210" height="228" fill="url(#loading-pencil-hatching)" mask="url(#loading-body-texture-mask)"/>
        </g>
        <g mask="url(#loading-trail-mask)">${image()}</g>
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
    const arm = overlay.querySelector('.portfolio-loader-raised-arm');
    const armState = { angle: 0 };
    const paintArm = () => arm.setAttribute('transform', `rotate(${armState.angle} 75.5 132.5)`);
    const trace = overlay.querySelector('.portfolio-loader-trace');
    const dots = overlay.querySelectorAll('.portfolio-loader-dot');
    const ellipsis = overlay.querySelectorAll('.portfolio-loader-ellipsis');
    const length = trace.getTotalLength();
    trace.style.strokeDasharray = `${length}`;
    trace.style.strokeDashoffset = `${length}`;
    let armWave, dotLoop, ellipsisLoop, drawing;
    let released = false;
    let resolveRelease;
    const releasedReady = new Promise(resolve => { resolveRelease = resolve; });
    const unlock = () => {
        if (released) return;
        released = true;
        window.__portfolioShouldLoad = false;
        clearTimeout(safety);
        preference.removeEventListener('change', stopMotion);
        resolveRelease();
        root.classList.remove('portfolio-loading', 'portfolio-loading--revealing');
        if (content) content.inert = previousInert;
        overlay.remove();
        clearTimeout(window.__portfolioLoadingFallback);
        [armWave, dotLoop, ellipsisLoop, drawing].forEach(animation => animation?.kill());
        gsap.killTweensOf([armState, ...dots, ...ellipsis, overlay]);
    };
    const safety = setTimeout(unlock, 6000);
    const decodeImage = async source => {
        const picture = new Image();
        picture.src = source;
        await picture.decode();
    };
    // SVG <image> elements have no decode() API; preload their shared sources.
    const artworkReady = Promise.all([
        artwork, bodyArtwork, armArtwork, labelArtwork, dotYellow, dotBlue, dotLast,
    ].map(decodeImage));
    const startMotion = () => {
        if (preference.matches) {
            trace.style.strokeDashoffset = '0';
            gsap.set([...dots, ...ellipsis], { opacity: 1 });
            return;
        }
        armWave = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut', onUpdate: paintArm } })
            .to(armState, { angle: -5, duration: .5 })
            .to(armState, { angle: 5, duration: 1 })
            .to(armState, { angle: 0, duration: .5 });
        dotLoop = gsap.timeline({ repeat: -1, repeatDelay: .12 });
        dots.forEach((dot, index) => dotLoop.to(dot, { opacity: 1, duration: .15 }, index * .38).to(dot, { opacity: 0, duration: .18 }, index * .38 + .18));
        ellipsisLoop = gsap.timeline({ repeat: -1, repeatDelay: .2 })
            .to(ellipsis, { opacity: 1, duration: .12, stagger: .23 })
            .to(ellipsis, { opacity: 0, duration: .12 }, '+=.32');
        drawing = gsap.timeline({ repeat: -1, repeatDelay: .12 })
            .to(trace, { strokeDashoffset: 0, duration: 3.2, ease: 'none' })
            .set(trace, { strokeDashoffset: length });
    };
    const motionReady = artworkReady.then(async () => {
        if (released) return;
        paintArm();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (released) return;
        startMotion();
    }).catch(() => {
        // Never show a partially decoded character when an asset fails.
        unlock();
    });
    const stopMotion = () => {
        if (!preference.matches) return;
        [armWave, dotLoop, ellipsisLoop].forEach(animation => animation?.kill());
        armState.angle = 0;
        paintArm();
        gsap.set(overlay.querySelector('.portfolio-loader-arm-marks'), { opacity: 0 });
        drawing?.kill();
        trace.style.strokeDashoffset = '0';
        gsap.set([...dots, ...ellipsis], { opacity: 1, rotation: 0, y: 0 });
    };
    preference.addEventListener('change', stopMotion);
    return {
        async finish() {
            const heroReady = Promise.all([...content.querySelectorAll('.portfolio-hero img')].map(picture => picture.decode().catch(() => {})));
            // Below-the-fold project images must not delay the first screen.
            await Promise.race([Promise.all([motionReady, heroReady]), releasedReady]);
            if (released) return;
            // Keep the backdrop opaque until the character has disappeared.
            // Crossfading the entire overlay exposes the hero through its artwork.
            const loaderContent = overlay.querySelector('.portfolio-loader-content');
            loaderContent.style.transition = preference.matches ? 'none' : 'opacity 160ms ease';
            loaderContent.style.opacity = '0';
            // Use wall-clock time: GSAP's lag smoothing can prolong a transition
            // while the browser decodes the portfolio's large project images.
            if (!preference.matches) await new Promise(resolve => setTimeout(resolve, 180));
            clearTimeout(safety);
            preference.removeEventListener('change', stopMotion);
            unlock();
        },
        dispose() { clearTimeout(safety); preference.removeEventListener('change', stopMotion); unlock(); },
    };
}
