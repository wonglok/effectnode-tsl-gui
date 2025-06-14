'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { MeshStandardNodeMaterial, WebGPURenderer } from 'three/webgpu'
import { mix, modelWorldMatrix, positionLocal, sin, time, uniform, uv, vec3, vec4 } from 'three/tsl'
import { OrbitControls } from '@react-three/drei'
import { ReactThreeFiber, ThreeElement } from '@react-three/fiber'

extend({ ...(THREE as {}) })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshStandardNodeMaterial: ReactThreeFiber.ThreeToJSXElements<MeshStandardNodeMaterial>
    }
  }
}

function Scene() {
  useFrame((st) => {
    st.gl.render(st.scene, st.camera)
  }, 1)

  const uniforms = useMemo(() => {
    return {
      frequencyX: uniform(10),
      frequencyY: uniform(5),
    }
  }, [])

  const customMaterial = useMemo(() => {
    const material = new THREE.MeshBasicNodeMaterial()
    const myTime = time

    // vertex
    const modelPosition = modelWorldMatrix.mul(vec4(positionLocal, 1))
    const elevation = sin(modelPosition.x.mul(uniforms.frequencyX).sub(myTime))
      .mul(0.1)
      .add(sin(modelPosition.z.mul(uniforms.frequencyY).sub(myTime)).mul(0.1))
    material.positionNode = positionLocal.add(vec3(0, 0, elevation))

    // fragment
    const color1 = vec3(uv(), 1.0)
    const color2 = vec3(1.0, uv())
    material.colorNode = mix(color1, color2, sin(myTime).mul(0.5).add(0.5))

    return material
  }, [uniforms])

  useControls({
    frequency: {
      value: [10, 5],
      onChange: (value: [number, number]) => {
        uniforms.frequencyX.value = value[0]
        uniforms.frequencyY.value = value[1]
      },
    },
  })

  //

  return (
    <>
      <mesh material={customMaterial} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[1, 1, 512, 512]} />
      </mesh>
    </>
  )
}

export default function Page() {
  //

  //
  return (
    <div className='w-full h-full'>
      <Canvas
        gl={(st: any) => {
          const renderer = new WebGPURenderer({
            canvas: st.canvas as HTMLCanvasElement,
          })

          let body = document.querySelector('body')
          renderer.setSize(body?.clientWidth || 1, body?.clientHeight || 1)
          renderer.setPixelRatio(window.devicePixelRatio || 1)
          return renderer
        }}
      >
        <OrbitControls></OrbitControls>
        <Scene />
      </Canvas>
    </div>
  )
}
