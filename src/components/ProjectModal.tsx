import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useScroll } from '../context/ScrollContext';

interface ProjectModalProps {
    project: {
        title: string;
        subtitle: string;
        desc: string;
        fullDesc?: string;
        humanDesc?: string;
        services?: string;
        humanServices?: string;
        buttonCopy?: string;
        ctaCopy?: string;
        year?: string;
        img?: string;
        video?: string;
        path?: string;
    } | null;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const servicesRef = useRef<HTMLParagraphElement>(null);
    const toggleBtnRef = useRef<HTMLButtonElement>(null);
    const { lenis } = useScroll();
    // State for translation mode
    const [isHumanMode, setIsHumanMode] = useState(false);

    useEffect(() => {
        if (project) {
            // LOCK SCROLL - FORCEFULLY
            // We target both body and html to ensure no scroll leakage
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            // Disable touch scrolling on the background
            document.body.style.touchAction = 'none';

            if (lenis) {
                lenis.stop();
                // Force stop again in next frame just in case
                requestAnimationFrame(() => lenis.stop());
            }

            // ENTER ANIMATION
            const tl = gsap.timeline();

            // 1. Backdrop Fade In
            tl.fromTo(modalRef.current,
                { opacity: 0, backdropFilter: 'blur(0px)' },
                { opacity: 1, backdropFilter: 'blur(20px)', duration: 0.5, ease: 'power2.out' }
            );

            // 2. Content Rise & Scale
            tl.fromTo(contentRef.current,
                { y: 100, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' },
                "-=0.3"
            );

            return () => {
                // RESTORE SCROLL
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.body.style.touchAction = '';

                if (lenis) lenis.start();
            };
        }
    }, [project, lenis]);

    // Mobile Detection (Simplified for this component scope)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!project) return null;

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        if (!isMobile) {
            tl.to(contentRef.current, { y: 50, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
        } else {
            tl.to(contentRef.current, { y: '100%', duration: 0.3, ease: 'power2.in' });
        }
        tl.to(modalRef.current, { opacity: 0, backdropFilter: 'blur(0px)', duration: 0.3 }, isMobile ? 0 : "-=0.1");
    };

    const handleToggleMode = () => {
        const newMode = !isHumanMode;
        const tl = gsap.timeline();
        tl.to([textRef.current, servicesRef.current], { opacity: 0, y: -5, duration: 0.2, ease: 'power2.in', onComplete: () => setIsHumanMode(newMode) });
        tl.to([textRef.current, servicesRef.current], { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    };

    // Derived Display Content
    const descriptionText = isHumanMode ? (project.humanDesc || project.fullDesc || project.desc) : (project.fullDesc || project.desc);
    const servicesText = isHumanMode ? (project.humanServices || project.services || 'Estrategia, Diseño, Desarrollo') : (project.services || 'Estrategia, Diseño, Desarrollo');
    const buttonText = isHumanMode ? '↩ MODO TÉCNICO' : (project.buttonCopy || 'TRADUCCIÓN HUMANA');

    return (
        <div
            ref={modalRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.85)', // Darker background for focus
                display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                padding: isMobile ? '0' : '5vw'
            }}
            onClick={handleClose}
            onWheel={(e) => e.stopPropagation()}
        >
            <div
                ref={contentRef}
                style={{
                    width: isMobile ? '100%' : '100%',
                    maxWidth: '1400px',
                    height: isMobile ? '90vh' : '85vh', // Sheet on mobile
                    backgroundColor: '#FFF',
                    borderRadius: isMobile ? '24px 24px 0 0' : '24px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row', // Column on mobile
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* MAGNETIC CLOSE BUTTON - Re-positioned for mobile friendliness */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '1.5rem' : '2rem',
                        right: isMobile ? '1.5rem' : '2rem',
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        width: isMobile ? '44px' : '48px',
                        height: isMobile ? '44px' : '48px',
                        borderRadius: '50%',
                        cursor: 'pointer', zIndex: 60,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000000',
                        fontSize: '1.5rem',
                        fontWeight: '300', // Fine/Elegant
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}
                >
                    ✕
                </button>

                {/* HERO SECTION (Image/Video) */}
                <div style={{
                    flex: isMobile ? '0 0 35%' : '1.2', // 35% height on mobile
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#000'
                }}>
                    {project.video ? (
                        <video src={project.video} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundImage: `url(${project.img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
                    )}

                    {/* GRADIENT & TITLE */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: isMobile ? '1.5rem' : '3rem', left: isMobile ? '1.5rem' : '3rem', right: isMobile ? '1.5rem' : '3rem', color: '#FFF' }}>
                        <h2 style={{
                            fontSize: isMobile ? 'clamp(2rem, 8vw, 2.5rem)' : 'clamp(2.5rem, 5vw, 6rem)',
                            margin: 0,
                            lineHeight: 0.9,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '-1px'
                        }}>
                            {project.title}
                        </h2>
                        <h3 style={{
                            fontSize: isMobile ? '0.8rem' : 'clamp(1rem, 1.5vw, 1.2rem)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '1px',
                            opacity: 0.8,
                            marginTop: isMobile ? '0.5rem' : '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {project.subtitle}
                        </h3>
                    </div>
                </div>

                {/* CONTENT SECTION - FLEX CONTAINER */}
                <div
                    data-lenis-prevent="true"
                    style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden', // Containement
                        position: 'relative',
                        padding: isMobile ? '1.5rem' : '3rem',
                        backgroundColor: '#FFF'
                    }}
                >
                    {/* FADE MASKS FOR SCROLLING TEXT */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2rem',
                        background: 'linear-gradient(to bottom, #FFF, transparent)', zIndex: 10, pointerEvents: 'none'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: isMobile ? '80px' : '0', // Adjust for footer/buttons
                        left: 0, right: 0, height: '4rem',
                        background: 'linear-gradient(to top, #FFF 20%, transparent)', zIndex: 10, pointerEvents: 'none'
                    }} />

                    {/* SCROLLABLE AREA */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        overscrollBehavior: 'contain',
                        paddingRight: '1rem', // Space for scrollbar
                        paddingBottom: isMobile ? '10rem' : '5rem', // MASSIVE PADDING SAFETY
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '1.5rem' : '4rem',
                    }}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {/* FLEX CONTENT ROW FOR DESKTOP, COLUMN FOR MOBILE */}
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem', height: '100%' }}>

                            {/* LEFT: DESCRIPTION */}
                            <div style={{ flex: 2 }}>
                                <p
                                    ref={textRef}
                                    style={{
                                        fontSize: isMobile ? '1rem' : 'clamp(1.1rem, 1.5vw, 1.35rem)',
                                        lineHeight: 1.6,
                                        color: isHumanMode ? '#000' : '#444',
                                        fontWeight: 400,
                                        marginBottom: '2rem',
                                        whiteSpace: 'pre-line'
                                    }}
                                >
                                    {descriptionText}
                                </p>
                            </div>

                            {/* RIGHT/BOTTOM: META */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                borderLeft: isMobile ? 'none' : '1px solid #f0f0f0',
                                borderTop: isMobile ? '1px solid #f0f0f0' : 'none',
                                paddingLeft: isMobile ? '0' : '3rem',
                                paddingTop: isMobile ? '1.5rem' : '0',
                                minWidth: '250px'
                            }}>
                                {/* TOGGLE BUTTON */}
                                <button
                                    ref={toggleBtnRef}
                                    onClick={handleToggleMode}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        background: isHumanMode ? '#FFF' : '#000',
                                        color: isHumanMode ? '#000' : '#FFF',
                                        border: isHumanMode ? '2px solid #000' : 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '1px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isHumanMode ? 'none' : '0 10px 20px -5px rgba(0,0,0,0.3)',
                                        flexShrink: 0
                                    }}
                                >
                                    {buttonText}
                                </button>

                                <div>
                                    <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#999', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                        {isHumanMode ? 'QUÉ HACEMOS' : 'STACK TÉCNICO'}
                                    </h4>
                                    <p ref={servicesRef} style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                                        {servicesText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FIXED ACTION BUTTON (BOTTOM - MOBILE ONLY) */}
                    {/* FIXED ACTION BUTTON (BOTTOM) */}
                    <div style={{
                        position: isMobile ? 'absolute' : 'relative',
                        bottom: isMobile ? '1.5rem' : 'auto',
                        left: isMobile ? '1.5rem' : 'auto',
                        right: isMobile ? '1.5rem' : 'auto',
                        marginTop: isMobile ? '0' : 'auto',
                        zIndex: 20
                    }}>
                        <Link to={project.path || '/'} onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
                            <div
                                className="cta-button"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    color: '#FFF',
                                    background: '#000',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                }}
                            >
                                {project.ctaCopy || 'EXPLORA NUESTRO ALCANCE'}
                                <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>→</span>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
