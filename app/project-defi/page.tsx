import dynamic from "next/dynamic";
import ProjectDefiHero from "@/components/sections/defi/hero";

const DefiFeatures = dynamic(() => import("@/components/sections/defi/features"));
const DefiPrompt = dynamic(() => import("@/components/sections/defi/prompt"));
const DefiSlider = dynamic(() => import("@/components/sections/defi/slider"));
const DefiCreate = dynamic(() => import("@/components/sections/defi/create"));

export default function ProjectDefiPage() {
  return (
    <>
      <ProjectDefiHero />
      <DefiFeatures />
      <DefiPrompt />
      <DefiSlider />
      <DefiCreate />
    </>
  );
}


