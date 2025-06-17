'use client'

import Link from 'next/link'

import { Box, OrbitControls } from '@react-three/drei'
import { O3D } from '@/_threejs/Layer'
import { useRouter } from 'next/navigation'

export default function Home() {
  let router = useRouter()
  return (
    <>
      <O3D>
        <group>
          <Box
            onClick={() => {
              //
              router.push('/blue')
            }}
          >
            <meshBasicMaterial color={'orange'}></meshBasicMaterial>
          </Box>
          <OrbitControls object-position={[0, 1.5, 2.5]}></OrbitControls>
        </group>
      </O3D>

      <div className=' absolute top-0 left-0 '>
        <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
          <div className='flex gap-4 items-center flex-col sm:flex-row'>
            <Link
              className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]'
              href='/creativecode'
              rel='noopener noreferrer'
            >
              Creative Code
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}
