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
        impactTag?: string;
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
    const [isHumanMode, setIsHumanMode] = useState(false);

    // Reset mode when project changes
    useEffect(() => {
        setIsHumanMode(false);
    }, [project]);

    useEffect(() => {
        if (project) {
            // LOCK SCROLL
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();

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
                document.body.style.overflow = '';
                if (lenis) lenis.start();
            };
        }
    }, [project, lenis]);

    if (!project) return null;

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(contentRef.current, { y: 50, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
        tl.to(modalRef.current, { opacity: 0, backdropFilter: 'blur(0px)', duration: 0.3 }, "-=0.1");
    };

    const handleToggleMode = () => {
        const newMode = !isHumanMode;

        // Simple timeline for text transition
        const tl = gsap.timeline();

        tl.to([textRef.current, servicesRef.current], {
            opacity: 0,
            y: -5,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => setIsHumanMode(newMode)
        });

        tl.to([textRef.current, servicesRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    };

    // Derived Display Content
    const descriptionText = isHumanMode
        ? (project.humanDesc || project.fullDesc || project.desc)
        : (project.fullDesc || project.desc);

    const servicesText = isHumanMode
        ? (project.humanServices || project.services || 'Estrategia, Diseño, Desarrollo')
        : (project.services || 'Estrategia, Diseño, Desarrollo');

    const buttonText = isHumanMode
        ? '↩ VOLVER A MODO TÉCNICO'
        : (project.buttonCopy || 'TRADUCCIÓN A MODO HUMANO');

    return (
        <div
            ref={modalRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '5vw'
            }}
            onClick={handleClose}
        >
            <div
                ref={contentRef}
                style={{
                    width: '100%', maxWidth: '1400px', height: '85vh',
                    backgroundColor: '#FFF', borderRadius: '24px',
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* MAGNETIC CLOSE BUTTON */}
                <button
                    onClick={handleClose}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, rotate: 90, duration: 0.3 })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, rotate: 0, duration: 0.3 })}
                    style={{
                        position: 'absolute', top: '2rem', right: '2rem',
                        background: 'rgba(255,255,255,0.9)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        width: '48px', height: '48px', borderRadius: '50%',
                        cursor: 'pointer', zIndex: 30,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#000', fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    ✕
                </button>

                {/* HERO SECTION */}
                <div style={{ flex: '1.2', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
                    {project.video ? (
                        <video
                            src={project.video} autoPlay muted loop playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundImage: `url(${project.img})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.9 }} />
                    )}

                    {/* GRADIENT & TITLE */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', color: '#FFF' }}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 6rem)',
                            margin: 0,
                            lineHeight: 0.85,
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '-2px'
                        }}>
                            {project.title}
                        </h2>
                        <h3 style={{
                            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '2px',
                            opacity: 0.8,
                            marginTop: '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {project.subtitle}
                        </h3>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '3rem',
                        display: 'flex',
                        gap: '4rem',
                        height: '100%',
                        overflowY: 'auto'
                    }}>
                        {/* LEFT: DESCRIPTION */}
                        <div style={{ flex: 2 }}>
                            <p
                                ref={textRef}
                                style={{
                                    fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
                                    lineHeight: 1.5,
                                    color: isHumanMode ? '#000' : '#444',
                                    fontWeight: 400,
                                    marginBottom: '2rem',
                                    whiteSpace: 'pre-line' // Respect line breaks
                                }}
                            >
                                {descriptionText}
                            </p>

                            {/* TAGS (Just visual noise/decoration) */}
                            {!isHumanMode && (
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', opacity: 1 }}>
                                    {['HIGHER-ORDER COMPONENTS', 'WEBGL ACCELERATION', 'EDGE COMPUTING'].map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.65rem', border: '1px solid #999', color: '#000', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '4px', fontFamily: 'var(--font-mono)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: META & ACTIONS */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem',
                            borderLeft: '1px solid #f0f0f0',
                            paddingLeft: '3rem',
                            minWidth: '280px'
                        }}>
                            {/* TOGGLE BUTTON - CYBER PILL */}
                            <button
                                ref={toggleBtnRef}
                                onClick={handleToggleMode}
                                onMouseEnter={(e) => {
                                    gsap.to(e.currentTarget, { scale: 1.02, backgroundColor: isHumanMode ? '#EEE' : '#111', duration: 0.2 });
                                }}
                                onMouseLeave={(e) => {
                                    gsap.to(e.currentTarget, { scale: 1, backgroundColor: isHumanMode ? '#FFF' : '#000', duration: 0.2 });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: isHumanMode ? '#FFF' : '#000',
                                    color: isHumanMode ? '#000' : '#FFF',
                                    border: isHumanMode ? '2px solid #000' : 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    letterSpacing: '1px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isHumanMode ? 'none' : '0 10px 20px -5px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {buttonText}
                            </button>

                            <div>
                                <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    {isHumanMode ? 'QUÉ HACEMOS' : 'STACK TÉCNICO'}
                                </h4>
                                <p ref={servicesRef} style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, margin: 0 }}>
                                    {servicesText}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#999', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    IMPACTO / ALCANCE
                                </h4>
                                <p style={{ fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#00FF99' }}>
                                    {(project.impactTag || 'GLOBAL SCALE')}
                                </p>
                            </div>

                            <Link to={project.path || '/'} onClick={onClose} style={{ marginTop: 'auto', textDecoration: 'none' }}>
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
                                        transition: 'transform 0.2s ease, background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.backgroundColor = '#111';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.backgroundColor = '#000';
                                    }}
                                >
                                    {project.ctaCopy || 'EXPLORA NUESTRO ALCANCE'}
                                    <span style={{
                                        fontSize: '1.2rem',
                                        lineHeight: 0
                                    }}>→</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
