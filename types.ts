
export enum ShapeType {
  BOTTLE = 'BOTTLE',
  SPHERE = 'SPHERE',
  CUBE = 'CUBE',
  TORUS = 'TORUS',
  HEART = 'HEART'
}

export interface ParticleConfig {
  count: number;
  size: number;
  color: string;
  shape: ShapeType;
  spread: number; // Controlled by hand gesture
}

export interface HandData {
  isOpen: boolean;
  pinchDistance: number; // 0 (closed) to 1 (fully open)
  x: number;
  y: number;
  detected: boolean;
}
