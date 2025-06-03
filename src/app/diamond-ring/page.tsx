"use client"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"
import { motion } from "framer-motion"

import Loading from "@/components/Loading"
import Link from "next/link"
const DiamondRingScene = dynamic(
  () => import("@/components/diamond-ring/DiamondRingScene"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
)

const DiamondRingPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <Suspense fallback={<Loading />}>
        <DiamondRingScene isOpen={isOpen} setIsOpen={setIsOpen} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="fixed w-full top-1/3 text-white text-2xl font-serif text-center z-10"
        >
          💍 Will you marry me?
        </motion.div>

        <div className="absolute bottom-0 right-0 p-4">
          <Link href={"https://github.com/khanhvinhnguyen"} target="_blank">
            &copy;2025 - KhanhVinhNguyen
          </Link>
        </div>
      </Suspense>
    </div>
  )
}

export default DiamondRingPage