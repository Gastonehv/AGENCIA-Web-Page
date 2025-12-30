import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import footerLogo from '../assets/logo_agencia_full.png';
import hechoEnMexicoLogo from '../assets/images/hecho_en_mexico.png';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const socialContainerRef = useRef<HTMLDivElement>(null);

    const socialLinks = [
        {
            name: 'LinkedIn',
            url: '#',
            colors: ['#0A66C2', '#0077B5'],
            gradient: 'linear-gradient(135deg, #0A66C2 0%, #0077B5 100%)',
            glow: '0 0 40px rgba(10, 102, 194, 0.6), 0 0 80px rgba(0, 119, 181, 0.4), 0 20px 60px rgba(10, 102, 194, 0.5)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'Instagram',
            url: '#',
            colors: ['#E1306C', '#833AB4'],
            gradient: 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #FCAF45 100%)',
            glow: '0 0 40px rgba(225, 48, 108, 0.5), 0 0 80px rgba(131, 58, 180, 0.3), 0 20px 60px rgba(225, 48, 108, 0.4)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'Twitter',
            url: '#',
            colors: ['#FFFFFF', '#E7E9EA'],
            gradient: 'linear-gradient(135deg, #FFFFFF 0%, #E7E9EA 100%)',
            glow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(231, 233, 234, 0.6), 0 20px 60px rgba(255, 255, 255, 0.7)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'Facebook',
            url: '#',
            colors: ['#1877F2', '#0C5DC7'],
            gradient: 'linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%)',
            glow: '0 0 40px rgba(24, 119, 242, 0.5), 0 0 80px rgba(24, 119, 242, 0.3), 0 20px 60px rgba(24, 119, 242, 0.4)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'TikTok',
            url: '#',
            colors: ['#000000', '#25F4EE'],
            gradient: 'linear-gradient(135deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)',
            glow: '0 0 40px rgba(37, 244, 238, 0.4), 0 0 40px rgba(254, 44, 85, 0.4)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'YouTube',
            url: '#',
            colors: ['#FF0000', '#CC0000'],
            gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
            glow: '0 0 40px rgba(255, 0, 0, 0.5), 0 0 80px rgba(204, 0, 0, 0.3), 0 20px 60px rgba(255, 0, 0, 0.4)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'Behance',
            url: '#',
            colors: ['#0057FF', '#003ECC'],
            gradient: 'linear-gradient(135deg, #0057FF 0%, #003ECC 100%)',
            glow: '0 0 40px rgba(0, 87, 255, 0.5), 0 0 80px rgba(0, 62, 204, 0.3)',
            size: 64,
            yOffset: 0
        },
        {
            name: 'GitHub',
            url: '#',
            colors: ['#333', '#000'],
            gradient: 'linear-gradient(135deg, #333333 0%, #000000 100%)',
            glow: '0 0 40px rgba(255, 255, 255, 0.2), 0 0 80px rgba(255, 255, 255, 0.1)',
            size: 64,
            yOffset: 0
        }
    ];

    const quickLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Ejecución', path: '/#capacidades' },
        { name: 'Contacto', path: '/contacto' }
    ];

    // GSAP Entrance Animation
    useEffect(() => {
        if (socialContainerRef.current) {
            const icons = socialContainerRef.current.querySelectorAll('.social-icon-link');
            gsap.fromTo(icons,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.8,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: socialContainerRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    }, []);

    // --- HECHO EN MÉXICO: ELEGANT HOLOGRAPHIC REDESIGN (PURE SVG) ---
    const sealRef = useRef<HTMLDivElement>(null);
    const gradientRef = useRef<SVGLinearGradientElement>(null);

    useEffect(() => {
        if (!sealRef.current || !gradientRef.current) return;
        const seal = sealRef.current;
        const gradient = gradientRef.current;

        // Subtle float animation
        gsap.to(seal, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Continuous holographic "sweep" - Right to Left Infinite Loop
        // Gradient defined as G-W-R-G. To swipe R->L, we animate the gradient coordinates to the left.
        // With spreadMethod="repeat", moving from 0%->100% to -100%->0% creates a seamless loop.
        gsap.fromTo(gradient,
            { attr: { x1: "0%", x2: "100%" } },
            {
                attr: { x1: "-100%", x2: "0%" },
                duration: 3,
                repeat: -1,
                ease: "none"
            }
        );

    }, []);

    return (
        <footer style={{
            backgroundColor: '#000',
            color: '#FFF',
            padding: '8vh 5%',
            position: 'relative',
            zIndex: 100,
            borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '4rem',
                marginBottom: '4rem'
            }}>
                {/* COLUMN 1: BRAND */}
                <div>
                    <img
                        src={footerLogo}
                        alt="AgencIA Logo"
                        style={{
                            width: '200px',
                            height: 'auto',
                            marginBottom: '1.5rem',
                            filter: 'brightness(0) invert(1)'
                        }}
                    />
                    <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        color: '#777',
                        maxWidth: '350px'
                    }}>
                        No somos una agencia con IA. Somos la IA como agencia. Lideramos la frontera de la transformación digital con arquitectura de código puro e identidad visual que respira.
                    </p>
                </div>

                {/* COLUMN 2: QUICK LINKS */}
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.3em',
                        color: '#00FF99',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        opacity: 0.8
                    }}>
                        /// NAVEGACIÓN
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {quickLinks.map((link, i) => (
                            <li key={i} style={{ marginBottom: '0.8rem' }}>
                                <Link
                                    to={link.path}
                                    style={{
                                        color: '#AAA',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontFamily: 'var(--font-body)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#00FF99';
                                        e.currentTarget.style.paddingLeft = '5px';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#AAA';
                                        e.currentTarget.style.paddingLeft = '0px';
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* COLUMN 3: CONTACT */}
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.3em',
                        color: '#00FF99',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        opacity: 0.8
                    }}>
                        /// CONTACTO
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <a
                            href="mailto:hola@agenciamx.tech"
                            style={{
                                color: '#AAA',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#00FF99'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#AAA'}
                        >
                            hola@agenciamx.tech
                        </a>
                        <p style={{ color: '#666', fontSize: '0.85rem', margin: 0, fontFamily: 'var(--font-mono)' }}>
                            Xalapa, Veracruz, México
                        </p>

                        {/* HECHO EN MÉXICO: MASTERPIECE PURE SVG -- ROBUST FOR IOS */}
                        <div
                            ref={sealRef}
                            data-no-magnetic="true"
                            style={{
                                marginTop: '3rem',
                                width: '240px',
                                height: '120px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))'
                            }}>

                            {/* PURE SVG IMPLEMENTATION (No foreignObject) */}
                            <svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    {/* The Dynamic Tricolor Gradient - VIBRANT FLAG COLORS */}
                                    <linearGradient id="mexico-shine-gradient" x1="0%" y1="0%" x2="100%" y2="0%" spreadMethod="repeat" ref={gradientRef}>
                                        <stop offset="0%" stopColor="#009B77" /> {/* Vibrant Flag Green */}
                                        <stop offset="33%" stopColor="#FFFFFF" /> {/* White */}
                                        <stop offset="66%" stopColor="#FF334B" /> {/* Vibrant Flag Red */}
                                        <stop offset="100%" stopColor="#009B77" /> {/* Loop Connector (Green) */}
                                    </linearGradient>

                                    {/* Mask from Image - INVERTED to make the black logo WHITE (visible in mask) */}
                                    <mask id="seal-mask">
                                        <image href={hechoEnMexicoLogo} width="240" height="120" style={{ filter: 'brightness(0) invert(1)' }} />
                                    </mask>
                                </defs>

                                {/* The Shine Layer (Masked) - No Dark Background, Pure Gradient */}
                                <rect width="240" height="120" fill="url(#mexico-shine-gradient)" mask="url(#seal-mask)" />

                                {/* No overlay interference, just pure color first to fix the 'dark' issue */}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* COLUMN 4: SOCIAL MEDIA - UNIFIED SIZE */}
                <div>
                    <h3 style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        color: '#00FF99',
                        marginBottom: '2rem',
                        textTransform: 'uppercase'
                    }}>
                        /// SÍGUENOS
                    </h3>
                    <div
                        ref={socialContainerRef}
                        style={{
                            display: 'flex',
                            gap: '1.2rem',
                            flexWrap: 'wrap',
                            alignItems: 'center', // Centered alignment
                            position: 'relative',
                            minHeight: '80px'
                        }}
                    >
                        {socialLinks.map((social, i) => (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon-link"
                                style={{
                                    width: `${social.size}px`,
                                    height: `${social.size}px`,
                                    borderRadius: '18px',
                                    border: '2px solid rgba(255,255,255,0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none',
                                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    position: 'relative',
                                    overflow: 'visible',
                                    // Removed Manual yOffset for consistency
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.background = social.gradient;
                                    e.currentTarget.style.transform = `scale(1.15) rotate(5deg)`; // Simplified transform
                                    e.currentTarget.style.boxShadow = social.glow;
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) {
                                        (svg as SVGElement).style.fill = social.name === 'Twitter' ? '#000' : '#FFF';
                                        (svg as SVGElement).style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.8))';
                                        (svg as SVGElement).style.transform = 'scale(1.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                    e.currentTarget.style.transform = `scale(1) rotate(0deg)`;
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                                    const svg = e.currentTarget.querySelector('svg');
                                    if (svg) {
                                        (svg as SVGElement).style.fill = '#FFF';
                                        (svg as SVGElement).style.filter = 'none';
                                        (svg as SVGElement).style.transform = 'scale(1)';
                                    }
                                }}
                            >
                                {/* GRADIENT BACKGROUND LAYER */}
                                <div style={{
                                    position: 'absolute',
                                    inset: '-2px',
                                    background: social.gradient,
                                    borderRadius: '18px',
                                    opacity: 0.15,
                                    zIndex: 0,
                                    filter: 'blur(8px)',
                                    pointerEvents: 'none'
                                }} />

                                {getSocialIcon(social.name, social.size)}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: '#666',
                    margin: 0
                }}>
                    © {currentYear} AgencIA. Todos los derechos reservados. · A.L.M.A. es propiedad intelectual de AgencIA.
                </p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link
                        to="/privacidad"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            color: '#666',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#00FF99'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                    >
                        Privacidad
                    </Link>
                    <Link
                        to="/terminos"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            color: '#666',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#00FF99'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                    >
                        Términos
                    </Link>
                </div>
            </div>
        </footer>
    );
};

