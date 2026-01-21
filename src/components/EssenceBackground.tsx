import { useEffect, useRef } from 'react';

/**
 * EssenceBackground - ALMA High-Performance Cinematic Implementation
 * Versión optimizada: Se elimina ctx.filter (causante del lag) y se sustituye
 * por simulación de profundidad mediante niveles de opacidad y escala.
 */
const EssenceBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: null as number | null, y: null as number | null, radius: 250 });

    useEffect(() => {
        // Force body background to transparent to allow fixed background to show 
        // if it were behind, but here we move it to z-index 0
        const originalBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'transparent';

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false }); // Optimización de contexto
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        class Particle {
            x!: number;
            y!: number;
            z!: number;
            baseSize!: number;
            opacity!: number;
            baseSpeedX!: number;
            baseSpeedY!: number;
            speedX!: number;
            speedY!: number;
            charge!: number;

            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;

                // Coordenada Z (0 = fondo, 1 = frente)
                this.z = Math.random();

                // Atributos basados en Z para evitar cálculos de filtro pesados
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
                this.x += this.speedX;
                this.y += this.speedY;

                // Recuperación elástica (Inercia de ALMA)
                this.speedX += (this.baseSpeedX - this.speedX) * 0.08;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.08;

                if (this.x > canvas!.width) this.x = 0;
                else if (this.x < 0) this.x = canvas!.width;
                if (this.y > canvas!.height) this.y = 0;
                else if (this.y < 0) this.y = canvas!.height;

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
                const finalSize = this.baseSize + (this.charge * 3 * this.z);
                const finalOpacity = Math.min(1, this.opacity + (this.charge * 0.5));

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, finalSize, 0, Math.PI * 2);
                // Usamos colores sólidos con alpha para máxima velocidad
                ctx!.fillStyle = `rgba(0, 0, 0, ${finalOpacity})`;
                ctx!.fill();
            }
        }

        const init = () => {
            particles = [];
            // Ajustamos densidad según resolución para mantener FPS
            const count = Math.min((canvas.width * canvas.height) / 10000, 150);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
            // Dibujar los de atrás primero
            particles.sort((a, b) => a.z - b.z);
        };

        const drawPlexus = () => {
            const maxDistance = 180;
            ctx!.lineCap = 'round';

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    // Solo conectar si están en planos de profundidad similares (Z-culling)
                    if (Math.abs(particles[i].z - particles[j].z) > 0.25) continue;

                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distanceSq = dx * dx + dy * dy; // Usar distancia al cuadrado es más rápido

                    if (distanceSq < maxDistance * maxDistance) {
                        const distance = Math.sqrt(distanceSq);
                        const avgZ = (particles[i].z + particles[j].z) / 2;
                        const opacity = (1 - distance / maxDistance) * 0.4 * avgZ;

                        ctx!.strokeStyle = `rgba(0, 0, 0, ${opacity + (particles[i].charge * 0.2)})`;
                        ctx!.lineWidth = (0.3 + avgZ) + (particles[i].charge * 1.2);

                        ctx!.beginPath();
                        ctx!.moveTo(particles[i].x, particles[i].y);
                        ctx!.lineTo(particles[j].x, particles[j].y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            // Fondo sólido para evitar transparencias costosas en el canvas
            ctx!.fillStyle = '#f8fafc';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);

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

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
            document.body.style.backgroundColor = originalBodyBg;
        };
    }, []);

    return (
        <div
            className="essence-bg-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                pointerEvents: 'none'
            }}
        >
            {/* Capas de fondo con CSS Blur (mucho más eficiente que Canvas Blur) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[100%] h-[100%] rounded-full bg-blue-100/30 blur-[120px]" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[90%] h-[90%] rounded-full bg-slate-200/40 blur-[120px]" />
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                style={{ width: '100%', height: '100%' }}
            />

            {/* Textura de ruido ligera */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default EssenceBackground;
