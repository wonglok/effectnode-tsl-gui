import { useEffect } from 'react'
import { SRGBColorSpace, Texture } from 'three/webgpu'

export function VideoTex({ src, onReady = () => {} }: any) {
  useEffect(() => {
    let video = document.createElement('video')
    video.src = `${src}`
    video.onloadedmetadata = () => {
      let tex = new Texture(video)
      tex.colorSpace = SRGBColorSpace
      onReady(tex)
    }
  }, [src])

  return <></>
}
