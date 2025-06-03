import { OrbitProgress } from "react-loading-indicators";

const Loading = () => {
  return (
    <div className="flex flex-col gap-4">
      <OrbitProgress variant="dotted" color="#808080" size="large" text="" textColor="" />
      <div className="loading loading04">
        <span>L</span>
        <span>O</span>
        <span>A</span>
        <span>D</span>
        <span>I</span>
        <span>N</span>
        <span>G</span>
      </div>
    </div>
  )
}

export default Loading;