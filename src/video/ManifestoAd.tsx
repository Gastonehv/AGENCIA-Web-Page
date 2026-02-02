import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Cargar fuente agresiva
const { fontFamily } = loadFont();

const Title = ({ text, color, bg }: { text: string; color: string; bg: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Efecto de entrada "Golpe" (Scale down rapido)
  const scale = interpolate(frame, [0, 5], [1.5, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame, [0, 3], [0, 1]);
  
  // Efecto Glitch (pequeño temblor aleatorio simulado)
  const shakeX = interpolate(frame % 2, [0, 1], [-2, 2]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
      <h1
        style={{
          fontFamily,
          fontSize: '120px',
          fontWeight: 900,
          color: color,
          textTransform: 'uppercase',
          transform: `scale(${scale}) translateX(${shakeX}px)`,
          opacity,
          letterSpacing: '-5px',
          lineHeight: '0.9',
          textAlign: 'center'
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};

const FlashWord = ({ word }: { word: string }) => {
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
            <h1 style={{ fontFamily, fontSize: '150px', color: '#fff', fontWeight: 'bold' }}>{word}</h1>
        </AbsoluteFill>
    )
}

export const ManifestoAd = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* SCENE 1: AGRESIVO - NEGRO */}
      <Sequence from={0} durationInFrames={30}>
        <Title text="TU WEB\nESTÁ MUERTA" color="white" bg="black" />
      </Sequence>

      {/* SCENE 2: INVERSION - BLANCO */}
      <Sequence from={30} durationInFrames={25}>
        <Title text="NADIE\nTE VE" color="black" bg="white" />
      </Sequence>

      {/* SCENE 3: PALABRAS RAPIDAS (SUBLIMINAL) */}
      <Sequence from={55} durationInFrames={5}>
        <FlashWord word="CÓDIGO" />
      </Sequence>
      <Sequence from={60} durationInFrames={5}>
        <FlashWord word="ARTE" />
      </Sequence>
      <Sequence from={65} durationInFrames={5}>
        <FlashWord word="VENTAS" />
      </Sequence>

      {/* SCENE 4: CIERRE - IDENTIDAD */}
      <Sequence from={70} durationInFrames={60}>
         <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontFamily, fontSize: '80px', color: '#fff', letterSpacing: '10px' }}>AGENC<span style={{color: '#4f46e5'}}>IA</span></h1>
            <p style={{ fontFamily, fontSize: '30px', color: '#666', marginTop: '20px' }}>CAPITALIZA EL CAOS</p>
         </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
