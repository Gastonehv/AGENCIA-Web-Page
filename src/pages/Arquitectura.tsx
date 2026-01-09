import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractionGuide from '../components/InteractionGuide';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import NeuralDatacenter from '../components/infrastructure/NeuralDatacenter';

gsap.registerPlugin(ScrollTrigger);

// Mobile and Touch detection hook
const useTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(() => {
        if (typeof window !== 'undefined') {
            return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        }
        return false;
    });

    useEffect(() => {
        const checkTouch = () => {
            const hasTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
            setIsTouch(hasTouch);
        };
        checkTouch();
        window.addEventListener('touchstart', checkTouch, { once: true });
        return () => window.removeEventListener('touchstart', checkTouch);
    }, []);

    return isTouch;
};

// Global scroll state for 3D scene
const scrollState = {
    target: 0,
    current: 0
};

// Scene wrapper that reads scroll and passes to NeuralDatacenter
const SceneContent = () => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useFrame(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const rawProgress = window.scrollY / (maxScroll || 1);
        scrollState.current += (rawProgress - scrollState.current) * 0.05;
        setScrollProgress(scrollState.current);
    });

    return <NeuralDatacenter scrollProgress={scrollProgress} />;
};

// Animated stat counter for boot sequence
const AnimatedStat = ({ label, value, suffix = '', delay = 0 }: {
    label: string;
    value: string;
    suffix?: string;
    delay?: number;
}) => {
    const [displayValue, setDisplayValue] = useState('---');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsActive(true);
            // Simulate "booting" numbers
            let count = 0;
            const interval = setInterval(() => {
                count++;
                if (count < 5) {
                    setDisplayValue(Math.random().toString().slice(2, 5));
                } else {
                    setDisplayValue(value);
                    clearInterval(interval);
                }
            }, 80);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div style={{
            textAlign: 'center',
            opacity: isActive ? 1 : 0.3,
            transition: 'opacity 0.5s ease'
        }}>
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                fontWeight: 900,
                color: '#00FF99',
                textShadow: '0 0 20px rgba(0, 255, 153, 0.5)'
            }}>
                {displayValue}{suffix}
            </div>
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.15em',
                marginTop: '0.5rem'
            }}>
                {label}
            </div>
        </div>
    );
};

