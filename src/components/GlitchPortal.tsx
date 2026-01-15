import { useImperativeHandle, forwardRef, useRef } from 'react';
import gsap from 'gsap';

export interface GlitchPortalHandle {
    trigger: (duration?: number) => void;
}

const GlitchPortal = forwardRef<GlitchPortalHandle>((_, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliceContainerRef = useRef<HTMLDivElement>(null);
    const rgbRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        trigger: (duration = 0.8) => {
            if (!containerRef.current || !sliceContainerRef.current) return;

            const tl = gsap.timeline();
            const slices = sliceContainerRef.current.children;
            const rgbLayers = rgbRef.current?.children;

            // 1. Initial Blast
            tl.set(containerRef.current, { display: 'block', opacity: 1 });

            // 2. Fragmented Chaos (Slices)
            tl.to(slices, {
                display: 'block',
                opacity: () => gsap.utils.random([0, 0.5, 1]),
                x: () => gsap.utils.random(-150, 150),
                y: () => gsap.utils.random(-150, 150),
                scaleX: () => gsap.utils.random(1, 4),
                scaleY: () => gsap.utils.random(1, 2),
                backgroundColor: () => gsap.utils.random(['#00FF99', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000']),
                duration: 0.04,
                repeat: Math.floor(duration / 0.04),
                repeatRefresh: true,
                ease: "none"
            }, 0);

            // 3. RGB Aberration layers
            if (rgbLayers) {
                tl.to(rgbLayers, {
                    display: 'block',
                    x: () => gsap.utils.random(-20, 20),
                    y: () => gsap.utils.random(-10, 10),
                    opacity: () => gsap.utils.random(0.2, 0.5),
                    duration: 0.03,
                    repeat: Math.floor(duration / 0.03),
                    repeatRefresh: true,
                    ease: "none"
                }, 0);
            }

            // 4. Clean up
            tl.set([containerRef.current, slices], { display: 'none', opacity: 0 });
            if (rgbLayers) tl.set(rgbLayers, { display: 'none' });
        }
    }));

    return (
        <div
            ref={containerRef}
            id="glitch-portal-overlay"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'transparent',
                pointerEvents: 'none',
                display: 'none',
                overflow: 'hidden',
                mixBlendMode: 'difference'
            }}
        >
            {/* RGB LAYERS */}
            <div ref={rgbRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,0,0,0.3)', display: 'none', mixBlendMode: 'screen' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,255,0,0.3)', display: 'none', mixBlendMode: 'screen' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,255,0.3)', display: 'none', mixBlendMode: 'screen' }} />
            </div>

            {/* NOISE LAYER */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                opacity: 0.25,
                zIndex: 2,
                mixBlendMode: 'overlay'
            }} />

            {/* SLICES */}
            <div ref={sliceContainerRef} style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
                {[...Array(25)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: `${gsap.utils.random(40, 100)}%`,
                            height: `${gsap.utils.random(1, 20)}vh`,
                            left: `${gsap.utils.random(-15, 15)}%`,
                            top: `${gsap.utils.random(0, 100)}vh`,
                            backgroundColor: '#FFFFFF',
                            display: 'none',
                            opacity: 0.8
                        }}
                    />
                ))}
            </div>
        </div>
    );
});

GlitchPortal.displayName = 'GlitchPortal';

export default GlitchPortal;
