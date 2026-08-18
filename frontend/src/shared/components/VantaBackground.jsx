import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import NET from 'vanta/dist/vanta.net.min'

export const VantaBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null)
  const myRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      try {
        setVantaEffect(NET({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xfe6b00, // ParceLops orange accent
          backgroundColor: 0x000f24, // ParceLops deep navy
          points: 15.00,
          maxDistance: 22.00,
          spacing: 16.00
        }))
      } catch (e) {
        console.error("Vanta initialization failed: ", e);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      <div ref={myRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
      <div className="relative z-10 w-full min-h-svh flex">
        {children}
      </div>
    </div>
  )
}
