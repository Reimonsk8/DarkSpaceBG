import React, { useEffect, useState } from 'react';

interface Pig {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface RainEffectProps {
  density?: number; // Number of elements per screen area
  emoji?: string; // Allow custom emoji
}

const RainEffect: React.FC<RainEffectProps> = ({ 
  density = 20, 
  emoji = '✨' 
}) => {
  const [pigs, setPigs] = useState<Pig[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Create initial pigs
  useEffect(() => {
    const initialPigs: Pig[] = [];
    const pigCount = Math.floor((dimensions.width * dimensions.height) / 50000 * density);
    
    for (let i = 0; i < pigCount; i++) {
      initialPigs.push(createRandomPig(i, dimensions.width, dimensions.height));
    }
    
    setPigs(initialPigs);
    
    // Update dimensions on window resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [density, dimensions.width, dimensions.height]);

  // Animation loop
  useEffect(() => {
    if (pigs.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setPigs(prevPigs => 
        prevPigs.map(pig => {
          // Move pig down
          let newY = pig.y + pig.speed;
          let newX = pig.x;
          let newRotation = pig.rotation + pig.rotationSpeed;
          
          // Reset position if pig goes off screen
          if (newY > dimensions.height + 50) {
            newY = -50;
            newX = Math.random() * dimensions.width;
          }
          
          return {
            ...pig,
            y: newY,
            x: newX,
            rotation: newRotation
          };
        })
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [pigs, dimensions.height, dimensions.width]);

  // Helper function to create a random pig
  const createRandomPig = (id: number, maxWidth: number, maxHeight: number): Pig => {
    return {
      id,
      x: Math.random() * maxWidth,
      y: Math.random() * maxHeight * -1 - 50, // Start above the screen
      speed: 1 + Math.random() * 3,
      size: 20 + Math.random() * 30,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2
    };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Allow clicking through the effect
      zIndex: 100,
      overflow: 'hidden'
    }}>
      {pigs.map(pig => (
        <div
          key={pig.id}
          style={{
            position: 'absolute',
            left: `${pig.x}px`,
            top: `${pig.y}px`,
            fontSize: `${pig.size}px`,
            transform: `rotate(${pig.rotation}deg)`,
            transition: 'transform 0.1s linear',
            userSelect: 'none'
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
};

export default RainEffect;