import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { useGLTF, Sparkles } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

const DIAMOND_RING_URL = '/models/diamond_ring.glb'
useGLTF.preload(DIAMOND_RING_URL)

type BoxModelProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const BoxModel = ({ isOpen, setIsOpen }: BoxModelProps) => {
  const { scene } = useGLTF(DIAMOND_RING_URL)
  const lidRef = useRef<THREE.Object3D>(null!)
  const { camera } = useThree()

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'Object_12') {
        child.visible = false
      }
    })

    scene.traverse((child) => {
      if (child.name === 'top_EX_2' && child instanceof THREE.Object3D) {
        child.rotation.set(0, 0, 0)
        child.quaternion.setFromEuler(new THREE.Euler(0, 0, 0))
        lidRef.current = child
        gsap.set(child.rotation, { x: 0 })
      }
    })
  }, [scene])

  const handleClick = () => {
    if (lidRef.current) {
      gsap.to(lidRef.current.rotation, {
        x: -Math.PI / 2,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
      })

      gsap.to(camera.position, {
        x: 0, y: 0.5, z: 1,
        duration: 1.5,
        ease: 'power2.out',
      })

      setIsOpen(true)
    }
  }

  return (
    <>
      <primitive
        object={scene}
        onClick={handleClick}
        onPointerOver={() => {
          gsap.to(scene.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.2 })
        }}
        onPointerOut={() => {
          gsap.to(scene.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
        }}
      />

      {isOpen && (
        <Sparkles count={60} scale={1.5} speed={0.3} color="gold" position={[0, 1, 0]} />
      )}
    </>
  )
}

export default BoxModel