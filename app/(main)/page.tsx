import dynamic from "next/dynamic";
import Hero from "@/components/sections/home/hero";

const Features = dynamic(() => import("@/components/sections/home/features"));
const Slider = dynamic(() => import("@/components/sections/home/slider"));
const Setup = dynamic(() => import("@/components/sections/home/setup"));
const Faq = dynamic(() => import("@/components/sections/home/faq"));

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Slider />
      <Setup />
      <Faq />
    </>
  );
}
