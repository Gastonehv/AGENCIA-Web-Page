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
                const bounds = hoverEl.getBoundingClientRect();
                const cx = bounds.x + bounds.width / 2;
                const cy = bounds.y + bounds.height / 2;

                const dx = x - cx;
                const dy = y - cy;

                // EXCLUSION ZONE: No magnetism in Capacities section or specifically marked elements
                const isExcluded = hoverEl.closest('#capacidades') || hoverEl.closest('[data-no-magnetic]');
                if (isExcluded) {
                    position.target.x = x;
                    position.target.y = y;
                } else {
                    position.target.x = cx + dx * 0.15;
                    position.target.y = cy + dy * 0.15;
                }

                // Check for custom cursor type
                const cursorType = hoverEl.getAttribute('data-cursor');

                if (cursorType === 'open') {
                    scale.target = 2.5; // MINIMALIST GLASS CORTEX (Small & Elegant)
                    text.textContent = ""; // SILENCE (No Text)
                    text.style.opacity = '0';

                    // Visual Style for OPEN
                    el.style.mixBlendMode = 'normal';

                    // PURE CORTEX with subtle glass lift
                    visual.style.backgroundColor = 'transparent'; // No background
                    visual.style.backdropFilter = 'none'; // No blur box
                    visual.style.border = 'none'; // No border
                    visual.style.boxShadow = 'none'; // No box shadow
                    // Just the brain, slightly glowing/lifted
                    visual.style.filter = 'drop-shadow(0 5px 15px rgba(0,0,0,0.3)) brightness(1.1)';

                    // Reset Text (Unused)
                    text.style.fontSize = '0px';
                } else {
                    scale.target = 1;
                    text.textContent = "";
                    text.style.opacity = '0';

                    // Reset Visual Style
                    el.style.mixBlendMode = 'difference';
                    visual.style.backgroundColor = 'transparent';
                    visual.style.backdropFilter = 'none';
                    visual.style.border = 'none';
                    visual.style.boxShadow = 'none';
                    visual.style.filter = 'brightness(0) invert(1)'; // RESTORE WHITE MASK
                }
            } else {
                position.target.x = x;
                position.target.y = y;
                scale.target = 1;
                text.textContent = "";
                text.style.opacity = '0';

                el.style.mixBlendMode = 'difference';
                visual.style.backgroundColor = 'transparent';
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
            // On scroll, if we are hovering, we need to check if we should stay hovering
            // To be safe and "silky", we reset hover if scrolling and mouse is static
            if (isHovered) {
                updateTargetPosition(lastMouseX, lastMouseY);
            }
        };

        const addListeners = () => {
            const targets = document.querySelectorAll('a, button, input, textarea, .hover-target, .rift-row, [data-cursor]');

            targets.forEach((target) => {
                const element = target as HTMLElement;
                if (boundElements.has(element)) return;
                boundElements.add(element);

                const isLarge = element.offsetWidth > 200 || element.offsetHeight > 100;

                if (!isLarge) {
                    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
                    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

                    const elementMouseMove = (e: MouseEvent) => {
                        const { clientX, clientY } = e;
                        const { left, top, width, height } = element.getBoundingClientRect();
                        const cx = left + width / 2;
                        const cy = top + height / 2;
                        const x = clientX - cx;
                        const y = clientY - cy;

                        const isExcluded = element.closest('[data-no-magnetic]');

                        if (element.closest('#capacidades') || isExcluded) {
                            xTo(0);
                            yTo(0);
                            return;
                        }

                        xTo(x * 0.1);
                        yTo(y * 0.1);
                    };

                    const elementMouseLeave = () => {
                        xTo(0);
                        yTo(0);
                    };

                    element.addEventListener("mousemove", elementMouseMove);
                    element.addEventListener("mouseleave", elementMouseLeave);
                    elementListeners.push({ element, mousemove: elementMouseMove, mouseleave: elementMouseLeave, xTo, yTo });
                }

                const cursorMouseEnter = () => {
                    isHovered = true;
                    hoverEl = element;
                };
                const cursorMouseLeave = () => {
                    isHovered = false;
                    hoverEl = null;

                    if (text) {
                        text.textContent = "";
                        text.style.opacity = '0';
                    }
                    if (el) el.style.mixBlendMode = 'difference';
                    if (visual) visual.style.backgroundColor = '#fff';
                    scale.target = 1;
                };

                element.addEventListener('mouseenter', cursorMouseEnter);
                element.addEventListener('mouseleave', cursorMouseLeave);
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
                xTo(0);
                yTo(0);
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
                body.loading .cursor-container {
                    display: none !important;
                    opacity: 0 !important;
                }
            `}</style>
        </div>
    );
};

export default Cursor;
