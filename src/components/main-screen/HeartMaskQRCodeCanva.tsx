import React, { useRef, useEffect } from "react";
import QRCode from "qrcode";
import download from "downloadjs";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import Image from "next/image";

interface HeartMaskQRCodeProps {
  data?: string;
  qrSize?: number;
}

const HeartMaskQRCode = ({
  data = 'https://example.com', 
  qrSize = 300,
}: HeartMaskQRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  const canvasSize = qrSize * 1.5;

  const generateQRBase64 = async (text: string): Promise<string> => {
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: qrSize,
      margin: 1,
      color: { dark: '#000', light: '#fff' },
    });
    return qrDataUrl;
  };

  const drawHeartQR = async () => {
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
    ctx.stroke();
    ctx.restore();


    ctx.restore(); // khôi phục trạng thái ban đầu

    // Xuất ra ảnh và set vào state
    const imageSrc = canvas.toDataURL("image/png");
    setImageSrc(imageSrc);
  };

  useEffect(() => {
    drawHeartQR();
  }, [data]);

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

      <Button onClick={handleDownload}>
        <Download className="mr-2" />
        Download QRcode
      </Button>
    </div>
  );
};

export default HeartMaskQRCode;