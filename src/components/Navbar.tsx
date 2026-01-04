import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useScroll } from '../context/ScrollContext';
import iconWhite from '../assets/logos/header-brain.png';
import { servicesData } from '../data/services.ts';

const Navbar: React.FC = () => {
    const navRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { lenis } = useScroll();

    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isAutopilot, setIsAutopilot] = useState(false);

    const tl = useRef<gsap.core.Timeline | null>(null);
    const autopilotTween = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const autopilotRef = useRef(false);

    const stopAutopilot = () => {
        autopilotRef.current = false;
        if (autopilotTween.current) {
            autopilotTween.current.kill();
            autopilotTween.current = null;
        }
        setIsAutopilot(false);
        // Remove listeners
        window.removeEventListener('wheel', stopAutopilot);
        window.removeEventListener('touchstart', stopAutopilot);
        window.removeEventListener('keydown', handleKeyStop);
    };

    const handleKeyStop = (e: KeyboardEvent) => {
        // Stop on any key interaction designed to scroll
        if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
            stopAutopilot();
        }
    };

    const startAutopilot = () => {
        if (!lenis) return;

        // Ensure we are in a stopped state before starting
        stopAutopilot();
        setIsAutopilot(true);
        autopilotRef.current = true;

        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        if (currentScroll >= totalHeight - 10) {
            // Already at bottom, maybe restart?
            lenis.scrollTo(0, { immediate: true });
            // Add a small delay to let visual reset happen before scrolling down
            setTimeout(() => {
                startActualScroll(0, totalHeight);
            }, 100);
            return;
        }

        startActualScroll(currentScroll, totalHeight);
    };

    const startActualScroll = (_startPos: number, maxPos: number) => {
        if (!lenis) return;

        // CONFIGURATION
        const SPEED_HERO = 2160; // Doubled from 1080
        const SPEED_DEFAULT = 450;

        const LERP_FACTOR = 0.05;

        // Reading Zone: 20% to 80% of viewport


        // Start fast if at top
        let currentActualSpeed = isAutopilot ? 0 : SPEED_HERO;

        let lastTime = performance.now();

        // Optimized: live collection to handle React re-renders/mounts
        const manifestoItems = document.getElementsByClassName('manifesto-item');

        const tick = (time: number) => {
            if (!autopilotRef.current) return;

            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;

            const currentY = window.scrollY; // Or lenis.scroll

            // Check end condition
            if (currentY >= maxPos - 5) {
                stopAutopilot();
                return;
            }

            // 1. DETERMINE TARGET SPEED based on context
            let targetSpeed = SPEED_DEFAULT;
            const viewportHeight = window.innerHeight;

            const identidadSection = document.getElementById('identidad');
            const manifestoSection = document.getElementById('manifesto');
            const showcaseSection = document.getElementById('showcase-slider'); // Chapter 003
            const symbiosisSection = document.getElementById('simbiosis-startups');
            const nucleoSection = document.getElementById('nucleo');

            // ZONE: HERO
            if (currentY < viewportHeight * 0.9) {
                targetSpeed = SPEED_HERO;
            }
            // ZONE: CHAPTER 1 (Identidad)
            else if (identidadSection &&
                currentY >= (identidadSection.offsetTop - viewportHeight * 0.5) &&
                currentY < (identidadSection.offsetTop + identidadSection.offsetHeight)) {

                targetSpeed = 900;
            }
            // ZONE: CHAPTER 2 (Manifesto)
            else if (manifestoSection &&
                currentY >= (manifestoSection.offsetTop - viewportHeight * 0.5) &&
                currentY < (manifestoSection.offsetTop + manifestoSection.offsetHeight)) {

                targetSpeed = 600;

                for (let i = 0; i < manifestoItems.length; i++) {
                    const rect = manifestoItems[i].getBoundingClientRect();
                    const itemCenter = rect.top + rect.height / 2;
                    const screenCenter = viewportHeight / 2;

                    if (Math.abs(itemCenter - screenCenter) < viewportHeight * 0.35) {
                        targetSpeed = 60;
                        break;
                    }
                }
            }
            // ZONE: CHAPTER 3 (Showcase - READING SLOW MOTION)
            else if (showcaseSection &&
                currentY >= (showcaseSection.offsetTop - viewportHeight * 0.3) &&
                currentY < (showcaseSection.offsetTop + showcaseSection.offsetHeight)) {

                targetSpeed = 40; // ULTRA SLOW FOR READING CARDS
            }
            // ZONE: CHAPTER 4 (Simbiosis - SLOW DOWN)
            else if (symbiosisSection &&
                currentY >= (symbiosisSection.offsetTop - viewportHeight * 0.8) &&
                currentY < (symbiosisSection.offsetTop + symbiosisSection.offsetHeight)) {
                targetSpeed = 120; // MIDDLE GROUND
            }
            // ZONE: CHAPTER 5 (Nucleo - SLOW DOWN)
            else if (nucleoSection &&
                currentY >= (nucleoSection.offsetTop - viewportHeight * 0.8) &&
                currentY < (nucleoSection.offsetTop + nucleoSection.offsetHeight)) {
                targetSpeed = 120; // MIDDLE GROUND
            }

            // 2. INTERPOLATE SPEED (Smooth acceleration/deceleration)
            currentActualSpeed += (targetSpeed - currentActualSpeed) * LERP_FACTOR;

            // 3. MOVE
            const moveStep = currentActualSpeed * deltaTime;
            const nextY = currentY + moveStep;

            lenis.scrollTo(nextY, { immediate: true });

            requestAnimationFrame(tick);
        };

        // Start loop

        // Wait a frame to ensure layout is settled? usually safe here.
        requestAnimationFrame(tick);

        // Add listeners to break autopilot on user interaction
        // Small timeout to avoid the click itself triggering stop
        setTimeout(() => {
            window.addEventListener('wheel', stopAutopilot, { passive: true });
            window.addEventListener('touchstart', stopAutopilot, { passive: true });
            window.addEventListener('keydown', handleKeyStop);
        }, 200);
    };


    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (autopilotTween.current) autopilotTween.current.kill();
            window.removeEventListener('wheel', stopAutopilot);
            window.removeEventListener('touchstart', stopAutopilot);
            window.removeEventListener('keydown', handleKeyStop);
        };
    }, []);

    const menuItems = [
        { path: '/', label: 'ESENCIA' },
        { path: '/arquitectura', label: 'INFRAESTRUCTURA' },
        { path: '/automatizacion', label: 'AUTOMATIZACIÓN' },
        { path: '/identidad', label: 'IDENTIDAD' },
        { path: '/contacto', label: 'CONTACTO' }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(menuRef.current, {
                clipPath: 'circle(0% at 4rem 3.5rem)',
                pointerEvents: 'none'
            });

            tl.current = gsap.timeline({ paused: true })
                .to(menuRef.current, {
                    clipPath: 'circle(150% at 4rem 3.5rem)',
                    pointerEvents: 'all',
                    duration: 1.2,
                    ease: 'power4.inOut'
                })
                .from(linksRef.current, {
                    y: 100,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    rotateX: 20,
                    filter: 'blur(10px)'
                }, '-=0.5');

        }, navRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (tl.current) {
            if (isOpen) {
                tl.current.play();
                document.body.style.overflow = 'hidden';
            } else {
                tl.current.reverse();
                document.body.style.overflow = '';
            }
        }
    }, [isOpen]);

    return (
        <nav ref={navRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999, pointerEvents: 'none' }}>
            <div style={{
                position: 'absolute', top: '1rem', left: '2rem', right: '2rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                pointerEvents: 'auto',
            }}>
                <div
                    onClick={() => {
                        if (location.pathname !== '/') {
                            const returnMap: Record<string, string> = {
                                '/arquitectura': '#case-arquitectura',
                                '/automatizacion': '#case-automatizacion',
                                '/identidad': '#case-identidad'
                            };
                            const targetHash = returnMap[location.pathname] || '';
                            navigate('/' + targetHash);
                        } else {
                            setIsOpen(!isOpen);
                        }
                    }}
                    style={{
                        height: isMobile ? '60px' : '70px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '0.6rem' : '0.8rem', // Reduced gap for "single piece" feel
                        cursor: 'pointer',
                        zIndex: 10001,
                        pointerEvents: 'auto',
                        padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
                        borderRadius: '40px',
                        transition: 'all 0.3s ease'
                    }}
                    className="universal-control-widget"
                    data-no-magnetic="true"
                    onMouseEnter={e => {
                        const label = e.currentTarget.querySelector('.widget-label');
                        const img = e.currentTarget.querySelector('img');
                        if (img) gsap.to(img, {
                            filter: 'brightness(0) drop-shadow(0 0 15px rgba(255,255,255,1)) drop-shadow(0 0 25px rgba(0,255,153,0.8))',
                            scale: 1.15,
                            duration: 0.4
                        });
                        if (label) gsap.to(label, {
                            opacity: 1,
                            filter: 'blur(0px)',
                            color: '#000',
                            textShadow: '0 0 15px #fff, 0 0 30px #fff, 0 0 45px rgba(0,255,153,1)',
                            duration: 0.5,
                            ease: 'power3.out'
                        });
                    }}
                    onMouseLeave={e => {
                        const label = e.currentTarget.querySelector('.widget-label');
                        const img = e.currentTarget.querySelector('img');
                        if (img) gsap.to(img, {
                            filter: 'brightness(0) drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 18px rgba(255,255,255,0.8))',
                            scale: 1.05,
                            duration: 0.4
                        });
                        if (label) gsap.to(label, {
                            opacity: 1,
                            filter: 'blur(0px)',
                            color: '#000',
                            textShadow: '0 0 12px #fff, 0 0 24px #fff, 0 0 36px rgba(255,255,255,1)',
                            duration: 0.5,
                            ease: 'power3.in'
                        });
                    }}
                >
                    <img src={iconWhite} alt="AgencIA Core" style={{
                        height: isMobile ? '35px' : '45px', width: 'auto', objectFit: 'contain',
                        filter: 'brightness(0) drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 18px rgba(255,255,255,0.8))',
                        transform: 'scale(1.05)',
                        transition: 'all 0.4s ease'
                    }} />

                    <span className="widget-label" style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: isMobile ? '1rem' : '1.3rem', // Punchier size
                        letterSpacing: isMobile ? '0.1em' : '0.15em', // Integrated spacing
                        color: '#000',
                        textTransform: 'uppercase',
                        width: 'auto',
                        opacity: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'block',
                        textShadow: '0 0 12px #fff, 0 0 24px #fff, 0 0 36px rgba(255,255,255,1)'
                    }}>
                        <span style={{ color: '#00FF99', marginRight: '0.4em', textShadow: '0 0 10px #00FF99' }}>//</span>
                        {location.pathname !== '/' ? 'REGRESAR' : (isOpen ? 'CERRAR' : 'MENÚ')}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 10001 }}>
                    <div
                        onClick={() => {
                            if (isAutopilot) {
                                stopAutopilot();
                            } else {
                                startAutopilot();
                            }
                        }}
                        style={{
                            display: isMobile ? 'none' : 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            cursor: 'pointer',
                            padding: '0.5rem 1.2rem',
                            background: isAutopilot ? 'rgba(0, 255, 153, 0.2)' : 'rgba(0, 0, 0, 0.6)',
                            border: `1px solid ${isAutopilot ? 'rgba(0, 255, 153, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                            borderRadius: '40px',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={e => {
                            gsap.to(e.currentTarget, {
                                background: 'rgba(0, 255, 153, 0.15)',
                                borderColor: 'rgba(0, 255, 153, 0.4)',
                                scale: 1.02,
                                duration: 0.3
                            });
                        }}
                        onMouseLeave={e => {
                            if (!isAutopilot) {
                                gsap.to(e.currentTarget, {
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    scale: 1,
                                    duration: 0.3
                                });
                            } else {
                                gsap.to(e.currentTarget, {
                                    scale: 1,
                                    duration: 0.3
                                });
                            }
                        }}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            background: isAutopilot ? '#00FF99' : '#ffffff',
                            borderRadius: '50%',
                            boxShadow: isAutopilot ? '0 0 10px #00FF99' : 'none',
                            transition: 'all 0.3s ease',
                            animation: isAutopilot ? 'pulse-green 1.5s infinite' : 'none'
                        }} />
                        <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            letterSpacing: '0.1em',
                            color: isAutopilot ? '#00FF99' : '#ffffff',
                            textShadow: isAutopilot ? '0 0 15px rgba(0,255,153,0.5)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                            {isAutopilot ? 'PILOTO ACTIVO' : 'PILOTO AUTOMÁTICO'}
                        </span>
                    </div>

                    <style>{`
                        @keyframes pulse-green {
                            0% { box-shadow: 0 0 0 0 rgba(0, 255, 153, 0.7); }
                            70% { box-shadow: 0 0 0 6px rgba(0, 255, 153, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(0, 255, 153, 0); }
                        }
                    `}</style>
                </div>
            </div>

            <div ref={menuRef} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(3, 3, 3, 0.98)',
                backdropFilter: 'blur(30px)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                zIndex: 10000,
                clipPath: 'circle(0% at 4rem 3.5rem)'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    pointerEvents: 'none',
                    opacity: 0.2,
                    zIndex: 0
                }} />

                <div style={{
                    flex: isMobile ? 'none' : 1,
                    height: isMobile ? 'auto' : '100%',
                    width: '100%',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    paddingLeft: isMobile ? 0 : '10vw',
                    paddingTop: isMobile ? '20vh' : 0,
                    borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: isMobile ? 'center' : 'left' }}>
                        {menuItems.map((item, index) => (
                            <li key={item.path} style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                                <Link
                                    to={item.path}
                                    ref={(el) => { linksRef.current[index] = el; }}
                                    onClick={() => setIsOpen(false)}
                                    className="nav-link-item"
                                    data-section={item.label}
                                    data-no-magnetic="true"
                                    style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                                        fontWeight: 900,
                                        color: '#ffffff',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        lineHeight: 0.9,
                                        letterSpacing: '-0.02em',
                                        transition: 'color 0.3s, opacity 0.3s',
                                        opacity: isMobile ? 1 : 0.5
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isMobile) {
                                            gsap.to(e.currentTarget, { color: '#00FF99', opacity: 1, x: 20, duration: 0.3 });
                                            setActiveSection(item.label);
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isMobile) {
                                            gsap.to(e.currentTarget, { color: '#ffffff', opacity: 0.5, x: 0, duration: 0.3 });
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {!isMobile && (
                    <div style={{
                        flex: 1,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                        perspective: '1000px'
                    }}>
                        <div style={{
                            width: '80%', height: '70%',
                            position: 'relative'
                        }}>
                            {activeSection !== 'SERVICIOS' && (
                                <div className="holo-default" style={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'
                                }}>
                                    <h3 style={{ fontSize: '10rem', opacity: 0.05, fontWeight: 900 }}>AI</h3>
                                    <p style={{ color: '#00FF99', fontFamily: 'monospace' }}>SYSTEM READY // SELECT MODULE</p>
                                </div>
                            )}

                            {activeSection === 'SERVICIOS' && (
                                <div className="holo-services-grid" style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem',
                                    opacity: 0,
                                    animation: 'glitchFadeIn 0.3s forwards'
                                }}>
                                    {servicesData.map((service) => (
                                        <Link key={service.id} to={service.path} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                padding: '1.5rem',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = service.color;
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <span style={{ color: service.color, fontSize: '0.7rem', fontFamily: 'monospace' }}>// {service.id.toUpperCase()}</span>
                                                    <div style={{ width: '8px', height: '8px', background: service.color, borderRadius: '50%', boxShadow: `0 0 10px ${service.color}` }} />
                                                </div>
                                                <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{service.titleKey}</h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <style>{`
                    @keyframes glitchFadeIn {
                        0% { opacity: 0; clip-path: inset(50% 0 50% 0); transform: scale(0.9); }
                        20% { opacity: 1; clip-path: inset(0 0 0 0); }
                        40% { opacity: 0.5; transform: scale(1.02); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `}</style>

                <div style={{
                    position: 'absolute', bottom: '2rem', left: isMobile ? '50%' : '10vw',
                    transform: isMobile ? 'translateX(-50%)' : 'none',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em',
                    width: '100%', textAlign: isMobile ? 'center' : 'left'
                }}>
                    AGENCIA © 2025 // [ SYSTEM_READY ]
                </div>
            </div>

        </nav >
    );
};

export default Navbar;
