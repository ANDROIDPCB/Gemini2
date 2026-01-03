
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
// Fix: Remove non-existent exports Bloom and EffectComposer from @react-three/drei as they are unused.
import { OrbitControls, Stars, Float } from '@react-three/drei';
import Particles from './Particles';
import { ShapeType, HandData } from '../types';

interface SceneProps {
  shape: ShapeType;
  color: string;
  handData: HandData;
}

const Scene: React.FC<SceneProps> = ({ shape, color, handData }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ position: 'fixed', top: 0, left: 0 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050505']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Particles count={8000} shape={shape} color={color} handData={handData} />
        </Float>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={3} 
        maxDistance={15}
        autoRotate={!handData.detected}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default Scene;
