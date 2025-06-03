"use client"
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import BoxModel from "@/components/diamond-ring/DiamondBox";

const DiamondRingPage = () => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [-1, 1.5, 3] }}>
        <color attach="background" args={["#15151e"]} />
        <OrbitControls />
        {/* <ambientLight intensity={0.6} /> */}
        {/* <axesHelper args={[5]} /> */}


        {/* Text and heart falling */}
        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.3} adjustCamera={false}>
            <BoxModel />
          </Stage>
        </Suspense>

        {/* Bloom effect */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default DiamondRingPage;