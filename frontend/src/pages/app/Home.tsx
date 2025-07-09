import CategoryList from "@/UIBlocks/CategoryList";
import ProductCard from "@/UIBlocks/ProductCard";
import vehicles from "../../assets/category/vehicles.png";
import BannerCarousel from "@/UIBlocks/BannerCarousel";
import GroupProductCard from "@/UIBlocks/GroupProductCard";
import AdvertisementBanner from "@/UIBlocks/AdvertisementBanner";

function Home() {

  const slides = [
  {
    image: vehicles,
    title: "Trendy Fashion Wear",
    price: "$49.99",
    discount: "20% off on all items",
  },
  {
    image: vehicles,
    title: "Smart Gadgets",
    price: "$199.99",
    discount: "Flat ₹1000 off",
  },
  {
    image: vehicles,
    title: "Home Furnishing",
    price: "$89.99",
    discount: "Save up to 30%",
  },
];
  return (
    <div>
      <CategoryList />
      <BannerCarousel slides={slides} delay={4000}/>
      <ProductCard title="Popular Items" api="/api/products"/>
      <ProductCard title="Recommended for You" api="/api/products"/>
      <AdvertisementBanner />
      <div className="flex flex-col md:flex-row gap-5 px-[5%]">
        <GroupProductCard title={"Top Rated"} api={"/api/products"} />
        <GroupProductCard title={"Discount for you"} api={"/api/products"} />
      </div>
    </div>
  );
}

export default Home;
