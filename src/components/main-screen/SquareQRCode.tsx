"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import Image from "next/image";

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

const SquareQRCode = ({
  data = "https://example.com",
  qrSize = 300,
  qrOptions = {},
}: SquareQRCodeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [ready, setReady] = useState(false);
  const [mergedImage, setMergedImage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const { default: QRCodeStyling } = await import("qr-code-styling");

        if (cancelled) return;

        containerRef.current!.innerHTML = "";

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

        if (containerRef.current) {
          qrCodeRef.current.append(containerRef.current);
        }

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

  // Auto merge QR with background image when uploaded
  useEffect(() => {
    const autoMerge = async () => {
      if (merged.hasUploadedImages && merged.uploadedFile && qrCodeRef.current && ready) {
        try {
          const canvas = containerRef.current?.querySelector("canvas");
          if (!canvas) return;
          
          const qrBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          
          if (!qrBlob) return;

          const fd = new FormData();
          fd.append("qr", qrBlob, "qr.png");
          fd.append("bg", merged.uploadedFile, "bg");
          fd.append("size", qrSize.toString());

          const resp = await fetch("/api/merge", { method: "POST", body: fd });
          if (!resp.ok) {
            console.error("merge error");
            return;
          }

          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          setMergedImage(url);
        } catch (error) {
          console.error("Auto merge error:", error);
        }
      } else {
        setMergedImage(null);
      }
    };

    autoMerge();
  }, [merged.hasUploadedImages, merged.uploadedFile, ready, qrSize]);

    const handleDownload = async () => {
    try {
      if (mergedImage) {
        // Download merged image
        const a = document.createElement("a");
        a.href = mergedImage;
        a.download = "square_qr_with_background.png";
        a.click();
      } else if (qrCodeRef.current) {
        // Download QR code only
        await qrCodeRef.current.download({
          name: "square_qr",
          extension: "png"
        });
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

      return (
      <div className="flex flex-col items-center gap-4">
        {/* Hiển thị merged image nếu có ảnh, nếu không hiển thị QR thường */}
        {mergedImage ? (
          <div className="relative">
            <Image
              src={mergedImage}
              alt="QR Code with background"
              width={qrSize}
              height={qrSize}
              className="rounded-lg"
            />
          </div>
        ) : (
          <div className="relative">
            <div 
              ref={containerRef} 
              className="relative z-10"
              style={{ width: qrSize, height: qrSize }} 
            />
          </div>
        )}

        <Button disabled={!ready} onClick={handleDownload}>
          <Download className="mr-2" /> 
          Download QR code {merged.hasUploadedImages ? "(với background)" : ""}
        </Button>
      </div>
    );
};

export default SquareQRCode;
