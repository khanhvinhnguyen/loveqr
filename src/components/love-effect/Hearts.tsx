import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";

import { FLOOR_Y, spawnPosition, spawnVelocity } from "./constants";

interface HeartsProps {
  count?: number;
}

export default function Hearts({ count = 40 }: HeartsProps) {
  const texture = useTexture("/heart.png");

  const hearts = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: spawnPosition(),
        velocity: spawnVelocity(),
        scale: 0.3 + Math.random() * 0.5,
      })),
    [count]
  );

  const refs = useRef<THREE.Object3D[]>([]);

  useFrame((_, delta) => {
    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      const mesh = refs.current[i];
      if (!mesh) continue;

      h.position.addScaledVector(h.velocity, delta);

      if (h.position.y < FLOOR_Y || h.position.z > 5) {
        h.position.copy(spawnPosition());
        h.velocity.copy(spawnVelocity());
      }

      mesh.position.copy(h.position);
    }
  });

  return (
    <>
      {hearts.map((h, i) => (
        <Billboard
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={h.position.toArray()}
        >
          <mesh scale={h.scale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial transparent map={texture} />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}
