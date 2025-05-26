import dynamic from "next/dynamic";

import NavBar from "@/components/NavBar";
const MainScreen = dynamic(() => import("@/components/MainScreen"), {ssr: false});

export default function Home() {
  return (
    <>
      <NavBar />
      <MainScreen />
    </>
  );
}
