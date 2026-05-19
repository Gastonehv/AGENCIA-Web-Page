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
        <div 
            className={`liquid-cta-container ${className}`} 
            style={style}
            onClick={() => navigate('/contacto')}
        >
            <span className="liquid-cta-text">{text}</span>
            <div className="liquid-cta-button">
                <div ref={liquidRef} className="liquid-cta-shader"></div>
                {/* Arrow Icon */}
                <svg className="liquid-cta-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12H3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                </svg>
            </div>
        </div>
    );
};

export default LiquidContactCTA;
