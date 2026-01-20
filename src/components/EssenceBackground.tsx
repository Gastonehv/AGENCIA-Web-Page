import React, { useEffect, useRef } from 'react';

/**
 * EssenceBackground - Red Neuronal Animada (Versión Senior Refinada)
 * zIndex: 0 - Actúa como fondo global tras el Layout transparente
 */
const EssenceBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: null as number | null, y: null as number | null, radius: 300 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimización de rendimiento
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let w = window.innerWidth;
        let h = window.innerHeight;

        const resize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            init();
        };

        class Particle {
            x = 0; y = 0; z = 0; vx = 0; vy = 0; size = 0; opacity = 0; charge = 0;

            constructor() { this.reset(); }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.z = Math.random();
                // BASE SIZE: Minimalist dots (0.8px to 2.3px)
                this.size = this.z * 1.5 + 0.8;
                this.opacity = this.z * 0.4 + 0.2;
                this.vx = (Math.random() - 0.5) * (this.z * 1.2 + 0.3);
                this.vy = (Math.random() - 0.5) * (this.z * 1.2 + 0.3);
                this.charge = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;

                if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
                    const dx = mouseRef.current.x - this.x;
                    const dy = mouseRef.current.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouseRef.current.radius) {
                        this.charge = (mouseRef.current.radius - dist) / mouseRef.current.radius;
                        // SUBTLE REPULSION
                        this.x -= (dx / dist) * this.charge * 2.5;
                        this.y -= (dy / dist) * this.charge * 2.5;
                    } else {
                        this.charge *= 0.92;
                    }
                } else {
                    this.charge *= 0.92;
                }
            }

            draw() {
                ctx!.beginPath();
                // ELEGANT GROWTH: Only 1.5px extra max
                ctx!.arc(this.x, this.y, this.size + this.charge * 1.5, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(0, 0, 0, ${Math.min(0.7, this.opacity + this.charge * 0.15)})`;
                ctx!.fill();
            }
        }

        const init = () => {
            particles = [];
            const count = Math.min((w * h) / 7500, 180);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        };

        const drawPlexus = () => {
            const maxDist = 180;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i], p2 = particles[j];
                    if (Math.abs(p1.z - p2.z) > 0.45) continue;
                    const dx = p1.x - p2.x, dy = p1.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < maxDist * maxDist) {
                        const dist = Math.sqrt(distSq);
                        const baseOpacity = (1 - dist / maxDist) * 0.4 * ((p1.z + p2.z) / 2);
                        // VIBRANT BUT SUBTLE OPACITY
                        ctx!.strokeStyle = `rgba(0, 0, 0, ${baseOpacity + (p1.charge + p2.charge) * 0.12})`;
                        // ULTRA-THIN LINES: 0.3px to 1.1px base + 0.4px interaction glow
                        ctx!.lineWidth = (0.3 + p1.z * 0.8) + (p1.charge + p2.charge) * 0.4;
                        ctx!.beginPath();
                        ctx!.moveTo(p1.x, p1.y);
                        ctx!.lineTo(p2.x, p2.y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, w, h);
            drawPlexus();
            particles.forEach(p => { p.update(); p.draw(); });
            animationFrameId = requestAnimationFrame(animate);
        };

        const onMouseMove = (e: MouseEvent) => { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; };
        const onMouseLeave = () => { mouseRef.current.x = null; mouseRef.current.y = null; };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseleave', onMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseleave', onMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="essence-background" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundColor: '#f8fafc' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
    );
};

export default EssenceBackground;
