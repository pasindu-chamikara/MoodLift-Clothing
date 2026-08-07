import { MinimalistHero } from "@/components/home/MinimalistHero";
import { ShopTheLook } from "@/components/home/ShopTheLook";
import { MaterialStory } from "@/components/home/MaterialStory";
import { ProductRow } from "@/components/home/ProductRow";
import { CustomerReviews } from "@/components/home/CustomerReviews";

export default function Home() {
  return (
    <>
      <MinimalistHero />
      <ShopTheLook />
      <ProductRow title="Best Sellers" />
      <MaterialStory />
      <ProductRow title="New Arrivals" />
      <CustomerReviews />
    </>
  );
}
