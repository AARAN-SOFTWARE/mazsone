import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import apiClient from "@/pages/app/api/apiClients";

type ProductType = {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  images?: { path: string }[]; // for consistency with other views
};

const CategoryPage: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [cartStates, setCartStates] = useState<Record<number, string>>({});
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/api/products") // adjust path if needed
      .then((response) => {
        const apiData = response.data.data || response.data;

        const formatted: ProductType[] = apiData.map((item: any) => {
          const firstImage = item.images?.[0]?.path;
          return {
            id: item.id,
            name: item.name || item.title,
            image: firstImage
              ? firstImage.startsWith("http")
                ? firstImage
                : `http://127.0.0.1:8000/${firstImage}`
              : "/placeholder.png",
            category: item.category || "Unknown",
            price: item.price,
          };
        });

        setProducts(formatted);

        const initialCartStates: Record<number, string> = {};
        formatted.forEach((item) => {
          initialCartStates[item.id] = "Add to Cart";
        });
        setCartStates(initialCartStates);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const navigateProductPage = (id: number) => {
    navigate(`/productpage/${id}`);
  };

  const changeCart = (id: number) => {
    setCartStates((prev) => ({
      ...prev,
      [id]: prev[id] === "Add to Cart" ? "Added to Cart" : "Add to Cart",
    }));
  };

  return (
    <div className="mt-5 px-[5%] py-10">
      {/* Responsive filter (mobile) */}
      <div className="md:hidden overflow-x-auto scrollbar-hide mb-4">
        <div className="flex gap-4 min-w-max">
          {["Category", "Brand", "Condition", "Price"].map((label, idx) => (
            <div key={idx} className="flex flex-col gap-1 min-w-[140px]">
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <select className="border px-2 py-1 rounded">
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop filter (left) */}
        <div className="hidden md:block md:w-1/4">
          <div className="sticky top-24 ring ring-gray-300/30 bg-white h-[calc(100vh-6rem)] overflow-y-auto p-6">
            <h6 className="text-gray-800 font-semibold mb-4">Filters</h6>
            {["Category", "Brand", "Condition", "Price"].map((label, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-sm font-medium text-gray-700">{label}</p>
                <select className="border w-full px-2 py-1 rounded">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="w-full md:w-3/4 space-y-6">
          {products.map((product) => (
            <div key={product.id}>
              <div className="grid grid-cols-[25%_50%_25%] mx-5 gap-4 p-4">
                <div onClick={() => navigateProductPage(product.id)}>
                  <img
                    className="mx-auto object-contain rounded-md"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div
                  className="space-y-1 px-2 cursor-pointer"
                  onClick={() => navigateProductPage(product.id)}
                >
                  <h4 className="text-lg font-semibold text-update/90">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-foreground/60">Feature A</p>
                  <p className="text-sm text-foreground/60">Feature B</p>
                  <p className="text-sm text-green-600">Special Offer</p>
                </div>
                <div className="text-right space-y-2">
                  <h2 className="text-xl font-bold">₹{product.price}</h2>
                  <p className="text-sm text-foreground/60">Delivery: 3–5 days</p>
                  <button
                    className="bg-update text-white text-sm px-4 py-2 rounded"
                    onClick={() => changeCart(product.id)}
                  >
                    {cartStates[product.id]}
                  </button>
                </div>
              </div>
              <hr className="border-t border-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
