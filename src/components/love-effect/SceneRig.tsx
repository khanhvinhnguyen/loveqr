import React, { useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";

interface SceneRigProps {
  children: ReactNode;
}

export default function SceneRig({ children }: SceneRigProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}