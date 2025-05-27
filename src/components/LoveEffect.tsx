import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { MESSAGES_DEFAULT } from "./love-effect/constants";
import FallingTextField from "./love-effect/FallingTextField";
import Hearts from "./love-effect/Hearts";
import SetupCamera from "./SetupCamera";

interface LoveEffectProps {
  messages?: string[];
}

const LoveEffect = ({ messages = MESSAGES_DEFAULT }: LoveEffectProps) => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 1, 3] }}>
        <SetupCamera />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1}/>

        <Suspense fallback={null}>
          <FallingTextField messages={messages} />
          <Hearts />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default LoveEffect;