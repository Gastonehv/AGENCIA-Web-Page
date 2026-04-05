import React, { createContext, useContext, useState } from 'react';
import { Howl } from 'howler';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playClick: () => void;
    playWhoosh: () => void;
    playAmbient: () => void;
    stopAmbient: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(true); // Muted by default for UX

    // --- SOUND ASSETS (Fine & Sophisticated) ---
    const sounds = {
        click: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], volume: 0.2 }),
        whoosh: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], volume: 0.1 }),
        ambient: new Howl({
            src: ['https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3'],
            loop: true,
            volume: 0.05,
            html5: true
        })
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (isMuted) {
            sounds.ambient.play();
        } else {
            sounds.ambient.pause();
        }
    };

    const playClick = () => !isMuted && sounds.click.play();
    const playWhoosh = () => !isMuted && sounds.whoosh.play();
    const playAmbient = () => !isMuted && sounds.ambient.play();
    const stopAmbient = () => sounds.ambient.stop();

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, playClick, playWhoosh, playAmbient, stopAmbient }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) throw new Error('useSound must be used within a SoundProvider');
    return context;
};
