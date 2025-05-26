import { QRCodeSVG } from 'qrcode.react';

const HeartMaskQRCode = ({
  data = 'https://example.com',
  size = 300,
  // text = 'Love forever and always',
}) => {

  return (
    <div className={`flex overflow-hidden relative flex-col items-center bg-transparent w-[450px] h-[600px]`}>
      <div className={`relative w-[450px] h-[450px] rotate-[0.625turn] scale-75`}>
        {/* Top left */}
        <QRCodeSVG
          value={data}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          className='absolute rounded-[50%] right-3 border-[1px] border-solid border-primary'
        />

        {/* Top right */}
        <QRCodeSVG
          value={data}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          className='absolute rounded-[50%] bottom-3 border-[1px] border-solid border-primary'
        />

        {/* QR code */}
        <QRCodeSVG
          value={data}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          className={`absolute top-0 left-0 z-auto w-[${size}px] h-[${size}px]`}
        />
      </div>

      {/* <div className='mt-4 text-lg text-primary'>
        {text}
      </div> */}
    </div>
  );
};

export default HeartMaskQRCode;