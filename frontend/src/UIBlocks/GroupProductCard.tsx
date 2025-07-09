import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/pages/app/api/apiClients";

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
    <div className="w-full p-4 my-5 bg-white border border-ring/20 shadow rounded-md">
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
            className="border border-ring/20 rounded-md cursor-pointer hover:-translate-y-2 transition-transform duration-300 overflow-hidden"
          >
            <div className="w-full">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
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
