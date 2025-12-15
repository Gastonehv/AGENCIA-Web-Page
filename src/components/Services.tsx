import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
// import { useScroll } from '../context/ScrollContext';

import { servicesData } from '../data/services.ts';

gsap.registerPlugin(ScrollTrigger);

const Services: React.FC = () => {
    const { t } = useLanguage();
    // const { currentSection } = useScroll(); // Unused
    const componentRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const portals = servicesData;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const slider = sliderRef.current;
            if (!slider) return;

            // Horizontal Scroll Logic
            const totalWidth = slider.scrollWidth;
            const windowWidth = window.innerWidth;
            const scrollDistance = totalWidth - windowWidth;
            const pinDuration = scrollDistance + 2000; // Define pin duration explicitly

            const sliderTween = gsap.to(slider, {
                x: -scrollDistance,
                ease: 'none',
                scrollTrigger: {
                    trigger: componentRef.current,
                    start: 'top top',
                    end: `+=${pinDuration}`, // Use defined duration
                    pin: true,
                    pinSpacing: true, // Ensure spacing is added
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });

            // Parallax effect for images inside portals
            portals.forEach((portal) => {
                gsap.fromTo(`.portal-img-${portal.id}`,
                    { yPercent: -20 }, // Vertical start
                    {
                        yPercent: 20, // Vertical end
                        ease: 'none',
                        scrollTrigger: {
                            trigger: `.portal-card-${portal.id}`,
                            containerAnimation: sliderTween,
                            start: 'left 100%',
                            end: 'right 0%',
                            scrub: true
                        }
                    }
                );
            });


        }, componentRef);

        return () => ctx.revert();
    }, []);



    return (
        <section
            ref={componentRef}
            id="nexus-section"
            style={{
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                background: 'transparent', // Let 3D background show through
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                zIndex: 10, // Ensure Services is above background
                pointerEvents: 'auto' // Force pointer events on container
            }}
        >


            {/* Header / HUD */}
            {/* Header / HUD */}
            <div style={{
                position: 'absolute',
                top: '5rem',
                left: '5rem',
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    color: '#fff',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <span style={{ width: '10px', height: '10px', background: '#00ffff', borderRadius: '50%', boxShadow: '0 0 10px #00ffff' }} />
                    {t('services.title')}
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    {t('services.select')}
                </p>
            </div>

            {/* Horizontal Slider */}
            <div
                ref={sliderRef}
                style={{
                    display: 'flex',
                    gap: '5vw',
                    paddingLeft: '40vw', // Increased offset to avoid overlap
                    paddingRight: '40vw', // Balanced offset for the last card
                    width: 'fit-content',
                    height: '60vh',
                    alignItems: 'center'
                }}
            >
                {portals.map((portal, index) => (
                    <Link
                        to={portal.path}
                        key={portal.id}
                        className={`portal-card portal-card-${portal.id}`}
                        style={{
                            display: 'block', // Ensure Link behaves as a block container
                            textDecoration: 'none',
                            position: 'relative',
                            width: '30vw',
                            minWidth: '400px',
                            height: '100%',
                            perspective: '1000px',
                            zIndex: 20, // Ensure it's above other elements
                            pointerEvents: 'all', // Force pointer events
                            cursor: 'pointer'
                        }}
                        onMouseMove={(e) => {
                            const card = e.currentTarget.querySelector('.card-content') as HTMLElement;
                            if (!card) return;
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            const centerX = rect.width / 2;
                            const centerY = rect.height / 2;
                            const rotateX = ((y - centerY) / centerY) * 10; // Inverted: Mouse Top -> Top tilts towards
                            const rotateY = ((x - centerX) / centerX) * 10;

                            const xPct = (x / rect.width) * 100;
                            const yPct = (y / rect.height) * 100;
                            card.style.setProperty('--mouse-x', `${xPct}%`);
                            card.style.setProperty('--mouse-y', `${yPct}%`);

                            card.style.transform = `perspective(1000px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                            card.style.borderColor = portal.color;
                            card.style.boxShadow = `0 0 80px ${portal.color}AA, inset 0 0 40px ${portal.color}50`; // Intensified glow

                            const sheen = card.querySelector('.holographic-sheen') as HTMLElement;
                            if (sheen) sheen.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            const card = e.currentTarget.querySelector('.card-content') as HTMLElement;
                            if (!card) return;
                            card.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
                            card.style.borderColor = 'rgba(255,255,255,0.1)';
                            card.style.boxShadow = 'none';
                            const sheen = card.querySelector('.holographic-sheen') as HTMLElement;
                            if (sheen) sheen.style.opacity = '0';
                        }}
                    >
                        {/* Card Content */}
                        <div className="card-content" style={{
                            width: '100%',
                            height: '100%',
                            background: '#000000', // Pure black, no transparency
                            border: '1px solid rgba(255,255,255,0.2)', // Stronger border
                            // backdropFilter removed for solid look
                            borderRadius: '20px',
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'transform 0.5s ease, border-color 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        >
                            {/* Image Container */}
                            <div style={{
                                width: '100%',
                                height: '60%',
                                overflow: 'hidden',
                                position: 'relative',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <img
                                    src={portal.image}
                                    alt={t(portal.titleKey)}
                                    className={`portal-img-${portal.id}`}
                                    style={{
                                        height: '140%', // Increased height for vertical parallax
                                        width: '100%',
                                        minWidth: '100%',
                                        maxWidth: 'none',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        left: '0',
                                        top: '-20%', // Center vertically to allow movement
                                        transform: 'none' // Remove translateX
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: `linear-gradient(to top, rgba(0,0,0,0.8), transparent)`
                                }} />
                                {/* Holographic Sheen Overlay */}
                                <div
                                    className="holographic-sheen"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.9) 0%, transparent 60%)`,
                                        mixBlendMode: 'overlay',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                        pointerEvents: 'none',
                                        zIndex: 10
                                    }}
                                />
                            </div>

                            {/* Text Content */}
                            <div style={{
                                padding: '2rem',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <div>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        color: portal.color,
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        opacity: 0.8
                                    }}>
                                        // {t(portal.conceptKey)}
                                    </span>
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '2.5rem',
                                        color: '#fff',
                                        margin: 0,
                                        lineHeight: 1
                                    }}>
                                        {t(portal.titleKey)}
                                    </h3>
                                    <p style={{
                                        fontFamily: 'var(--font-body)',
                                        color: portal.color,
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginTop: '0.5rem'
                                    }}>
                                        {t(portal.descKey)}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: 'rgba(255,255,255,0.5)',
                                        fontFamily: 'monospace'
                                    }}>
                                        0{index + 1}
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default Services;
