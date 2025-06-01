"use client"
import React, { useRef, useEffect } from 'react';

const HeartWaveSquare = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, window.innerHeight);
      canvas.width = size;
      canvas.height = size;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const xMin = -3;
    const xMax = 3;
    const yMin = -4;
    const yMax = 2;

    // 3) Tạo mảng u từ −π đến π (100 điểm)
    const N = 100;
    const u: number[] = [];
    for (let i = 0; i < N; i++) {
      u.push(-Math.PI + (2 * Math.PI * i) / N);
    }

    // 4) Hàm f(x, k) giống như đã triển khai
    const f = (x: number, k: number): number => {
      const term1 = Math.pow(Math.abs(x), 2 / 3);
      // Nếu x^2 > 3 thì sqrt(3 - x^2) thành 0 để tránh NaN
      const sqrtTerm = x * x > 3 ? 0 : Math.sqrt(3 - x * x);
      const term2 = 0.9 * sqrtTerm * Math.sin(10 * (k * x - 2 * Math.sin(k)));
      return term1 + term2 - 1.5;
    };

    // 5) Chỉ số “nổi” để tính k. 
    //    Ta dùng một biến float idx để tăng dần 0.5 mỗi frame ⇒ animation chỉ bằng khoảng 50% tốc độ gốc.
    let idx = 0;

    let animationId: number;

    // 6) Hàm vẽ mỗi frame
    const drawFrame = () => {
      // Nếu ctx mất giá trị hoặc canvas không tồn tại thì dừng
      if (!ctx || !canvas) return;

      // Clear toàn bộ canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lấy giá trị k hiện tại (lấy index = floor(idx) mod N)
      const k = u[Math.floor(idx) % N];
      // Tăng idx để qua frame sau, dùng 0.5 ⇒ chậm hơn một chút
      idx += 0.3;

      // Tạo mảng x ∈ [−2.5, 2.5] (200 điểm) tương tự Python
      const M = 200;
      const xArr: number[] = [];
      for (let j = 0; j < M; j++) {
        xArr.push(-2.5 + (5 * j) / (M - 1));
      }

      // Lấy lại kích thước canvas (vuông) trong trường hợp đã resize
      const width = canvas.width;
      const height = canvas.height;

      // Hàm map tọa độ toán học ➔ pixel
      const mapX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
      const mapY = (y: number) => ((yMax - y) / (yMax - yMin)) * height;

      // Bắt đầu vẽ đường “heart wave” màu đỏ
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';

      xArr.forEach((xMath, idxPoint) => {
        // Tính y = f(x − sin(k), k)
        const shiftedX = xMath - Math.sin(k);
        const yMath = f(shiftedX, k);

        // Map sang pixel
        const px = mapX(xMath);
        const py = mapY(yMath);

        if (idxPoint === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });

      ctx.stroke();

      // Tiếp tục vòng lặp animation
      animationId = window.requestAnimationFrame(drawFrame);
    };

    // Khởi động animation lần đầu
    animationId = window.requestAnimationFrame(drawFrame);

    // Cleanup khi component unmount
    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 7) Trả về một canvas vuông được đặt chính giữa, background đen
  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#000',
        zIndex: 0,
      }}
    />
  );
};

export default HeartWaveSquare;
