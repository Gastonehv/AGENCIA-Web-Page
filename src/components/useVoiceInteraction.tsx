import { useState, useEffect, useCallback } from 'react';

interface VoiceState {
    isListening: boolean;
    isSpeaking: boolean;
    transcript: string;
    lastSpeakingTime: number;
}

export const useVoiceInteraction = () => {
    const [state, setState] = useState<VoiceState>({
        isListening: false,
        isSpeaking: false,
        transcript: '',
        lastSpeakingTime: 0
    });

    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log("Voces disponibles:", voices.length);
            setAvailableVoices(voices);
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => {
            window.speechSynthesis.cancel(); // Silenciar al desmontar
        };
    }, []);

    const speak = useCallback((text: string) => {
        if (!text) return;

        // Cancelar cualquier audio previo
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configuración de voz "Angelical/Latina"
        utterance.rate = 0.9; // Un poco más lento y claro
        utterance.pitch = 1.1; // Ligeramente agudo (femenino/joven)
        utterance.volume = 1.0;

        // Selección de voz (Prioridad: México -> Latino -> Español genérico)
        const voice = availableVoices.find(v => v.lang === 'es-MX' && v.name.includes('Mexico')) ||
            availableVoices.find(v => v.lang === 'es-MX') ||
            availableVoices.find(v => v.lang.includes('es') && v.name.includes('Female')) ||
            availableVoices.find(v => v.lang.includes('es'));

        if (voice) {
            utterance.voice = voice;
            console.log("Voz seleccionada:", voice.name);
        }

        utterance.onstart = () => setState(s => ({ ...s, isSpeaking: true }));
        utterance.onend = () => setState(s => ({ ...s, isSpeaking: false, lastSpeakingTime: Date.now() }));
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setState(s => ({ ...s, isSpeaking: false }));
        };

        window.speechSynthesis.speak(utterance);
    }, [availableVoices]);

    const startListening = useCallback(() => {
        // En un entorno real usaríamos window.SpeechRecognition
        // Para este demo, simularemos la escucha para garantizar que el escenario "Semillas" funciona perfecto
        setState(s => ({ ...s, isListening: true, transcript: '' }));

        // Simulación de "Escuchando..."
        setTimeout(() => {
            setState(s => ({ ...s, isListening: false }));
        }, 2000);

    }, []);

    return {
        ...state,
        speak,
        startListening,
        setTranscript: (text: string) => setState(s => ({ ...s, transcript: text }))
    };
};