// PREMIUM SVG SOCIAL ICONS - SCALED DYNAMICALLY
const getSocialIcon = (name: string, size: number): React.ReactElement => {
    const iconSize = Math.floor(size * 0.45); // 45% of container
    const iconStyle = {
        fill: '#FFF',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        position: 'relative' as const,
        zIndex: 1,
        filter: 'none'
    };

    switch (name) {
        case 'LinkedIn':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            );
        case 'Instagram':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            );
        case 'Twitter':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            );
        case 'Facebook':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            );
        case 'TikTok':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
            );
        case 'YouTube':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        case 'Behance':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM16.94 16.665c.44.428 1.073.643 1.894.643.59 0 1.1-.148 1.53-.447.424-.29.68-.61.78-.94h2.588c-.403 1.28-1.048 2.2-1.9 2.75-.85.56-1.884.83-3.08.83-.837 0-1.584-.13-2.272-.4-.673-.27-1.24-.65-1.72-1.14-.464-.49-.823-1.07-1.077-1.74-.253-.67-.373-1.41-.373-2.23 0-.8.125-1.55.373-2.23.253-.68.62-1.27 1.077-1.75.48-.48 1.047-.86 1.72-1.14.688-.27 1.435-.41 2.272-.41.86 0 1.63.15 2.317.45.685.3 1.253.72 1.717 1.27.465.55.806 1.2 1.025 1.94.22.74.323 1.54.308 2.42H14.43c0 .87.433 1.43.877 1.86zm.01-7.53h3.993v-.96h-3.993v.96zm-10.868 4.15c.48 0 .878-.114 1.192-.345.312-.23.536-.55.688-.96.15-.41.223-.87.223-1.37 0-.51-.073-.96-.223-1.35-.152-.39-.376-.7-.688-.93-.314-.228-.712-.35-1.192-.35H3.24v5.31h2.842v-.006zm.99 4.95c.48 0 .878-.114 1.192-.345.312-.23.536-.55.688-.96.15-.41.223-.87.223-1.37 0-.51-.073-.96-.223-1.35-.152-.39-.376-.7-.688-.93-.314-.228-.712-.35-1.192-.35H3.24v5.31h3.83v-.006z" />
                </svg>
            );
        case 'GitHub':
            return (
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" style={iconStyle}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            );
        default:
            return <></>;
    }
};

export default Footer;
