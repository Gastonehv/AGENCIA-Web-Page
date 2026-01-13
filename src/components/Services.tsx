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

            const mm = gsap.matchMedia();

            // --- DESKTOP LOGIC (> 768px) ---
            mm.add("(min-width: 769px)", () => {
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
            });

            // --- MOBILE LOGIC (<= 768px) ---
            mm.add("(max-width: 768px)", () => {
                // In mobile, we want a strict horizontal swipe/scroll experience
                // Each card is 100vw, so total distance is straightforward

                // Force horizontal setup if flexbox breaks
                gsap.set(slider, {
                    x: 0,
                    paddingLeft: 0,
                    paddingRight: 0
                });

                const totalWidth = slider.scrollWidth;
                const windowWidth = window.innerWidth;
                const scrollDistance = totalWidth - windowWidth;

                // Duration proportional to number of cards for natural feel
                const mobilePinDuration = window.innerHeight * (portals.length);

                const mobileTween = gsap.to(slider, {
                    x: -scrollDistance,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: componentRef.current,
                        start: 'top top',
                        end: `+=${mobilePinDuration}`,
                        pin: true,
                        pinSpacing: true,
                        scrub: 0.5, // Less friction for mobile feel
                        snap: {
                            snapTo: 1 / (portals.length - 1), // Snap to each card
                            duration: 0.3,
                            ease: "power1.inOut"
                        },
                        invalidateOnRefresh: true
                    }
                });

                // Mobile Parallax (Simpler)
                portals.forEach((portal) => {
                    gsap.fromTo(`.portal-img-${portal.id}`,
                        { scale: 1.2, xPercent: -10 },
                        {
                            scale: 1,
                            xPercent: 0,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: `.portal-card-${portal.id}`,
                                containerAnimation: mobileTween,
                                start: 'left right',
                                end: 'right left',
                                scrub: true
                            }
                        }
                    );
                });
            });

        }, componentRef);

        return () => ctx.revert();
    }, [portals]);



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
            <div style={{
                position: 'absolute',
                top: 'clamp(2rem, 5vh, 5rem)', // Responsive Top
                left: 'clamp(1.5rem, 5vw, 5rem)', // Responsive Left
                zIndex: 10,
                pointerEvents: 'none',
                width: 'calc(100% - 3rem)' // Prevent overflow
            }}>
                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
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
                className="services-slider"
                style={{
                    display: 'flex',
                    gap: 'clamp(1rem, 5vw, 5vw)',
                    // Padding handled via CSS/GSAP matchMedia primarily, defaults for desktop:
                    width: 'fit-content',
                    height: 'clamp(60vh, 100vh, 100vh)',
                    alignItems: 'center'
                }}
            >
                {/* INLINE STYLE OVERRIDES INJECTION FOR MOBILE */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media (min-width: 769px) {
                        .services-slider {
                            padding-left: 40vw;
                            padding-right: 40vw;
                            height: 60vh !important;
                        }
                        .portal-card {
                            width: 30vw !important;
                            min-width: 400px;
                        }
                    }
                    @media (max-width: 768px) {
                        .services-slider {
                            padding-left: 0;
                            padding-right: 0;
                            gap: 0 !important; /* No gap for seamless flush look */
                        }
                        .portal-card {
                            width: 100vw !important; /* Full Screen Width */
                            height: 100vh !important; /* Full Screen Height */
                            min-width: 100vw !important;
                            border-radius: 0 !important; /* Edge to edge */
                            border: none !important;
                            border-right: 1px solid rgba(255,255,255,0.1) !important;
                        }
                        .card-content {
                            border-radius: 0 !important;
                            border: none !important;
                        }
                    }
                `}} />

                {portals.map((portal, index) => (
                    <Link
                        to={portal.path}
                        key={portal.id}
                        className={`portal-card portal-card-${portal.id}`}
                        style={{
                            display: 'block', // Ensure Link behaves as a block container
                            textDecoration: 'none',
                            position: 'relative',
                            // Widths handled by CSS media queries block above
                            height: '100%',
                            perspective: '1000px',
                            zIndex: 20, // Ensure it's above other elements
                            pointerEvents: 'all', // Force pointer events
                            cursor: 'pointer'
                        }}
                        onMouseMove={(e) => {
                            if (window.innerWidth <= 768) return; // Disable hover tilt on mobile
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
                            if (window.innerWidth <= 768) return;
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
                                height: '55%', // Slightly reduced to give text more room
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
                                    background: `linear-gradient(to top, rgba(0,0,0,0.9), transparent)`
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
                                padding: 'clamp(1.5rem, 5vw, 3rem)',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative', // Context for numbering
                                zIndex: 15
                            }}>
                                <div>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)',
                                        color: portal.color,
                                        fontSize: 'clamp(0.6rem, 2vw, 0.7rem)',
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
                                        fontSize: 'clamp(2rem, 8vw, 2.5rem)', // Responsive Heading
                                        color: '#fff',
                                        margin: '0 0 0.5rem 0',
                                        lineHeight: 0.9
                                    }}>
                                        {t(portal.titleKey)}
                                    </h3>
                                    <p style={{
                                        fontFamily: 'var(--font-body)',
                                        color: portal.color,
                                        fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        marginTop: '0.5rem',
                                        maxWidth: '90%'
                                    }}>
                                        {t(portal.descKey)}
                                    </p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: 'auto', // Push to bottom
                                    paddingTop: '1rem'
                                }}>
                                    <span style={{
                                        fontSize: 'clamp(0.8rem, 2vw, 1rem)', // Prevent cutoff of numbers
                                        color: 'rgba(255,255,255,0.5)',
                                        fontFamily: 'monospace'
                                    }}>
                                        0{index + 1}
                                    </span>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />

                                    {/* Mobile "Swipe" Indicator (Only visible on small screens) */}
                                    <div className="mobile-swipe-hint" style={{
                                        display: 'none', // hidden by default, shown via query below if needed or just implied
                                        color: portal.color,
                                        fontSize: '1.2rem'
                                    }}>
                                        →
                                    </div>
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
