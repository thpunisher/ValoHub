"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment, MeshDistortMaterial, Sphere, Box, Html } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import type { Mesh, Group, Points } from "three"

// Animated floating orb
function FloatingOrb({ position, color, scale = 1, speed = 1 }: { 
  position: [number, number, number]
  color: string
  scale?: number
  speed?: number
}) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed
    }
  })

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </Float>
  )
}

// Glowing sphere with distortion
function GlowingSphere({ position, color }: { 
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere args={[0.8, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

// Rotating geometric shape
function GeometricShape({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#ff4655"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff4655"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

// Particle field
function ParticleField({ count = 200 }: { count?: number }) {
  const points = useRef<Points>(null)
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
      points.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff4655"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Grid floor
function Grid() {
  return (
    <gridHelper 
      args={[30, 30, "#ff465530", "#ff465510"]} 
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

// Main hero scene
export function ValorantHeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ff4655" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ff" />
          
          <ParticleField count={150} />
          
          <FloatingOrb position={[-4, 2, -2]} color="#ff4655" scale={0.8} speed={0.8} />
          <FloatingOrb position={[4, -1, -3]} color="#00d4aa" scale={0.6} speed={1.2} />
          <FloatingOrb position={[2, 3, -4]} color="#ff4655" scale={0.5} speed={1} />
          
          <GlowingSphere position={[-3, -2, -2]} color="#ff4655" />
          <GeometricShape position={[3, 1, -1]} />
          
          <Grid />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Agent showcase 3D scene
function AgentPlatform() {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Hexagonal platform */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2.2, 0.2, 6]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#ff4655"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 6]} />
        <meshStandardMaterial 
          color="#ff4655" 
          emissive="#ff4655"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Outer particles */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh 
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 2.5,
              0,
              Math.sin((i / 6) * Math.PI * 2) * 2.5
            ]}
          >
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial 
              color="#ff4655" 
              emissive="#ff4655"
              emissiveIntensity={1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export function AgentShowcaseScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <spotLight 
            position={[0, 10, 0]} 
            intensity={1} 
            angle={0.5}
            color="#ff4655"
          />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#fff" />
          
          <AgentPlatform />
          <ParticleField count={50} />
          
          <fog attach="fog" args={["#0a0a0f", 5, 20]} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Weapon display scene
export function WeaponDisplayScene() {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <spotLight position={[5, 5, 5]} intensity={1} color="#ff4655" />
          
          <Float speed={1} rotationIntensity={0.1}>
            <Box args={[3, 0.1, 0.1]} position={[0, 0, 0]}>
              <meshStandardMaterial 
                color="#ff4655" 
                metalness={0.9}
                roughness={0.1}
                emissive="#ff4655"
                emissiveIntensity={0.3}
              />
            </Box>
          </Float>
          
          <ParticleField count={30} />
        </Suspense>
      </Canvas>
    </div>
  )
}
