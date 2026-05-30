import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playClick: () => void;
    playHover: () => void;
    playWhoosh: () => void;
    playAmbient: () => void;
    stopAmbient: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true);
    const isMutedRef = useRef(true);

    useEffect(() => {
        isMutedRef.current = isMuted;
    }, [isMuted]);

    // Audio node references
    const audioCtxRef = useRef<AudioContext | null>(null);
    const schedulerIntervalRef = useRef<any>(null);

    // Initialize AudioContext
    const initAudio = () => {
        if (audioCtxRef.current) return audioCtxRef.current;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        return ctx;
    };

    // Play a clean, simple synthesized beep with a self-closing AudioContext for UI clicks
    const playBeep = (frequency: number, duration: number, volume: number) => {
        try {
            const ctx = initAudio();
            ctx.resume();

            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (err) {
            console.error("Error playing beep:", err);
        }
    };

    const playClick = () => {
        if (isMutedRef.current) return;
        playBeep(440, 0.12, 0.12); // Clean 440Hz beep
    };

    const playHover = () => {
        if (isMutedRef.current) return;
        playBeep(880, 0.04, 0.04); // Clean 880Hz beep
    };

    const playWhoosh = () => {
        if (isMutedRef.current) return;
        playBeep(220, 0.25, 0.1); // Clean 220Hz beep
    };

    // Synthesize Rhodes Electric Piano Chord & Bass
    const playChordAndBass = (ctx: AudioContext, barIndex: number, time: number) => {
        // Chord progression: Cmaj7 - Am7 - Fmaj7 - G7
        const chordPitches = [
            [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
            [110.00, 130.81, 164.81, 196.00], // Am7 (A2, C3, E3, G3)
            [87.31, 110.00, 130.81, 164.81],  // Fmaj7 (F2, A2, C3, E3)
            [98.00, 123.47, 146.83, 174.61]   // G7 (G2, B2, D3, F3)
        ];
        const bassPitches = [65.41, 55.00, 43.65, 49.00]; // C2, A1, F1, G1

        const chord = chordPitches[barIndex];
        const bass = bassPitches[barIndex];

        // 1. Synthesize Warm Deep Bass Note (Sine wave)
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bass, time);
        
        bassGain.gain.setValueAtTime(0.0, time);
        bassGain.gain.linearRampToValueAtTime(0.05, time + 0.05); // Soft attack
        bassGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.5); // Decay

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(time);
        bassOsc.stop(time + 2.6);

        // 2. Synthesize Warm Pad Chord (Triangle waves lowpass-filtered to sound like a Rhodes Piano)
        chord.forEach((freq) => {
            const osc = ctx.createOscillator();
            const filter = ctx.createBiquadFilter();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(320, time); // High-cut filter for cozy tone
            filter.Q.setValueAtTime(1.0, time);

            gain.gain.setValueAtTime(0.0, time);
            gain.gain.linearRampToValueAtTime(0.02, time + 0.15); // Smooth chord fade-in
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(time);
            osc.stop(time + 3.6);
        });
    };

    // Synthesize Bell Melody Notes (Sine waves with delay)
    const playMelodyBeat = (ctx: AudioContext, beat: number, time: number) => {
        // Pentatonic focus melody mapping: beat index -> frequency (E4, G4, A4, B4, C5, D5)
        const melodyMap: { [key: number]: number } = {
            0: 329.63,  // E4 (Bar 0 start)
            1: 392.00,  // G4
            2: 440.00,  // A4
            3: 392.00,  // G4
            4: 493.88,  // B4 (Bar 1 start)
            6: 440.00,  // A4
            7: 392.00,  // G4
            8: 523.25,  // C5 (Bar 2 start)
            9: 493.88,  // B4
            10: 440.00, // A4
            12: 587.33, // D5 (Bar 3 start)
            14: 523.25, // C5
            15: 493.88  // B4
        };

        const freq = melodyMap[beat];
        if (!freq) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = ctx.createDelay();
        const delayFeedback = ctx.createGain();
        const panner = ctx.createStereoPanner();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.0, time);
        gain.gain.linearRampToValueAtTime(0.025, time + 0.005); // Instant pluck
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

        panner.pan.setValueAtTime(Math.random() * 1.4 - 0.7, time); // Random spatial panning

        // Delay setup (333ms delay feedback for dreamy echo space)
        delay.delayTime.setValueAtTime(0.333, time);
        delayFeedback.gain.setValueAtTime(0.35, time);

        osc.connect(gain);
        gain.connect(panner);
        
        // Connect dry path
        panner.connect(ctx.destination);

        // Connect wet delay path
        panner.connect(delay);
        delay.connect(delayFeedback);
        delayFeedback.connect(delay);
        delay.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 1.3);
    };

    const startAmbient = () => {
        if (isMutedRef.current) return;
        
        const ctx = initAudio();
        ctx.resume();

        if (schedulerIntervalRef.current) return;

        let beat = 0;
        // Schedule notes one beat in advance to prevent browser event lag
        schedulerIntervalRef.current = setInterval(() => {
            if (isMutedRef.current) {
                if (schedulerIntervalRef.current) {
                    clearInterval(schedulerIntervalRef.current);
                    schedulerIntervalRef.current = null;
                }
                return;
            }

            const now = ctx.currentTime;
            const scheduleTime = now + 0.05; // 50ms scheduling buffer

            // 1. Play Chord & Bass every 4 beats (Bar start)
            if (beat % 4 === 0) {
                const barIndex = Math.floor(beat / 4);
                playChordAndBass(ctx, barIndex, scheduleTime);
            }

            // 2. Play Melody Note
            playMelodyBeat(ctx, beat, scheduleTime);

            beat = (beat + 1) % 16;
        }, 666); // 90 BPM = 666.6ms per beat
    };

    const stopAmbient = () => {
        if (schedulerIntervalRef.current) {
            clearInterval(schedulerIntervalRef.current);
            schedulerIntervalRef.current = null;
        }
    };

    const toggleMute = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        isMutedRef.current = nextMute;

        if (!nextMute) {
            playBeep(523.25, 0.15, 0.15); // Welcome sound
            startAmbient();
        } else {
            playBeep(349.23, 0.15, 0.12); // Shutdown sound
            stopAmbient();
        }
    };

    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            if (schedulerIntervalRef.current) {
                clearInterval(schedulerIntervalRef.current);
            }
        };
    }, []);

    // Handle tab visibility change
    useEffect(() => {
        const handleVisibilityChange = () => {
            const ctx = audioCtxRef.current;
            if (document.hidden) {
                if (ctx && ctx.state === 'running') {
                    ctx.suspend();
                }
            } else {
                if (ctx && ctx.state === 'suspended' && !isMutedRef.current) {
                    ctx.resume();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const playAmbient = () => {
        if (!isMutedRef.current) {
            startAmbient();
        }
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playClick, playHover, playWhoosh, playAmbient, stopAmbient }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error('useSound must be used within a SoundProvider');
    return context;
};
