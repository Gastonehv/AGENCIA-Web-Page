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
                {/* Signal node — minimal 3-point connector */}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="2" fill="currentColor" />
                    <path d="M8 2V5M8 11V14M2 8H5M11 8H14" />
                </svg>

                {/* Spark — minimal 4-point star */}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                    <path d="M8 2L8 14M2 8L14 8" />
                    <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" strokeWidth="1" opacity="0.5" />
                </svg>

                {/* Optional Text Label */}
                <span className="cta-label-text">{text}</span>

                {/* NOTE: Liquid Metal Button */}
                <div id="liquid-metal">
                    <div className="outline">
                        <div ref={liquidRef} className="liquid-cta-shader"></div>
                        {/* Custom Tech Vector Arrow */}
                        {/* Arrow — single diagonal stroke */}
                        <svg className="svg-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 11L11 5" />
                            <path d="M7 5H11V9" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidContactCTA;
