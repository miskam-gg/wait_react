import React, { useEffect, useState, useRef } from 'react';
import './ZhduLogo.css';

const ZhduLogo = () => {
  const textRef = useRef(null);
  const [position, setPosition] = useState({
    x: Math.floor(Math.random() * (window.innerWidth - 100)),
    y: Math.floor(Math.random() * (window.innerHeight - 50)),
  });

  const [direction, setDirection] = useState({ x: 2, y: 2 });
  const [waves, setWaves] = useState([]);
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const [resetKey, setResetKey] = useState(0); // Используемый ключ для перезапуска

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color === '#FFFFFF' ? '#000000' : color;
  };

  const [color, setColor] = useState(getRandomColor());

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setResetKey((prevKey) => prevKey + 1); // Перезапуск скрипта при изменении размера окна
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateTextSize = () => {
    if (textRef.current) {
      setTextSize({
        width: textRef.current.offsetWidth,
        height: textRef.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    updateTextSize();
  }, [color, resetKey]); // Обновляем размер текста при изменении цвета или перезапуске

  useEffect(() => {
    const moveLogo = () => {
      if (!textRef.current) return;

      const textWidth = textSize.width;
      const textHeight = textSize.height;

      const newX = position.x + direction.x;
      const newY = position.y + direction.y;

      const hitRight = newX + textWidth >= windowSize.width;
      const hitLeft = newX <= 0;
      const hitBottom = newY + textHeight >= windowSize.height;
      const hitTop = newY <= 0;

      if (hitRight || hitLeft) {
        setDirection((prev) => ({ ...prev, x: -prev.x }));
        setColor(getRandomColor());
        createWaves(hitRight ? windowSize.width : 0, position.y + textHeight / 2);
      }

      if (hitBottom || hitTop) {
        setDirection((prev) => ({ ...prev, y: -prev.y }));
        setColor(getRandomColor());
        createWaves(position.x + textWidth / 2, hitBottom ? windowSize.height : 0);
      }

      setPosition({ x: newX, y: newY });
    };

    const interval = setInterval(moveLogo, 20);

    return () => clearInterval(interval);
  }, [position, direction, windowSize, textSize, resetKey]);

  const createWaves = (x, y) => {
    const numberOfWaves = Math.random() < 0.5 ? 3 : 5;

    for (let i = 0; i < numberOfWaves; i++) {
      const id = Date.now() + i;
      setWaves((prevWaves) => [...prevWaves, { id, x, y, delay: i * 400 }]);

      setTimeout(() => {
        setWaves((prevWaves) => prevWaves.filter((wave) => wave.id !== id));
      }, 4000 + i * 400);
    }
  };

  return (
    <>
      <div
        ref={textRef}
        className="logo"
        style={{
          left: position.x,
          top: position.y,
          color: color,
        }}
      >
        WAIT
      </div>
      {waves.map((wave) => (
        <div
          key={wave.id}
          className="wave"
          style={{
            left: wave.x,
            top: wave.y,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${wave.delay}ms`,
          }}
        />
      ))}
    </>
  );
};

export default ZhduLogo;
