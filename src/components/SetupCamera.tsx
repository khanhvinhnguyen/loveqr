import { useTheme } from "@/hook/ThemeProvider"
import { OrbitControls } from "@react-three/drei"

const SetupCamera = () => {
  const { systemTheme } = useTheme()

  return (
    <>
      <color attach="background" args={[systemTheme === 'dark' ? "#000000" : "#ffffff"]} />
      <OrbitControls />
      {/* <axesHelper args={[5]} /> */}
    </>
  )
}

export default SetupCamera