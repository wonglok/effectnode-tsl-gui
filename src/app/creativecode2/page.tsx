'use client'

import { Suspense } from 'react'
import { Box, Environment, OrbitControls, Stats } from '@react-three/drei'
import { Flying } from './_ui/Objects/Flying'
import { O3D } from '@/_threejs/Layer'
import { useRouter } from 'next/navigation'

export default function Page() {
  let router = useRouter()
  return (
    <>
      <div className='w-full h-full'>
        <O3D>
          <Suspense fallback={null}>
            <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>

            <Flying />
            <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>

            <group>
              <Box
                onClick={() => {
                  //
                  router.push('/creativecode')
                }}
              >
                <meshBasicMaterial color={'blue'}></meshBasicMaterial>
              </Box>
            </group>
          </Suspense>
        </O3D>
        {/* <Suspense fallback={null}>
          <Environment files={[`/hdr/brown_photostudio_02_1k.hdr`]}></Environment>

          <Flying />

          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>
        </Suspense> */}
        {/*  */}
        {/* <Canvas
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
       
      </Canvas> */}
      </div>
    </>
  )
}
