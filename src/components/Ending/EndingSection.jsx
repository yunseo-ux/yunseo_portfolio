import React, { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A soft pencil-texture variant of Hero/assets/pen.svg, with the same tip anchor.
const pencilImage = new URL('./assets/pencil-sketch.svg', import.meta.url).href;
const desktopCurve = 'M230 350 C333 377 412 340 496 285 C584 226 666 245 760 200';
const mobileCurve = 'M230 350 C370 382 476 285 580 257 C650 240 708 233 760 200';

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
        const restingPencil = query('.ending-resting-pencil');
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
                gsap.set([...scene, ...restingPencil, ...star, ...copy], { autoAlpha: 1, y: 0, scale: 1, rotation: 0 });
                gsap.set(pencil, { autoAlpha: 0 });
                point.progress = 1;
                placePencil();
                return () => section.classList.remove('ending--reduced');
            }
            section.classList.remove('ending--reduced');
            gsap.set(intro, { autoAlpha: 1, y: 0 });
            gsap.set(scene, { autoAlpha: 0 });
            gsap.set(pencil, { autoAlpha: 0 });
            gsap.set(restingPencil, { autoAlpha: 0 });
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
                .to(restingPencil, { autoAlpha: .82, duration: .6 }, 7.5)
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
                            <g>
                                <path className="ending-curve ending-curve--soft" d={desktopCurve} />
                                <path className="ending-curve ending-curve--trace" d={desktopCurve} transform="translate(0 .6)" />
                            </g>
                            <g className="ending-pencil"><image href={pencilImage} x="-4.5" y="-105.5" width="110" height="110" /></g>
                            <g transform="translate(230 350) rotate(-18)"><g className="ending-resting-pencil"><image href={pencilImage} x="-5.7" y="-134.3" width="140" height="140" /></g></g>
                        </svg>
                        <span className="ending-star-slot">
                            <span className="ending-star" tabIndex={0} role="img" aria-label="새로운 가능성을 상징하는 반짝이는 별">
                                <svg viewBox="0 0 100 100" aria-hidden="true">
                                    <defs>
                                        <linearGradient id={`${filterId}-wash`} x1="0" y1="0" x2=".8" y2="1">
                                            <stop offset="0" stopColor="#fff7d6" /><stop offset="1" stopColor="#e8d58f" />
                                        </linearGradient>
                                        <clipPath id={`${filterId}-star-clip`}><path d="M49 14 Q51 11 53 16 L63 36 L86 39 Q91 40 87 44 L70 60 L73 83 Q74 88 69 86 L49 75 L29 85 Q24 87 25 82 L29 59 L13 42 Q10 38 15 38 L38 35 Z" /></clipPath>
                                    </defs>
                                    <g filter={`url(#${filterId})`}>
                                        <path className="ending-star-fill" style={{ fill: `url(#${filterId}-wash)` }} d="M49 14 Q51 11 53 16 L63 36 L86 39 Q91 40 87 44 L70 60 L73 83 Q74 88 69 86 L49 75 L29 85 Q24 87 25 82 L29 59 L13 42 Q10 38 15 38 L38 35 Z" />
                                        <g className="ending-star-shading" clipPath={`url(#${filterId}-star-clip)`}>
                                            <path d="M8 53 L68 10 M8 61 L77 12 M9 69 L87 14 M10 77 L93 18 M13 84 L95 26 M19 89 L97 34 M25 93 L98 42 M34 96 L99 50 M43 99 L99 58 M53 100 L99 67" />
                                        </g>
                                        <path className="ending-star-pencil" d="M49 14 Q51 11 53 16 L63 36 L86 39 Q91 40 87 44 L70 60 L73 83 Q74 88 69 86 L49 75 L29 85 Q24 87 25 82 L29 59 L13 42 Q10 38 15 38 L38 35 Z" />
                                        <path className="ending-star-highlight" d="M48 24 L41 40 L23 42 M32 64 L30 76" />
                                    </g>
                                    <g className="ending-star-sparkles">
                                        <path d="M88 17 L88 27 M83 22 L93 22 M14 75 L14 82 M10.5 78.5 L17.5 78.5 M66 4 L68 9 M91 66 L96 69" />
                                    </g>
                                </svg>
                            </span>
                        </span>
                    </div>
                    <div className="ending-copy">
                        <p className="ending-english">THE STORY CONTINUES.</p>
                        <p className="ending-korean">작은 생각을 기록하며,<br className="ending-mobile-break" /> 새로운 가능성을 계속 그려갑니다.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
