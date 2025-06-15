// src/components/ImageQRCodeLogo.tsx

import React, { useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const ImageQRCodeLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Thông tin QR Code
  const qrText = 'https://loveqr.vercel.app'; 
  const qrSize = 300;
  const logoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAA...'; // Thay bằng base64 của logo bạn

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Thiết lập kích thước canvas
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Hàm tải và vẽ hình ảnh nền
    const loadImage = (url: string, callback: (img: HTMLImageElement) => void) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => callback(img);
      img.src = url;
    };

    // Tải hình nền (ví dụ: biển)
    loadImage('https://picsum.photos/300/300',  (backgroundImg) => {
      // Vẽ hình nền lên canvas
      ctx.drawImage(backgroundImg, 0, 0, qrSize, qrSize);

      // Tạo QR Code với các ô trống để đặt logo
      QRCode.toCanvas(
        canvas,
        qrText,
        {
          color: {
            dark: '#000000',
            light: 'transparent',
          },
          width: qrSize,
          margin: 0,
        },
        (error) => {
          if (error) console.error(error);
        }
      );

      // Vẽ logo lên canvas (ở giữa QR Code)
      loadImage(logoUrl, (logoImg) => {
        ctx.globalAlpha = 0.8; // Độ trong suốt của logo
        ctx.drawImage(
          logoImg,
          (qrSize - logoImg.width) / 2,
          (qrSize - logoImg.height) / 2,
          logoImg.width,
          logoImg.height
        );
        ctx.globalAlpha = 1; // Reset độ trong suốt
      });
    });
  }, []);

  return (
    <div>
      <h3>QR Code với hình nền và logo</h3>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />
    </div>
  );
};

export default ImageQRCodeLogo;