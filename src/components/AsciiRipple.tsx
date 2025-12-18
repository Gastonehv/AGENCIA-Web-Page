import React, { useEffect, useRef } from 'react';

/**
 * ASCII Ripple Effect Component
 * Wraps text with an interactive ASCII glitch hover effect.
 * Adapted from Bastien Cornier's experiment.
 */

interface AsciiRippleProps {
    text: string;
    className?: string;
    style?: React.CSSProperties;
}

const AsciiRipple: React.FC<AsciiRippleProps> = ({ text, className, style }) => {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        // --- ANIMATION LOGIC ---
        // Constants
        const WAVE_THRESH = 3;
        const CHAR_MULT = 3;
        const ANIM_STEP = 40;
        const WAVE_BUF = 5;

        // State
        const origTxt = text;
        const origChars = origTxt.split("");
        let isAnim = false;
        let cursorPos = 0;
        let waves: Array<{ startPos: number; startTime: number; id: number }> = [];
        let animId: number | null = null;
        let isHover = false;
        let origW: number | null = null;

        // Simple touch detection
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const cfg = {
            dur: isTouch ? 2000 : 600, // Slower/Breathing speed
            // Lighter chars (removed heavy blocks) for subtlety
            chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║!?&#$@0123456789',
            preserveSpaces: true,
            spread: isTouch ? 1.0 : 0.3, // Slightly less wide than before
        };

        const updateCursorPos = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const len = origTxt.length;
            const pos = Math.round((x / rect.width) * len);
            cursorPos = Math.max(0, Math.min(pos, len - 1));
        };

        const startWave = () => {
            waves.push({
                startPos: cursorPos,
                startTime: Date.now(),
                id: Math.random()
            });
            if (!isAnim) start();
        };

        const cleanupWaves = (t: number) => {
            waves = waves.filter((w) => t - w.startTime < cfg.dur);
        };

        const calcWaveEffect = (charIdx: number, t: number) => {
            let shouldAnim = false;
            let resultChar = origChars[charIdx];

            for (const w of waves) {
                const age = t - w.startTime;
                const prog = Math.min(age / cfg.dur, 1);
                const dist = Math.abs(charIdx - w.startPos);
                const maxDist = Math.max(w.startPos, origChars.length - w.startPos - 1);
                const rad = (prog * (maxDist + WAVE_BUF)) / cfg.spread;

                if (dist <= rad) {
                    shouldAnim = true;
                    const intens = Math.max(0, rad - dist);
                    if (intens <= WAVE_THRESH && intens > 0) {
                        const charIdxAnim = (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % cfg.chars.length;
                        resultChar = cfg.chars[charIdxAnim];
                    }
                }
            }
            return { shouldAnim, char: resultChar };
        };

        const genScrambledTxt = (t: number) =>
            origChars.map((char, i) => {
                if (cfg.preserveSpaces && char === " ") return " ";
                const res = calcWaveEffect(i, t);
                return res.shouldAnim ? res.char : char;
            }).join("");

        const stop = () => {
            el.textContent = origTxt;
            // Reset width
            if (origW !== null) {
                el.style.width = "";
                origW = null;
            }
            isAnim = false;
        };

        const start = () => {
            if (isAnim) return;
            // Lock width to prevent layout shift
            if (origW === null) {
                origW = el.getBoundingClientRect().width;
                el.style.width = `${origW}px`;
            }
            isAnim = true;

            const animate = () => {
                const t = Date.now();
                cleanupWaves(t);
                if (waves.length === 0) {
                    stop();
                    return;
                }
                el.textContent = genScrambledTxt(t);
                animId = requestAnimationFrame(animate);
            };
            animId = requestAnimationFrame(animate);
        };

        // Handlers
        const handleEnter = (e: MouseEvent) => {
            isHover = true;
            updateCursorPos(e);
            startWave();
        };

        const handleMove = (e: MouseEvent) => {
            if (!isHover) return;
            const old = cursorPos;
            updateCursorPos(e);
            if (cursorPos !== old) startWave();
        };

        const handleLeave = () => {
            isHover = false;
        };

        // Attach
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mousemove', handleMove);
        el.addEventListener('mouseleave', handleLeave);

        // --- MOBILE / TOUCH AUTO-ANIMATION ---
        let autoAnimInterval: number | undefined;
        if (isTouch) {
            autoAnimInterval = setInterval(() => {
                if (!isAnim) {
                    // Randomize "cursor" position for the wave origin
                    cursorPos = Math.floor(Math.random() * origTxt.length);
                    startWave();
                }
            }, 6000); // Trigger every 6 seconds
        }

        // Cleanup
        return () => {
            if (animId) cancelAnimationFrame(animId);
            if (autoAnimInterval) clearInterval(autoAnimInterval);
            el.removeEventListener('mouseenter', handleEnter);
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [text]); // Re-run if text changes

    return (
        <span
            ref={elementRef}
            className={className}
            style={{
                display: 'inline-block',
                cursor: 'pointer',
                // Ensure monospace for alignment
                // fontFamily: 'monospace', // Inherited usually
                whiteSpace: 'pre-wrap', // Handle wrapping
                ...style
            }}
        >
            {text}
        </span>
    );
};

export default AsciiRipple;
