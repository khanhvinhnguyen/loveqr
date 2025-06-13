"use cliend"
import { Suspense } from "react"
import NavBar from "./main-screen/NavBar"
import Loading from "./Loading"

interface SettingLayoutProps {
  children: React.ReactNode
}

const SettingLayout = ({ children }: SettingLayoutProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <NavBar />
      {children}
    </Suspense>
  )
}

export default SettingLayout