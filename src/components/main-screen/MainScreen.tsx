// src/components/main-screen/MainScreen.tsx
"use client"
import React, { useState } from 'react'
import CryptoJS from 'crypto-js'
import LZString from 'lz-string'
import { v7 } from 'uuid'
import { Eye, QrCode } from 'lucide-react'

// import HeartShapedQRCode from './HeartShapedQRCode'
import { Payload } from '@/types/generateQRcode'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { HEART_COUNT, TEXT_COUNT } from '../love-effect/constants'
import HeartMaskQRCodeCanva from './HeartMaskQRCodeCanva'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const BASE_URL = `${process.env.NEXT_PUBLIC_LOVEQR_URL}`!
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!

const TEXT_COUNT_MIN = 25
const TEXT_COUNT_MAX = 80
const HEART_COUNT_MIN = 15
const HEART_COUNT_MAX = 60

export default function MainScreen() {
  const [note, setNote] = useState<string>('')
  const [setting, setSetting] = useState({
    starsBackground: true,
    textCount: TEXT_COUNT,
    heartCount: HEART_COUNT,
    follow: false,
    syncColors: true
  })
  // const [generateURL, setGenerateURL] = useState<string>('')
  const [generateURLCanva, setGenerateURLCanva] = useState<string>('')
  const disable = note.trim().length === 0

  const getDeviceToken = () => {
    let deviceToken = localStorage.getItem('deviceToken')
    if (!deviceToken) {
      deviceToken = v7()
      localStorage.setItem('deviceToken', deviceToken)
    }
    return deviceToken
  }

  const encryptPayload = (payload: Payload) => {
    const json = JSON.stringify(payload)
    const compressed = LZString.compressToEncodedURIComponent(json)
    return CryptoJS.AES.encrypt(compressed, SECRET_KEY).toString()
  }

  const handleGenerate = () => {
    const lines = note
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    const payload = { note: lines }

    const cipher = encryptPayload(payload)
    const url = `/falling-text/loveqr?data=${encodeURIComponent(cipher)}`
    // setGenerateURL(`${BASE_URL}${url}`)
    setGenerateURLCanva(`${BASE_URL}${url}`)
  }

  const handleReview = () => {
    const lines = note
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    const deviceToken = getDeviceToken()

    const payload = {
      note: lines,
      token: deviceToken,
      review: true,
      setting: setting
    }

    const cipher = encryptPayload(payload)
    const url = `/falling-text/loveqr?data=${encodeURIComponent(cipher)}`

    window.open(url, '_blank')
  }

  // Hàm xử lý giới hạn giá trị
  const handleNumberInput = (value: string, min: number, max: number): number => {
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue)) return min
    if (parsedValue < min) return min
    if (parsedValue > max) return max
    return parsedValue
  }

  return (
    <div className="p-4 mx-auto max-w-5xl">
      <h1 className="mb-4 text-xl font-bold">Generate LoveQR</h1>

      {/* Nhập lời nhắn */}
      <section>
        <label className="block mb-2">Lời nhắn (mỗi dòng 1 lời nhắn nhé)</label>
        <textarea
          rows={5}
          className="p-2 mb-2 w-full rounded border bg-background"
          placeholder="Nhập lời nhắn..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </section>

      {/* Accordion tuỳ chỉnh lời nhắn */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Tuỳ chỉnh riêng cho lời nhắn của bạn</AccordionTrigger>
          <AccordionContent>
            <section className="flex flex-col gap-2 mb-2 ml-4 max-w-2xl md:flex-row md:justify-between">
              <div className='flex gap-2 justify-between items-center'>
                <label>Số lượng lời nhắn</label>
                <Input
                  type="number"
                  min={TEXT_COUNT_MIN}
                  max={TEXT_COUNT_MAX}
                  value={setting.textCount}
                  onChange={e => setSetting({
                    ...setting,
                    textCount: handleNumberInput(e.target.value, TEXT_COUNT_MIN, TEXT_COUNT_MAX)
                  })}
                  className="text-primary w-fit"
                />
              </div>

              <div className='flex gap-2 justify-between items-center'>
                <label>Số lượng trái tim</label>
                <Input
                  type="number"
                  min={HEART_COUNT_MIN}
                  max={HEART_COUNT_MAX}
                  value={setting.heartCount}
                  onChange={e => setSetting({
                    ...setting,
                    heartCount: handleNumberInput(e.target.value, HEART_COUNT_MIN, HEART_COUNT_MAX)
                  })}
                  className="text-primary w-fit"
                />
              </div>

              <label className="flex gap-2 justify-between items-center">
                <p>Hiển thị nền sao</p>
                <Switch
                  checked={setting.starsBackground}
                  onCheckedChange={(checked) => setSetting({ ...setting, starsBackground: checked })}
                />
              </label>
            </section>

            <section className="flex flex-col gap-2 mb-2 ml-4 max-w-2xl md:flex-row md:justify-between">
              <label className="flex gap-2 justify-between items-center">
                <p>Lời nhắn luôn hướng về phía người nhìn</p>
                <Switch
                  checked={setting.follow}
                  onCheckedChange={(checked) => setSetting({ ...setting, follow: checked })}
                />
              </label>

              <label className="flex gap-2 justify-between items-center">
                <p>Màu đồng bộ</p>
                <Switch
                  checked={setting.syncColors}
                  onCheckedChange={(checked) => setSetting({ ...setting, syncColors: checked })}
                />
              </label>
            </section>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Gọi ActionButtons và truyền project */}
      <div className="flex gap-4">
        <Button
          className="px-4 py-2 rounded disabled:opacity-50"
          disabled={disable}
          onClick={handleGenerate}
        >
          <QrCode />
          Generate
        </Button>

        <Button
          className="px-4 py-2 rounded disabled:opacity-50"
          variant="outline"
          disabled={disable}
          onClick={handleReview}
        >
          <Eye />
          Review
        </Button>
      </div>

      <div className="flex gap-4">
        {/* {generateURL && <HeartShapedQRCode
          data={generateURL || 'https://google.com'}
          size={300}
        />} */}

        {generateURLCanva && <HeartMaskQRCodeCanva
          data={generateURLCanva || 'https://google.com'}
          qrSize={300}
        />}
      </div>
    </div>
  )
}
