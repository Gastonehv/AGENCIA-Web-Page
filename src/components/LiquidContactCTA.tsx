import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';
import '../styles/liquid-cta.css';

interface LiquidContactCTAProps {
    text?: string;
    style?: React.CSSProperties;
    className?: string;
}

const LiquidContactCTA: React.FC<LiquidContactCTAProps> = ({ 
    text = "HABLAR CON UN AGENTE",
    style,
    className = ""
}) => {
    const navigate = useNavigate();
    const liquidRef = useRef<HTMLDivElement>(null);
    const mountRef = useRef<any>(null);

    useEffect(() => {
        if (!liquidRef.current) return;

        // Ensure the container is empty before mounting
        liquidRef.current.innerHTML = '';

        // Mount the Liquid Metal Shader
        mountRef.current = new ShaderMount(
            liquidRef.current,
            liquidMetalFragmentShader,
            {
                u_repetition: 1.5,
                u_softness: 0.5,
                u_shiftRed: 0.3,   // Magenta/Cyan aesthetic
                u_shiftBlue: 0.6,
                u_shiftGreen: 0.2,
                u_distortion: 0.1,
                u_contour: 0.05,
                u_angle: 120,
                u_scale: 1.5,
                u_shape: 1,
                u_offsetX: 0.1,
                u_offsetY: -0.1
            },
            undefined,
            0.6
        );

        return () => {
            if (mountRef.current && typeof mountRef.current.destroy === 'function') {
                mountRef.current.destroy();
            } else if (mountRef.current && typeof mountRef.current.dispose === 'function') {
                mountRef.current.dispose();
            }
        };
    }, []);

    return (
        <div className={`liquid-cta-wrapper ${className}`} style={style}>
            <div className="text-box" onClick={() => navigate('/contacto')}>
                {/* Custom Neural Link Icon (Abstract, replaces paperclip) */}
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                    <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.3" />
                    <path d="M50 15 L80 32 L80 68 L50 85 L20 68 L20 32 Z" opacity="0.5" />
                    <path d="M50 30 L67 40 L67 60 L50 70 L33 60 L33 40 Z" strokeWidth="8" />
                    <line x1="50" y1="15" x2="50" y2="85" strokeWidth="4" strokeDasharray="6 6" />
                </svg>

                {/* Custom Quantum Core/Swarm Icon (Abstract, replaces sparkles) */}
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" style={{ width: '20px', height: '20px' }}>
                    <circle cx="50" cy="50" r="40" strokeDasharray="8 8" opacity="0.4" />
                    <circle cx="50" cy="50" r="25" strokeWidth="7" />
                    <circle cx="50" cy="10" r="5" fill="currentColor" />
                    <circle cx="50" cy="90" r="5" fill="currentColor" />
                    <circle cx="10" cy="50" r="5" fill="currentColor" />
                    <circle cx="90" cy="50" r="5" fill="currentColor" />
                    <polygon points="50,38 54,46 62,50 54,54 50,62 46,54 38,50 46,46" fill="currentColor" />
                </svg>

                {/* Optional Text Label */}
                <span className="cta-label-text">{text}</span>

                {/* NOTE: Liquid Metal Button */}
                <div id="liquid-metal">
                    <div className="outline">
                        <div ref={liquidRef} className="liquid-cta-shader"></div>
                        {/* Custom Tech Vector Arrow */}
                        <svg className="svg-icon" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M25 75 L75 25" strokeWidth="10" />
                            <path d="M45 25 H75 V55" strokeWidth="10" />
                            <path d="M20 50 H15 V85 H50 V80" strokeWidth="4" opacity="0.5" />
                            <path d="M80 50 V75" strokeWidth="5" strokeDasharray="6 6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidContactCTA;
