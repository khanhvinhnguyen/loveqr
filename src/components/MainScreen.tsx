"use client"
import React, { useState } from 'react'
import CryptoJS from 'crypto-js'
import LZString from 'lz-string'
import { v7 } from 'uuid'

import HeartShapedQRCode from './HeartShapedQRCode'
import { Button } from '@/components/ui/button'
import { Payload } from '@/types/generateQRcode'

const BASE_URL = `${process.env.NEXT_PUBLIC_LOVEQR_URL}`!
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!

export default function MainScreen() {
  const [note, setNote] = useState<string>('')
  const [generateURL, setGenerateURL] = useState<string>('')
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
    const url = `/loveqr?data=${encodeURIComponent(cipher)}`
    setGenerateURL(`${BASE_URL}${url}`)
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
    }
  
    const cipher = encryptPayload(payload)
    const url = `/loveqr?data=${encodeURIComponent(cipher)}`
  
    window.open(url, '_blank')
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-xl font-bold">Generate LoveQR</h1>

      <label className="block mb-2">Lời nhắn (mỗi dòng 1 lời nhắn nhé)</label>
      <textarea
        rows={5}
        className="p-2 mb-4 w-full rounded border"
        placeholder="Nhập lời nhắn..."
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <div className="flex gap-4">
        <Button
          className="px-4 py-2 rounded disabled:opacity-50"
          disabled={disable}
          onClick={handleGenerate}
        >
          Generate
        </Button>

        <Button
          className="px-4 py-2 rounded disabled:opacity-50"
          variant="outline" 
          disabled={disable}
          onClick={handleReview}
        >
          Review
        </Button>
      </div>

      {generateURL && <HeartShapedQRCode
        data={generateURL || 'https://google.com'}
        size={300}
      />}
    </div>
  )
}