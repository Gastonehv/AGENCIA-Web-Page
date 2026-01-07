import { useRef, useState, useEffect, useLayoutEffect } from 'react';
// import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from './ProjectModal';
import { useScroll } from '../context/ScrollContext'; // Import useScroll
import techArchitectureImg from '../assets/images/architecture_digital.jpg';
import architectureVideo from '../assets/videos/arquitectura.mp4';
import automationVideo from '../assets/videos/automatizacion.mp4';
import identidadVideo from '../assets/videos/IDENTIDAD VISUAL.mp4';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSliderProps {
    initialHash?: string;
}

const CASES = [
    {
        id: '01',
        title: 'INFRAESTRUCTURA',
        subtitle: 'Arquitectura de Software & Ecosistemas',
        desc: 'Desarrollamos ecosistemas digitales soberanos: aplicaciones escalables, software SAS y plataformas web de alta complejidad.',
        fullDesc: 'Construimos infraestructura digital desde cero, optimizada para velocidad extrema y escalabilidad global. Dejamos atrás las limitaciones comerciales para entregar soluciones de ingeniería pura que dominan el mercado.',
        humanDesc: 'No vendemos páginas; construimos el motor de tu negocio digital. Software que funciona sin errores, Apps que la gente ama usar y plataformas que escalan junto con tu ambición.',
        services: 'SaaS, Apps Multiplataforma, Ingeniería Headless',
        humanServices: 'Software a medida, Aplicaciones móviles, Páginas ultrarrápidas',
        buttonCopy: 'TRADUCCIÓN PARA HUMANOS',
        year: '2025',
        img: techArchitectureImg,
        video: architectureVideo,
        path: '/infraestructura',
        ctaCopy: 'CONOCE NUESTRA INGENIERÍA'
    },
    {
        id: '02',
        title: 'AUTOMATIZACIÓN',
        subtitle: 'Eficiencia Imposible // Plataforma 360',
        desc: 'El control total de tu empresa en un solo lugar. CRM, Chatbots inteligentes y flujos autónomos que operan 24/7.',
        fullDesc: 'Implementamos la "Plataforma 360", un ecosistema de gestión total que integra CRM, ventas y atención al cliente. Nuestros agentes autónomos resuelven, agendan y venden mientras tu equipo se enfoca en la estrategia.',
        humanDesc: 'Es como tener un ejército digital trabajando para ti. Un sistema que responde WhatsApp, agenda citas y maneja tus ventas sin que tengas que mover un dedo. Eficiencia real, 24 horas al día.',
        services: 'Ecosistema 360, Agentes Autónomos, Flujos CRM',
        humanServices: 'Vendedor digital, Oficina automática, Todo conectado',
        buttonCopy: 'MODO MENOS TÉCNICO',
        year: '2025',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
        video: automationVideo,
        path: '/automatizacion',
        ctaCopy: 'CONOCE EL ECOSISTEMA'
    },
    {
        id: '03',
        title: 'IDENTIDAD',
        subtitle: 'Estética & Experiencia Multisensorial',
        desc: 'Diseño que se siente. Creamos marcas que no solo se ven bien, sino que provocan una respuesta visceral en el mercado.',
        fullDesc: 'Trasscendemos lo visual para diseñar experiencias multisensoriales completas. Forjamos identidades que respiran, se mueven y comunican autoridad a través de cada píxel, sonido y micro-interacción.',
        humanDesc: 'Tu marca es tu firma en el mundo. No hacemos logos estáticos; creamos sistemas vivos que inspiran respeto y confianza. Es el arte de verse (y sentirse) como el líder.',
        services: 'Branding Multisensorial, UI/UX de Lujo, Motion Pro',
        humanServices: 'Marca sensorial, Diseño premium, Animaciones elegantes',
        buttonCopy: 'MODO SENCILLO',
        year: '2025',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        video: identidadVideo,
        path: '/identidad',
        ctaCopy: 'CONOCE EL ARTE'
    },
];

