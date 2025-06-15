"use client";
import { useState } from "react";

// components
import NavBar from "@/components/main-screen/NavBar";
// ui
import { Input } from "@/components/ui/input";

const BuildQRCode = () => {
  const [qrLink, setQrLink] = useState('')

  return (
    <div className="container mx-auto gap-6">
      <NavBar />

      <h1 className="text-xl font-bold mb-2">Build QR Code</h1>
      <div className="flex gap-4">
        <Input
          type="text"
          value={qrLink}
          onChange={(e) => setQrLink(e.target.value)}
          placeholder="Nhập link vào đây để generate QR code làm avatar..."
        />
      </div>

      {/* <SquareQRCode data={qrLink} /> */}
    </div>
  )
}

export default BuildQRCode;