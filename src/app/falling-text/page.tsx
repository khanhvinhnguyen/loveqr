import dynamic from "next/dynamic";

import SettingLayout from "@/components/SettingLayout";
const MainScreen = dynamic(() => import("@/components/main-screen/MainScreen"), {ssr: false});

export default function Home() {
  return (
    <SettingLayout>
      <MainScreen />
    </SettingLayout>
  );
}
