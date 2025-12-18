import React from 'react';
import crystalVideo from '../assets/videos/cristal.mp4';

const CrystalScroller: React.FC = () => {
    return (
        <div style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            zIndex: 0,
            backgroundColor: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <video
                src={crystalVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{
                    width: '85%',
                    height: '85%',
                    objectFit: 'contain'
                }}
            />
            {/* Overlay to ensure text readability if needed */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', pointerEvents: 'none' }} />
        </div>
    );
};

export default CrystalScroller;
