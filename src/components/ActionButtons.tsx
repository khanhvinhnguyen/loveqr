// src/components/ActionButtons.tsx
"use client";
import React, { useState } from "react";
import CryptoJS from "crypto-js";
import LZString from "lz-string";
import { v7 } from "uuid";
import { Eye, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import HeartMaskQRCodeCanva from "@/components/main-screen/HeartMaskQRCodeCanva";
import SquareQRCode from "./main-screen/SquareQRCode";
import { UploadedImage, useImageUpload } from "@/hooks/useImageUpload";

interface ActionButtonsProps {
  note: string;
  setting: Record<string, unknown>;
  files: File[];
  disabled: boolean;
  project: string;
}

export default function ActionButtons({
  note,
  setting,
  files,
  disabled,
  project,
}: ActionButtonsProps) {
  const [qrColor, setQrColor] = useState("#FF0000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const debQrColor = useDebounce(qrColor);
  const debBgColor = useDebounce(backgroundColor);

  const [shape, setShape] = useState<"heart" | "square">("heart");
  const [eyeShape, setEyeShape] = useState<"dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded">("square");
  const [generateURL, setGenerateURL] = useState("");
  
  const { uploadState, uploadFilesToS3 } = useImageUpload();

  const getDeviceToken = () => {
    let t = localStorage.getItem("deviceToken");
    if (!t) {
      t = v7();
      localStorage.setItem("deviceToken", t);
    }
    return t;
  };

  const encrypt = (payload: any) => {
    const json = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return CryptoJS.AES.encrypt(
      compressed,
      process.env.NEXT_PUBLIC_SECRET_KEY!
    ).toString();
  };

  const buildQrOptions = () => ({
    color: { color: debQrColor, background: debBgColor },
  });

  const handleGenerate = async () => {
    const lines = note.split("\n").map((l) => l.trim()).filter(Boolean);

    let imageUrls: string[] = [];
    
    // Upload ảnh nếu có files được chọn
    if (files.length > 0) {
      try {
        const uploadedImages = await uploadFilesToS3(files);
        imageUrls = uploadedImages.map(img => img.url);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Lỗi upload không xác định';
        alert(`Lỗi upload ảnh: ${errorMessage}`);
        return;
      }
    }

    const payload = {
      note: lines,
      setting,
      qrOptions: buildQrOptions(),
      ...(imageUrls.length && { images: imageUrls })
    };
    const cipher = encrypt(payload);
    const urlPath = `/${project}/loveqr?data=${encodeURIComponent(cipher)}`;
    const longUrl = `${process.env.NEXT_PUBLIC_LOVEQR_URL}${urlPath}`;

    try {
      const shortUrl = await generateShortLink(longUrl);
      setGenerateURL(shortUrl);
    } catch (error) {
      console.error("Error shortening URL:", error);
      alert("Không thể tạo shortlink. Đang sử dụng link gốc.");
      setGenerateURL(longUrl);
    }
  };

  const handleReview = () => {
    const lines = note.split("\n").map((l) => l.trim()).filter(Boolean);
    const payload = {
      note: lines,
      setting,
      qrOptions: buildQrOptions(),
      token: getDeviceToken(),
      review: true,
    };
    const cipher = encrypt(payload);
    const url = `/${project}/loveqr?data=${encodeURIComponent(cipher)}`;
    window.open(`${process.env.NEXT_PUBLIC_LOVEQR_URL}${url}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* QR Customization Accordion */}
      <Accordion type="single" collapsible>
        <AccordionItem value="qr-conf">
          <AccordionTrigger>Tùy chỉnh QR Code</AccordionTrigger>
          <AccordionContent className="space-y-6">
            {/* Color Pickers */}
            <div className="flex flex-wrap gap-6 ml-4">
              <ColorInput label="QR Colour" value={qrColor} onChange={setQrColor} />
              <ColorInput label="Background" value={backgroundColor} onChange={setBackgroundColor} />
            </div>

            {/* Eye Shape Selection */}
            <div className="flex flex-wrap items-center gap-4 ml-2">
              <span className="font-medium">Eye Frame:</span>
              {(["square", "dots", "rounded", "classy"] as const).map((e) => (
                <label key={e} className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    checked={eyeShape === e}
                    onChange={() => setEyeShape(e)}
                  />
                  {e}
                </label>
              ))}
            </div>

            {/* Shape Toggle */}
            <div className="flex items-center gap-2 ml-2">
              <label>Hình Trái Tim</label>
              <Switch
                checked={shape === "heart"}
                onCheckedChange={(c) => setShape(c ? "heart" : "square")}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          disabled={disabled || uploadState.isUploading} 
          onClick={handleGenerate}
        >
          <QrCode className="mr-2" /> 
          {uploadState.isUploading ? 'Đang upload ảnh...' : 'Generate'}
        </Button>
        <Button 
          variant="outline" 
          disabled={disabled || uploadState.isUploading} 
          onClick={handleReview}
        >
          <Eye className="mr-2" /> Review
        </Button>
      </div>

      {/* Upload Status */}
      {uploadState.error && (
        <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {uploadState.error}
        </div>
      )}

      {/* QR Preview */}
      {generateURL && (
        <HeartMaskQRCodeCanva
          data={generateURL}
          qrSize={300}
          qrOptions={buildQrOptions()}
        />
      )}

      {generateURL && (
        <SquareQRCode
          data={generateURL}
          qrSize={300}
          qrOptions={buildQrOptions()}
        />
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const generateShortLink = async (longUrl: string): Promise<string> => {
  const response = await fetch("https://tinyurl.com/api-create.php", {
    method: "POST",
    body: new URLSearchParams({ url: longUrl }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to shorten URL using TinyURL");
  }

  const data = await response.text();
  return data;
};

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <label>{label}:</label>
    <Input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-9 h-9 p-0 border-none"
    />
  </div>
);