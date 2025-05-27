import { OrbitControls } from "@react-three/drei"

const SetupCamera = () => {
  return (
    <>
      <color attach="background" args={["#15151e"]} />
      <OrbitControls />
      {/* <axesHelper args={[5]} /> */}
    </>
  )
}

export default SetupCamera