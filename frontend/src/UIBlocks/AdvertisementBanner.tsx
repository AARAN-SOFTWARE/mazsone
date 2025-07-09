import { useState } from "react";
import vehicle from '../assets/fashion1.png'
import ads from '../assets/adverthisment.png'
export const AdvertisementBanner = () => {
  const [advertisment] = useState({
    title: "Discover Our New Collection",
    description:
      "Upgrade your style with top-quality products. Limited time offer!",
    button: { label: "Shop Now", className: "" },
    bgimg: "",
    images: [vehicle, vehicle, vehicle, vehicle],
  });
  return (
    <div
      className="relative w-full h-[80vh] overflow-hidden bg-cover bg-center"
     style={{ backgroundImage: `url(${ads})` }}

    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>


      <div className="relative z-10 flex h-full px-6 md:px-16">
        {/* Left side: text + button */}
        <div className="w-1/2 flex flex-col justify-center text-white space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            {advertisment.title}
          </h2>
          <p className="text-sm md:text-base max-w-md">
            {advertisment.description}
          </p>
          <button
            className={`bg-update text-update-foreground px-6 py-2 rounded hover:bg-gray-200 transition w-fit ${advertisment.button.className}`}
          >
            {advertisment.button.label}
          </button>
        </div>

        {/* Right side: 2 stacked images */}
        <div className="w-1/2 grid grid-cols-2 gap-4 justify-items-end items-center pl-4">
          {advertisment.images.map((img) => (
            <img
              src={img}
              alt="Ad 1"
              className="w-4/5 h-[170px] object-cover rounded shadow-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
