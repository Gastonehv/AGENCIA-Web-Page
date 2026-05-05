import React, { useMemo } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  type?: 'chars' | 'words';
  style?: React.CSSProperties;
}

const SplitText: React.FC<SplitTextProps> = ({ 
  text, 
  className = '', 
  wordClassName = '', 
  charClassName = '', 
  type = 'chars',
  style = {}
}) => {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <span className={`split-text-container ${className}`} style={{ display: 'inline-block', ...style }}>
      {words.map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          className={`split-word ${wordClassName}`} 
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {type === 'chars' ? (
            word.split('').map((char, charIndex) => (
              <span 
                key={charIndex} 
                className={`split-char ${charClassName}`} 
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))
          ) : (
            word
          )}
          {/* Añadir espacio después de cada palabra excepto la última */}
          {wordIndex < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
