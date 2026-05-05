import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import cortexImg from '../assets/images/cortex cerebro agencia.png';

// Lightweight Vector2 Helper (Ported from user code)
class Vec2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    lerp(v: Vec2, t: number) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    sub(v: Vec2) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    copy(v: Vec2) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
}

const Cursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLImageElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        // Mobile Check
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        const el = cursorRef.current;
        const visual = visualRef.current;
        const text = textRef.current;
        if (!el || !visual || !text) return;

        // State (Closure to avoid refs overhead in loop)
        const position = {
            previous: new Vec2(-100, -100),
            current: new Vec2(-100, -100),
            target: new Vec2(-100, -100),
            lerpAmount: 0.5 // MUCH Faster (Reduced Latency)
        };
        const scale = {
            previous: 1,
            current: 1,
            target: 1,
            lerpAmount: 0.5 // MUCH Faster (Reduced Latency)
        };

        let isHovered = false;
        let hoverEl: HTMLElement | null = null;

        // Trackers for listeners to avoid duplicates and allow cleanup
        const boundElements = new WeakSet<HTMLElement>();
        const elementListeners: Array<{
            element: HTMLElement;
            mousemove: (e: MouseEvent) => void;
            mouseleave: () => void;
            xTo: gsap.QuickToFunc;
            yTo: gsap.QuickToFunc;
        }> = [];

        // --- UPDATE LOOP ---
        const update = () => {
            position.current.lerp(position.target, position.lerpAmount);
            scale.current = gsap.utils.interpolate(
                scale.current,
                scale.target,
                scale.lerpAmount
            );

            const delta = position.current.clone().sub(position.previous);

            position.previous.copy(position.current);
            scale.previous = scale.current;

            // 1. Move Container (No Distortion)
            gsap.set(el, {
                x: position.current.x,
                y: position.current.y
            });

            // 2. Deform Visuals Only (Squash & Stretch)
            if (!isHovered) {
                const angle = Math.atan2(delta.y, delta.x) * (180 / Math.PI);
                const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * 0.04;

                gsap.set(visual, {
                    rotate: angle,
                    scaleX: scale.current + Math.min(distance, 1),
                    scaleY: scale.current - Math.min(distance, 0.3)
                });
            } else {
                // In hover/open state, we might want uniform scaling or cleaner shapes
                // Just apply the scale.target without the physics jitter if locked on target
                // Or keep physics if it's just a button magnetic effect

                // If "OPEN" state, we want a perfect circle, no rotation jitter
                if (text.textContent === "ABRIR") {
                    gsap.set(visual, { rotate: 0, scaleX: scale.current, scaleY: scale.current });
                } else {
                    // Normal button magnetism - keep physics?
                    const angle = Math.atan2(delta.y, delta.x) * (180 / Math.PI);
                    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * 0.04;
                    gsap.set(visual, {
                        rotate: angle,
                        scaleX: scale.target + Math.pow(Math.min(distance, 0.6), 3) * 3,
                        scaleY: scale.target - Math.pow(Math.min(distance, 0.3), 3) * 3
                    });
                }
            }
        };

        // --- TARGET POSITION UPDATE ---
        const updateTargetPosition = (x: number, y: number) => {
            if (isHovered && hoverEl) {
                // GLOBAL UNIFICATION: No magnetism, no drift.
                position.target.x = x;
                position.target.y = y;
                scale.target = 1; // ALWAYS SCALE 1
                text.textContent = ""; 
                text.style.opacity = '0';
                
                // UNIFIED STYLE (WHITE BRAIN, DIFFERENCE MODE)
                el.style.mixBlendMode = 'difference';
                visual.style.filter = 'brightness(0) invert(1)'; 
                visual.style.backgroundColor = 'transparent';
                visual.style.backdropFilter = 'none';
                visual.style.border = 'none';
                visual.style.boxShadow = 'none';
            } else {
                position.target.x = x;
                position.target.y = y;
                scale.target = 1;
                text.textContent = "";
                text.style.opacity = '0';

                el.style.mixBlendMode = 'difference';
                visual.style.backgroundColor = 'transparent';
                visual.style.filter = 'brightness(0) invert(1)';
            }
        };

        // --- LISTENERS ---
        let lastMouseX = 0;
        let lastMouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            updateTargetPosition(e.clientX, e.clientY);
        };

        const handleScroll = () => {
            if (isHovered) {
                updateTargetPosition(lastMouseX, lastMouseY);
            }
        };

        const addListeners = () => {
            const targets = document.querySelectorAll('a, button, input, textarea, .hover-target, .rift-row, [data-cursor], .magnetic');

            targets.forEach((target) => {
                const element = target as HTMLElement;
                if (boundElements.has(element)) return;
                boundElements.add(element);

                // Identificar si el elemento debe tener físicas magnéticas
                const isMagnetic = element.classList.contains('magnetic') || element.tagName === 'BUTTON' || element.tagName === 'A';
                
                // Preparar GSAP quickTo para mover el elemento magnéticamente
                let xTo: gsap.QuickToFunc;
                let yTo: gsap.QuickToFunc;
                
                if (isMagnetic) {
                    xTo = gsap.quickTo(element, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
                    yTo = gsap.quickTo(element, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
                }

                const mousemove = (e: MouseEvent) => {
                    if (isMagnetic && xTo && yTo) {
                        const rect = element.getBoundingClientRect();
                        const relX = (e.clientX - rect.left) - rect.width / 2;
                        const relY = (e.clientY - rect.top) - rect.height / 2;
                        // Mover el elemento hacia el ratón (Fuerza magnética del 30%)
                        xTo(relX * 0.3);
                        yTo(relY * 0.3);
                    }
                };

                const cursorMouseEnter = () => {
                    isHovered = true;
                    hoverEl = element;
                    
                    // Soporte para texto dinámico en el cursor
                    const cursorText = element.getAttribute('data-cursor-text');
                    if (cursorText && text) {
                        text.textContent = cursorText;
                        text.style.opacity = '1';
                        scale.target = 3; // Crecer para alojar el texto
                        
                        // MICRO-INTERACTION: Glitch Flicker
                        gsap.fromTo(text, 
                            { x: -2, opacity: 0.5 }, 
                            { x: 0, opacity: 1, duration: 0.1, repeat: 3, yoyo: true }
                        );
                    } else {
                        scale.target = 1.5; // Hover normal
                    }
                    
                    // Visual Glitch
                    gsap.fromTo(visual, 
                        { filter: 'brightness(2) invert(1) blur(2px)' }, 
                        { filter: 'brightness(0) invert(1) blur(0px)', duration: 0.2 }
                    );
                };
                
                const cursorMouseLeave = () => {
                    isHovered = false;
                    hoverEl = null;

                    if (text) {
                        text.textContent = "";
                        text.style.opacity = '0';
                    }
                    if (el) el.style.mixBlendMode = 'difference';
                    if (visual) visual.style.backgroundColor = 'transparent';
                    scale.target = 1;

                    // Soltar el elemento magnético (Reset)
                    if (isMagnetic && xTo && yTo) {
                        xTo(0);
                        yTo(0);
                    }
                };

                element.addEventListener('mouseenter', cursorMouseEnter);
                element.addEventListener('mouseleave', cursorMouseLeave);
                if (isMagnetic) {
                    element.addEventListener('mousemove', mousemove);
                }

                elementListeners.push({ element, mousemove, mouseleave: cursorMouseLeave, xTo: xTo!, yTo: yTo! });
            });
        };

        // Init
        gsap.set(el, { xPercent: -50, yPercent: -50 });

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        gsap.ticker.add(update);

        addListeners();
        const scanner = setInterval(addListeners, 1000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            gsap.ticker.remove(update);
            clearInterval(scanner);

            elementListeners.forEach(({ element, mousemove, mouseleave, xTo, yTo }) => {
                element.removeEventListener("mousemove", mousemove);
                element.removeEventListener("mouseleave", mouseleave);
                if (xTo) xTo(0);
                if (yTo) yTo(0);
            });
        };
    }, [location]);

    // --- HYBRID DEVICE SUPPORT (FIX: Invisible Cursor on Touch Laptops) ---
    // Instead of checking maxTouchPoints (which is >0 on Surface/Laptops),
    // we check if the primary input mechanism is a "fine" pointer (Mouse/Trackpad).
    // This matches the CSS media query that hides the default cursor.
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    // Safety check for strictly touch devices (Mobile/Tablet without mouse)
    if (!hasFinePointer) return null;

    return (
        <div
            ref={cursorRef}
            className="cursor-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '30px',
                height: '30px',
                pointerEvents: 'none',
                zIndex: 100000,
                mixBlendMode: 'difference'
            }}
        >
            {/* 1. VISUAL BLOB (Deforms) */}
            <img
                ref={visualRef}
                src={cortexImg}
                alt="Cursor"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: 0, left: 0,
                    // FORCE WHITE for mix-blend-mode: difference to work (Invert Black -> White)
                    filter: 'brightness(0) invert(1)'
                }}
            />

            {/* 2. TEXT (Fixed scale) */}
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '8px',
                    color: '#000',
                    letterSpacing: '1px',
                    opacity: 0,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none'
                }}
            />
            <style>{`
                /* GLOBAL CURSOR HIDE */
                * {
                    cursor: none !important;
                }

                body.loading .cursor-container {
                    display: none !important;
                    opacity: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default Cursor;
