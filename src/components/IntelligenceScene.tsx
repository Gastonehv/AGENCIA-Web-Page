import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Stars, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import AIEntity from './AIEntity';
import FloatingWindow from './FloatingWindow';
import { useVoiceInteraction } from './useVoiceInteraction';

// Mobile detection hook - detects immediately on first render
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 768px)').matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        // Use a more modern and robust way to handle the listener
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handler);

        // Final sync check in case something changed between render and effect mount
        if (isMobile !== mediaQuery.matches) {
            Promise.resolve().then(() => {
                setIsMobile(mediaQuery.matches);
            });
        }

        return () => mediaQuery.removeEventListener('change', handler);
    }, [isMobile]);

    return isMobile;
};

// Escenario Específico: "El Negocio de Semillas y Abarrotes"
const SCENARIO_STEPS = {
    IDLE: {
        aiText: "Esperando conexión...",
        visualState: 'idle',
        image: null
    },
    GREETING: {
        aiText: "Hola. Soy AURA. ¿Qué deseas crear hoy?",
        visualState: 'listening',
        image: null
    },
    LISTENING: {
        aiText: "Escuchando...",
        visualState: 'listening',
        image: null
    },
    PROCESSING: {
        aiText: "Analizando modelo híbrido: Abarrotes, Semillas y Alimento para Mascotas. Integrando inventario diverso y UX local...",
        visualState: 'processing',
        image: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczhzZmEwejF6d3F6d3F6d3F6d3F6d3F6d3F6d3F6d3F6d3F6d3F6/3o7TKsdsRpS5qTKjDy/giphy.gif"
    },
    DELIVERY: {
        aiText: "Listo. Interfaz multi-catálogo: Destaca promociones de abarrotes y sección especializada para agro/mascotas.",
        visualState: 'display',
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop"
    }
};

const IntelligenceScene: React.FC = () => {
    const isMobile = useIsMobile();
    const [step, setStep] = useState<keyof typeof SCENARIO_STEPS>('IDLE');
    const { speak, isSpeaking, startListening, isListening } = useVoiceInteraction();
    const currentData = SCENARIO_STEPS[step];

    // Lógica del "Chatbot Script"
    const handleMicClick = () => {
        if (step === 'IDLE' || step === 'DELIVERY') {
            // Reiniciar flujo
            setStep('GREETING');
            speak(SCENARIO_STEPS.GREETING.aiText);
        } else if (step === 'GREETING') {
            // Usuario "habla" (Simulado para demo perfecta)
            setStep('LISTENING');
            startListening();

            // Simular respuesta del usuario después de escuchar
            setTimeout(() => {
                // Avanzar a procesar
                setStep('PROCESSING');
                speak("Entendido. Generando diseño tienda de abarrotes con sección de semillas y mascotas.");

                // Avanzar a entrega final
                setTimeout(() => {
                    setStep('DELIVERY');
                    speak(SCENARIO_STEPS.DELIVERY.aiText);
                }, 4000); // 4 seg de "generación"

            }, 2000); // 2 seg de "escucha"
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#000000', overflow: 'hidden' }}>

            {/* Capa 3D */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: isMobile ? 'none' : 'auto' }}>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    gl={{ antialias: false, alpha: false }}
                    style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
                >
                    <color attach="background" args={['#050505']} />

                    <Suspense fallback={null}>
                        {/* 
                            IRIDESCENT HOLOGRAPHIC ENVIRONMENT
                            Mezcla de luces suaves y saturadas para crear un efecto "nacarado" o holográfico.
                        */}
                        <Environment resolution={512} background={false}>
                            {/* Fondo Base: Violeta Profundo */}
                            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#7000ff" />

                            {/* Gradient Swirls - Grandes círculos suaves de color */}
                            <Lightformer form="circle" intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={10} color="#00ffff" /> {/* Cyan */}
                            <Lightformer form="circle" intensity={4} rotation-y={-Math.PI / 2} position={[5, 1, -1]} scale={10} color="#ff00cc" /> {/* Magenta */}
                            <Lightformer form="circle" intensity={4} rotation-x={-Math.PI / 2} position={[0, -5, 0]} scale={10} color="#ccff00" /> {/* Lime/Yellow */}

                            {/* Detalles puntuales brillantes (Hightlights) */}
                            <Lightformer form="ring" intensity={5} scale={10} position={[0, 0, -10]} color="#ffffff" />
                        </Environment>

                        {/* Luces adicionales para la escena (no solo reflejos) */}
                        <ambientLight intensity={isSpeaking ? 0.8 : 0.3} color="#ccffff" />
                        <spotLight
                            position={[10, 10, 10]}
                            angle={0.15}
                            intensity={isSpeaking ? 5 : 2}
                            color={isSpeaking ? "#d6bdff" : "#ffffff"} // Luz lila/blanca al hablar
                            castShadow
                        />

                        <Float speed={isSpeaking ? 4 : 1} rotationIntensity={isSpeaking ? 1.5 : 0.5} floatIntensity={0.5}>
                            <AIEntity isActive={step !== 'IDLE'} />
                        </Float>

                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        <EffectComposer enableNormalPass={false}>
                            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={isSpeaking ? 3 : 1.5} radius={0.6} />
                            <ToneMapping />
                        </EffectComposer>
                    </Suspense>

                    {/* Disable OrbitControls on mobile to allow scrolling */}
                    {!isMobile && (
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate={step !== 'IDLE'} autoRotateSpeed={0.5} />
                    )}
                </Canvas>
            </div>

            {/* Capa UI (Floating Windows) */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
                <FloatingWindow
                    title="AURA SYSTEM"
                    position="left"
                    mode="text"
                    isActive={step !== 'IDLE'}
                    content={isListening ? "Usuario: Mi negocio es de abarrotes, semillas y comida de mascota..." : currentData.aiText}
                />

                <FloatingWindow
                    title="VISUAL PROCESSOR"
                    position="right"
                    mode="image"
                    isActive={step !== 'IDLE'}
                    image={currentData.image || undefined}
                />
            </div>

            {/* Botón de Micrófono Central */}
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
                pointerEvents: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <button
                    onClick={handleMicClick}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: isListening ? '#ff4444' : 'rgba(255,255,255,0.1)',
                        border: '2px solid rgba(255,255,255,0.5)',
                        color: 'white',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        boxShadow: isListening ? '0 0 30px #ff4444' : (step !== 'IDLE' ? '0 0 30px #00f2ff' : 'none'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                    {step === 'IDLE' ? 'CLICK PARA INICIAR' : (isListening ? 'ESCUCHANDO...' : 'HABLAR')}
                </div>
            </div>

        </div>
    );
};

export default IntelligenceScene;
