// src/app/page.tsx
'use client'
import Image from "next/image";
import { useState } from "react";

import NavBar from "@/components/main-screen/NavBar";
import Link from "next/link";
import { CustomItems, HardItems } from "@/data/constants";

export default function Home() {
  const [hoveredHardIdx, setHoveredHardIdx] = useState<number | null>(null);
  const [hoveredCustomIdx, setHoveredCustomIdx] = useState<number | null>(null);

  return (
    <>
      <NavBar />

      <div className="max-w-6xl flex flex-col mx-auto space-y-8 px-4">
        {/* ---------- Section 1: HardItems ---------- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            QR Yêu Sẵn, Quét Là Mê
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {HardItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="block"
                onMouseEnter={() => setHoveredHardIdx(idx)}
                onMouseLeave={() => setHoveredHardIdx(null)}
              >
                <Image
                  src={hoveredHardIdx === idx ? item.gif : item.webp}
                  alt="QR Code"
                  width={300}
                  height={300}
                  unoptimized
                  className="w-full h-auto"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- Section 2: CustomItems ---------- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            QR Sáng Tác, Yêu Theo Cách Của Bạn
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {CustomItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="block"
                onMouseEnter={() => setHoveredCustomIdx(idx)}
                onMouseLeave={() => setHoveredCustomIdx(null)}
              >
                <Image
                  src={hoveredCustomIdx === idx ? item.gif : item.webp}
                  alt="QR Code"
                  width={300}
                  height={300}
                  unoptimized
                  className="w-full h-auto"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
