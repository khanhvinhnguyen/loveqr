"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

/* -------------------------------------------------- utils */

/* -------------------------------------------------- props */
interface SquareQRCodeProps {
  data?: string;
  qrSize?: number;
  qrOptions?: {
    color?: { color: string; background: string };
    eyeShape?: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
    dotOpacity?: number;
    imageBg?: string;
    hasUploadedImages?: boolean;
    uploadedFile?: File;
  };
}

/* ========================================================== */
const SquareQRCode = ({
  data = "https://example.com",
  qrSize = 300,
  qrOptions = {},
}: SquareQRCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [ready, setReady] = useState(false);

  /* ---------- merge defaults ---------- */
  const defaults = {
    color: { color: "#FF0000", background: "#ffffff" },
    eyeShape: "square" as const,
    dotOpacity: 1,
    imageBg: "/bae.png",
    hasUploadedImages: false,
  };
  const merged = {
    color: { ...defaults.color, ...(qrOptions.color ?? {}) },
    eyeShape: qrOptions.eyeShape ?? defaults.eyeShape,
    dotOpacity: qrOptions.dotOpacity ?? defaults.dotOpacity,
    imageBg: qrOptions.imageBg ?? defaults.imageBg,
    hasUploadedImages: qrOptions.hasUploadedImages ?? defaults.hasUploadedImages,
    uploadedFile: qrOptions.uploadedFile,
  };

  /* ---------- map eye shapes to qr-code-styling types ---------- */
  const getCornerSquareType = (eyeShape: string) => {
    switch (eyeShape) {
      case "dots": return "dot";
      case "rounded": return "extra-rounded";
      case "classy": return "extra-rounded";
      case "classy-rounded": return "extra-rounded";
      case "extra-rounded": return "extra-rounded";
      case "square":
      default: return "square";
    }
  };

  const getCornerDotType = (eyeShape: string) => {
    switch (eyeShape) {
      case "dots": return "dot";
      case "rounded": return "square";
      case "classy": return "square";
      case "classy-rounded": return "square";
      case "extra-rounded": return "square";
      case "square":
      default: return "square";
    }
  };

  const getDotsType = (eyeShape: string) => {
    switch (eyeShape) {
      case "dots": return "dots";
      case "rounded": return "rounded";
      case "classy": return "classy";
      case "classy-rounded": return "classy-rounded";
      case "extra-rounded": return "extra-rounded";
      case "square":
      default: return "square";
    }
  };

  /* ---------- create QR code with qr-code-styling ---------- */
  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    
    (async () => {
      try {
        // Dynamic import để tránh SSR issues
        const { default: QRCodeStyling } = await import("qr-code-styling");
        
        if (cancelled) return;

        // Clear previous QR code
        containerRef.current!.innerHTML = "";
        
        // Create QR code instance
        qrCodeRef.current = new QRCodeStyling({
          width: qrSize,
          height: qrSize,
          type: "canvas",
          data: data,
          margin: 10,
          qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q"
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            crossOrigin: "anonymous",
          },
          dotsOptions: {
            color: merged.color.color,
            type: getDotsType(merged.eyeShape),
          },
          backgroundOptions: {
            color: merged.hasUploadedImages ? "transparent" : merged.color.background,
          },
          cornersSquareOptions: {
            color: merged.color.color,
            type: getCornerSquareType(merged.eyeShape),
          },
          cornersDotOptions: {
            color: merged.color.color,
            type: getCornerDotType(merged.eyeShape),
          },
        });

        // Append to container
        if (containerRef.current) {
          qrCodeRef.current.append(containerRef.current);
        }
        
        // Canvas is ready for use
        
        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        console.error("Error creating QR code:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data, qrSize, merged.color, merged.eyeShape, merged.hasUploadedImages]);

  /* ---------- download logic ---------- */
  const handleDownload = async () => {
    if (!qrCodeRef.current) return;

    try {
              // Nếu có uploaded images, gọi API merge
        if (merged.hasUploadedImages && merged.uploadedFile) {
          // Tạo blob từ QR code
          const canvas = containerRef.current?.querySelector("canvas");
          if (!canvas) return;
          
          const qrBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          
          if (!qrBlob) return;

          // Sử dụng trực tiếp uploaded file làm background
          const fd = new FormData();
          fd.append("qr", qrBlob, "qr.png");
          fd.append("bg", merged.uploadedFile, "bg");
          fd.append("size", qrSize.toString());

          const resp = await fetch("/api/merge", { method: "POST", body: fd });
          if (!resp.ok) {
            const { error } = await resp.json();
            console.error("merge error:", error);
            return;
          }

          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "square_qr_with_background.png";
          a.click();
          URL.revokeObjectURL(url);
      } else {
        // Download trực tiếp QR code
        await qrCodeRef.current.download({
          name: "square_qr",
          extension: "png"
        });
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code Preview Container */}
      <div className="relative">
        {merged.hasUploadedImages && merged.uploadedFile && (
          <div
            className="absolute inset-0 z-0"
            style={{
              width: qrSize,
              height: qrSize,
              backgroundImage: `url(${URL.createObjectURL(merged.uploadedFile)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "12px",
            }}
          />
        )}
        <div 
          ref={containerRef} 
          className="relative z-10"
          style={{ width: qrSize, height: qrSize }} 
        />
      </div>

      <Button disabled={!ready} onClick={handleDownload}>
        <Download className="mr-2" /> 
        Download QR code {merged.hasUploadedImages ? "(với background)" : ""}
      </Button>
    </div>
  );
};

export default SquareQRCode;
