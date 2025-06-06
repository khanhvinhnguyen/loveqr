import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import { HEART_COUNT, MESSAGES_DEFAULT, TEXT_COUNT } from "./constants";
import FallingTextField from "./FallingTextField";
import Hearts from "./Hearts";
import AnimatedStars from "./AnimatedStars";

interface LoveEffectProps {
  messages?: string[];
  setting?: {
    starsBackground?: boolean;
    textCount?: number;
    heartCount?: number;
    follow?: boolean;
    syncColors: boolean;
  }
}

const LoveEffect = ({ messages = MESSAGES_DEFAULT, setting = {
  starsBackground: true,
  textCount: TEXT_COUNT,
  heartCount: HEART_COUNT,
  follow: false,
  syncColors: true,
} }: LoveEffectProps) => {
  return (
    <Canvas camera={{ position: [-1, 0, 3] }}>
      <color attach="background" args={["#15151e"]} />
      <OrbitControls />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      {/* <axesHelper args={[5]} /> */}

      {/* Background */}
      {setting?.starsBackground && <AnimatedStars />}

      {/* Text and heart falling */}
      <Suspense fallback={null}>
        <FallingTextField messages={messages} count={setting?.textCount} follow={setting?.follow} syncColors={setting?.syncColors}/>
        <Hearts count={setting?.heartCount} />
      </Suspense>

      {/* Bloom effect */}
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} />
      </EffectComposer>
    </Canvas>
  );
}

export default LoveEffect;