
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType, HandData } from '../types';
import { generatePoints } from '../utils/geometryBuilder';

interface ParticlesProps {
  count: number;
  shape: ShapeType;
  color: string;
  handData: HandData;
}

const Particles: React.FC<ParticlesProps> = ({ count, shape, color, handData }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const currentPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const targetPositions = useMemo(() => generatePoints(count, shape), [count, shape]);
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);
  
  // Track last shape to trigger smooth transitions
  const lastShape = useRef(shape);
  const transitionProgress = useRef(1);

  useEffect(() => {
    if (shape !== lastShape.current) {
      const nextTargets = generatePoints(count, shape);
      targetPositions.set(nextTargets);
      lastShape.current = shape;
      transitionProgress.current = 0;
    }
  }, [shape, count, targetPositions]);

  useFrame((state) => {
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    // Spread factor based on hand gesture (pinching distance)
    // 0 distance = compact, 1 distance = normal/expanded
    const spread = Math.max(0.2, handData.pinchDistance * 1.5);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Interpolation to target shape
      const tx = targetPositions[i3] * spread;
      const ty = targetPositions[i3 + 1] * spread;
      const tz = targetPositions[i3 + 2] * spread;

      // Follow hand position slightly
      const hx = handData.detected ? handData.x * 0.1 : 0;
      const hy = handData.detected ? handData.y * 0.1 : 0;

      // Physics: Move towards target with a bit of noise
      const noise = Math.sin(time * 2 + i) * 0.01;
      
      positions[i3] += (tx + hx - positions[i3]) * 0.05 + noise;
      positions[i3 + 1] += (ty + hy - positions[i3 + 1]) * 0.05 + noise;
      positions[i3 + 2] += (tz - positions[i3 + 2]) * 0.05 + noise;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={currentPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

export default Particles;
