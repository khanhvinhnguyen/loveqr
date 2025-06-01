"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import CryptoJS from 'crypto-js'
import LZString from 'lz-string'
import { useSearchParams } from 'next/navigation'

const LoveEffect = dynamic(() => import('@/components/love-effect/LoveEffect'), { ssr: false })

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!

export default function LoveQRPage() {
  const searchParams = useSearchParams()
  const cipher = searchParams.get('data')

  const [content, setContent] = useState<string[]>([])
  const [setting, setSetting] = useState({
    starsBackground: true,
    textCount: 50,
    heartCount: 30
  })

  useEffect(() => {
    if (!cipher) {
      alert("Không tìm thấy dữ liệu!")
      window.location.href = '/'
      return
    }

    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(cipher), SECRET_KEY)
      const decompressed = LZString.decompressFromEncodedURIComponent(bytes.toString(CryptoJS.enc.Utf8))
      const payload = JSON.parse(decompressed)

      const { note, review, token, setting } = payload
      const storedToken = localStorage.getItem('deviceToken')
      if (setting) {
        setSetting(setting)
      }

      if (review && token !== storedToken) {
        alert("Bạn không có quyền truy cập nội dung này.")
        window.location.href = '/'
        return
      }

      setContent(note)
    } catch (e) {
      console.error('Giải mã thất bại', e)
      alert('Dữ liệu không hợp lệ hoặc đã bị thay đổi!')
      window.location.href = '/'
    }
  }, [cipher])

  return (
    <div className="w-full h-screen">
      <LoveEffect messages={content} setting={setting}/>
    </div>
  )
}