// import Image from "next/image";

import Categories from "@/components/global/site/Categories";
import Cta from "@/components/global/site/Cta";
import Hero from "@/components/global/site/Hero";
import Section1 from "@/components/global/site/Section1";
import FeaturedTrucks from "@/components/global/site/Section2";
import { getAuthUserDetails } from "@/lib/queries";

export default async function Home () {
  const user = await getAuthUserDetails();

  if (!user.success) {
    console.log("Error");
  }
  return (
    <div>
      <Hero />
      <Section1 />
      <FeaturedTrucks />
      <Cta />
      <Categories />
    </div>
  );
}
