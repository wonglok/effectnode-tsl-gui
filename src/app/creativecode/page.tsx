'use client'

import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three/webgpu'
import { MeshStandardNodeMaterial, WebGPURenderer } from 'three/webgpu'
import { mix, modelWorldMatrix, positionLocal, sin, texture, time, uniform, uv, vec3, vec4 } from 'three/tsl'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { ReactThreeFiber } from '@react-three/fiber'

// import studio from '@theatre/studio'

// if (process.env.NODE_ENV === 'development') {
//   studio.initialize()
// }

extend({ ...(THREE as {}) })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      MeshStandardNodeMaterial: ReactThreeFiber.ThreeToJSXElements<MeshStandardNodeMaterial>
    }
  }
}

function Scene() {
  useFrame((st) => {
    st.gl.render(st.scene, st.camera)
  }, 1)

  const uni = useMemo(() => {
    return {
      frequencyX: uniform(10),
      frequencyY: uniform(10),
    }
  }, [])

  const customMaterial = useMemo(() => {
    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
    })

    const modelPosition = modelWorldMatrix.mul(vec4(positionLocal, 1))
    const elevation = sin(modelPosition.x.mul(uni.frequencyX).sub(time))
      .mul(0.1)
      .add(sin(modelPosition.z.mul(uni.frequencyY).sub(time)).mul(0.1))

    material.positionNode = positionLocal.add(vec3(0, 0, elevation))
    material.normalNode = positionLocal.add(vec3(0, 0, elevation)).normalize()

    const color1 = vec3(uv(), 1.0)

    const color2 = vec3(1.0, uv())

    material.colorNode = mix(
      color1,
      color2,
      sin(time.add(elevation.mul(25)))
        .mul(0.5)
        .add(0.5),
    )

    return material
  }, [uni])

  // useControls({
  //   frequency: {
  //     value: [20, 20],
  //     onChange: (value: [number, number]) => {
  //       uni.frequencyX.value = value[0]
  //       uni.frequencyY.value = value[1]
  //     },
  //   },
  // })

  //

  return (
    <>
      <mesh material={customMaterial} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[1, 1, 128, 128]} />
      </mesh>
    </>
  )
}

// FlyPlaneSheet

export default function Page() {
  //

  //
  return (
    <div className='w-full h-full'>
      <Suspense fallback={null}>
        <Canvas
          gl={async (st: any) => {
            const renderer = new WebGPURenderer({
              canvas: st.canvas as HTMLCanvasElement,
            })

            let body = document.querySelector('body')
            renderer.setSize(body?.clientWidth || 1, body?.clientHeight || 1)
            renderer.setPixelRatio(window.devicePixelRatio || 1)

            await renderer.init()
            return renderer
          }}
        >
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>
          <Scene />
          <OrbitControls></OrbitControls>
          <Stats></Stats>
        </Canvas>
      </Suspense>
    </div>
  )
}
