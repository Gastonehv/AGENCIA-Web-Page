import React from 'react';
import { useSound } from '../context/SoundContext';

const SoundToggle: React.FC = () => {
    const { isMuted, toggleMute, playClick } = useSound();

    const handleClick = () => {
        playClick();
        toggleMute();
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 999999, // Super elevado
            pointerEvents: 'auto'
        }}>
            <button
                onClick={handleClick}
                style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid #00FF99',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: isMuted ? '#666' : '#00FF99',
                    letterSpacing: '0.2em',
                    boxShadow: isMuted ? 'none' : '0 0 20px rgba(0,255,153,0.3)',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', gap: '3px', height: '15px', alignItems: 'center' }}>
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '2px',
                                height: isMuted ? '2px' : '100%',
                                background: isMuted ? '#444' : '#00FF99',
                                animation: isMuted ? 'none' : `soundWave 0.${i + 2}s infinite alternate`
                            }}
                        />
                    ))}
                </div>
                <span>{isMuted ? 'AUDIO_OFF' : 'AUDIO_ON'}</span>
            </button>
            <style>{`
                @keyframes soundWave {
                    0% { transform: scaleY(0.3); }
                    100% { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default SoundToggle;
