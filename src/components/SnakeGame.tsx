import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 90;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    setFood(newFood!);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    generateFood(INITIAL_SNAKE);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      if (e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        if (!hasStarted) setHasStarted(true);
        return;
      }

      if (isPaused || !hasStarted) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    },
    [isGameOver, isPaused, hasStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isGameOver || isPaused || !hasStarted) return;

    const speed = Math.max(30, BASE_SPEED - score * 1.5);

    const moveSnake = () => {
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const currentDir = directionRef.current;

      const head = currentSnake[0];
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [isGameOver, isPaused, hasStarted, score, generateFood, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-2xl">
      <div className="w-full border-4 border-[#00FFFF] bg-black p-4 md:p-6 relative">
        {/* Decorative Corners */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF00FF]"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FF00FF]"></div>
        
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b-4 border-[#FF00FF] pb-3 mb-6">
          <span className="text-[#FF00FF] text-2xl tracking-widest">EXECUTION_ENVIRONMENT</span>
          <span className="text-[#00FFFF] text-2xl animate-pulse">[ACTIVE]</span>
        </div>

        <div className="flex justify-center">
          <div 
            className="relative bg-black border-2 border-[#FF00FF] overflow-hidden"
            style={{
              width: `${GRID_SIZE * 20}px`,
              height: `${GRID_SIZE * 20}px`,
            }}
          >
            {/* Grid lines */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)`,
                backgroundSize: `20px 20px`
              }}
            />

            {/* Food */}
            <div
              className="absolute bg-[#FF00FF] animate-pulse"
              style={{
                left: `${food.x * 20}px`,
                top: `${food.y * 20}px`,
                width: '20px',
                height: '20px',
              }}
            />

            {/* Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute ${
                    isHead 
                      ? 'bg-[#FF00FF] z-10' 
                      : 'bg-[#00FFFF]'
                  }`}
                  style={{
                    left: `${segment.x * 20}px`,
                    top: `${segment.y * 20}px`,
                    width: '20px',
                    height: '20px',
                  }}
                />
              );
            })}

            {/* Overlays */}
            {(!hasStarted || isPaused || isGameOver) && (
              <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 screen-tear">
                <div className="text-center p-8 bg-black border-4 border-[#FF00FF]">
                  {isGameOver ? (
                    <>
                      <h2 className="text-3xl font-pixel text-[#FF00FF] mb-4">CRITICAL_FAILURE</h2>
                      <p className="text-[#00FFFF] text-2xl mb-8">DATA_YIELD: {score}</p>
                      <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-black border-2 border-[#00FFFF] text-[#00FFFF] text-xl font-pixel hover:bg-[#00FFFF] hover:text-black uppercase"
                      >
                        REBOOT_SEQUENCE
                      </button>
                    </>
                  ) : !hasStarted ? (
                    <>
                      <h2 className="text-3xl font-pixel text-[#00FFFF] mb-4">AWAITING_INPUT</h2>
                      <p className="text-[#FF00FF] text-xl mb-8">W_A_S_D // ARROWS<br/>SPACE_TO_HALT</p>
                      <button
                        onClick={resetGame}
                        className="px-8 py-4 bg-black border-2 border-[#FF00FF] text-[#FF00FF] text-xl font-pixel hover:bg-[#FF00FF] hover:text-black uppercase"
                      >
                        INITIALIZE_SYSTEM
                      </button>
                    </>
                  ) : isPaused ? (
                    <>
                      <h2 className="text-3xl font-pixel text-[#00FFFF] mb-8">SYSTEM_HALTED</h2>
                      <button
                        onClick={() => setIsPaused(false)}
                        className="px-8 py-4 bg-black border-2 border-[#00FFFF] text-[#00FFFF] text-xl font-pixel hover:bg-[#00FFFF] hover:text-black uppercase"
                      >
                        RESUME_EXECUTION
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
