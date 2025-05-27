import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface HeartMaskQRCodeProps {
  data?: string;
  size?: number;
}

const HeartMaskQRCode = ({
  data = 'https://example.com',
  size = 300,
}: HeartMaskQRCodeProps) => {

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!wrapperRef.current) return;
    try {
      const dataUrl = await toPng(wrapperRef.current, {
        pixelRatio: 2,
        backgroundColor: "transparent",
        cacheBust: true,
      });
      download(dataUrl, "heart_qr.png");
    } catch (err) {
      console.error("Export QR failed:", err);
    }
  };

  return (
    <>
      <div className={`flex overflow-hidden relative flex-col items-center w-full bg-transparent md:w-[450px] h-[450px]`}>
        <div
          ref={wrapperRef}
          className={`relative w-[450px] h-[450px]`}
          style={{
            transform: "rotate(0.625turn) scale(.75) translate(4rem, 4rem)",
          }}
        >
          {/* Top left */}
          <QRCodeCanvas
            value={data}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            className='absolute rounded-[50%] right-3 border-[5px] border-solid border-white' />

          {/* Top right */}
          <QRCodeCanvas
            value={data}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            className='absolute rounded-[50%] bottom-3 border-[5px] border-solid border-white' />

          {/* QR code */}
          <QRCodeCanvas
            value={data}
            size={size}
            bgColor="#ffffff"
            fgColor="#000000"
            className={`absolute top-0 left-0 z-auto w-[${size}px] h-[${size}px] border-[5px] border-solid border-white`}
          />
        </div>
      </div>

      <Button onClick={handleDownload}>
        <Download />
        Download QRcode
      </Button>
    </>
  );
};

export default HeartMaskQRCode;