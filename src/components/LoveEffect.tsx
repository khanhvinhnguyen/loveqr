import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

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

        <Suspense fallback={null}>
          <FallingTextField messages={messages} />
          <Hearts />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default LoveEffect;