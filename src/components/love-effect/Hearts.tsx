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
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 1),
      })),
    [count]
  );

  const planeRefs = useRef<THREE.Mesh[]>([]);
  const billboardRefs = useRef<THREE.Object3D[]>([]);

  useFrame((_, delta) => {
    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      const billboard = billboardRefs.current[i];
      const plane = planeRefs.current[i];
      if (!billboard || !plane) continue;

      h.position.addScaledVector(h.velocity, delta);

      if (h.position.y < FLOOR_Y || h.position.z > 5) {
        h.position.copy(spawnPosition());
        h.velocity.copy(spawnVelocity());
      }

      billboard.position.copy(h.position);
      plane.rotation.y += h.spin * delta;
    }
  });

  return (
    <>
      {hearts.map((h, i) => (
        <Billboard
          key={i}
          ref={(el) => {
            if (el) billboardRefs.current[i] = el;
          }}
          position={h.position.toArray()}
        >
          <mesh
            ref={(el) => {
              if (el) planeRefs.current[i] = el;
            }}
            scale={h.scale}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial transparent map={texture} />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}
