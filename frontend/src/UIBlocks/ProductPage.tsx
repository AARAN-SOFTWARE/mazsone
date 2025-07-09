import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "@/pages/app/api/apiClients";
import ProductCard from "./ProductCard";
import VerticalImageList from "@/Slider/VerticalImageList";
import Tooltipcomp from "@/Components/Tooltip/tooltipcomp";
import RatingReviews from "./RatingReviews";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images?: string[]; // Optional if you support multiple
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [offer] = useState([
    {
      title: "",
      content:
        "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
      tooltip: {
        message:
          "ksfuhk bsfkghdkf ghs fkhdfgkhs fkg hfig fg ujgsidtih sdifgii igisg",
      },
    },
    {
      title: "Bank Offer",
      content:
        "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
      tooltip: {
        message:
          "ksfuhk bsfkghdkf ghs fkhdfgkhs fkg hfig fg ujgsidtih sdifgii igisg",
      },
    },
    {
      title: "Bank Offer",
      content:
        "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
      tooltip: {
        message:
          "ksfuhk bsfkghdkf ghs fkhdfgkhs fkg hfig fg ujgsidtih sdifgii igisg",
      },
    },
  ]);

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/api/products/${id}`)
      .then((res) => {
        const data = res.data.data || res.data;

        const imageList =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images.map((img: any) => `http://127.0.0.1:8000/${img.path}`)
            : [`http://127.0.0.1:8000/${data.image}`];

        setSelectedImage(imageList[0]);
        setProduct({
          ...data,
          images: imageList,
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Product not found");
      })
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!product || error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="py-10 px-[5%] mx-auto">
      <div className="grid lg:grid-cols-2 gap-5 xl:grid-cols-[35%_60%] items-start">
        <div className="lg:sticky top-20 h-fit">
          {/* --- Main image section --- */}
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Vertical Image List - only on lg and up */}
            <div className="hidden lg:block">
              <VerticalImageList
                images={product.images || []}
                selectedIndex={(product.images || []).findIndex(
                  (img) => img === selectedImage
                )}
                onSelect={(index) => setSelectedImage(product.images![index])}
              />
            </div>

            {/* Main Image + Button Group */}
            <div className="block m-auto">
              <div className="w-[320px] mx-auto">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[320px] object-contain rounded shadow-lg"
                />
             
              </div>
            </div>

            {/* Horizontal Image List - only on small to md screens */}
            <div className="lg:hidden mt-4 w-[320px] block mx-auto overflow-x-auto">
              <VerticalImageList
                images={product.images || []}
                selectedIndex={(product.images || []).findIndex(
                  (img) => img === selectedImage
                )}
                direction="horizontal"
                onSelect={(index) => setSelectedImage(product.images![index])}
              />
            </div>
          </div>
        </div>

        {/* --- Product details section --- */}
        <div className="space-y-4">
          <h1 className="text-xl text-gray-800">{product.name}</h1>
          <div className="text-sm text-foreground/50">
             <span className="bg-green-600 text-white text-xs w-max px-2 py-1 rounded">
            4 ★
          </span> <span>76876 rating</span> &{" "}
            <span>7868 Reviews</span>
          </div>
          <p className="text-2xl font-bold">
            ₹{product.price}{" "}
            <span className="line-through text-sm text-foreground/30">
              675634
            </span>
            <span className="text-sm ml-2 text-create">6% offer</span>
          </p>
          <p className="text-sm text-gray-500">Extra feee</p>
          <p className="text-gray-700 text-lg font-semibold">Available Offer</p>
          {offer.map((off, index) => (
            <div key={index}>
              <span className="font-bold">{off.title}</span> {off.content}{" "}
              <Tooltipcomp
                label={"T&C"}
                tip={off.tooltip.message}
                className={"text-update font-bold"}
              />
            </div>
          ))}
             {/* Button Group aligned with image */}
                <div className="flex justify-between mt-5 gap-4">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    BUY NOW
                  </button>
                </div>
          <div className="mt-10">
            <RatingReviews />
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="mt-12">
        <ProductCard title="Similar Products" api={"api/products"} />
      </div>
    </div>
  );
}

export default ProductPage;
