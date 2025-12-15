import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface FloatingWindowProps {
    title: string;
    content?: string; // Para modo 'text'
    image?: string;   // Para modo 'image'
    position: 'left' | 'right';
    isActive: boolean; // Controla visibilidad global
    mode: 'text' | 'image';
}

const FloatingWindow: React.FC<FloatingWindowProps> = ({ title, content, image, position, isActive, mode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const [displayedText, setDisplayedText] = useState("");

    // Efecto de entrada/salida basado en isActive
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        if (isActive) {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: position === 'left' ? 0.2 : 0.4,
                ease: "power3.out"
            });
        } else {
            gsap.to(el, {
                opacity: 0,
                x: position === 'left' ? -50 : 50,
                duration: 0.5,
                ease: "power3.in"
            });
        }
    }, [isActive, position]);

    // Efecto Typewriter para modo Texto
    useEffect(() => {
        if (mode === 'text' && isActive && content) {
            setDisplayedText(""); // Reset
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText(content.substring(0, i + 1));
                i++;
                if (i === content.length) clearInterval(interval);
            }, 30); // Velocidad de escritura
            return () => clearInterval(interval);
        } else if (!isActive) {
            setDisplayedText("");
        }
    }, [content, isActive, mode]);

    const baseStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        [position]: '10%',
        transform: 'translateY(-50%) translateX(0px)', // X controlado por GSAP
        width: '350px',
        minHeight: '200px',
        padding: '2rem',
        background: 'rgba(20, 20, 30, 0.4)', // Más oscuro para contraste con reflejos brillantes
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        color: 'white',
        fontFamily: '"Inter", sans-serif',
        pointerEvents: isActive ? 'auto' : 'none',
        opacity: 0, // Inicialmente invisible
        zIndex: 10,
        transition: 'background 0.3s ease'
    };

    return (
        <div ref={containerRef} style={baseStyle}>
            <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: position === 'left' ? '#a1cfee' : '#eecfa1', // Color temático por lado
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.5rem'
            }}>
                {title}
            </h3>

            <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mode === 'image' && image && isActive && (
                    <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                        <img
                            src={image}
                            alt="Visual Context"
                            style={{ width: '100%', display: 'block', opacity: 0, animation: 'fadeIn 1s forwards' }}
                        />
                        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
                    </div>
                )}

                {mode === 'text' && (
                    <div ref={textRef} style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                        "{displayedText}"<span className="cursor">|</span>
                        <style>{`.cursor { animation: blink 1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } }`}</style>
                    </div>
                )}
            </div>

            {/* Elementos decorativos */}
            <div style={{ position: 'absolute', bottom: '15px', right: '20px', fontSize: '0.7rem', opacity: 0.5, letterSpacing: '1px' }}>
                SYSTEM: {isActive ? 'ONLINE' : 'STANDBY'}
            </div>
        </div>
    );
};

export default FloatingWindow;
