import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

interface ScrambleTextProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
    speed?: number;
    delay?: number;
    scrambleColor?: string;
    finalColor?: string;
    iridescent?: boolean;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    className = '',
    style = {},
    speed = 1.0,
    delay = 0,
    scrambleColor = '#00FFFF',
    finalColor = '#FFFFFF',
    iridescent = false,
}) => {
    const elRef = useRef<HTMLSpanElement>(null);
    const isPlayingRef = useRef(false);

    // Inject CSS for the iridescent shimmer once
    useLayoutEffect(() => {
        if (!iridescent || document.getElementById('scramble-iridescent-style')) return;

        const css = `
            @keyframes scramble-shine {
                0% { color: #FFCCFF; text-shadow: 0 0 8px rgba(255, 0, 255, 0.7); }   /* 20% Magenta */
                33% { color: #CCFFFF; text-shadow: 0 0 8px rgba(0, 255, 255, 0.7); }  /* 20% Cyan */
                66% { color: #FFFFFF; text-shadow: 0 0 8px rgba(255, 255, 255, 0.8); } /* Pure White */
                100% { color: #FFCCFF; text-shadow: 0 0 8px rgba(255, 0, 255, 0.7); }
            }
            .scramble-iridescent {
                animation: scramble-shine 0.1s linear infinite; /* TRIPLE SPEED */
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.id = 'scramble-iridescent-style';
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);

        return () => {
            // Optional cleanup
        };
    }, [iridescent]);

    // Safety Patch removed


    useLayoutEffect(() => {
        const el = elRef.current;
        if (!el) return;

        // We take full control of the innerText. React has no children to diff.
        if (el.innerText !== text && !isPlayingRef.current) {
            el.innerText = text; // Initialize/Reset
        }

        const ctx = gsap.context(() => {
            const length = text.length;
            const animObj = { p: 0 };
            let animationTween: gsap.core.Tween | null = null;
            let observer: IntersectionObserver | null = null;

            const getChaos = () => {
                let s = "";
                for (let i = 0; i < length; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
                return s;
            };

            const cleanupLocalAnimation = () => {
                if (animationTween) animationTween.kill();
                gsap.killTweensOf(el);
                gsap.killTweensOf(animObj);
                isPlayingRef.current = false;
            };

            const runAnimation = () => {
                if (isPlayingRef.current) return;
                isPlayingRef.current = true;

                cleanupLocalAnimation();
                animObj.p = 0;

                if (iridescent) {
                    el.classList.add('scramble-iridescent');
                    el.style.color = '';
                    el.style.webkitTextFillColor = 'initial';
                } else {
                    el.classList.remove('scramble-iridescent');
                    el.style.color = scrambleColor;
                }

                el.innerText = getChaos();
                gsap.set(el, { autoAlpha: 1 });

                animationTween = gsap.to(animObj, {
                    p: 1,
                    duration: speed,
                    delay: delay,
                    ease: "power2.out",
                    onUpdate: () => {
                        const progress = animObj.p;
                        const revealIdx = Math.floor(progress * length);
                        let newText = "";
                        for (let i = 0; i < length; i++) {
                            if (i < revealIdx) newText += text[i];
                            else newText += CHARS[Math.floor(Math.random() * CHARS.length)];
                        }
                        el.innerText = newText;
                    },
                    onComplete: () => {
                        el.innerText = text;
                        el.classList.remove('scramble-iridescent');
                        gsap.to(el, { color: finalColor, duration: 0.2, overwrite: true });
                        isPlayingRef.current = false;
                    }
                });
            };

            const stopAnimation = () => {
                cleanupLocalAnimation();
                el.innerText = text;
                isPlayingRef.current = false;
            };

            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) runAnimation();
                    else stopAnimation();
                });
            }, {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0
            });

            observer.observe(el);

            return () => {
                observer?.disconnect();
            };
        });

        return () => ctx.revert();
    }, [text, speed, delay, scrambleColor, finalColor, iridescent]);

    return (
        <span
            ref={elRef}
            className={className}
            style={{
                fontFamily: 'monospace',
                display: 'inline-block',
                minWidth: '20px',
                opacity: 1,
                visibility: 'visible',
                willChange: 'opacity, transform',
                ...style
            }}
            aria-label={text}
        >
            {/* NO CHILDREN: PREVENTS REACT RECONCILIATION FROM WIPING CONTENT */}
        </span>
    );
};

export default React.memo(ScrambleText);
