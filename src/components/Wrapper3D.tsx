"use client"
import { Suspense, useEffect } from "react"
import Link from "next/link"
import Loading from "./Loading"

interface Wrapper3dProps {
  children: React.ReactNode
  musicSrc?: string 
}

const Wrapper3D = ({children, musicSrc}: Wrapper3dProps) => {
  useEffect(() => {
    if (!musicSrc) return

    const audio = new Audio(musicSrc)
    audio.loop = true
    audio.volume = 0.5

    const playAudio = async () => {
      try {
        await audio.play()
        console.log("🎵 Đang phát nhạc nền...")
      } catch (err) {
        console.warn("❌ Trình duyệt chặn auto-play âm thanh", err)
      }
    }
   
    const handleFirstInteraction = () => {
      playAudio()
      window.removeEventListener("click", handleFirstInteraction)
      window.removeEventListener("touchstart", handleFirstInteraction)
    }

    window.addEventListener("click", handleFirstInteraction)
    window.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      window.removeEventListener("click", handleFirstInteraction)
      window.removeEventListener("touchstart", handleFirstInteraction)
      audio.pause()
    }
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <Suspense fallback={<Loading />}>
        {children}

        <div className="absolute bottom-0 right-0 p-4">
          <Link href={"https://github.com/khanhvinhnguyen"} target="_blank">
            &copy;2025 - <span className="font-bold">KhanhVinhNguyen</span>
          </Link>
        </div>
      </Suspense>
    </div>
  )
}

export default Wrapper3D