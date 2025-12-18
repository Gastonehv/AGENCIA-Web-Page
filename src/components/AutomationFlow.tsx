import React, { useEffect, useRef } from 'react';
import { useScroll } from '../context/ScrollContext';

// Keep velocity ref outside or inside as needed, but let's use a ref inside for safety with concurrent renders if needed.
// However, for simplicity and following the initial logic:

class Particle {
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
    size: number = 0;
    brightness: number = 0;
    width: number = 0;
    height: number = 0;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.reset();
        this.y = Math.random() * h; // Initial random Y
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() * 0.5) + 0.2;
        this.size = Math.random() * 2 + 0.5;
        this.brightness = Math.random();
    }

    update(scrollSpeed: number, w: number, h: number) {
        this.width = w;
        this.height = h;
        const baseSpeed = 0.5;
        const speedMultiplier = 1 + (Math.abs(scrollSpeed) * 0.1);

        this.y += (this.vy * baseSpeed) * speedMultiplier;
        this.x += this.vx;

        if (this.y > h) {
            this.reset();
        }
        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 153, ${this.brightness * 0.8})`;
        ctx.fill();
    }
}

const AutomationFlow: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { velocity } = useScroll();
    const velocityRef = useRef(0);

    useEffect(() => {
        velocityRef.current = velocity;
    }, [velocity]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: Particle[] = [];
        const particleCount = 150;
        const connectionDistance = 180;

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(width, height));
        }

        let animationId: number;

        const animate = () => {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.update(velocityRef.current, width, height);
                p.draw(ctx);

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        const opacity = (1 - dist / connectionDistance) * 0.3;
                        ctx.strokeStyle = `rgba(0, 255, 153, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            // Optionally re-reset particles or update their width/height refs
            particles.forEach(p => {
                p.width = width;
                p.height = height;
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.8, background: 'transparent' }}
        />
    );
};

export default AutomationFlow;
