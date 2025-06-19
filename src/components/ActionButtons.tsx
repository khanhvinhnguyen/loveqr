// src/components/ActionButtons.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import CryptoJS from "crypto-js";
import LZString from "lz-string";
import { v7 } from "uuid";
import { Eye, QrCode, Upload, X } from "lucide-react";
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

interface ActionButtonsProps {
  note: string;
  setting: Record<string, unknown>;
  disabled: boolean;
  project: string;
}

export default function ActionButtons({
  note,
  setting,
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const getDeviceToken = () => {
    let t = localStorage.getItem("deviceToken");
    if (!t) {
      t = v7();
      localStorage.setItem("deviceToken", t);
    }
    return t;
  };

  const encrypt = (payload: Record<string, unknown>) => {
    const json = JSON.stringify(payload);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return CryptoJS.AES.encrypt(
      compressed,
      process.env.NEXT_PUBLIC_SECRET_KEY!
    ).toString();
  };

  const buildQrOptions = () => ({
    color: { color: debQrColor, background: debBgColor },
    eyeShape,
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    const lines = note.split("\n").map((l) => l.trim()).filter(Boolean);

    const payload = {
      note: lines,
      setting,
      qrOptions: buildQrOptions(),
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

            {/* Shape Toggle */}
            <div className="flex items-center gap-2 ml-2">
              <label>Hình Trái Tim</label>
              <Switch
                checked={shape === "heart"}
                onCheckedChange={(c) => setShape(c ? "heart" : "square")}
              />
            </div>

            {/* Eye Shape Selection - hiển thị cho cả hai loại QR */}
            <div className="flex flex-wrap items-center gap-4 ml-2">
              <span className="font-medium">Eye Frame:</span>
              {(["square", "dots", "rounded", "classy", "classy-rounded", "extra-rounded"] as const).map((e) => (
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

            {/* Upload ảnh - chỉ hiển thị khi shape là square */}
            {shape === "square" && (
              <div className="ml-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Upload Background Image:</span>
                  <div className="relative inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      id="file-upload"
                    />
                    <Button variant="outline" size="sm" type="button" className="relative">
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn ảnh
                    </Button>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Ảnh đã chọn:</span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative inline-block">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 pr-8">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                              width={48}
                              height={48}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-32">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadedFiles.length > 0 && shape === "heart" && (
              <div className="p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded ml-2">
                Lưu ý: Ảnh upload chỉ áp dụng cho QR code hình vuông
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          disabled={disabled}
          onClick={handleGenerate}
        >
          <QrCode className="mr-2" />
          Generate
        </Button>
        <Button
          variant="outline"
          disabled={disabled}
          onClick={handleReview}
        >
          <Eye className="mr-2" /> Review
        </Button>
      </div>



      {/* QR Preview - chỉ hiển thị QR code tương ứng với shape đã chọn */}
      {generateURL && shape === "heart" && (
        <HeartMaskQRCodeCanva
          data={generateURL}
          qrSize={300}
          qrOptions={buildQrOptions()}
        />
      )}

      {generateURL && shape === "square" && (
        <SquareQRCode
          data={generateURL}
          qrSize={300}
          qrOptions={{
            ...buildQrOptions(),
            ...(uploadedFiles.length > 0 && { 
              hasUploadedImages: true,
              uploadedFile: uploadedFiles[0] // Truyền file trực tiếp thay vì URL
            })
          }}
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