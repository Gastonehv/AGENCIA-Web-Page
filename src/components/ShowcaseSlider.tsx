import { useRef, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from './ProjectModal';
import { useScroll } from '../context/ScrollContext'; // Import useScroll
import techArchitectureImg from '../assets/images/architecture_digital.jpg';
import architectureVideo from '../assets/videos/arquitectura.mp4';
import automationVideo from '../assets/videos/automatización.mp4';
import identidadVideo from '../assets/videos/IDENTIDAD VISUAL.mp4';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSliderProps {
    initialHash?: string;
}

const CASES = [
    {
        id: '01',
        title: 'ARQUITECTURA DIGITAL',
        subtitle: 'Ingeniería de Software & SaaS',
        desc: 'Desarrollamos ecosistemas digitales soberanos: aplicaciones escalables, software SAS y plataformas web de alta complejidad.',
        fullDesc: 'Construimos infraestructura digital desde cero, optimizada para velocidad extrema y escalabilidad global. Dejamos atrás las limitaciones comerciales para entregar soluciones de ingeniería pura que dominan el mercado.',
        humanDesc: 'No vendemos páginas; construimos el motor de tu negocio digital. Software que funciona sin errores, Apps que la gente ama usar y plataformas que escalan junto con tu ambición.',
        services: 'SaaS, Apps Multiplataforma, Ingeniería Headless',
        humanServices: 'Software a medida, Aplicaciones móviles, Páginas ultrarrápidas',
        buttonCopy: 'TRADUCCIÓN PARA HUMANOS',
        year: '2025',
        img: techArchitectureImg,
        video: architectureVideo,
        path: '/arquitectura',
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
        title: 'IDENTIDAD VISUAL',
        subtitle: 'Maestría Estética & Clase Mundial',
        desc: 'Diseño que define autoridad. Creamos marcas que no solo se ven bien, sino que imponen su presencia en el mercado.',
        fullDesc: 'Aquí nos ponemos el sombrero de señores en la materia. Forjamos identidades visuales que trascienden lo convencional, utilizando motion graphics de alta fidelidad y un lenguaje estético exclusivo que garantiza el reconocimiento de marca instantáneo.',
        humanDesc: 'Tu marca es tu firma en el mundo. No hacemos logos mediocres; creamos identidades que inspiran respeto y confianza. Es el arte de verse como el líder, antes de decir una sola palabra.',
        services: 'Branding de Autoridad, UI/UX de Lujo, Motion Pro',
        humanServices: 'Marca de impacto, Diseño premium, Animaciones elegantes',
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
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
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

    useEffect(() => {
        let scrollTimeline: gsap.core.Timeline;

        const ctx = gsap.context(() => {
            if (!sliderRef.current || !containerRef.current) return;

            // 1. CLEANUP: Only kill previous instances of THIS component's triggers
            ScrollTrigger.getById('showcase-scroll')?.kill();
            ScrollTrigger.getAll().filter(st => st.vars.id?.startsWith('parallax-')).forEach(st => st.kill());

            const totalWidth = sliderRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;

            // 2. TIMELINE: Horizontal Scroll + Dead Scroll
            const isMobile = window.innerWidth <= 768;
            scrollTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => isMobile ? `+=${totalWidth + viewportWidth * 2.5}` : `+=${totalWidth + viewportWidth * 1.0}`, // Adjusted for shorter delay
                    pin: true,
                    scrub: isMobile ? 1.5 : 1,
                    invalidateOnRefresh: true,
                    id: 'showcase-scroll'
                }
            });

            // Add delay/pause before movement starts (reduced to half)
            scrollTimeline.to({}, { duration: 0.25 });

            scrollTimeline.to(sliderRef.current, {
                x: () => -(totalWidth - viewportWidth),
                ease: "none",
                duration: 1
            });

            scrollTimeline.to({}, { duration: 0.15 }); // Reduced from 0.35 for Snappier transition

            // 3. PARALLAX
            imagesRef.current.forEach((img, i) => {
                if (!img || !cardsRef.current[i]) return;
                gsap.fromTo(img,
                    { xPercent: -15 }, // Reduced slightly for safety
                    {
                        xPercent: 15,
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

            // 4. RESPONSIVE
            const mm = gsap.matchMedia();
            mm.add({
                isMobile: "(max-width: 768px)",
                isTablet: "(min-width: 769px) and (max-width: 1024px)",
                isLaptop: "(min-width: 1025px) and (max-width: 1440px)",
                isDesktop: "(min-width: 1441px)"
            }, (context) => {
                const { isMobile, isTablet, isLaptop } = context.conditions as { isMobile: boolean, isTablet: boolean, isLaptop: boolean };

                if (isMobile) {
                    gsap.set('.showcase-card', { minWidth: '85vw', marginRight: '5vw' });
                    gsap.set('.showcase-headline', { minWidth: '90vw', marginRight: '5vw' });
                    gsap.set(sliderRef.current, { paddingLeft: '5vw', gap: 0 });
                } else if (isTablet) {
                    // iPad Pro / Small Laptops
                    gsap.set('.showcase-card', { minWidth: '45vw', marginRight: '0' });
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '6vw', gap: '4vw' });
                } else if (isLaptop) {
                    // Standard Laptops (1366x768, 1440x900) - Tighter distribution
                    gsap.set('.showcase-card', { minWidth: '40vw', marginRight: '0' });
                    gsap.set('.showcase-headline', { minWidth: '35vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '8vw', gap: '4vw' });
                } else {
                    // Large Screens
                    gsap.set('.showcase-card', { minWidth: '50vw', marginRight: '0' });
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '10vw', gap: '5vw' });
                }
                ScrollTrigger.refresh();
            });
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
        <div ref={containerRef} style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#FFF' }}>
            <div
                ref={sliderRef}
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
                        EJECUCIÓN<br />
                        <span style={{ color: '#CCC' }}>/// SISTEMAS DE VALOR</span>
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
                        className="showcase-card"
                        onClick={() => setActiveProject(item)} // OPEN MODAL
                        style={{
                            textDecoration: 'none',
                            minWidth: isMobile ? '85vw' : '50vw',
                            height: isMobile ? '80vh' : '80%',
                            alignSelf: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            padding: isMobile ? '1.5rem' : '2rem',
                            backgroundColor: '#FFFFFF',
                            cursor: 'none',
                            flexShrink: 0, // CRITICAL: Prevent card shrinking on mobile/smaller screens
                            transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            zIndex: highlightedIndex === i || hoveredIndex === i ? 10 : 2,
                            boxShadow: highlightedIndex === i
                                ? '0 0 100px rgba(0, 255, 153, 0.6)' // Doubled intensity
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
                            style={{
                                width: '100%',
                                height: '50vh',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                marginBottom: '2rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                            {/* MEDIA CONTENT (VIDEO OR IMAGE) */}
                            {item.video ? (
                                <video
                                    ref={el => { imagesRef.current[i] = el; }}
                                    src={item.video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{
                                        width: '170%', // Increased for total parallax coverage
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        left: '-35%', // Recalculated center
                                        willChange: 'transform'
                                    }}
                                />
                            ) : (
                                <div
                                    ref={el => { imagesRef.current[i] = el; }}
                                    style={{
                                        width: '170%', // Increased for total parallax coverage
                                        height: '100%',
                                        backgroundImage: `url(${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'absolute',
                                        left: '-35%'
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

                {/* END SPACER */}
                <div style={{ minWidth: '10vw' }} />
            </div>

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
