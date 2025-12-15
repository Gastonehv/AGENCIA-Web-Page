import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroParallax: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const speed = 100;

            // Initial States
            gsap.set("#h2-1", { opacity: 0 });
            gsap.set("#bg_grad", { attr: { cy: "-50" } });

            // SCENE 1
            const scene1 = gsap.timeline();
            ScrollTrigger.create({
                animation: scene1,
                trigger: ".scrollElement",
                start: "top top",
                end: "45% 100%",
                scrub: 3
            });

            // Hills Animation (Scene 1)
            scene1.to("#h1-1", { y: 3 * speed, x: 1 * speed, scale: 0.9, ease: "power1.in" }, 0);
            scene1.to("#h1-2", { y: 2.6 * speed, x: -0.6 * speed, ease: "power1.in" }, 0);
            scene1.to("#h1-3", { y: 1.7 * speed, x: 1.2 * speed }, 0.03);
            scene1.to("#h1-4", { y: 3 * speed, x: 1 * speed }, 0.03);
            scene1.to("#h1-5", { y: 2 * speed, x: 1 * speed }, 0.03);
            scene1.to("#h1-6", { y: 2.3 * speed, x: -2.5 * speed }, 0);
            scene1.to("#h1-7", { y: 5 * speed, x: 1.6 * speed }, 0);
            scene1.to("#h1-8", { y: 3.5 * speed, x: 0.2 * speed }, 0);
            scene1.to("#h1-9", { y: 3.5 * speed, x: -0.2 * speed }, 0);

            // Sun Motion
            const sun = gsap.timeline();
            ScrollTrigger.create({
                animation: sun,
                trigger: ".scrollElement",
                start: "1% top",
                end: "2150 100%",
                scrub: 2
            });
            sun.fromTo("#bg_grad", { attr: { cy: "-50" } }, { attr: { cy: "330" } }, 0);

            // SCENE 2
            const scene2 = gsap.timeline();
            ScrollTrigger.create({
                animation: scene2,
                trigger: ".scrollElement",
                start: "15% top",
                end: "40% 100%",
                scrub: 3
            });

            scene2.fromTo("#h2-1", { y: 500, opacity: 0 }, { y: 0, opacity: 1 }, 0);
            scene2.fromTo("#h2-2", { y: 500 }, { y: 0 }, 0.1);
            scene2.fromTo("#h2-3", { y: 700 }, { y: 0 }, 0.1);
            scene2.fromTo("#h2-4", { y: 700 }, { y: 0 }, 0.2);
            scene2.fromTo("#h2-5", { y: 800 }, { y: 0 }, 0.3);
            scene2.fromTo("#h2-6", { y: 900 }, { y: 0 }, 0.3);

            // Transition to Scene 3
            const sceneTransition = gsap.timeline();
            ScrollTrigger.create({
                animation: sceneTransition,
                trigger: ".scrollElement",
                start: "60% top",
                end: "bottom 100%",
                scrub: 3
            });
            sceneTransition.to("#h2-1", { y: -1000, scale: 1.5, transformOrigin: "50% 50%" }, 0);
            sceneTransition.to("#bg_grad", { attr: { cy: "-80" } }, 0.0);
            sceneTransition.to("#bg2", { y: 0 }, 0);

            // SCENE 3
            gsap.set("#scene3", { y: 500 - 40, visibility: "visible" }); // Adjust based on height
            
            const scene3 = gsap.timeline();
            ScrollTrigger.create({
                animation: scene3,
                trigger: ".scrollElement",
                start: "70% 50%",
                end: "bottom 100%",
                scrub: 3
            });

            // Hills motion Scene 3
            scene3.fromTo("#h3-1", { y: 300 }, { y: -550 }, 0);
            scene3.fromTo("#h3-2", { y: 800 }, { y: -550 }, 0.03);
            scene3.fromTo("#h3-3", { y: 600 }, { y: -550 }, 0.06);
            scene3.fromTo("#h3-4", { y: 800 }, { y: -550 }, 0.09);
            scene3.fromTo("#h3-5", { y: 1000 }, { y: -550 }, 0.12);

            // Stars
            scene3.fromTo("#stars", { opacity: 0 }, { opacity: 0.5, y: -500 }, 0);

            // Gradient value change
            scene3.to("#bg2-grad", { attr: { cy: 600 } }, 0);
            scene3.to("#bg2-grad", { attr: { r: 500 } }, 0);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="wrapper" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <div className="scrollElement" style={{ position: 'absolute', height: '6000px', width: '100%', top: 0, zIndex: 4 }}></div>

            <svg ref={svgRef} className="parallax" viewBox="0 0 750 500" preserveAspectRatio="xMidYMax slice" style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 3 }}>
                <defs>
                    {/* AGENCIA THEME GRADIENTS */}

                    {/* Sky/Sun Gradient - Dark Core */}
                    <radialGradient id="bg_grad" cx="375" cy="-30" r="318.69" gradientUnits="userSpaceOnUse">
                        <stop offset="0.0" stopColor="#00f3ff" /> {/* Cyan Core */}
                        <stop offset="0.1" stopColor="#0066ff" />
                        <stop offset="0.3" stopColor="#050510" /> {/* Dark Blue */}
                        <stop offset="1.0" stopColor="#000000" /> {/* Black */}
                    </radialGradient>

                    {/* Hills Gradients - Dark Metal/Neon */}
                    <linearGradient id="grad1" x1="-154.32" y1="263.27" x2="-154.32" y2="374.3" gradientTransform="matrix(-1, 0, 0, 1.36, 231.36, -100.14)" gradientUnits="userSpaceOnUse">
                        <stop offset="0.0" stopColor="#1a1a2e" />
                        <stop offset="1.0" stopColor="#16213e" />
                    </linearGradient>

                    <linearGradient id="grad2" x1="242.5" y1="356.25" x2="750" y2="356.25" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#0f3460" />
                        <stop offset="1" stopColor="#1a1a2e" />
                    </linearGradient>

                    <linearGradient id="grad3" x1="467.26" y1="500" x2="467.26" y2="225.47" gradientUnits="userSpaceOnUse">
                        <stop offset="0.01" stopColor="#16213e" />
                        <stop offset="1" stopColor="#0f3460" />
                    </linearGradient>

                    {/* Scene 2 Gradients - Darker/Deeper */}
                    <linearGradient id="lg4" x1="641.98" y1="274.9" x2="638.02" y2="334.36" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#0f3460" />
                        <stop offset="1" stopColor="#533483" /> {/* Purple tint */}
                    </linearGradient>
                    <linearGradient id="lg5" x1="172.37" y1="286.02" x2="171.33" y2="343.08" xlinkHref="#lg4" />
                    <linearGradient id="lg6" x1="505.71" y1="261.55" x2="504.61" y2="322.08" xlinkHref="#lg4" />
                    <linearGradient id="lg7" x1="301.32" y1="260.99" x2="295.66" y2="345.9" xlinkHref="#lg4" />
                    <linearGradient id="lg8" x1="375.59" y1="381.01" x2="373.3" y2="507.08" xlinkHref="#lg4" />

                    {/* Scene 3 Gradients - Neon/Cyber */}
                    <radialGradient id="bg2-grad" cx="365.22" cy="500" r="631.74" gradientTransform="translate(750 552.6) rotate(180) scale(1 1.11)" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#000000" />
                        <stop offset="0.5" stopColor="#1a1a2e" />
                        <stop offset="1" stopColor="#16213e" />
                    </radialGradient>

                    <linearGradient id="linear-gradient" x1="472" y1="461.56" x2="872.58" y2="461.56" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#00f3ff" />
                        <stop offset="1" stopColor="#7000ff" />
                    </linearGradient>
                    <linearGradient id="linear-gradient-2" x1="214.61" y1="508.49" x2="166.09" y2="361.12" xlinkHref="#linear-gradient" />
                    <linearGradient id="linear-gradient-3" x1="57.65" y1="508.01" x2="448.08" y2="508.01" xlinkHref="#linear-gradient" />
                    <linearGradient id="linear-gradient-4" x1="193.48" y1="508.3" x2="761.05" y2="508.3" xlinkHref="#linear-gradient" />

                </defs>

                <rect id="bg" width="750" height="500" opacity="1" fill="url(#bg_grad)" />

                {/* SCENE 1 PLACEHOLDER */}
                <g id="scene1">
                    <g id="hills1">
                        <path id="h1-9" d="M696.36,409H75V335.47c10.19-.52,20.5-.36,30.05-3.65,8.11-2.8,15.84-8.49,23.78-11.33s18.18,1.84,25.36-4.85C165,305.56,172,289.79,186.71,292.8c6.21,1.27,12.09,3.66,18.43.84,6-2.65,9.73-9.46,14.69-13.54,2.87-2.35,6.42-3.2,9.35-5.49,1.65-1.28,5.45-6.37,7-6.92,7.94-2.93,10.34,2.69,18.56-3.47,6.45-4.84,8.52-8.21,15.45-5,5,2.35,11.89,10.09,16,15.37C294.9,286,302,297.77,312.71,307.53c11.62,10.63,21.59,9.37,34.67,5.83,16.12-4.37,18.32,9.06,32.24,15.28,7.45,3.32,13.23-1.7,19.6-2.08,3.64-.22,5.85,2.12,9.37,1.82,3.12-.27,4.08-4.44,8.33-3,7.32,12.31,15.75,20,28.21,20.59,14.32.7,27.12.76,39.73-4.94A145.24,145.24,0,0,0,502.11,332c8.71-5.36,11.22-2.82,19.35,1.5,11.66,6.21,25.31,1.08,36.56,9.18,5.53,4,8.36,12.23,14.64,14.79,4.86,2,15.59.38,20.4-1.18,13.47-4.38,21.52-16.59,36.56-17.33,13.57-.67,25.19-4.17,39.11-2.31,10.91,1.46,18.72-.1,27.63-2.61Z" fill="url(#grad1)" />
                        <path id="h1-8" d="M750,500V212.49a19.09,19.09,0,0,0-11.54,8.17c-2.21,3.35-4.39,7.9-7.92,7.69-1.44-.08-2.78-1-4.23-1.08-5.12-.2-7.87,10.11-12.84,8.66a2.7,2.7,0,0,0-2.57-3.34c-1.49.1-2.72,1.38-3.77,2.67a46.94,46.94,0,0,0-7.7,14c-1.76-6-8.53-7.93-13.43-5.51s-8.31,7.76-11.48,12.87l-17.31,27.92c-4.54,7.33-11.47,15.57-18.52,12.15-3.38-1.64-5.76-5.76-9.32-6.73s-7.55,1.64-11.18.48c-5.45-1.76-8.37-11.36-14-10.4-3.13.54-5.93,4.55-8.87,3.14-1.52-.73-2.44-2.76-4-3.36s-3.32.52-5,1.13c-7.4,2.73-14.16-5.41-21.27-9.08-12.35-6.38-26.85,1.31-36.59,12.45-3.1,3.54-6,7.5-9.78,9.89-3.22,2-6.88,2.8-10.48,3.54L480,303.58c-15,3.07-30.14,6.2-44.07,13.54-6.63,3.48-13,7.91-19.94,10.16-10.83,3.5-22.26,1.5-33.47,1.18-9.18-.27-102.2,122.09-140,171.54Z" fill="url(#grad2)" />
                        <path id="h1-7" d="M749.79,500,750,239.12c-.58-.62-1.15-1.25-1.74-1.87-5.67-5.95-12.57-12.05-20.78-11.77s-15.44,7.12-23.74,6.87c-7.55-.23-14.09-6.33-21.65-6.11-5.79.17-10.74,4-15.29,7.6C639.78,255.2,328.89,423.17,184.52,500Z" fill="url(#grad3)" />
                        {/* More hills can be added here if needed, keeping it cleaner for now */}
                    </g>
                </g>

                {/* SCENE 2 PLACEHOLDER */}
                <g id="scene2">
                    <g id="hills2">
                        <path id="h2-6" d="M524.28,418.82c6.36,0,80.19-14.81,103.12-36.53S655.28,345.8,679,359.64s33.69,18.54,46.63,18.82a158.62,158.62,0,0,1,23.88,2.4V447L632,458.92Z" fill="url(#lg4)" />
                        <path id="h2-5" d="M294.06,498.2l49.09-66.93s-64-6.48-93.59-31.29-63.47-49.78-87.15-41.46-81.7,4.44-98.73,15S.1,387.08.1,387.08l.37,60.18L209.75,498.2Z" fill="url(#lg5)" />
                        <path id="h2-4" d="M264.94,449.2s61-16.39,94.07-37.28,61.37-37.2,73.53-36.12,69.9-40,80.18-42.62,13.55-.37,29,1.85,22-5.27,34.52,6.39,43.29,34.86,75.51,48.52c25.88,11,91.48,28.88,91.48,28.88l-31.58,67.73-326.93,9.27Z" fill="url(#lg6)" />
                        <path id="h2-3" d="M.47,469.58V420s113.73-2.74,171.72-26.68,101.69-72.29,134.53-52,31.37-18.48,61.9,13.28S446.68,393.48,478,406.86s113.08,26.06,113.08,26.06l-59.28,53.4L272.55,485Z" fill="url(#lg7)" />
                        <path id="h2-2" d="M749.55,500V398.27l-38.48-6.67s-29.86,12.13-63,11.53-39.61-7.26-70.33-13.41-72.58,21.4-105.61,21.4-75.5-17.78-110.64-17.78c-24.85,0-90.08,20.12-110.82,18.48s-51.11-20.42-82-6.26S.47,409.26.47,409.26V500Z" fill="url(#lg8)" />
                        <path id="h2-1" style={{ opacity: 0 }} d="M750,371 L740,360 L720,380 L700,350 L650,400 L600,380 L550,420 L500,390 L450,430 L400,400 L350,440 L300,410 L250,450 L200,420 L150,460 L100,430 L50,470 L0,440 V500 H750 V371 Z" fill="url(#lg8)" />
                    </g>
                </g>

                {/* SCENE 3 */}
                <g id="scene3" style={{ visibility: 'hidden' }}>
                    <rect id="bg2" y="-59.8" width="750" height="612.4" transform="translate(750 492.8) rotate(180)" fill="url(#bg2-grad)" />

                    <g id="stars" fill="#fff" style={{ opacity: 0 }}>
                        <circle cx="636.11" cy="77.24" r="1.46" />
                        <circle cx="711.49" cy="170.22" r="1.46" />
                        <circle cx="473.23" cy="34.67" r="1.46" />
                        <circle cx="616.73" cy="121.26" r="1.46" />
                        <circle cx="559.97" cy="25.73" r="1.46" />
                        <circle cx="679.95" cy="161.38" r="1.46" />
                        <circle cx="558.51" cy="229.54" r="1.46" />
                        <circle cx="616.73" cy="201.91" r="1.46" />
                        <circle cx="544.82" cy="223.87" r="1.46" />
                        <circle cx="166.68" cy="270.45" r="1.46" />
                        <circle cx="671.95" cy="113.82" r="1.46" />
                        <circle cx="104.05" cy="109.88" r="1.46" />
                        <circle cx="252.58" cy="229.54" r="1.46" />
                        <circle cx="351.16" cy="104.5" r="1.46" />
                        <circle cx="32.33" cy="82.62" r="1" />
                        <circle cx="48.8" cy="202.91" r="1" />
                        <circle cx="474.23" cy="222.87" r="1" />
                        <circle cx="663.41" cy="189.82" r="1" />
                        <circle cx="349.25" cy="41.39" r="1" />
                        <circle cx="557.51" cy="100.02" r="1" />
                        <circle cx="122.39" cy="60.39" r="1.46" />
                        {/* Reduced star count for performance/cleanliness */}
                    </g>

                    <g id="hills3" transform="translate(0, -110)">
                        <polygon id="h3-5" points="756.3 330.5 750.6 327 742.4 331.1 719.1 317.4 705.9 311.9 695.1 307.3 688 314.2 675.7 336.9 665.3 346.8 657.8 353.1 641.2 353.5 633.5 362.6 626.6 373.1 618.5 378.9 596.8 411.3 588.9 404.9 578.9 406.5 539.9 443.4 472 493.8 556 490.9 756.1 490.9 756.3 330.5" style={{ fill: 'url(#linear-gradient)', mixBlendMode: 'multiply' }} />
                        <path id="h3-4" d="m453.1,471c-20-.3-48.5-14.4-68.1-10.1-13.5-4.7-34.5-19.9-48.2-23.8-4.1-5.1-13.2-13.6-18.3-16.9l-21.4,5.1c-25.8-9-71.7-48.8-92.2-70.8-23.3,8-24.4,17.5-52.5,13.5l-26.5-23.2c-7.3,4.7-21.4,3.1-28.9,0-10.3-12.3-37.7-44.9-50.7-51.2l-26.6,39.7-21.4-3.8v161.3s204.1-2.7,204.1-2.7l2.2,2.7h252.5l-3.8-19.9Z" style={{ fill: 'url(#linear-gradient-2)', mixBlendMode: 'multiply' }} />
                        <path id="h3-3" d="m369.3,490.9h71.8l-20.4-23.4c-12.5-1.8-31-7.3-43-11.4-4.4,2-12-2.4-15.7-5.3-24-16.4-52.4-28.7-75.6-47.8l-36.3,12.9-13.2-10.5-44.3,23c-4.1-6-13.7-11.8-19.9-12.4-29.3,7.5-89.7,52.2-115.1,72.8,56.6,2.7,251.8,2.1,311.6,2.1Z" style={{ fill: 'url(#linear-gradient-3)', mixBlendMode: 'multiply' }} />
                        <path id="h3-2" d="m756.1,490.9l-8-59.6-53-.2c-15.1-2.4-50.9-7.7-64.2,4.9-19.1-2.9-49.7-19.3-69.1-17.5-5.3-5.7-16.9-13.1-23.7-14.8l-26.9,20.4c-26.9,1.9-30.4-8.1-52.6-17.2l-12.9,14.9c-8.8-4.9-25.3-12.2-33.6-18.1-22.7,22.2-39,46.1-70,32.9-19.4,17.9-46.6,30.6-69.4,40.5-20.6-4.2-50.8,9.7-71.7,9.9l-.8,4h555.8Z" style={{ fill: 'url(#linear-gradient-4)', mixBlendMode: 'multiply' }} />
                        <path id="h3-1" d="M754.1,270.8 L716.1,330.8 L669.3,392.1 L580.1,447.7 L511.6,468.2 L456.7,432.2 L380.6,449.8 L355.5,456.3 L324,446.9 L287.2,409.4 L279.1,416.1 L225,404.7 L216.6,409.5 L177.6,377.7 L139.8,397 L97.9,338.7 L57.3,291.1 L52.6,293.1 V681.7 H810.8 V270.8 Z" fill="#000" />
                    </g>
                </g>

            </svg>
        </div>
    );
};

export default HeroParallax;
