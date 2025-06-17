'use client'

import '@theatre/core'
import { Canvas, extend } from '@react-three/fiber'
import { useRef } from 'react'
import { WebGPURenderer } from 'three/webgpu'
// import { Environment, OrbitControls, Stats } from '@react-three/drei'
import * as THREE from 'three/webgpu'
import tunnel from 'tunnel-rat'

// import { Flying } from '../app/creativecode/_ui/Objects/Flying'

extend({ ...(THREE as any) })

if (process.env.NODE_ENV === 'development') {
  import('./extensionConfig')
}

const t3d = tunnel()

export function O3D({ children }: { children: any }) {
  return (
    <>
      <t3d.In>{children}</t3d.In>
    </>
  )
}

export function Layer({ children }: { children: any }) {
  return (
    <>
      <div className='w-full h-full absolute top-0 left-0 '>
        <Canvas
          gl={async (st: any) => {
            const renderer = new WebGPURenderer({
              canvas: st.canvas as HTMLCanvasElement,
            })
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFSoftShadowMap

            if (!renderer._initialized) {
              await renderer.init()
            }

            return renderer
          }}
        >
          <t3d.Out></t3d.Out>
        </Canvas>
      </div>
      {children}
    </>
  )
}

//
