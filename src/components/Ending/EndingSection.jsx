import React, { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// A soft pencil-texture variant of Hero/assets/pen.svg, with the same tip anchor.
const pencilImage = new URL('./assets/pencil-sketch.svg', import.meta.url).href;
const starImage = new URL('./assets/star-sketch.png', import.meta.url).href;

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
        const star = query('.ending-star-slot');
        const starIllustration = query('.ending-star-color');
        const starOutline = query('.ending-star-outline path');
        const copy = query('.ending-copy > p');
        let disposed = false;
        const media = gsap.matchMedia();

        media.add({
            mobile: '(max-width: 767px)',
            desktop: '(min-width: 768px)',
            reduced: '(prefers-reduced-motion: reduce)',
        }, context => {
            const { reduced } = context.conditions;
            const starPoint = { progress: 0 };
            const pencilGap = { x: 0, y: 0 };
            const placeStarPencil = () => {
                const outline = starOutline[0];
                const drawing = pencil[0].ownerSVGElement;
                const starMatrix = outline.getScreenCTM();
                const drawingMatrix = drawing.getScreenCTM();
                if (!starMatrix || !drawingMatrix) return;
                const position = outline.getPointAtLength(starPoint.progress * outline.getTotalLength());
                const local = new DOMPoint(position.x, position.y)
                    .matrixTransform(starMatrix)
                    .matrixTransform(drawingMatrix.inverse());
                pencil[0].setAttribute('transform', `translate(${local.x + pencilGap.x} ${local.y + pencilGap.y}) rotate(9)`);
            };
            gsap.set(starIllustration, { autoAlpha: reduced ? 1 : 0 });
            starOutline.forEach(outline => {
                const outlineLength = outline.getTotalLength();
                gsap.set(outline, { strokeDasharray: outlineLength, strokeDashoffset: reduced ? 0 : outlineLength, opacity: reduced ? 0 : 1 });
            });
            if (reduced) {
                section.classList.add('ending--reduced');
                gsap.set(intro, { autoAlpha: 0 });
                gsap.set([...scene, ...star, ...copy], { autoAlpha: 1, y: 0, scale: 1, rotation: 0 });
                gsap.set(restingPencil, { autoAlpha: 0 });
                starPoint.progress = 1;
                pencilGap.x = 12;
                pencilGap.y = -12;
                placeStarPencil();
                gsap.set(pencil, { autoAlpha: .82 });
                return () => section.classList.remove('ending--reduced');
            }
            section.classList.remove('ending--reduced');
            gsap.set(intro, { autoAlpha: 1, y: 0 });
            gsap.set(scene, { autoAlpha: 0 });
            gsap.set(pencil, { autoAlpha: 0 });
            gsap.set(restingPencil, { autoAlpha: 0 });
            gsap.set(star, { autoAlpha: 0, scale: 1, rotation: 0 });
            gsap.set(copy, { autoAlpha: 0, y: 18 });

            placeStarPencil();
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
                .to(star, { autoAlpha: 1, duration: .3 }, 2.5)
                .to(starPoint, { progress: 1, duration: 3, onUpdate: placeStarPencil }, 2.8)
                .to(starOutline, { strokeDashoffset: 0, duration: 3 }, 2.8)
                .to(pencilGap, { x: 12, y: -12, duration: .6, ease: 'sine.inOut', onUpdate: placeStarPencil }, 5.8)
                .to(starIllustration, { autoAlpha: 1, duration: .9, ease: 'sine.inOut' }, 6.8)
                .to(starOutline, { opacity: 0, duration: .9 }, 6.8)
                .to(star, { rotation: 8, duration: .55, ease: 'sine.inOut' }, 7.75)
                .to(copy[0], { autoAlpha: 1, y: 0, duration: .7, ease: 'power2.out' }, 8.5)
                .to(copy[1], { autoAlpha: 1, y: 0, duration: .75, ease: 'power2.out' }, 9.1)
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
                                    <feTurbulence type="fractalNoise" baseFrequency=".55 .32" numOctaves="3" seed="8" result="grain" />
                                    <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="pencilStroke" />
                                    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .8 .2" result="paperGrain" />
                                    <feComposite in="pencilStroke" in2="paperGrain" operator="in" />
                                </filter>
                            </defs>
                            <g className="ending-pencil"><image href={pencilImage} x="-4.5" y="-105.5" width="110" height="110" /></g>
                            <g transform="translate(230 350) rotate(-18)"><g className="ending-resting-pencil"><image href={pencilImage} x="-5.7" y="-134.3" width="140" height="140" /></g></g>
                        </svg>
                        <span className="ending-star-slot">
                            <span className="ending-star" tabIndex={0} role="img" aria-label="새로운 가능성을 상징하는 반짝이는 별">
                                <span className="ending-star-artwork" data-node-id="428:4101">
                                    <svg className="ending-star-outline" viewBox="0 0 1024 973" aria-hidden="true">
                                        <path filter={`url(#${filterId})`} d="M838 433 Q859 438 842 453 L671 611 Q663 618 665 630 L706 844 Q711 869 690 857 L489 748 Q479 742 468 747 L246 846 Q222 857 228 831 L274 625 Q278 613 269 603 L120 440 Q102 420 128 416 L342 384 Q354 382 360 371 L474 185 Q487 161 499 187 L600 382 Q606 394 620 396 Z" />
                                    </svg>
                                    <img className="ending-star-color" src={starImage} alt="" aria-hidden="true" />
                                </span>
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
