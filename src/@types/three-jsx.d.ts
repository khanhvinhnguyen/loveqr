import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: ThreeElements['mesh']
      planeGeometry: ThreeElements['planeGeometry']
      meshBasicMaterial: ThreeElements['meshBasicMaterial']
      boxGeometry: ThreeElements['boxGeometry']
      meshStandardMaterial: ThreeElements['meshStandardMaterial']
    }
  }
}

export {} 