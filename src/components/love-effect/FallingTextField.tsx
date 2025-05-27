// src/components/love-effect/FallingTextField.tsx
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { FLOOR_Y, spawnPosition, spawnVelocity } from "./constants";

const randomNeonColor = () => {
  const t = Math.random();
  return new THREE.Color().setHSL(0.97 /* ~hồng */, 0.7, 1 - t * 0.15).getStyle();
};

export default function FallingTextField({
  count = 60,
  messages,
}: {
  count?: number;
  messages: string[];
}) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        position: spawnPosition(),
        velocity: spawnVelocity(),
        message: messages[Math.floor(Math.random() * messages.length)],
        color: randomNeonColor(),
      })),
    [count, messages]
  );

  const refs = useRef<THREE.Object3D[]>([]);

  useFrame((_, delta) => {
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const mesh = refs.current[i];
      if (!mesh) continue;

      it.position.addScaledVector(it.velocity, delta);

      if (it.position.y < FLOOR_Y) {
        it.position.copy(spawnPosition());
        it.velocity.copy(spawnVelocity());
        it.message = messages[Math.floor(Math.random() * messages.length)];
        it.color = randomNeonColor();
      }
      mesh.position.copy(it.position);
    }
  });

  return (
    <>
      {items.map((it, idx) => (
        <Billboard
          key={idx}
          ref={(el) => {
            if (el) refs.current[idx] = el;
          }}
          position={it.position.toArray()}
          follow
        >
          <Text
            fontSize={1.2}
            color={it.color}
            anchorX="center"
            anchorY="middle"
            outlineColor={it.color}
            outlineWidth={0.02}
            key={it.message}
          >
            {it.message}
          </Text>
        </Billboard>
      ))}
    </>
  );
}
