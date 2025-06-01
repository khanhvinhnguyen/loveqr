import dynamic from "next/dynamic";

import NavBar from "@/components/main-screen/NavBar";
const MainScreen = dynamic(() => import("@/components/main-screen/MainScreen"), {ssr: false});

export default function Home() {
  return (
    <>
      <NavBar />
      <MainScreen />
    </>
  );
}
