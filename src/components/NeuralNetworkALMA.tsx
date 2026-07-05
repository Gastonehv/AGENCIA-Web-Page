import React, { useEffect, useRef } from 'react';

/**
 * NeuralNetworkALMA - ALMA High-Performance Cinematic Implementation (Refined Version)
 * Implementación optimizada con Canvas 2D, simulación de profundidad y capas de blur CSS.
 */
const NeuralNetworkALMA: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef<{ x: number | null, y: number | null, radius: number }>({ x: null, y: null, radius: 250 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false }); // Optimización de contexto (opaco para velocidad)
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let logicalWidth = window.innerWidth;
        let logicalHeight = window.innerHeight;

        const resize = () => {
            const parent = canvas.parentElement;
            const rect = parent?.getBoundingClientRect();
            const width = Math.max(1, Math.ceil(rect?.width || window.innerWidth));
            const height = Math.max(1, Math.ceil(rect?.height || window.innerHeight));
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            logicalWidth = width;
            logicalHeight = height;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            init();
        };

        class Particle {
            x: number = 0;
            y: number = 0;
            z: number = 0;
            baseSize: number = 0;
            opacity: number = 0;
            baseSpeedX: number = 0;
            baseSpeedY: number = 0;
            speedX: number = 0;
            speedY: number = 0;
            charge: number = 0;

            constructor() {
                this.init();
            }

            init() {
                if (!canvas) return;
                this.x = Math.random() * logicalWidth;
                this.y = Math.random() * logicalHeight;

                // Coordenada Z (0 = fondo, 1 = frente)
                this.z = Math.random();

                // Atributos basados en Z para simular profundidad
                this.baseSize = this.z * 2.5 + 0.5;
                this.opacity = this.z * 0.6 + 0.1;

                // Velocidad proporcional a la profundidad (efecto paralaje)
                this.baseSpeedX = (Math.random() - 0.5) * (this.z * 1.8 + 0.4);
                this.baseSpeedY = (Math.random() - 0.5) * (this.z * 1.8 + 0.4);

                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
                this.charge = 0;
            }

            update() {
                if (!canvas) return;
                this.x += this.speedX;
                this.y += this.speedY;

                // Recuperación elástica (Inercia de ALMA)
                this.speedX += (this.baseSpeedX - this.speedX) * 0.08;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.08;

                if (this.x > logicalWidth) this.x = 0;
                else if (this.x < 0) this.x = logicalWidth;
                if (this.y > logicalHeight) this.y = 0;
                else if (this.y < 0) this.y = logicalHeight;

                // Interacción reactiva ágil
                if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
                    const dx = mouseRef.current.x - this.x;
                    const dy = mouseRef.current.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRef.current.radius) {
                        const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
                        // Solo los nodos cercanos al frente reaccionan con violencia cinética
                        const pushFactor = force * (12 * this.z + 3);
                        this.speedX -= (dx / distance) * pushFactor;
                        this.speedY -= (dy / distance) * pushFactor;
                        this.charge = force;
                    } else {
                        this.charge *= 0.9;
                    }
                } else {
                    this.charge *= 0.9;
                }
            }

            draw() {
                if (!ctx) return;
                const finalSize = this.baseSize + (this.charge * 3 * this.z);
                const finalOpacity = Math.min(1, this.opacity + (this.charge * 0.5));

                ctx.beginPath();
                ctx.arc(this.x, this.y, finalSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
                ctx.fill();
            }
        }

        const init = () => {
            if (!canvas) return;
            particles = [];
            const cssWidth = logicalWidth;
            const cssHeight = logicalHeight;
            const count = Math.min((cssWidth * cssHeight) / 10000, 150);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
            // Dibujar los de atrás primero
            particles.sort((a, b) => a.z - b.z);
        };

        const drawPlexus = () => {
            if (!ctx) return;
            const maxDistance = 180;
            ctx.lineCap = 'round';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    // Solo conectar si están en planos de profundidad similares (Z-culling)
                    if (Math.abs(particles[i].z - particles[j].z) > 0.25) continue;

                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distanceSq = dx * dx + dy * dy;

                    if (distanceSq < maxDistance * maxDistance) {
                        const distance = Math.sqrt(distanceSq);
                        const avgZ = (particles[i].z + particles[j].z) / 2;
                        const opacity = (1 - distance / maxDistance) * 0.4 * avgZ;

                        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity + (particles[i].charge * 0.2)})`;
                        ctx.lineWidth = (0.3 + avgZ) + (particles[i].charge * 1.2);

                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            // Fondo sólido oficial para máxima velocidad y limpieza
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, logicalWidth, logicalHeight);

            drawPlexus();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = null;
            mouseRef.current.y = null;
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            if (!canvas) return;
            // Gamma: inclinación lateral, Beta: inclinación frontal
            const nx = (e.gamma || 0) / 45; 
            const ny = ((e.beta || 60) - 60) / 45;

            const cnx = Math.max(-1, Math.min(1, nx));
            const cny = Math.max(-1, Math.min(1, ny));

            // Mapeamos el centro de la pantalla + el desplazamiento del sensor
            mouseRef.current.x = (logicalWidth / 2) + (cnx * logicalWidth / 2);
            mouseRef.current.y = (logicalHeight / 2) + (cny * logicalHeight / 2);
        };

        const resizeObserver = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(() => resize())
            : null;
        if (canvas.parentElement && resizeObserver) resizeObserver.observe(canvas.parentElement);

        window.addEventListener('resize', resize);
        window.addEventListener('orientationchange', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('deviceorientation', handleOrientation);

        resize();
        animate();

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', resize);
            window.removeEventListener('orientationchange', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('deviceorientation', handleOrientation);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', minHeight: '100svh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
            {/* Capas de fondo con CSS Blur (Alta eficiencia) */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(219, 234, 254, 0.3)',
                    filter: 'blur(120px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-10%',
                    width: '90%',
                    height: '90%',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(226, 232, 240, 0.4)',
                    filter: 'blur(120px)'
                }} />
            </div>

            <canvas
                ref={canvasRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            />

            {/* Textura de ruido ligera */}
            <div style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.03,
                pointerEvents: 'none',
                mixBlendMode: 'multiply',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
            }} />
        </div>
    );
};

export default NeuralNetworkALMA;