const ShowcaseSlider: React.FC<ShowcaseSliderProps> = ({ initialHash }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [activeProject, setActiveProject] = useState<any>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([]); // New ref for the outer card
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]); // Keeps existing ref for image window (Parallax)
    // Fix: Allow both Div and Video elements for the parallax target
    const imagesRef = useRef<(HTMLElement | null)[]>([]);

    const { lenis } = useScroll(); // Need Lenis for precision scrolling

    // Floating Indicator State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);

    // Track Mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animate Indicator Position (Magnetic Smoothing)
    useEffect(() => {
        if (indicatorRef.current && isHovering) {
            gsap.to(indicatorRef.current, {
                x: mousePos.x,
                y: mousePos.y,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true
            });
        }
    }, [mousePos, isHovering]);

    // 4. RESPONSIVE LAYOUT STATE
    const [cardWidth, setCardWidth] = useState('30vw'); // Start Small

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w <= 768) setCardWidth('85vw');
            else if (w <= 1024) setCardWidth('45vw');
            else if (w <= 1440) setCardWidth('30vw');
            else setCardWidth('30vw');
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // CHANGED TO useLayoutEffect TO PREVENT JUMPS
    useLayoutEffect(() => {
        let scrollTimeline: gsap.core.Timeline;

        const ctx = gsap.context(() => {
            if (!sliderRef.current || !containerRef.current) return;

            // 1. CLEANUP
            ScrollTrigger.getById('showcase-scroll')?.kill();
            ScrollTrigger.getAll().filter(st => st.vars.id?.startsWith('parallax-')).forEach(st => st.kill());

            // 2. APPLY STYLES FIRST (MatchMedia)
            // Critical: Apply styles BEFORE calculating width
            const mm = gsap.matchMedia();
            mm.add({
                isMobile: "(max-width: 768px)",
                isTablet: "(min-width: 769px) and (max-width: 1024px)",
                isLaptop: "(min-width: 1025px) and (max-width: 1440px)",
                isDesktop: "(min-width: 1441px)"
            }, (context) => {
                const { isMobile, isTablet, isLaptop } = context.conditions as { isMobile: boolean, isTablet: boolean, isLaptop: boolean };

                if (isMobile) {
                    gsap.set('.showcase-headline', { minWidth: '90vw', marginRight: '5vw' });
                    gsap.set(sliderRef.current, { paddingLeft: '5vw', gap: 0 });
                } else if (isTablet) {
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '6vw', gap: '4vw' });
                } else if (isLaptop) {
                    gsap.set('.showcase-headline', { minWidth: '35vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '8vw', gap: '4vw' });
                } else {
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '10vw', gap: '5vw' });
                }
            });

            // 3. FORCE RECALCULATION
            // Helper to get true width after styles applied
            const getScrollWidth = () => sliderRef.current?.scrollWidth || 0;
            const getViewportWidth = () => window.innerWidth;

            // 4. TIMELINE

            // 4. TIMELINE (DESKTOP ONLY)
            // Use existing 'mm' from line 148

            // DESKTOP: Horizontal Scroll logic
            mm.add("(min-width: 769px)", () => {
                const viewportWidth = getViewportWidth();
                const totalScrollWidth = getScrollWidth();
                const maxScroll = -(totalScrollWidth - viewportWidth);

                scrollTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: () => `+=${totalScrollWidth + viewportWidth * 4.0}`,
                        pin: true,
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                        id: 'showcase-scroll'
                    }
                });

                // ... (Logic continues inside) ...

                // 1. Initial Headline Pause
                scrollTimeline.to({}, { duration: viewportWidth * 1.0 });

                let currentX = 0;
                cardContainerRefs.current.forEach((card, i) => {
                    if (!card) return;
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    let targetX = (viewportWidth / 2) - cardCenter;
                    if (targetX > 0) targetX = 0;
                    if (targetX < maxScroll) targetX = maxScroll;
                    const distance = Math.abs(targetX - currentX);
                    if (distance > 0) {
                        scrollTimeline.to(sliderRef.current, {
                            x: targetX, ease: "none", duration: distance
                        });
                    }
                    let pauseDuration = i === 0 ? viewportWidth * 0.9 : viewportWidth * 0.5;
                    scrollTimeline.to({}, { duration: pauseDuration });
                    currentX = targetX;
                });

                if (currentX > maxScroll) {
                    scrollTimeline.to(sliderRef.current, {
                        x: maxScroll, ease: "none", duration: Math.abs(maxScroll - currentX)
                    });
                }
                scrollTimeline.to({}, { duration: 0.15 });

                // PARALLAX (Desktop Only)
                imagesRef.current.forEach((img, i) => {
                    if (!img || !cardsRef.current[i]) return;
                    gsap.fromTo(img,
                        { xPercent: -30 },
                        {
                            xPercent: 30,
                            ease: "none",
                            force3D: true,
                            scrollTrigger: {
                                trigger: cardsRef.current[i],
                                containerAnimation: scrollTimeline,
                                start: "left right",
                                end: "right left",
                                scrub: true,
                                id: `parallax-${i}`
                            }
                        }
                    );
                });
            });

            // MOBILE: No GSAP Pinning/Scroll - Native Vertical Stack
            // (Handled via CSS injected below)



            // Refresh to ensure all start/end points are correct with new styles
            ScrollTrigger.refresh();

        }, containerRef);

        // 5. DEEP LINKING
        if (initialHash && initialHash.startsWith('#case-') && lenis) {
            setTimeout(() => {
                ScrollTrigger.refresh();
                const st = ScrollTrigger.getById('showcase-scroll');
                if (!st || !sliderRef.current) return;

                const targetId = initialHash.replace('#case-', '');
                const targetIndex = CASES.findIndex(c => c.id === targetId);
                const card = cardsRef.current[targetIndex];

                if (card) {
                    setHighlightedIndex(targetIndex);
                    setTimeout(() => setHighlightedIndex(null), 6000); // Doubled from 3s to 6s

                    const totalWidth = sliderRef.current.scrollWidth;
                    const viewportWidth = window.innerWidth;
                    const maxTrans = totalWidth - viewportWidth;
                    const cardOffset = card.offsetLeft;
                    let targetTrans = -(cardOffset - (viewportWidth - card.offsetWidth) / 2);

                    if (targetTrans > 0) targetTrans = 0;
                    if (targetTrans < -maxTrans) targetTrans = -maxTrans;

                    const progressInTimeline = (targetTrans / -maxTrans) * (1 / 1.8);
                    const targetScrollY = st.start + (progressInTimeline * (st.end - st.start));
                    lenis.scrollTo(targetScrollY, { duration: 2, force: true });
                }
            }, 800);
        }

        return () => ctx.revert();
    }, [initialHash, lenis]);

    return (
        <div ref={containerRef} className="showcase-slider-container" style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#FFF' }}>
            <div
                ref={sliderRef}
                className="showcase-track"
                style={{
                    display: 'flex',
                    height: '100%',
                    width: 'fit-content',
                    // Inline defaults (Desktop) - Overridden by GSAP logic above
                    paddingLeft: '10vw',
                    gap: '5vw'
                }}
            >
                {/* HEADLINE CARD */}
                <div className="showcase-headline" style={{
                    minWidth: '40vw',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 8rem)',
                        lineHeight: 0.9,
                        color: '#000',
                        marginBottom: '2rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        textShadow: '0px 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        INGENIERÍA<br />
                        <span style={{ color: '#CCC' }}>/// CREATIVA</span>
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                        maxWidth: '500px',
                        fontFamily: 'var(--font-mono)',
                        color: '#555'
                    }}>
                        Construimos infraestructura que piensa, escala y domina.
                    </p>
                </div>

                {/* CASE CARDS */}
                {CASES.map((item, i) => (
                    <div
                        key={i}
                        ref={el => { cardContainerRefs.current[i] = el; }} // OUTER REFERENCE FOR POSITIONING
                        className="showcase-card"
                        onClick={() => setActiveProject(item)} // OPEN MODAL
                        style={{
                            textDecoration: 'none',
                            width: cardWidth, // Strict Width
                            maxWidth: cardWidth, // Prevent expansion
                            minWidth: cardWidth, // Prevent shrinking
                            height: isMobile ? 'auto' : '80%', // AUTO on mobile to prevent clipping
                            alignSelf: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            padding: isMobile ? '1.5rem' : '2rem',
                            backgroundColor: '#FFFFFF',
                            cursor: 'none',
                            flexShrink: 0,
                            transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            zIndex: highlightedIndex === i || hoveredIndex === i ? 10 : 2,
                            boxShadow: highlightedIndex === i
                                ? '0 0 100px rgba(0, 255, 153, 0.6)'
                                : (hoveredIndex === i ? '0 40px 80px rgba(0,0,0,0.3)' : '0 30px 60px rgba(0,0,0,0.1)'),
                            border: highlightedIndex === i ? '2px solid #00FF99' : '1px solid rgba(0,0,0,0.05)',
                            animation: highlightedIndex === i ? 'landingFlash 1.5s infinite alternate' : 'none',
                            transform: hoveredIndex === i && !isMobile ? 'translateY(-10px) scale(1.02)' : 'none',
                            borderRadius: '24px'
                        }}
                        onMouseEnter={() => {
                            setIsHovering(true);
                            setHoveredIndex(i);
                        }}
                        onMouseLeave={() => {
                            setIsHovering(false);
                            setHoveredIndex(null);
                        }}
                    >
                        {/* PARALLAX IMAGE WINDOW */}
                        <div
                            ref={el => { cardsRef.current[i] = el; }}
                            className="showcase-media-window"
                            style={{
                                width: '100%',
                                height: isMobile ? '250px' : '55%', // Fixed height on mobile
                                overflow: 'hidden',
                                borderRadius: '16px',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                flexShrink: 0
                            }}>
                            {item.video ? (
                                <video
                                    ref={el => { imagesRef.current[i] = el; }}
                                    src={item.video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    webkit-playsinline="true"
                                    preload="auto"
                                    poster={item.img}
                                    className="showcase-video"
                                    style={{
                                        width: isMobile ? '100%' : '250%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: isMobile ? 'relative' : 'absolute',
                                        left: isMobile ? '0' : '-75%',
                                        willChange: 'transform'
                                    }}
                                />
                            ) : (
                                <div
                                    ref={el => { imagesRef.current[i] = el; }}
                                    className="showcase-image"
                                    style={{
                                        width: isMobile ? '100%' : '250%',
                                        height: '100%',
                                        backgroundImage: `url(${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: isMobile ? 'relative' : 'absolute',
                                        left: isMobile ? '0' : '-75%'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'flex-start',
                            justifyContent: 'space-between',
                            gap: isMobile ? '1rem' : '0'
                        }}>
                            <div>
                                <h3 className="showcase-title" style={{
                                    fontSize: isMobile ? '1.8rem' : '2.5rem',
                                    fontWeight: 800,
                                    margin: '0 0 0.5rem 0',
                                    color: '#000',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-1px',
                                    lineHeight: 1
                                }}>{item.title}</h3>
                                <p className="showcase-subtitle" style={{
                                    fontSize: isMobile ? '0.8rem' : '1rem',
                                    color: '#888',
                                    margin: 0,
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>{item.subtitle}</p>
                            </div>
                            <span style={{
                                fontSize: isMobile ? '2.5rem' : '4rem',
                                fontWeight: 900,
                                color: '#AAAAAA',
                                lineHeight: 0.8,
                                alignSelf: isMobile ? 'flex-end' : 'flex-start',
                                opacity: 0.4
                            }}>{item.id}</span>
                        </div>
                        <p style={{
                            marginTop: 'auto',
                            paddingTop: '2rem',
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                            color: '#444'
                        }}>
                            {item.desc}
                        </p>
                    </div>
                ))}

                <div style={{ minWidth: '10vw' }} />
            </div>

            <style>{`
                @media (max-width: 768px) {
                    /* FORCE VERTICAL STACK ON MOBILE */
                    .showcase-slider-container {
                        height: auto !important;
                        overflow: visible !important;
                         background-color: #FFF !important;
                    }
                    .showcase-track {
                        flex-direction: column !important;
                        width: 100% !important;
                        height: auto !important;
                        padding: 100px 5vw 50px 5vw !important;
                        gap: 2rem !important;
                        transform: none !important; /* Kill GSAP transform */
                    }
                    .showcase-headline {
                        min-width: 100% !important;
                        height: auto !important;
                        margin-bottom: 2rem !important;
                        margin-right: 0 !important;
                        align-items: flex-start !important;
                    }
                    .showcase-card {
                        width: 100% !important;
                        max-width: 100% !important;
                        min-width: 100% !important;
                        height: auto !important;
                        min-height: auto !important;
                        aspect-ratio: auto !important;
                        margin: 0 !important;
                        padding: 1.5rem !important;
                    }
                    .showcase-media-window {
                        height: 200px !important;
                        min-height: 200px !important;
                    }
                    .showcase-video, .showcase-image {
                        width: 100% !important;
                        height: 100% !important;
                        left: 0 !important;
                        position: relative !important;
                        object-fit: cover !important;
                    }
                }
            `}</style>

            {/* PROJECT MODAL */}
            <ProjectModal
                key={activeProject?.id || 'none'}
                project={activeProject}
                onClose={() => setActiveProject(null)}
            />

            {/* FLOATING CASE INDICATOR (Desktop Only) */}
            <div
                ref={indicatorRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#000',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0.8,
                    mixBlendMode: 'normal',
                    transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span>VER PROYECTO</span>
                    <span style={{ fontSize: '1.2rem', color: '#00FF99' }}>→</span>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseSlider;
