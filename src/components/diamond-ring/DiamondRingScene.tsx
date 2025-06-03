"use client"
import { Canvas } from "@react-three/fiber"
import { Stage, OrbitControls } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import BoxModel from "@/components/diamond-ring/DiamondBox"

interface DiamondRingSceneProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DiamondRingScene = ({ isOpen, setIsOpen }: DiamondRingSceneProps) => {
  return (
    <Canvas camera={{ position: [-1.5, 1.5, 4] }}>
      <color attach="background" args={["#000"]} />
      <ambientLight intensity={0.6} />
      <OrbitControls />

      <Stage shadows="contact" adjustCamera={false} environment="dawn" intensity={0.8}>
        <BoxModel isOpen={isOpen} setIsOpen={setIsOpen} />
      </Stage>

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} />
      </EffectComposer>
    </Canvas>
  )
}

export default DiamondRingScene