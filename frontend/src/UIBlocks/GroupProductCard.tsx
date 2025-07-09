import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/pages/app/api/apiClients";
import ImageButton from "@/Components/Button/ImageBtn";

export interface ProductItem {
  id: number;
  title: string;
  image: string;
  price: number;
}

interface GroupProductCardProps {
  title: string;
  api: string;
}

const GroupProductCard: React.FC<GroupProductCardProps> = ({ title, api }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(api);
      const apiData = response.data.data || response.data;

      const formatted = apiData.map((item: any) => {
        const firstImage = item.images?.[0]?.path;
        return {
          id: item.id,
          title: item.name || item.title,
          image: firstImage
            ? firstImage.startsWith("http")
              ? firstImage
              : `http://127.0.0.1:8000/${firstImage}`
            : "/placeholder.png",
          price: item.price,
        };
      });

      setProducts(formatted);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [api]);

  const navigateProductPage = (id: number) => {
    navigate(`/productpage/${id}`);
  };

  return (
    <div className="w-full p-4 my-10 bg-white border border-ring/20 shadow rounded-md">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h1 className="mt-2 font-bold text-[25px]">{title}</h1>
        <p className="text-update text-lg mt-2 cursor-pointer hover:underline">
          More
        </p>
      </div>

      {/* Grid (2 items per row, max 4 items) */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product.id}
            onClick={() => navigateProductPage(product.id)}
            className="relative group border border-ring/20 rounded-md cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden"
          >
            {/* Discount Label */}
            <div className="absolute top-2 left-2 bg-update text-white text-xs px-2 py-1 z-10 rounded">
              -3% OFF
            </div>

            {/* Hover Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 m-2">
              <ImageButton
                onClick={(e) => e.stopPropagation()}
                className="bg-background text-foreground p-1 rounded-full shadow hover:bg-gray-200"
                icon={"cart"}
              />
              <ImageButton
                onClick={(e) => e.stopPropagation()}
                className="bg-background text-foreground p-1  rounded-full shadow hover:bg-gray-200"
                icon={"like"}
              />
              <ImageButton
                onClick={(e) => e.stopPropagation()}
                className="bg-background text-foreground p-1 rounded-full shadow hover:bg-gray-200"
                icon={"link"}
              />
            </div>

            {/* Product Image */}
            <div className="w-full relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
                <div className="absolute bottom-0  left-2 text-foreground/60 text-lg px-2 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  S.345
                </div>
                <div className="absolute bottom-0 m-2 right-2 bg-create text-white text-xs px-2 py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  4 ★
                </div>
            </div>

            {/* Title & Price */}
            <div className="p-3">
              <p className="text-center text-lg mt-2 truncate">
                {product.title}
              </p>
              <p className="text-center font-bold mt-1 text-base">
                ₹{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupProductCard;
