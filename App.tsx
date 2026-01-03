
import React, { useState, useCallback } from 'react';
import Scene from './components/Scene';
import HandTrack from './components/HandTrack';
import UI from './components/UI';
import { ShapeType, HandData } from './types';

const App: React.FC = () => {
  const [shape, setShape] = useState<ShapeType>(ShapeType.BOTTLE);
  const [color, setColor] = useState('#4fa3ff');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [handData, setHandData] = useState<HandData>({
    isOpen: false,
    pinchDistance: 0.5,
    x: 0,
    y: 0,
    detected: false
  });

  const handleHandUpdate = useCallback((data: HandData) => {
    setHandData(data);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Content */}
      <Scene shape={shape} color={color} handData={handData} />

      {/* Hand Tracking Camera Preview */}
      <HandTrack onHandUpdate={handleHandUpdate} />

      {/* Interactive UI Overlays */}
      <UI 
        currentShape={shape} 
        onShapeChange={setShape} 
        color={color} 
        onColorChange={setColor}
        handData={handData}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
      />

      {/* Subtle overlay instructions */}
      {!handData.detected && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass p-8 rounded-3xl text-center animate-bounce">
            <p className="text-xl font-light">Show your <span className="text-blue-400 font-bold">hand</span> to the camera</p>
            <p className="text-sm opacity-50 mt-2">Open/Close hand to control particles</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
