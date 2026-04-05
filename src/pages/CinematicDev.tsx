import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import essenceHeroVideo from '../assets/videos/esencia_hero_ultra.mp4'; // IMPORTACIÓN DE VIDEO
import EssenceBackground from '../components/EssenceBackground';
import officialTypography from '../assets/logos/agencia_typography_official.png';
import NeuralNetworkALMA from '../components/NeuralNetworkALMA';

gsap.registerPlugin(ScrollTrigger);

const CinematicDev: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // RUTAS DEL LOGOTIPO (Vectores "AGENCIA")
    const logoPaths = [
        "449.17,2442.5 90.53,2442.5 1043.39,157.04 1992.73,2442.5 1637.6,2442.5 1043.39,1025.52", // A
        "M3825.9 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,215.66 72.66,400.84 218,555.54 145.33,154.71 321.13,232.07 527.41,232.07 119.54,0 234.99,-30.47 346.33,-91.43 111.35,-60.95 203.35,-145.33 276.01,-253.15l80.88 -116.04 -397.32 -348.09 235.58 -270.75 559.06 488.74c-77.35,285.97 -216.24,515.7 -416.65,689.15 -200.42,173.46 -428.37,260.2 -683.87,260.2 -304.74,0 -564.92,-111.93 -780.58,-335.79 -215.66,-223.86 -323.48,-494.01 -323.48,-810.46 0,-314.11 107.82,-582.5 323.48,-805.18 215.66,-222.69 475.84,-334.03 780.58,-334.03 215.65,0 416.07,59.78 601.25,179.32l-242.61 274.26c-107.82,-60.95 -227.38,-91.43 -358.64,-91.43z", // G
        "6253.29,515.69 6253.29,1120.45 6995.18,1120.45 6995.18,1479.09 6253.29,1479.09 6253.29,2083.86 7297.56,2083.86 7297.56,2442.5 5894.64,2442.5 5894.64,157.04 7297.56,157.04 7297.56,515.69", // E
        "9999.2,2438.98 8687.7,1074.74 8687.7,2442.5 8329.06,2442.5 8329.06,157.04 9640.56,1531.83 9640.56,157.04 9999.2,157.04", // N
        "M12138.27 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,218 72.66,403.77 218,557.3 145.33,153.54 321.13,230.31 527.41,230.31 128.92,0 248.47,-31.65 358.64,-94.93l242.61 274.25c-180.5,119.54 -380.91,179.32 -601.25,179.32 -304.74,0 -564.92,-111.34 -780.58,-334.03 -215.66,-222.69 -323.48,-491.08 -323.48,-805.18 0,-316.44 107.82,-586.6 323.48,-810.46 215.66,-223.86 475.84,-335.79 780.58,-335.79 220.34,0 420.75,59.78 601.25,179.32l-242.61 277.77c-105.48,-63.28 -225.03,-94.93 -358.64,-94.93z", // C
        "13718.27,2442.5 13718.27,157.04 14076.92,157.04 14076.92,2442.5", // I
        "15375.63,2442.5 15016.99,2442.5 15969.85,157.04 16919.2,2442.5 16564.07,2442.5 15969.85,1025.52" // A
    ];

    // Referencia para el fondo
    const bgRef = useRef<HTMLDivElement>(null);
    // Referencia para la capa roja intermedia
    const redLayerRef = useRef<HTMLDivElement>(null);

    // Referencia para la ventana contenedora
    const windowRef = useRef<HTMLDivElement>(null);

    // Referencia para el grupo SVG que vamos a escalar
    const maskGroupRef = useRef<SVGSVGElement>(null);

    // --- CAMPO DE PARTICULAS MAGNETICAS (APAGADO) ---

    React.useEffect(() => {
        const ctx = gsap.context(() => {
            // Animación de Fondo (Ciclo de Color) - MANTENIDA
            gsap.to(bgRef.current, {
                backgroundColor: '#89CFF0',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                keyframes: [
                    { backgroundColor: '#A7C7E7', duration: 2 },
                    { backgroundColor: '#B0E0E6', duration: 2 },
                    { backgroundColor: '#89CFF0', duration: 2 },
                    { backgroundColor: '#ADD8E6', duration: 2 }
                ]
            });

            // --- 1. ANIMACIÓN DE ZOOM DEL PORTAL (SCROLL) ---
            const tlZoom = gsap.timeline({
                scrollTrigger: {
                    trigger: '.cinematic-content', // Solo el cap 1
                    start: 'top top',
                    end: '+=1000%', // Duración extendida para dar tiempo a la IA de salir completamente
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // 1. Zoom Infinito de la Máscara
            tlZoom.to(maskGroupRef.current, {
                scale: 150, // Crecimiento masivo para "atravesar"
                // Coordenadas calculadas del centro de la N (9164, 1299) sobre el viewBox (17009, 2588)
                // X: 9164/17009 = 53.8%
                // Y: 1299/2588 = 50.1%
                transformOrigin: "53.8% 50.1%",
                ease: "power2.inOut",
                duration: 1
            });

            // 2. Desvanecimiento de la Capa Roja
            tlZoom.to(redLayerRef.current, {
                autoAlpha: 0, // Se desvanece hasta ser invisible
                ease: "power1.out",
                duration: 0.6 // Un poco más rápido para revelar la ventana antes
            }, "<"); // "<" = Inicia al mismo tiempo que el inicio del zoom

            // 3. Aparición/Acercamiento de la Ventana
            tlZoom.fromTo(windowRef.current,
                { scale: 0.4 },
                { scale: 0.8, duration: 1, ease: "power2.inOut" },
                "<"
            );

            // 4. Secuencia de TEXTO (NUESTRA -> ESENCIA)
            // Aparecen con estilo cinemático (Blur + Fade + Scale)
            tlZoom.to('.text-nuestra', {
                autoAlpha: 1, y: 0,
                duration: 0.8, ease: "power2.out"
            }, "-=0.4");

            tlZoom.to('.text-esencia', {
                autoAlpha: 1, scale: 1, filter: 'blur(0px)',
                duration: 1, ease: "power2.out"
            }, ">-0.6");

            // 5. TRANSFORMACIÓN: "NUESTRA ESENCIA" -> "NUESTRA IA"
            // "ESENC" se desvanece lentamente
            tlZoom.to('.word-esenc', {
                width: 0, // CRÍTICO: Libera el espacio físico para que "IA" se centre al 100%
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.inOut"
            }, ">+0.5"); // Pequeña pausa para leer "ESENCIA" completo antes de borrarlo

            // "IA" se vuelve Verde Radiactivo con efecto de TUBOS DE NEÓN
            tlZoom.to('.hero-char-ia', {
                color: '#00FF99', // Color base
                textShadow: 'none', // Limpio, sin halo difuminado excesivo
                WebkitTextStroke: '0px',
                scale: 1.15, // Poco más de peso
                duration: 1.5,
                ease: "power2.out"
            }, "<"); // Al mismo tiempo que ESENC desaparece

            // Desaparecer la red neuronal / capa de esencia de fondo (Como en original)
            tlZoom.to(".essence-dev-wrapper", {
                opacity: 0,
                autoAlpha: 0,
                duration: 1,
                ease: 'power1.in'
            }, "<");

            // ALINEACIÓN PERFECTAMENTE MILIMÉTRICA: "NUESTRA" se acopla con "IA"
            tlZoom.to('.text-nuestra', {
                y: '0%', // Baja para alinear al centro de IA
                x: '0%', // Desplazamiento fino horizontal ajustado
                scale: 1.05, // Ligeramente crecido para presencia
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");

            // Pausa dramática para asimilar "NUESTRA IA"
            tlZoom.to({}, { duration: 1.5 });

            // 6. EL DESPLIEGUE CONTINÚA: "NUESTRA" se despide
            tlZoom.to('.text-nuestra', {
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.2,
                ease: "power2.inOut"
            });

            // 7. EL PORTAL FINAL: "IA" SE CONVIERTE EN LA PUERTA AL SIGUIENTE NIVEL
            // IA Crece masivamente
            tlZoom.to('.hero-char-ia', {
                scale: 300, // Zoom infinito estilo Nolan (Túnel masivo para atravesar)
                filter: 'blur(0px)',
                opacity: 0, // Se desvanece al cruzar
                duration: 2.5, // Prolongado
                ease: "expo.in" // Aceleración masiva al final
            }, ">"); // En vez de "8.5" absoluto que generaba huecos en blanco

            // SIMULTÁNEO: La ventana de video se desvanece y desaparece para revelar el fondo blanco
            tlZoom.to(windowRef.current, {
                autoAlpha: 0,
                scale: 0.9, // Ligera contracción mientras desaparece
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.in"
            }, "<0.2"); // Empieza un poco después de que inicie el zoom de IA

            // SIMULTÁNEO: El fondo y sus destellos iridiscentes pasan a Blanco Sólido impoluto
            tlZoom.to('.iridescent-layer', {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");

            // Opacidad final para limpieza profunda y colapso para empalmar con Identidad
            tlZoom.to('.cinematic-content', {
                autoAlpha: 0,
                duration: 1,
                ease: "power2.in"
            }, ">=-0.5"); // Se desvanece DESPUES de que IA haya crecido

            // --- 2. REVELACIÓN DE IDENTIDAD (El Efecto Entropy / Nolan) ---
            const tlIdentidad = gsap.timeline({
                scrollTrigger: {
                    trigger: '#identidad',
                    start: 'top top', // GRACIAS AL MARGIN-TOP NEGATIVO, EL EMPALME ESTÁ JUSTO AL BORDE DEL DOM
                    end: '+=600%', // Flujo moderado
                    pin: true,
                    scrub: 0.5,
                    anticipatePin: 1
                }
            });

            // Resurrección de Nodos: Después de apagar la red neuronal en Cap 1, renace aquí (como el usuario exige)
            tlIdentidad.to('.essence-dev-wrapper', {
                opacity: 1,
                autoAlpha: 1,
                duration: 1.5,
                ease: 'power2.inOut'
            }, 0); // Empieza instantáneamente en start del tlIdentidad

            tlIdentidad.to('.entropy-el', { // Primera Letra aparece en un lapso exacto
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'scale(1)',
                duration: 3,
                stagger: 1.2,
                ease: 'power2.out'
            }, 0.2);

            tlIdentidad.to('.entropy-catchphrase', {
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'scale(1)',
                color: '#888888', // CORRECCIÓN: Gris en lugar de Blanco (Invisible)
                duration: 3,
                ease: 'expo.out'
            }, ">-0.5");

            tlIdentidad.to('.entropy-catchphrase', {
                color: '#00FF99',
                textShadow: '0 0 40px rgba(0,255,153,0.6), 0 0 80px rgba(0,255,153,0.4)',
                duration: 2,
                ease: 'power4.out'
            }, ">");

            tlIdentidad.to('.entropy-finish', {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 3,
                ease: 'power2.out'
            }, ">-1");

            tlIdentidad.to('.entropy-line', {
                scaleY: 1,
                duration: 3,
                ease: 'power2.inOut'
            }, ">-1.5");

            tlIdentidad.to('.entropy-body', {
                opacity: 1,
                transform: 'translateY(0)',
                filter: 'blur(0px)',
                duration: 3,
                stagger: 1,
                ease: 'power2.out'
            }, ">-1.5");

            tlIdentidad.to('#identidad', {
                opacity: 0,
                duration: 4,
                ease: 'power2.in'
            }, ">+1.5");

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} style={{
            position: 'relative',
            zIndex: 9999,
            width: '100%',
            backgroundColor: 'transparent' // Eliminada restricción height: 100vh maestra
        }}>

            {/* Capas de fondo FIJAS GLOBALES (No atrapadas por overflow) */}
            <div className="iridescent-layer" style={{
                position: 'fixed', inset: 0, zIndex: -5, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f4f6f9 50%, #e2e6eb 100%)',
                opacity: 1,
            }}>
                <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}>
                </div>
            </div>

            {/* WRAPPER RELATIVO (Capítulo 1) */}
            <div className="cinematic-content" style={{
                position: 'relative',
                width: '100%', height: '100vh',
                overflow: 'visible',
                zIndex: 10
            }}>
                {/* LA TEXTURA EN MOVIMIENTO: Detrás de la ventana flotante de video (Capítulo 1) */}
                <div className="essence-dev-wrapper" style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', opacity: 1 }}>
                    <EssenceBackground paused={false} />
                </div>

                {/* CAPA 1: VENTANA FLOTANTE (TEXTO SOBRE BLANCO) */}
                <div ref={windowRef} style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw', height: '35vw',
                    borderRadius: '20px',
                    // Sombra direccional MUY marcada para la ilusión de profundidad extrema
                    boxShadow: '-40px 50px 60px rgba(0,0,0,0.5), -15px 20px 25px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: '#000000', // Fondo negro para video
                    zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'visible' // CAMBIADO a visible para que "IA" explote fuera de la caja
                }}>
                    {/* Contenedor estricto para redondear el video SIN cortar el texto */}
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden' }}>
                        {/* VIDEO DE FONDO: Esencia Hero Ultra */}
                        <video
                            src={essenceHeroVideo}
                            autoPlay muted loop playsInline
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', opacity: 0.8
                            }}
                        />
                    </div>

                    {/* 1.2 CAPA DE TEXTO (Encima del Video, sin restricciones de overflow) */}
                    <div className="text-container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 8vw, 10rem)',
                            lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.04em', margin: 0,
                            textTransform: 'uppercase', color: '#000000',
                            // Glow blanco ultra-refinado y multicapa para separar del video oscuro
                            textShadow: '0 0 5px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {/* LÍNEA 1: NUESTRA */}
                            <span className="text-nuestra" style={{
                                display: 'inline-block', fontSize: '0.4em', letterSpacing: '0.2em', marginBottom: '0.2em',
                                // Glow proporcional para línea menor
                                textShadow: '0 0 5px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.6)',
                                opacity: 0, transform: 'translateY(20px)'
                            }}>
                                NUESTRA
                            </span>

                            {/* LÍNEA 2: ESENCIA */}
                            <div className="text-esencia" style={{
                                display: 'flex', gap: '0', whiteSpace: 'nowrap',
                                opacity: 0, transform: 'scale(0.9)', filter: 'blur(10px)'
                            }}>
                                <span className="word-esenc" style={{ display: 'inline-block', overflow: 'hidden' }}>ESENC</span>
                                <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', transformOrigin: '70% 50%' }}>IA</span>
                            </div>
                        </h1>
                    </div>
                </div>

                {/* CAPA 2: CAPA NEGRA INTERMEDIA (Transición) */}
                <div ref={redLayerRef} style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundColor: '#000000', // Modificado a NEGRO por solicitud
                    mixBlendMode: 'normal'
                }} />

                {/* CAPA 3: PARED BLANCA CON RECORTE EN LA "N" */}
                {/* Nota: Pared Blanca vs Fondo Azul vs Ventana Blanca. 
                    El fondo crea el contraste entre la Pared y la Ventana. */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%'
                }}>
                    <svg ref={maskGroupRef} viewBox="0 0 17009 2588" width="80%" height="auto" style={{ overflow: 'visible' }}>
                        <defs>
                            <mask id="n-portal-mask">
                                {/* 1. Lienzo Blanco (Visible - Pared) */}
                                <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" />

                                {/* 2. La "N" es Negra (El Agujero - Invisible) */}
                                {logoPaths[3].startsWith('M') ?
                                    <path d={logoPaths[3]} fill="black" /> :
                                    <polygon points={logoPaths[3]} fill="black" />
                                }
                            </mask>
                        </defs>

                        {/* A. La Pared Blanca Infinita (con el hueco de la N) */}
                        <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" mask="url(#n-portal-mask)" />

                        {/* B. El resto de letras en NEGRO SÓLIDO */}
                        <g fill="black">
                            {logoPaths.map((d, i) => {
                                if (i === 3) return null;
                                return d.startsWith('M') ?
                                    <path key={i} d={d} /> :
                                    <polygon key={i} points={d} />;
                            })}
                        </g>
                    </svg>
                </div>

            </div> {/* Cierre de cinematic-content (Fase 1: Hero) */}

            {/* --- SECCIÓN 2: IDENTIDAD MASTERPIECE --- */}
            <section id="identidad" style={{
                marginTop: '-100vh', // MAGIA PURA: Compensa el tamaño del pin-spacer anterior logrando un hand-off al 100% de la pantalla
                minHeight: '100vh', position: 'relative', // Bloque HTML Puesto normal post cap1
                padding: '2rem 5% 2rem 5%',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4vh',
                zIndex: 40,
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}>
                {/* FONDO: RED NEURONAL INTERACTIVA PARA ESTE CAPÍTULO */}
                <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                    <NeuralNetworkALMA />
                </div>

                <div className="identidad-headline-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', perspective: '1000px', width: '100%', maxWidth: '800px' }}>

                    {/* BLOCK 1: NO SOMOS UNA AGENCIA... */}
                    <div className="entropy-block-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#000',
                            textShadow: '-5px 10px 20px rgba(0,0,0,0.15)', // Sombra física para el texto
                            opacity: 0, // GSAP manejará esto
                            filter: 'blur(20px)',
                            transform: 'scale(0.8)',
                            willChange: 'opacity, filter, transform'
                        }}>
                            NO SOMOS UNA
                        </h2>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#000', // Modificado a NEGRO por el screenshot
                            textShadow: '-5px 10px 20px rgba(0,0,0,0.15)', // Sombra física para el texto
                            opacity: 0,
                            filter: 'blur(30px)',
                            transform: 'scale(0.7)',
                            willChange: 'opacity, filter, transform'
                        }}>
                            AGENCIA CON IA.
                        </h2>
                    </div>

                    {/* BLOCK 2: SOMOS LA IA... */}
                    <div className="entropy-block-2" style={{ marginTop: '1rem' }}>
                        <h2 className="entropy-catchphrase" style={{
                            fontSize: 'clamp(2rem, 5vw, 4.5rem)', // Reduced Size
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1,
                            color: '#333',
                            opacity: 0,
                            filter: 'blur(40px)', // Original era 40px
                            transform: 'scale(1.2)',
                            willChange: 'opacity, filter, transform, color, text-shadow'
                        }}>
                            SOMOS LA IA
                        </h2>
                        <div className="entropy-finish" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem', opacity: 0, filter: 'blur(20px)' }}>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 1, color: '#000' }}>COMO</h2>
                            <img
                                src={officialTypography}
                                alt="AgencIA"
                                style={{
                                    height: 'clamp(1.8rem, 4.5vw, 4rem)', // Tuned for crispness
                                    width: 'auto',
                                    objectFit: 'contain',
                                    imageRendering: 'auto' // Let browser handle smoothing
                                }}
                            />
                        </div>
                    </div>

                </div>

                <div className="identidad-body-container" style={{
                    marginTop: '1.5rem',
                    paddingLeft: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    position: 'relative',
                }}>
                    {/* ANIMATED VERTICAL LINE */}
                    <div className="entropy-line" style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: '#00FF99', // Neon Acccent
                        boxShadow: '0 0 10px rgba(0,255,153,0.5)',
                        transformOrigin: 'top',
                        transform: 'scaleY(0)', // Start hidden
                    }} />

                    {/* Line 1 */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#333',
                        margin: 0,
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)'
                    }}>
                        No hacemos "diseño bonito". Construimos interfaces que<br />
                        <strong style={{ color: '#00FF99' }}>imponen autoridad</strong> y capturan mercado.
                    </p>

                    {/* Line 2 - NIVEL 2 */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#333',
                        margin: 0,
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)',
                        textShadow: '3px 6px 12px rgba(0,0,0,0.28)'
                    }}>
                        Estética superior. Ejecución quirúrgica. Resultados financieros.
                    </p>

                    {/* Line 3 - NIVEL 1 (más cerca, más marcada) */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#000',
                        fontWeight: 800,
                        margin: '0.3rem 0 0',
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)',
                        textShadow: '4px 8px 16px rgba(0,0,0,0.35)'
                    }}>
                        Creatividad humana. Velocidad de máquina.
                    </p>
                </div>
            </section>
        </div> // Cierre de containerRef
    );
};

export default CinematicDev;
