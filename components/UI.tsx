
import React from 'react';
import { ShapeType, HandData } from '../types';

interface UIProps {
  currentShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  color: string;
  onColorChange: (color: string) => void;
  handData: HandData;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
}

const UI: React.FC<UIProps> = ({ 
  currentShape, 
  onShapeChange, 
  color, 
  onColorChange, 
  handData,
  isFullScreen,
  toggleFullScreen
}) => {
  const shapes = [
    { id: ShapeType.BOTTLE, label: 'Bottle', icon: '🍾' },
    { id: ShapeType.SPHERE, label: 'Sphere', icon: '⚽' },
    { id: ShapeType.CUBE, label: 'Cube', icon: '🧊' },
    { id: ShapeType.TORUS, label: 'Torus', icon: '🍩' },
    { id: ShapeType.HEART, label: 'Heart', icon: '❤️' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="glass p-4 rounded-xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Gemini Gesture Particles
          </h1>
          <p className="text-xs text-white/50">Real-time Hand Interaction & Morphing</p>
        </div>
        <button 
          onClick={toggleFullScreen}
          className="glass p-3 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
        >
          {isFullScreen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          )}
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
        {/* Left Side: Shape Selection */}
        <div className="glass p-4 rounded-2xl flex flex-col gap-3 pointer-events-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Choose Pattern</span>
          <div className="flex gap-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => onShapeChange(s.id)}
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${
                  currentShape === s.id ? 'bg-white/20 scale-105 border border-white/40' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="text-[10px] mt-1">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Hand Info (Visualizer) */}
        <div className="glass px-6 py-3 rounded-full flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${handData.detected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {handData.detected ? (
              handData.isOpen ? '🖐️ Hand Open - Spreading' : '✊ Hand Closed - Contracting'
            ) : 'Looking for Hand...'}
          </span>
          {handData.detected && (
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-100" 
                style={{ width: `${handData.pinchDistance * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Right Side: Visual Style */}
        <div className="glass p-4 rounded-2xl pointer-events-auto">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60 block mb-2">Particle Color</span>
              <input 
                type="color" 
                value={color} 
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full h-8 rounded cursor-pointer bg-transparent border-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <div className="fixed top-1/2 right-12 transform rotate-90 origin-right text-white/10 text-6xl font-bold select-none whitespace-nowrap">
        MORPH & GESTURE
      </div>
    </div>
  );
};

export default UI;
