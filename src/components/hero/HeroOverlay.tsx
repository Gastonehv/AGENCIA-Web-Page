import React, { useRef, useEffect } from 'react';
import { useScroll } from '../../context/ScrollContext';
import gsap from 'gsap';
import agencyTypography from '../../assets/logos/agency-typography.png';
import MaskedText from '../MaskedText';

const HeroOverlay: React.FC = () => {
    const { lenis } = useScroll(); // Access lenis for scroll locking
    const containerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement>(null);
    const [isLocked, setIsLocked] = React.useState(true);

    // Scroll-driven Exit Animation (Local ScrollTrigger)
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (containerRef.current) {
                gsap.to(containerRef.current, {
                    opacity: 0,
                    scale: 1.5,
                    filter: 'blur(20px)',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#hero-section',
                        start: 'top top',
                        end: '70% top', // Fade out completely before leaving view
                        scrub: true
                    }
                });
            }
        });

        return () => ctx.revert();
    }, []);

    // Initial Reveal Animation (Runs once)
    useEffect(() => {
        gsap.fromTo(logoRef.current,
            { opacity: 0, y: 20, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.5,
                onComplete: () => {
                    // Unlock scroll after animation + slight delay
                    setTimeout(() => {
                        setIsLocked(false);
                    }, 500);
                }
            }
        );
    }, []);

    // Scroll Locking Logic (Reacts to state and lenis availability)
    useEffect(() => {
        if (isLocked) {
            if (lenis) lenis.stop();
            document.body.style.overflow = 'hidden';
        } else {
            if (lenis) lenis.start();
            document.body.style.overflow = '';
        }
    }, [lenis, isLocked]);

    return (
        <div
            ref={containerRef}
            className="hero-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
                pointerEvents: 'none', // Allow clicks to pass through to 3D background if needed
                mixBlendMode: 'screen' // Cool blending with particles
            }}
        >
            <img
                ref={logoRef}
                src={agencyTypography}
                alt="AGENCIA"
                onClick={() => window.dispatchEvent(new CustomEvent('triggerRandomColors'))}
                style={{
                    width: '80%',
                    maxWidth: '800px',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.5))',
                    willChange: 'transform, opacity',
                    pointerEvents: 'auto',
                    cursor: 'pointer'
                }}
            />


            <MaskedText
                main="SCROLL TO ENTER"
                sub="DESCUBRIR"
                index={0}
                style={{
                    marginTop: '2rem',
                    // opacity: 0.8 handled by component largely, but okay
                }}
                className="scroll-hint"
            />
            {/* INJECT STYLES FOR OVERRIDE IF NEEDED or pass via style prop properly */}
            <style>{`
                .scroll-hint h2 {
                    font-family: var(--font-body) !important;
                    font-size: 0.9rem !important;
                    letter-spacing: 0.5em !important;
                    color: rgba(255,255,255,0.6) !important;
                    text-transform: uppercase !important;
                }
            `}</style>
        </div>
    );
};

export default HeroOverlay;
