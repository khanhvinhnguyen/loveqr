import React, { useRef, useEffect } from "react";
import download from "downloadjs";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import Image from "next/image";

interface HeartMaskQRCodeProps {
  data?: string;
  qrSize?: number;
  qrOptions: {
    color?: { color: string; background: string };
    eyeShape?: "dots" | "rounded" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  };
}

const HeartMaskQRCode = ({
  data = 'https://example.com', 
  qrSize = 300,
  qrOptions = {
    color: {
      color: "#FF0000",
      background: "#ffffff",
    },
    eyeShape: "square",
  }
}: HeartMaskQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  const canvasSize = qrSize * 1.5;

  const drawHeartQR = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const [qr1, qr2, qr3] = await Promise.all([
      generateQRBase64(data),
      generateQRBase64(data),
      generateQRBase64(data),
    ]);

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new window.Image(qrSize, qrSize);
        img.src = src;
        img.onload = () => resolve(img);
      });
    };

    const [img1, img2, img3] = await Promise.all([
      loadImage(qr1),
      loadImage(qr2),
      loadImage(qr3),
    ]);

    ctx.save();

    // Áp dụng rotate + scale + translate toàn bộ
    ctx.translate(canvas.width / 2, canvas.height / 2); // Dịch tâm đến giữa canvas
    ctx.scale(0.75, 0.75); // scale(0.75)
    ctx.rotate(0.625 * Math.PI * 2); // rotate(0.625turn)
    ctx.translate(8 * 16, 8 * 16); // translate(8rem, 8rem) ≈ 128px

    // Vẽ ảnh 1: Top Left - vuông, không bo tròn
    ctx.drawImage(img1, -qrSize, -qrSize, qrSize, qrSize);

    // Vẽ viền trắng cho ảnh 1
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(-qrSize, -qrSize, qrSize, qrSize);

    // Vẽ ảnh 2: Top Right - bo tròn
    ctx.save();

    // Tạo vùng clip là nửa phải hình tròn
    ctx.beginPath();
    ctx.moveTo(0, -qrSize / 2); // bắt đầu từ đỉnh
    ctx.arc(0, -qrSize / 2, qrSize / 2, Math.PI * 0.5, Math.PI * 1.5, true); // nửa phải
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(img2, 0, -qrSize, qrSize, qrSize);
    
    // Vẽ viền trắng dày 5px
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    ctx.restore();

    // Vẽ ảnh 3: Bottom Center - bo tròn
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-qrSize / 2 - qrSize / 2, 0);
    ctx.arc(-qrSize / 2, 0, qrSize / 2, 0, Math.PI * 2); // vị trí vẽ: bottom center
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img3, -qrSize, 0, qrSize, qrSize);
    
    // Vẽ viền trắng
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // khôi phục trạng thái ban đầu

    // Xuất ra ảnh và set vào state
    const imageSrc = canvas.toDataURL("image/png");
    setImageSrc(imageSrc);
  }, [data, qrSize, qrOptions]);

  useEffect(() => {
    drawHeartQR();
  }, [drawHeartQR]);

  const generateQRBase64 = async (text: string): Promise<string> => {
    try {
      // Dynamic import để tránh SSR issues
      const { default: QRCodeStyling } = await import("qr-code-styling");
      
      // Map eye shapes to qr-code-styling types
      const getCornerSquareType = (eyeShape?: string) => {
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

      const getCornerDotType = (eyeShape?: string) => {
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

      const getDotsType = (eyeShape?: string) => {
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

      // Create temporary QR code instance
      const qrCode = new QRCodeStyling({
        width: qrSize,
        height: qrSize,
        type: "canvas",
        data: text,
        margin: 10,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "Q"
        },
        dotsOptions: {
          color: qrOptions.color?.color || "#FF0000",
          type: getDotsType(qrOptions.eyeShape),
        },
        backgroundOptions: {
          color: qrOptions.color?.background || "#ffffff",
        },
        cornersSquareOptions: {
          color: qrOptions.color?.color || "#FF0000",
          type: getCornerSquareType(qrOptions.eyeShape),
        },
        cornersDotOptions: {
          color: qrOptions.color?.color || "#FF0000",
          type: getCornerDotType(qrOptions.eyeShape),
        },
      });

      // Create temporary container to get canvas
      const tempDiv = document.createElement("div");
      qrCode.append(tempDiv);
      
      // Wait a bit for canvas to be created
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = tempDiv.querySelector("canvas");
      if (!canvas) throw new Error("Canvas not found");
      
      const dataUrl = canvas.toDataURL("image/png");
      
      // Clean up
      tempDiv.remove();
      
      return dataUrl;
    } catch (error) {
      console.error("Error generating QR:", error);
      // Fallback to simple QR if qr-code-styling fails
      const QRCode = (await import("qrcode")).default;
      return await QRCode.toDataURL(text, {
        width: qrSize,
        margin: 1,
        color: { dark: qrOptions.color?.color, light: qrOptions.color?.background },
      });
    }
  };



  const handleDownload = () => {
    if (!imageSrc) return;
    download(imageSrc, "heart_qr.png");
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ display: 'none' }}
      />

      {imageSrc && (
        <div className="relative w-full md:w-[450px] md:h-[450px] mb-4">
          <Image
            src={imageSrc}
            alt="QR Code hình trái tim"
            className="w-full h-full object-contain"
            width={canvasSize}
            height={canvasSize}
          />
        </div>
      )}

      <Button onClick={handleDownload} disabled={!imageSrc}>
        <Download className="mr-2" />
        Download QRcode
      </Button>
    </div>
  );
};

export default HeartMaskQRCode;

// dotsOptions: { color: qrOptions.color?.color, type: "rounded" },
// cornerSquareTypes: { color: qrOptions.color?.color, type: "extra-rounded" },
// cornerDotsOptions: { color: qrOptions.color?.color, type: "dot" },