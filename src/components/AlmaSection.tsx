import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import almaLogo from '../assets/images/alma_logo_final.png';
import almaFondoVideo from '../assets/videos/alma_fondo_v3_opt.mp4';

gsap.registerPlugin(ScrollTrigger);

const AlmaSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current) return;

            // Entrance animation: very subtle and professional
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 10 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 90%",
                        toggleActions: 'play none none none'
                    }
                }
            );

            // Subtle rotation for the video to give it some life
            gsap.to(".alma-video-element", {
                scale: 1.1,
                duration: 10,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="alma-editorial-section"
            style={{
                width: '100%',
                minHeight: '100vh', // FORCE FULL SCREEN
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                padding: '0', // Clean padding
                zIndex: 10
            }}
        >
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.2rem',
                    width: '100%',
                    maxWidth: '1200px'
                }}
            >
                {/* LOGO CONTAINER - MATCHING TEAM IMAGE WIDTH */}
                <div style={{
                    position: 'relative',
                    width: 'clamp(280px, 30vw, 450px)', // Aproximadamente el ancho de la imagen del equipo en el rift
                    aspectRatio: '2.5 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* VIDEO MASKED BY LOGO */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        maskImage: `url(${almaLogo})`,
                        WebkitMaskImage: `url(${almaLogo})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                        backgroundColor: '#000',
                        overflow: 'hidden'
                    }}>
                        <video
                            className="alma-video-element"
                            src={almaFondoVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'brightness(1.4) contrast(1.1) saturate(1.2)'
                            }}
                        />
                    </div>
                </div>

                {/* EDITORIAL DATA BLOCK */}
                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    textAlign: 'center',
                    padding: '0 5%'
                }}>
                    {/* ACRONYM DEFINITION - SINGLE LINE */}
                    <span style={{
                        fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
                        letterSpacing: 'clamp(0.1em, 1vw, 0.4em)', // Reduced for mobile
                        color: '#000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        whiteSpace: 'normal', // Allow wrap on small screens
                        textAlign: 'center',
                        lineHeight: 1.4
                    }}>
                        ALGORITMO LÓGICO DE MENTE ARTIFICIAL
                    </span>

                    {/* INTELLECTUAL PROPERTY DECLARATION - CLEARER */}
                    <p style={{
                        margin: 0,
                        fontSize: 'clamp(0.55rem, 1vw, 0.65rem)',
                        letterSpacing: '0.25em',
                        color: '#333', // Darker for better visibility
                        textTransform: 'uppercase',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        opacity: 0.8
                    }}>
                        A.L.M.A. es una propiedad intelectual de <strong style={{ color: '#000', fontWeight: 900 }}>AgencIA</strong>. <br />
                        Sistemas de orquestación propietaria. All rights reserved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AlmaSection;
