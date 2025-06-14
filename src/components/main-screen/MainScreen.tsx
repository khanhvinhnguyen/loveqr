// src/components/main-screen/MainScreen.tsx
"use client"
import React, { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { HEART_COUNT, TEXT_COUNT } from '@/components/love-effect/constants'
import ActionButtons from '@/components/ActionButtons'
import { useImageUpload } from '@/hooks/useImageUpload'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);


  const disable = note.trim().length === 0

  const handleNumberInput = (value: string, min: number, max: number): number => {
    const parsed = parseInt(value)
    if (isNaN(parsed)) return min
    if (parsed < min) return min
    if (parsed > max) return max
    return parsed
  }

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

  const handleFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 5) {
      alert('Tối đa 5 ảnh được phép chọn');
      return;
    }
    
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke URL for removed preview
    URL.revokeObjectURL(previews[index]);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

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

      <section>
        <label className='block mb-2'>Chọn ảnh (tối đa 5 ảnh)</label>
        <span className='flex gap-2 text-sm text-gray-600 mb-2'>
          Ảnh sẽ được upload khi bạn click Generate QR Code
        </span>
        
        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            <input
              type="file"
              id="file-input"
              className="hidden"
              accept="image/*"
              multiple
              onChange={e => {
                const selected = Array.from(e.currentTarget.files || []);
                handleFileSelect(selected);
              }}
            />

            <label htmlFor="file-input" className="p-2 rounded border bg-background cursor-pointer hover:bg-gray-50">
              Chọn ảnh
            </label>

            {files.length > 0 && (
              <button
                onClick={() => {
                  setFiles([]);
                  setPreviews([]);
                }}
                className="p-2 rounded border bg-gray-500 text-white hover:bg-gray-600"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {previews.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Ảnh đã chọn ({files.length}/5):</h4>
              <div className="flex gap-2 overflow-x-auto">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
      <ActionButtons
        note={note}
        setting={setting}
        files={files}
        disabled={disable}
        project="falling-text"
      />
    </div>
  )
}
