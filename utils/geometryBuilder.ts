
import { Vector3, MathUtils } from 'three';

export const generatePoints = (count: number, shape: string): Float32Array => {
  const points = new Float32Array(count * 3);
  const v = new Vector3();

  for (let i = 0; i < count; i++) {
    switch (shape) {
      case 'BOTTLE': {
        // Create a stylized bottle shape
        const u = Math.random();
        const v_val = Math.random() * Math.PI * 2;
        let r = 1;
        let y = (u - 0.5) * 4; // Height -2 to 2

        if (y < -1.5) {
          // Bottom base
          r = 1.0;
        } else if (y < 0.5) {
          // Main body
          r = 1.0;
        } else if (y < 1.2) {
          // Shoulder taper
          r = 1.0 - (y - 0.5) * 0.8;
        } else {
          // Neck
          r = 0.4;
        }

        v.set(Math.cos(v_val) * r, y, Math.sin(v_val) * r);
        break;
      }
      case 'SPHERE': {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        v.setFromSphericalCoords(2, phi, theta);
        break;
      }
      case 'CUBE': {
        v.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
        break;
      }
      case 'TORUS': {
        const u = Math.random() * Math.PI * 2;
        const vt = Math.random() * Math.PI * 2;
        const R = 2;
        const r = 0.6;
        v.set(
          (R + r * Math.cos(vt)) * Math.cos(u),
          (R + r * Math.cos(vt)) * Math.sin(u),
          r * Math.sin(vt)
        );
        break;
      }
      case 'HEART': {
        const t = Math.random() * Math.PI * 2;
        const z = (Math.random() - 0.5) * 1.5;
        // Parametric heart
        const x = 1.6 * Math.pow(Math.sin(t), 3);
        const y = 1.3 * Math.cos(t) - 0.5 * Math.cos(2 * t) - 0.2 * Math.cos(3 * t) - 0.1 * Math.cos(4 * t);
        v.set(x, y, z);
        break;
      }
      default:
        v.set(0, 0, 0);
    }
    points[i * 3] = v.x;
    points[i * 3 + 1] = v.y;
    points[i * 3 + 2] = v.z;
  }
  return points;
};
