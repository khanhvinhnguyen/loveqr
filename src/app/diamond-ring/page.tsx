"use client"
import dynamic from "next/dynamic"
import { useState } from "react"
import { motion } from "framer-motion"

import Loading from "@/components/Loading"
import Wrapper3D from "@/components/Wrapper3D"
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
    <Wrapper3D>
      <DiamondRingScene isOpen={isOpen} setIsOpen={setIsOpen} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed w-full top-1/3 text-white text-2xl font-serif text-center z-10"
      >
        💍 Will you marry me?
      </motion.div>
    </Wrapper3D>
  )
}

export default DiamondRingPage