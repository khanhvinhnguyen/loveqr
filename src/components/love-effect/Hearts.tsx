import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Billboard } from "@react-three/drei";
import { FLOOR_Y, spawnPosition, spawnVelocity } from "./constants";

const HEART_URL = "/models/heart.glb";
useGLTF.preload(HEART_URL);

interface HeartsProps {
  count?: number;
}

export default function Hearts({ count = 30 }: HeartsProps) {
  const { scene: heartModel } = useGLTF(HEART_URL);

  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: spawnPosition(),
        velocity: spawnVelocity(),
        scale: 0.003 + Math.random() * 0.005,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 2),
      })),
    [count]
  );

  const billRefs = useRef<THREE.Object3D[]>([]);
  const modelRefs = useRef<THREE.Object3D[]>([]);

  useFrame((_, delta) => {
    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      const bill = billRefs.current[i];
      const model = modelRefs.current[i];
      if (!bill || !model) continue;

      h.position.addScaledVector(h.velocity, delta);

      if (h.position.y < FLOOR_Y || h.position.z > 5) {
        h.position.copy(spawnPosition());
        h.velocity.copy(spawnVelocity());
      }

      bill.position.copy(h.position);
      model.rotation.y += h.spin * delta;
    }
  });

  return (
    <>
      {hearts.map((h, i) => (
        <Billboard
          key={i}
          ref={(el) => {
            if (el) billRefs.current[i] = el;
          }}
          position={h.position.toArray()}
        >
          <primitive
            object={heartModel.clone(true)}
            ref={(el: THREE.Object3D<THREE.Object3DEventMap>) => {
              if (el) modelRefs.current[i] = el;
            }}
            scale={h.scale}
          />
        </Billboard>
      ))}
    </>
  );
}
