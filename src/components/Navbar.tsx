import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useLocation, useNavigate
import gsap from 'gsap';
// import { useLanguage } from '../context/LanguageContext';
import iconWhite from '../assets/logos/header-brain.png';
import { servicesData } from '../data/services.ts';

const Navbar: React.FC = () => {
    const navRef = useRef<HTMLElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    // const { language, toggleLanguage } = useLanguage(); // Removed unused hook
    const location = useLocation(); // Hook
    const navigate = useNavigate(); // Hook

    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const menuItems = [
        { path: '/esencia', label: 'ESENCIA' },
        { path: '/arquitectura', label: 'ARQUITECTURA DIGITAL' },
        { path: '/inteligencia', label: 'IA GENERATIVA' },
        { path: '/automatizacion', label: 'AUTOMATIZACIÓN' },
        { path: '/identidad', label: 'IDENTIDAD VISUAL' },
        { path: '/contacto', label: 'CONTACTO' }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial Set: Menu Hidden via ClipPath (ORIGIN: TOP LEFT @ BRAIN)
            gsap.set(menuRef.current, {
                clipPath: 'circle(0% at 4rem 3.5rem)', // Matched to Brain Position
                pointerEvents: 'none'
            });

            tl.current = gsap.timeline({ paused: true })
                .to(menuRef.current, {
                    clipPath: 'circle(150% at 4rem 3.5rem)', // Expands from Brain
                    pointerEvents: 'all',
                    duration: 1.2,
                    ease: 'power4.inOut' // Dramatic expansion
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
                document.body.style.overflow = 'hidden'; // Lock Scroll
            } else {
                tl.current.reverse();
                document.body.style.overflow = ''; // Unlock Scroll
            }
        }
    }, [isOpen]);



    return (
        <nav ref={navRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999, pointerEvents: 'none' }}>

            {/* TOP BAR (Always Visible) */}
            <div style={{
                position: 'absolute', top: '1rem', left: '2rem', right: '2rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                pointerEvents: 'auto',
            }}>
                {/* SYNAPTIC TRIGGER (Logo = Menu) */}
                <div
                    onClick={() => {
                        if (location.pathname !== '/') {
                            // IF NOT HOME -> RETURN TO SPECIFIC CARD
                            const returnMap: Record<string, string> = {
                                '/arquitectura': '#case-arquitectura',
                                '/inteligencia': '#case-inteligencia',
                                '/automatizacion': '#case-automatizacion',
                                '/identidad': '#case-identidad'
                            };
                            // Default to TOP of home for "Esencia" and others, only use deep links for cases
                            const targetHash = returnMap[location.pathname] || '';
                            navigate('/' + targetHash);
                        } else {
                            // IF HOME -> TOGGLE MENU
                            setIsOpen(!isOpen);
                        }
                    }}
                    style={{
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        zIndex: 10001,
                        pointerEvents: 'auto'
                    }}
                    className="synaptic-trigger"
                    onMouseEnter={e => {
                        const text = e.currentTarget.querySelector('.menu-label');
                        const img = e.currentTarget.querySelector('img');
                        if (text) gsap.to(text, {
                            // NUCLEAR GLOW: 7 LAYERS (Ultimate Density)
                            textShadow: '0 0 1px #fff, 0 0 3px #fff, 0 0 7px #fff, 0 0 15px #fff, 0 0 30px #fff, 0 0 60px #fff, 0 0 100px #fff',
                            scale: 1.05
                        });
                        if (img) gsap.to(img, {
                            filter: 'brightness(0) drop-shadow(0 0 12px rgba(255,255,255,1)) drop-shadow(0 0 20px rgba(255,255,255,1)) drop-shadow(0 0 35px rgba(255,255,255,0.9))',
                            scale: 1.15
                        });
                    }}
                    onMouseLeave={e => {
                        const text = e.currentTarget.querySelector('.menu-label');
                        const img = e.currentTarget.querySelector('img');
                        if (text) gsap.to(text, {
                            // IDLE GLOW: SOLID
                            textShadow: '0 0 2px #fff, 0 0 8px #fff, 0 0 15px #fff',
                            scale: 1
                        });
                        if (img) gsap.to(img, {
                            filter: 'brightness(0) drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 15px rgba(255,255,255,0.9)) drop-shadow(0 0 25px rgba(255,255,255,0.7))',
                            scale: 1.1
                        });
                    }}
                >
                    <img src={iconWhite} alt="AgencIA Brain" style={{
                        height: '100%', width: 'auto', objectFit: 'contain',
                        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                        // ALWAYS: Black icon with intense white glow behind (visible on any background)
                        filter: 'brightness(0) drop-shadow(0 0 8px rgba(255,255,255,1)) drop-shadow(0 0 15px rgba(255,255,255,0.9)) drop-shadow(0 0 25px rgba(255,255,255,0.7))',
                        transform: 'scale(1.1)'
                    }} />

                    {/* MENU LABEL - Visual Affordance */}
                    <span className="menu-label" style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 900,
                        fontSize: '1rem', // Larger
                        letterSpacing: '0.2em',
                        transition: 'all 0.3s ease',
                        color: '#000', // Black text
                        textTransform: 'uppercase',
                        // SUPER GLOW IDLE
                        textShadow: '0 0 2px #fff, 0 0 8px #fff, 0 0 15px #fff',
                        opacity: 1
                    }}>
                        {location.pathname !== '/' ? '// REGRESAR' : (isOpen ? '// CERRAR' : '// MENÚ')}
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 10001 }}>
                    {/* HAMBURGER ELIMINATED */}
                </div>
            </div>

            {/* FULLSCREEN OVERLAY ("THE COMMAND OS") */}
            <div ref={menuRef} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(3, 3, 3, 0.98)', // Absolute Void
                backdropFilter: 'blur(30px)',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                zIndex: 10000,
                clipPath: 'circle(0% at 4rem 3.5rem)' // Matches Brain Position
            }}>
                {/* Background Noise with Neural Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%',
                    pointerEvents: 'none',
                    opacity: 0.2,
                    zIndex: 0
                }} />

                {/* LEFT HEMISPHERE: NAVIGATION */}
                <div style={{
                    flex: isMobile ? 'none' : 1,
                    height: isMobile ? 'auto' : '100%',
                    width: '100%',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: isMobile ? 'center' : 'flex-start', // Center on Mobile
                    paddingLeft: isMobile ? 0 : '10vw',
                    paddingTop: isMobile ? '20vh' : 0, // Push down on mobile
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
                                    className="nav-link-item" // Class for easier targeting
                                    data-section={item.label} // Hook for hover logic
                                    style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: 'clamp(2rem, 5vw, 4.5rem)', // Smaller clamp base
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
                                            // Dim others (handled by siblings logic if needed, or simple css)
                                            setActiveSection(item.label); // Trigger Hologram
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

                {/* RIGHT HEMISPHERE: HOLOGRAPHIC DECK (HIDDEN ON MOBILE) */}
                {!isMobile && (
                    <div style={{
                        flex: 1,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center',
                        position: 'relative',
                        zIndex: 2,
                        perspective: '1000px'
                    }}>
                        {/* HOLOGRAPHIC CONTENT SWITCHER */}
                        <div style={{
                            width: '80%', height: '70%',
                            position: 'relative'
                        }}>
                            {/* 1. DEFAULT / CONTACT / HOME VIEW (Agency Brain) */}
                            {activeSection !== 'SERVICIOS' && (
                                <div className="holo-default" style={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%'
                                }}>
                                    <h3 style={{ fontSize: '10rem', opacity: 0.05, fontWeight: 900 }}>AI</h3>
                                    <p style={{ color: '#00FF99', fontFamily: 'monospace' }}>SYSTEM READY // SELECT MODULE</p>
                                </div>
                            )}

                            {/* 2. SERVICES GRID (The Direct Access) */}
                            {activeSection === 'SERVICIOS' && (
                                <div className="holo-services-grid" style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem',
                                    opacity: 0, // Animate in
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
                                                <h4 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{service.titleKey}</h4> {/* Need Translation? using raw key for now or hook */}
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

                {/* Footer Info */}
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

        </nav>
    );
};

export default Navbar;
