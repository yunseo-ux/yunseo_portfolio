import React, { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A soft pencil-texture variant of Hero/assets/pen.svg, with the same tip anchor.
const pencilImage = new URL('./assets/pencil-sketch.svg', import.meta.url).href;
const desktopCurve = 'M265 330 C300 210 420 155 500 212 C585 274 433 362 510 387 C615 424 726 299 760 200';
const mobileCurve = 'M255 315 C330 215 420 180 510 240 C595 299 668 322 760 200';

gsap.registerPlugin(ScrollTrigger);

export default function EndingSection() {
    const sectionRef = useRef(null);
    const filterId = `ending-pencil-${useId().replace(/:/g, '')}`;

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const query = gsap.utils.selector(section);
        const intro = query('.ending-intro');
        const scene = query('.ending-scene');
        const pencil = query('.ending-pencil');
        const strokes = query('.ending-curve');
        const star = query('.ending-star-slot');
        const copy = query('.ending-copy > p');
        const path = strokes[0];
        let disposed = false;
        const media = gsap.matchMedia();

        media.add({
            mobile: '(max-width: 767px)',
            desktop: '(min-width: 768px)',
            reduced: '(prefers-reduced-motion: reduce)',
        }, context => {
            const { mobile, reduced } = context.conditions;
            strokes.forEach(stroke => stroke.setAttribute('d', mobile ? mobileCurve : desktopCurve));
            const length = path.getTotalLength();
            const point = { progress: 0 };
            const placePencil = () => {
                const position = path.getPointAtLength(point.progress * length);
                // Only a small tilt; the tip stays anchored to the drawn line.
                pencil[0].setAttribute('transform', `translate(${position.x} ${position.y}) rotate(${-8 + point.progress * 17})`);
            };
            placePencil();
            gsap.set(strokes, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length });
            if (reduced) {
                section.classList.add('ending--reduced');
                gsap.set(intro, { autoAlpha: 0 });
                gsap.set([...scene, ...pencil, ...star, ...copy], { autoAlpha: 1, y: 0, scale: 1, rotation: 0 });
                point.progress = 1;
                placePencil();
                return () => section.classList.remove('ending--reduced');
            }
            section.classList.remove('ending--reduced');
            gsap.set(intro, { autoAlpha: 1, y: 0 });
            gsap.set(scene, { autoAlpha: 0 });
            gsap.set(pencil, { autoAlpha: 0 });
            gsap.set(star, { autoAlpha: 0, scale: .65, rotation: -12, transformOrigin: '50% 50%' });
            gsap.set(copy, { autoAlpha: 0, y: 18 });

            const timeline = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    id: 'portfolio-ending',
                    trigger: section,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: .45,
                    invalidateOnRefresh: true,
                },
            });
            timeline
                .to(intro, { autoAlpha: 0, y: -24, duration: .8 }, 1.1)
                .to(scene, { autoAlpha: 1, duration: .45 }, 1.9)
                .to(pencil, { autoAlpha: .82, duration: .65 }, 2)
                .to(point, { progress: 1, duration: 4.2, onUpdate: placePencil }, 2.8)
                .to(strokes, { strokeDashoffset: 0, duration: 4.2 }, 2.8)
                .to(pencil, { autoAlpha: 0, duration: .45 }, 7)
                .to(star, { autoAlpha: 1, scale: 1.12, rotation: 6, duration: .55, ease: 'power2.out' }, 7.1)
                .to(star, { scale: 1, rotation: 0, duration: .45, ease: 'sine.inOut' }, 7.65)
                .to(copy[0], { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out' }, 8.2)
                .to(copy[1], { autoAlpha: 1, y: 0, duration: .75, ease: 'power2.out' }, 8.8)
                .to({}, { duration: 1.2 });
            // matchMedia tracks and reverts the timeline and ScrollTrigger.
        }, section);

        document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
        return () => {
            disposed = true;
            media.revert();
        };
    }, []);

    return (
        <section className="portfolio-ending" ref={sectionRef} aria-label="포트폴리오의 다음 이야기">
            <div className="ending-viewport">
                <div className="ending-intro">
                    <h2>MY STORY IS STILL<br />BEING DRAWN</h2>
                    <p>지금까지의 경험을 바탕으로,<br />앞으로도 새로운 가능성을 그려가겠습니다.</p>
                </div>
                <div className="ending-scene">
                    <div className="ending-art">
                        <svg className="ending-drawing" viewBox="0 0 1000 520" aria-hidden="true">
                            <defs>
                                <filter id={filterId} x="-10%" y="-15%" width="120%" height="130%">
                                    <feTurbulence type="fractalNoise" baseFrequency=".035 .32" numOctaves="3" seed="8" result="grain" />
                                    <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
                                </filter>
                            </defs>
                            <g filter={`url(#${filterId})`}>
                                <path className="ending-curve ending-curve--soft" d={desktopCurve} />
                                <path className="ending-curve ending-curve--trace" d={desktopCurve} transform="translate(0 .6)" />
                            </g>
                            <g className="ending-pencil"><image href={pencilImage} x="-4.5" y="-105.5" width="110" height="110" /></g>
                        </svg>
                        <span className="ending-star-slot">
                            <span className="ending-star" tabIndex={0} role="img" aria-label="새로운 가능성을 상징하는 반짝이는 별">
                                <svg viewBox="0 0 100 100" aria-hidden="true">
                                    <path className="ending-star-fill" d="M49 9 C51 35 62 45 91 49 C65 51 54 62 51 91 C47 64 35 54 9 51 C36 47 46 35 49 9 Z" />
                                    <path className="ending-star-pencil" d="M49 9 C51 35 62 45 91 49 C65 51 54 62 51 91 C47 64 35 54 9 51 C36 47 46 35 49 9 Z" />
                                    <path className="ending-star-grain" d="M50 11 C53 36 62 46 89 50 M50 90 Q44 57 11 50 M29 49 L45 47 M51 32 L52 42" />
                                </svg>
                            </span>
                        </span>
                    </div>
                    <div className="ending-copy">
                        <p className="ending-english">the story continues.</p>
                        <p className="ending-korean">작은 생각을 기록하며,<br className="ending-mobile-break" /> 새로운 가능성을 계속 그려갑니다.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
