'use client'

import { Canvas, extend } from '@react-three/fiber'
import { Suspense } from 'react'
import { WebGPURenderer } from 'three/webgpu'
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import * as THREE from 'three/webgpu'

import studio from '@theatre/studio'
import '@theatre/core'
import { Flying } from './_ui/Objects/Flying'

if (process.env.NODE_ENV === 'development') {
  studio.initialize()
}

extend({ ...(THREE as any) })

export default function Page() {
  return (
    <div className='w-full h-full'>
      <Canvas
        gl={async (st: any) => {
          const renderer = new WebGPURenderer({
            canvas: st.canvas as HTMLCanvasElement,
          })
          if (!renderer._initialized) {
            await renderer.init()
          }

          return renderer
        }}
      >
        {/*  */}
        <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>
          <Flying />
          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>
          {process.env.NODE_ENV === 'development' && (
            <>
              <Stats></Stats>
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
