import React, { useRef } from 'react';
import { useSound } from '../context/SoundContext';

const SoundToggle: React.FC = () => {
    const { isMuted, toggleMute, playClick, playHover } = useSound();
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        playClick();
        toggleMute();
        if (btnRef.current) {
            btnRef.current.animate(
                [{ transform: 'scale(0.85)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }],
                { duration: 240, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
            );
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '28px', left: '28px', zIndex: 999999 }}>
            <div className="st-wrap">
                <button
                    ref={btnRef}
                    onClick={handleClick}
                    onMouseEnter={() => { if (!isMuted) playHover(); }}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                    className={`st-btn ${isMuted ? 'st-muted' : 'st-on'}`}
                >
                    {/* 3-bar minimal EQ — stays compact and readable */}
                    <div className="st-eq">
                        {[0.6, 1, 0.75].map((h, i) => (
                            <div
                                key={i}
                                className={`st-bar ${isMuted ? '' : 'st-bar--live'}`}
                                style={{
                                    '--bar-h': h,
                                    '--bar-delay': `${i * 0.14}s`,
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </button>
                <span className="st-label">{isMuted ? 'off' : 'on'}</span>
            </div>

            <style>{`
                .st-wrap {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                }
                .st-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(4, 7, 14, 0.5);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: border-color .3s, box-shadow .3s;
                    outline: none;
                    padding: 0;
                }
                .st-on {
                    border-color: rgba(0,255,153,0.2);
                }
                .st-btn:hover {
                    border-color: rgba(0,255,153,0.5);
                    box-shadow: 0 0 10px rgba(0,255,153,0.12);
                }
                /* EQ container */
                .st-eq {
                    display: flex;
                    align-items: flex-end;
                    gap: 2px;
                    width: 13px;
                    height: 10px;
                }
                /* Each bar */
                .st-bar {
                    flex: 1;
                    border-radius: 1px;
                    background: rgba(255,255,255,0.3);
                    height: calc(var(--bar-h) * 10px);
                    transition: background .3s, height .25s;
                }
                .st-bar--live {
                    background: #00FF99;
                    animation: st-eq calc(0.55s + var(--bar-delay)) var(--bar-delay) infinite ease-in-out alternate;
                }
                @keyframes st-eq {
                    from { transform: scaleY(0.25); }
                    to   { transform: scaleY(1);    }
                }
                /* Tooltip */
                .st-label {
                    position: absolute;
                    left: calc(100% + 7px);
                    font-family: var(--font-mono);
                    font-size: 0.45rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.35);
                    pointer-events: none;
                    opacity: 0;
                    transform: translateX(-3px);
                    transition: opacity .2s, transform .2s;
                    white-space: nowrap;
                }
                .st-wrap:hover .st-label {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>
        </div>
    );
};

export default SoundToggle;
