
import React, { useRef, useEffect, useState } from 'react';
import { HandData } from '../types';

interface HandTrackProps {
  onHandUpdate: (data: HandData) => void;
}

const HandTrack: React.FC<HandTrackProps> = ({ onHandUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hands: any;
    let camera: any;

    const setupTracking = async () => {
      try {
        // Load MediaPipe scripts dynamically to avoid large bundle size and ensure environment compatibility
        const loadScript = (src: string) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        };

        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

        const mpHands = (window as any).Hands;
        const mpCamera = (window as any).Camera;

        hands = new mpHands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // Calculate distance between thumb tip (4) and index tip (8)
            const thumb = landmarks[4];
            const index = landmarks[8];
            const dist = Math.sqrt(
              Math.pow(thumb.x - index.x, 2) +
              Math.pow(thumb.y - index.y, 2) +
              Math.pow(thumb.z - index.z, 2)
            );

            // Mapping dist (approx 0.05 to 0.3) to 0.0 to 1.0
            const normalizedDist = Math.min(Math.max((dist - 0.05) / 0.25, 0), 1);

            onHandUpdate({
              isOpen: normalizedDist > 0.4,
              pinchDistance: normalizedDist,
              x: (landmarks[0].x - 0.5) * 10,
              y: -(landmarks[0].y - 0.5) * 10,
              detected: true
            });
          } else {
            onHandUpdate({ isOpen: false, pinchDistance: 0.5, x: 0, y: 0, detected: false });
          }
        });

        if (videoRef.current) {
          camera = new mpCamera(videoRef.current, {
            onFrame: async () => {
              await hands.send({ image: videoRef.current! });
            },
            width: 320,
            height: 240,
          });
          camera.start();
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Tracking Error:", err);
        setError("Camera or MediaPipe initialization failed.");
      }
    };

    setupTracking();

    return () => {
      if (camera) camera.stop();
      if (hands) hands.close();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 w-40 h-30 rounded-lg overflow-hidden border-2 border-white/20 glass z-50">
      <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-center px-2">
          Initializing Camera...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-[10px] text-center px-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default HandTrack;