// Boot sequence terminal lines
const BootSequence = ({ isVisible }: { isVisible: boolean }) => {
    const [lines, setLines] = useState<string[]>([]);
    const bootLines = [
        '> INITIALIZING NEURAL CORE...',
        '> LOADING ARCHITECTURE MODULES...',
        '> CONNECTING NODE CLUSTER...',
        '> SYNC: 100% COMPLETE',
        '> SYSTEM ONLINE ////',
    ];

    useEffect(() => {
        if (!isVisible) return;
        let index = 0;
        const interval = setInterval(() => {
            if (index < bootLines.length) {
                setLines(prev => [...prev, bootLines[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <div style={{
            position: 'absolute',
            bottom: '15vh',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: '#00FF99',
            textAlign: 'left',
            opacity: 0.7,
            maxWidth: '400px',
            width: '90%'
        }}>
            {lines.map((line, i) => (
                <div key={i} style={{
                    marginBottom: '0.3rem',
                    animation: 'fadeSlideIn 0.3s ease forwards',
                    opacity: i === lines.length - 1 ? 1 : 0.5
                }}>
                    {line}
                </div>
            ))}
        </div>
    );
};

// --- Main Component ---
const Arquitectura: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const isTouch = useTouchDevice();
    const containerRef = useRef<HTMLDivElement>(null);
    const actionBtnRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Scroll Reset on Mount
    React.useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate Architecture Sections with enhanced effects
            const sections = document.querySelectorAll('.arch-section');
            sections.forEach((section) => {
                const title = section.querySelector('.arch-title');
                const text = section.querySelector('.arch-text');
                const decoration = section.querySelector('.blueprint-decoration');
                const terminal = section.querySelector('.terminal-prompt');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: 'center center',
                        end: '+=2500',
                        pin: true,
                        pinSpacing: false,
                        scrub: 1.5,
                        toggleActions: 'play reverse play reverse'
                    }
                });

                // Terminal prompt glitch in
                if (terminal) {
                    tl.fromTo(terminal,
                        { opacity: 0, x: -20, filter: 'blur(5px)' },
                        { opacity: 0.8, x: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out' }
                    );
                }

                tl.fromTo(decoration,
                    { opacity: 0, scale: 0.5 },
                    { opacity: 0.8, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
                    terminal ? '-=0.2' : 0
                );

                tl.fromTo(title,
                    { yPercent: 110, rotateX: -20, opacity: 0, transformOrigin: 'top center' },
                    { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, ease: 'power4.out' },
                    '-=0.3'
                );

                tl.fromTo(text,
                    { opacity: 0, y: 50, filter: 'blur(10px)' },
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
                    '-=1'
                );

                // Glitch exit effect
                tl.to([title, text, decoration, terminal],
                    { y: -100, opacity: 0, filter: 'blur(20px)', duration: 1, stagger: 0.1, ease: 'power2.in' },
                    '+=2'
                );
            });

            // Final Section Animation with dramatic reveal
            const tlFinal = gsap.timeline({
                scrollTrigger: {
                    trigger: '.final-copy-section',
                    start: 'center center',
                    end: '+=1500',
                    pin: true,
                    scrub: 1,
                    toggleActions: 'play reverse play reverse'
                }
            });

            tlFinal.fromTo('.final-line-1', { opacity: 0, y: 50, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power2.out' })
                .fromTo('.final-line-2', { opacity: 0, scale: 0.9, filter: 'blur(15px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out' }, '-=0.5')
                .fromTo('.final-line-3', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
                .to({}, { duration: 3 })
                .add('switch')
                .fromTo('.next-protocol-btn',
                    { autoAlpha: 0, y: 30 },
                    { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out', pointerEvents: 'auto' },
                    'switch'
                )
                .to('.interaction-hud', { autoAlpha: 0, duration: 0.2 }, 'switch');

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Magnetic button effect
    useEffect(() => {
        const el = actionBtnRef.current;
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(x * x + y * y);

            if (distance < 200) {
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
            } else {
                gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            <SEO
                title="Infraestructura Digital"
                description="Arquitectura de software y ecosistemas digitales soberanos. Aplicaciones escalables, SaaS y plataformas web de alta complejidad."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Infraestructura Digital",
                "provider": { "@type": "Organization", "name": "AgencIA" },
                "description": "Desarrollo de ecosistemas digitales optimizados para velocidad y escalabilidad extrema."
            }} />

            {/* Global Styles */}
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes glitchText {
                    0%, 100% { text-shadow: 0 0 20px rgba(0, 255, 153, 0.5); }
                    25% { text-shadow: 2px 0 20px rgba(255, 0, 100, 0.5), -2px 0 20px rgba(0, 255, 153, 0.5); }
                    50% { text-shadow: -2px 0 20px rgba(0, 229, 255, 0.5), 2px 0 20px rgba(143, 0, 255, 0.5); }
                    75% { text-shadow: 1px 0 20px rgba(0, 255, 153, 0.8); }
                }
                .terminal-prompt {
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                    color: #00FF99;
                    letter-spacing: 0.1em;
                    opacity: 0.6;
                }
                .glitch-title {
                    animation: glitchText 3s infinite;
                }
            `}</style>

            {/* Fixed WebGL Background */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: 1,
                pointerEvents: isTouch ? 'none' : 'auto'
            }}>
                <Canvas
                    camera={{ position: [0, 2, 12], fov: 60 }}
                    style={{ touchAction: 'auto', pointerEvents: isTouch ? 'none' : 'auto' }}
                >
                    <color attach="background" args={['#030308']} />
                    <fog attach="fog" args={['#030308', 10, 30]} />
                    <SceneContent />
                    {!isTouch && (
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={true}
                            autoRotate={false}
                            enableDamping={true}
                            dampingFactor={0.05}
                        />
                    )}
                </Canvas>
            </div>

            {/* Scan Line Effect */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #00FF99, transparent)',
                opacity: 0.3,
                animation: 'scanline 4s linear infinite',
                zIndex: 50,
                pointerEvents: 'none'
            }} />

            {/* Scrollable Content */}
            <div style={{
                height: '1600vh',
                position: 'relative',
                zIndex: 10,
                pointerEvents: isTouch ? 'auto' : 'none'
            }}>

                {/* Interaction HUD */}
                <div className="interaction-hud" style={{ position: 'fixed', bottom: '1rem', width: '100%', zIndex: 20 }}>
                    <InteractionGuide mode="both" />
                </div>

                {/* HERO - Neural Datacenter Boot Sequence */}
                <div style={{
                    position: 'absolute',
                    top: '0',
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff'
                }}>
                    {/* System Status Tag */}
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: '#00FF99',
                        letterSpacing: '0.3em',
                        marginBottom: '1rem',
                        opacity: 0.7
                    }}>
                        [ NEURAL CORE :: ACTIVE ]
                    </div>

                    {/* Main Title with Glitch Effect */}
                    <h1 className="glitch-title" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 6rem)',
                        textTransform: 'uppercase',
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        lineHeight: 0.9,
                        margin: 0,
                        color: '#fff',
                        textShadow: '0 0 20px rgba(0, 255, 153, 0.5)'
                    }}>
                        INFRAESTRUCTURA<br />
                        <span style={{ color: '#00FF99' }}>DIGITAL</span>
                    </h1>

                    {/* Stat Counters */}
                    <div style={{
                        display: 'flex',
                        gap: 'clamp(2rem, 5vw, 5rem)',
                        marginTop: '3rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        <AnimatedStat label="UPTIME" value="99.99" suffix="%" delay={500} />
                        <AnimatedStat label="NODES" value="∞" delay={800} />
                        <AnimatedStat label="LATENCY" value="<1" suffix="ms" delay={1100} />
                    </div>

                    {/* Boot Sequence Terminal */}
                    <BootSequence isVisible={true} />
                </div>

                {/* SECTION 1: Arquitectura de Software */}
                <div className="arch-section" style={{
                    position: 'absolute', top: '150vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="terminal-prompt" style={{ marginBottom: '0.5rem' }}>
                        $ ./deploy --architecture core
                    </div>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3, marginBottom: '1rem', color: '#00FF99',
                        fontSize: '0.8rem', letterSpacing: '0.2em'
                    }}>
                        {'{ ARCHITECTURE_CORE }'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 255, 153, 0.4)',
                            textWrap: 'balance'
                        }}>
                            APLICACIONES ESCALABLES<br />&amp; PLATAFORMAS WEB
                        </h2>
                    </div>
                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '0 auto', lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(3, 3, 8, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 255, 153, 0.1)',
                        borderLeft: '2px solid #00FF99',
                        textAlign: 'left',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }}>
                        Construimos <strong style={{ color: '#00FF99' }}>ecosistemas digitales soberanos</strong>:
                        desde aplicaciones que soportan millones de transacciones hasta portales corporativos
                        que cierran tratos antes del primer clic. Tu presencia es tu activo más valioso;
                        lo convertimos en una herramienta de dominio absoluto.
                    </p>

                    {/* HUMAN TRANSLATION - WHAT THIS MEANS IN PLAIN LANGUAGE */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(0, 255, 153, 0.08) 0%, rgba(0, 229, 255, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 255, 153, 0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Label */}
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#00FF99',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: '#00FF99',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #00FF99'
                            }} />
                            EN SIMPLE
                        </div>
                        {/* Human-friendly text */}
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300
                        }}>
                            No vendemos páginas; <strong style={{ color: '#fff', fontWeight: 600 }}>construimos el motor de tu negocio digital</strong>.
                            Software que funciona sin errores, Apps que la gente ama usar
                            y plataformas que escalan junto con tu ambición.
                        </p>
                        {/* Tech Stack Badges */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            marginTop: '1rem'
                        }}>
                            {['SaaS', 'Apps Multiplataforma', 'Ingeniería Headless'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#00FF99',
                                    background: 'rgba(0, 255, 153, 0.1)',
                                    border: '1px solid rgba(0, 255, 153, 0.3)',
                                    borderRadius: '20px',
                                    letterSpacing: '0.05em'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 2: SaaS & Plataformas */}
                <div className="arch-section" style={{
                    position: 'absolute', top: '550vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box'
                }}>
                    <div className="terminal-prompt" style={{ marginBottom: '0.5rem' }}>
                        $ saas-engine --init production
                    </div>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3, marginBottom: '1rem', color: '#8F00FF',
                        fontSize: '0.8rem', letterSpacing: '0.2em'
                    }}>
                        {'[ SAAS_ENGINE ]'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(143, 0, 255, 0.4)',
                            textWrap: 'balance'
                        }}>
                            MOTORES DE INGRESO<br />SOFTWARE AS A SERVICE
                        </h2>
                    </div>
                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '0 auto', lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(3, 3, 8, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(143, 0, 255, 0.1)',
                        borderRight: '2px solid #8F00FF',
                        textAlign: isMobile ? 'left' : 'right',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }}>
                        El software lento tiene un costo oculto: tu crecimiento. Forjamos
                        <strong style={{ color: '#8F00FF' }}> ecosistemas SaaS y aplicaciones empresariales</strong> que
                        trascienden el código tradicional. Creamos máquinas de control robustas que eliminan
                        los cuellos de botella para que tu única limitación sea tu propia ambición.
                    </p>

                    {/* HUMAN TRANSLATION - SECTION 2 */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(143, 0, 255, 0.08) 0%, rgba(0, 229, 255, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(143, 0, 255, 0.2)',
                        position: 'relative'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#8F00FF',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{
                                width: '6px', height: '6px',
                                background: '#8F00FF',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #8F00FF'
                            }} />
                            EN SIMPLE
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300
                        }}>
                            Es como tener un <strong style={{ color: '#fff', fontWeight: 600 }}>ejército digital trabajando para ti</strong>.
                            Un sistema que responde WhatsApp, agenda citas y maneja tus ventas sin que tengas que mover un dedo.
                            Eficiencia real, 24 horas al día.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                            {['Software a Medida', 'Aplicaciones Móviles', 'Páginas Ultrarrápidas'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#8F00FF',
                                    background: 'rgba(143, 0, 255, 0.1)',
                                    border: '1px solid rgba(143, 0, 255, 0.3)',
                                    borderRadius: '20px',
                                    letterSpacing: '0.05em'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Integración Total */}
                <div className="arch-section" style={{
                    position: 'absolute', top: '950vh', width: '100%', textAlign: 'center', color: '#fff',
                    padding: isMobile ? '0 3%' : '0 5%', boxSizing: 'border-box',
                    transform: isMobile ? 'translateY(-8vh)' : 'none'
                }}>
                    <div className="terminal-prompt" style={{ marginBottom: '0.5rem' }}>
                        $ connect --all-systems unified
                    </div>
                    <div className="blueprint-decoration" style={{
                        opacity: 0.3, marginBottom: '1rem', color: '#00E5FF',
                        fontSize: '0.8rem', letterSpacing: '0.2em'
                    }}>
                        {'< SYSTEM_UNITY />'}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 className="arch-title" style={{
                            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : 'clamp(1.8rem, 5vw, 6rem)',
                            letterSpacing: '0.05em',
                            marginBottom: isMobile ? '1rem' : '2rem',
                            textShadow: '0 0 50px rgba(0, 229, 255, 0.4)',
                            textWrap: 'balance'
                        }}>
                            CONVERGENCIA TOTAL<br />EL ORGANISMO UNIFICADO
                        </h2>
                    </div>
                    <p className="arch-text" style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: isMobile ? '0.85rem' : 'clamp(0.9rem, 1.5vw, 1.2rem)',
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '0 auto', lineHeight: 1.6,
                        color: '#ffffff',
                        background: 'rgba(3, 3, 8, 0.85)',
                        backdropFilter: 'blur(5px)',
                        padding: isMobile ? '1rem' : '2rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 229, 255, 0.1)',
                        borderBottom: '2px solid #00E5FF',
                        textAlign: isMobile ? 'left' : 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                    }}>
                        Un componente aislado no sostiene nada. Integramos APIs, capas de datos y servicios cloud
                        para crear un <strong style={{ color: '#00E5FF' }}>organismo digital vivo</strong>.
                        Conectamos cada fibra de tu negocio para que el frontend, el backend y tus herramientas
                        de gestión operen bajo un mismo pulso inteligente.
                    </p>

                    {/* HUMAN TRANSLATION - SECTION 3 */}
                    <div className="human-translation" style={{
                        maxWidth: isMobile ? 'calc(100vw - 2rem)' : '800px',
                        margin: '1.5rem auto 0',
                        padding: isMobile ? '1rem' : '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.08) 0%, rgba(0, 255, 153, 0.05) 100%)',
                        borderRadius: '8px',
                        border: '1px solid rgba(0, 229, 255, 0.2)',
                        position: 'relative'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            color: '#00E5FF',
                            letterSpacing: '0.2em',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            justifyContent: 'center'
                        }}>
                            <span style={{
                                width: '6px', height: '6px',
                                background: '#00E5FF',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px #00E5FF'
                            }} />
                            EN SIMPLE
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            lineHeight: 1.7,
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 300,
                            textAlign: 'center'
                        }}>
                            <strong style={{ color: '#fff', fontWeight: 600 }}>Todo conectado, todo funcionando</strong>.
                            Tu web, tu app, tu CRM, tus pagos y tu inventario hablando el mismo idioma.
                            Sin islas de información, sin caos. Un solo sistema que lo une todo.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                            {['APIs Conectadas', 'Cloud Nativo', 'Sistemas Unificados'].map((tag) => (
                                <span key={tag} style={{
                                    padding: '0.35rem 0.8rem',
                                    fontSize: '0.7rem',
                                    fontFamily: 'var(--font-mono)',
                                    color: '#00E5FF',
                                    background: 'rgba(0, 229, 255, 0.1)',
                                    border: '1px solid rgba(0, 229, 255, 0.3)',
                                    borderRadius: '20px',
                                    letterSpacing: '0.05em'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FINAL COPY SECTION */}
                <div className="final-copy-section" style={{
                    position: 'absolute', top: '1320vh', width: '100%', textAlign: 'center',
                    color: '#fff', padding: '0 2rem', boxSizing: 'border-box',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh',
                    transform: 'translateY(-10vh)'
                }}>
                    <h3 className="final-line-1" style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        fontWeight: 300, marginBottom: '1rem', opacity: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        No solo construimos software...
                    </h3>

                    <h1 className="final-line-2" style={{
                        fontSize: 'clamp(2.5rem, 8vw, 8rem)',
                        fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9,
                        marginBottom: '2rem',
                        background: 'linear-gradient(to bottom, #fff, #00FF99)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 30px rgba(0, 255, 153, 0.5))',
                        opacity: 0
                    }}>
                        FORJAMOS<br />ECOSISTEMAS.
                    </h1>

                    <p className="final-line-3" style={{
                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                        maxWidth: '800px', margin: '0 auto', opacity: 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)', lineHeight: 1.5
                    }}>
                        En AgencIA, cada línea de código es un ladrillo de tu imperio digital.<br />
                        <strong style={{ color: '#00FF99' }}>Arquitectura que escala. Sistemas que dominan.</strong>
                    </p>
                </div>

                {/* ELEGANT CTA */}
                <div className="action-bar" style={{
                    position: 'fixed', bottom: '3rem', left: '50%',
                    transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none'
                }}>
                    <a
                        ref={actionBtnRef}
                        href="/#case-infraestructura"
                        className="next-protocol-btn elegant-cta"
                        style={{
                            opacity: 0,
                            display: 'inline-flex', alignItems: 'center', gap: '1rem',
                            background: 'transparent', border: 'none',
                            color: '#00FF99',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
                            fontWeight: 500, letterSpacing: '0.25em',
                            textTransform: 'uppercase', textDecoration: 'none',
                            cursor: 'pointer', pointerEvents: 'none',
                            position: 'relative', padding: '0.5rem 0',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <span className="cta-underline" />
                        <span style={{ position: 'relative', zIndex: 2 }}>Continuar Exploración</span>
                        <span className="cta-arrow" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '50%',
                            border: '1px solid rgba(0, 255, 153, 0.3)',
                            fontSize: '0.9rem', position: 'relative', transition: 'all 0.4s ease'
                        }}>
                            →
                            <span className="arrow-glow" />
                        </span>
                    </a>

                    <style>{`
                        .elegant-cta { filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.2)); }
                        .elegant-cta:hover { color: #fff !important; filter: drop-shadow(0 0 30px rgba(0, 255, 153, 0.5)); }
                        .elegant-cta:hover .cta-arrow { background: rgba(0, 255, 153, 0.15); border-color: rgba(0, 255, 153, 0.6); transform: translateX(5px); }
                        .elegant-cta:hover .cta-underline { width: 100%; opacity: 1; }
                        .elegant-cta:hover .arrow-glow { opacity: 1; }
                        .cta-underline { position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, #00FF99, #00E5FF, #00FF99); background-size: 200% 100%; opacity: 0; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); animation: shimmer 3s infinite linear; }
                        .arrow-glow { position: absolute; inset: -2px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 255, 153, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.4s ease; animation: pulse-soft 2s infinite ease-in-out; }
                        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                        @keyframes pulse-soft { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.6; } }
                    `}</style>
                </div>

            </div>

        </div>
    );
};

export default Arquitectura;
