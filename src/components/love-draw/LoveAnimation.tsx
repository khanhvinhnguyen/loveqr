'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'classnames';

const HEART_COLORS = ['#ff4d6d', '#ff5976', '#ff6d88'];
const SPAWN_MS = 180;
const FALL_S = 4;
const MAX_HEARTS = 80;

interface Heart {
  id: number;
  x: number;
  size: number;
  delay: number;
  color: string;
}

interface LoveAnimationProps {
  texts?: string[];
  cycleInterval?: number;
  maxWidthRatio?: number;
}

export default function LoveAnimation({
  texts = ['i love you'],
  cycleInterval = 6,
  maxWidthRatio = 0.7,
}: LoveAnimationProps) {

  const [hearts, setHearts] = useState<Heart[]>([]);
  const [idx, setIdx] = useState(0);
  const currentText = texts[idx];

  useEffect(() => {
    let id = 0;
    const t = setInterval(() => {
      setHearts((prev) =>
        prev.length > MAX_HEARTS
          ? prev.slice(1)
          : [
            ...prev,
            {
              id: id++,
              x: Math.random() * 100,
              size: 45 + Math.random() * 100,
              delay: Math.random() * 0.5,
              color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
            },
          ],
      );
    }, SPAWN_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (texts.length <= 1) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % texts.length),
      cycleInterval * 1000,
    );
    return () => clearInterval(t);
  }, [texts, cycleInterval]);

  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const text = svg.querySelector('text');
    if (!text) return;
  }, [currentText, maxWidthRatio]);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    setDimensions({
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.7
    });
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.7
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-gradient-to-b from-rose-300 to-rose-200">
      <motion.svg
        ref={svgRef}
        key={currentText}
        viewBox="0 0 1024 240"
        className="absolute z-20"
      >
        {/* 1. Nét trắng “vẽ tay” */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Dancing Script', cursive"
          fontSize="120"
          fill="none"
          stroke="#fff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3000"
          initial={{ strokeDashoffset: 3000 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        >
          {currentText}
        </motion.text>

        {/* 2. Lấp màu hồng */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Dancing Script', cursive"
          fontSize="120"
          fill="#ff4d6d"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          {currentText}
        </motion.text>
      </motion.svg>

      {/* Heart */}
      <AnimatePresence mode="wait">
        <motion.svg
          key={`heart-${idx}`}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 380 340"
          className="absolute"
          initial={{ strokeDashoffset: 1700 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.3 }}
        >
          <path
            d="M190 315s150-74 150-190c0-53-39-88-88-88-45 0-62 40-62 40s-17-40-62-40c-49 0-88 35-88 88 0 116 150 190 150 190z"
            fill="none"
            stroke="#fff"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1700"
          />
        </motion.svg>
      </AnimatePresence>

      {hearts.map(({ id, x, size, delay, color }) => (
        <motion.span
          key={id}
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: '-50%', opacity: [0, 1, 1, 0] }}
          transition={{ delay, duration: FALL_S, ease: 'easeInOut' }}
          style={{ left: `${x}%`, fontSize: size, color }}
          className={clsx(
            'absolute bottom-0 select-none pointer-events-none scale-150',
            id % 2 ? 'rotate-[15deg]' : 'rotate-[-12deg]',
          )}
        >
          ♥
        </motion.span>
      ))}
    </div>
  );
}
