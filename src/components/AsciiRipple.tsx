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
    autoTrigger?: boolean;
    trigger?: any; // New prop
}

const AsciiRipple: React.FC<AsciiRippleProps> = ({ text, className, style, autoTrigger = false, trigger }) => {
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        // ... [EXISTING LOGIC REMAINS, but we add trigger watcher] ...
        // Note: Writing full logic again is expensive, I will use a separate useEffect for the trigger or inject it into the main one.
        // BUT replace_file_content requires replacing the block. 
        // Strategy: I will replace the top part to add props, and then add a specific useEffect for the trigger.

        // Actually, let's keep it simple. I'll just add the trigger watcher at the bottom of the existing useEffect logic if I can find a good insertion point, OR just replace the whole useEffect if needed.
        // It's safer to just restart the logic if trigger changes.

        // --- ANIMATION LOGIC ---
        // Constants (Redefined inside scope)
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
            dur: isTouch ? 2000 : 600,
            chars: '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║!?&#$@0123456789',
            preserveSpaces: true,
            spread: isTouch ? 1.0 : 0.3,
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
            isAnim = false;
        };

        const start = () => {
            if (isAnim) return;
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

        // --- AUTO-ANIMATION ("FLASHAZOS") ---
        let autoAnimInterval: number | undefined;
        if (isTouch || autoTrigger) {
            const randomDelay = Math.random() * 2000;
            setTimeout(() => {
                autoAnimInterval = setInterval(() => {
                    if (!isAnim) {
                        cursorPos = Math.floor(Math.random() * origTxt.length);
                        startWave();
                    }
                }, 4000 + Math.random() * 3000);
            }, randomDelay);
        }

        // --- SC: TRIGGER RESPONSE ---
        if (trigger) {
            cursorPos = Math.floor(Math.random() * origTxt.length);
            startWave();
        }

        // Cleanup
        return () => {
            if (animId) cancelAnimationFrame(animId);
            if (autoAnimInterval) clearInterval(autoAnimInterval);
            el.removeEventListener('mouseenter', handleEnter);
            el.removeEventListener('mousemove', handleMove);
            el.removeEventListener('mouseleave', handleLeave);
        };
    }, [text, trigger]); // Dependency updated

    return (
        <span
            ref={elementRef}
            className={className}
            style={{
                display: 'inline-block',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono, monospace)', // SC: FORCED MONO to prevent "brincos"
                whiteSpace: 'pre-wrap',
                ...style
            }}
        >
            {text}
        </span>
    );
};

export default AsciiRipple;
