import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import HoldToReveal from './HoldToReveal';

interface ForceCardProps {
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
}

const ForceCard: React.FC<ForceCardProps> = ({ title, description, color, icon }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt
        const rotateX = ((y - centerY) / centerY) * -10; // Max -10 to 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(cardRef.current, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Move glow effect
        if (glowRef.current) {
            gsap.to(glowRef.current, {
                x: x,
                y: y,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
        });
    };

    const handleHoldComplete = () => {
        // Trigger the hover effect permanently or open a modal
        setIsHovered(true);
        if (cardRef.current) {
            gsap.to(cardRef.current, {
                boxShadow: `0 0 50px ${color} 40`,
                borderColor: color,
                duration: 0.5
            });
        }
    };

    const Content = (
        <div
            ref={cardRef}
            className="force-card-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                minHeight: '350px',
                padding: '3rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)', // Obsidian Glass
                backdropFilter: 'blur(10px)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
                cursor: 'none',
                borderColor: isHovered ? color : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isHovered ? `0 0 30px ${color} 20` : 'none'
            }}
        >
            {/* Dynamic Glow Spotlight */}
            <div
                ref={glowRef}
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '300px', height: '300px',
                    background: `radial - gradient(circle, ${color}30 0 %, transparent 70 %)`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    mixBlendMode: 'screen'
                }}
            />

            <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '40px', height: '4px', background: color,
                        boxShadow: `0 0 10px ${color}`
                    }} />
                    <div style={{ color: color, fontSize: '1.2rem' }}>{icon}</div>
                </div>
                <h3 style={{
                    fontSize: '2.5rem', lineHeight: 1, fontWeight: 700,
                    color: '#FFF', marginBottom: '1rem',
                    textShadow: isHovered ? `0 0 20px ${color} 80` : 'none',
                    transition: 'all 0.3s ease'
                }}>
                    {title}
                </h3>
            </div>

            <p style={{
                fontSize: '1.1rem', fontFamily: 'var(--font-mono)',
                color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 2
            }}>
                {description}
            </p>
        </div>
    );

    // Conditional Wrapper could go here, but fitting HoldToReveal into the flow:
    return (
        <HoldToReveal onComplete={handleHoldComplete} className="force-card-wrapper" style={{ width: '100%' }}>
            {Content}
        </HoldToReveal>
    );
};

export default ForceCard;
