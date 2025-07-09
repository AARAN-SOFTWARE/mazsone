import { useNavigate } from "react-router-dom";
import grocery from "../assets/category/grocery.png";
import mobile from "../assets/category/mobile.png";
import fashion from "../assets/category/fashion.png";
import electronics from "../assets/category/electronics.png";
import furniture from "../assets/category/furnitures.png";
import travel from "../assets/category/travels.png";
import toys from "../assets/category/toys.png";
import vehicles from "../assets/category/vehicles.png";

interface CategoryItem {
  name: string;
  image: string;
  alt: string;
}

const Categories: CategoryItem[] = [
  { name: "Grocery", image: grocery, alt: "grocery image" },
  { name: "Mobiles", image: mobile, alt: "mobile image" },
  { name: "Fashion", image: fashion, alt: "fashion image" },
  { name: "Electronics", image: electronics, alt: "electronics image" },
  { name: "Furnitures", image: furniture, alt: "furniture image" },
  { name: "Travel", image: travel, alt: "travel image" },
  { name: "Toys", image: toys, alt: "toys image" },
  { name: "Vehicles", image: vehicles, alt: "vehicles image" },
];

const CategoryList: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="px-2 mt-4 mb-6">
      <div className="flex gap-5 sm:gap-15 md:gap-10 m-5 lg:mx-20 bg-background overflow-x-auto justify-between scrollbar-hide px-1 ">
        {Categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="cursor-pointer w-[100px] sm:w-auto flex-shrink-0 text-center"
          >
            <img
              src={category.image}
              alt={category.alt}
              className="w-[70px] h-[70px] mx-auto"
            />
            <p className="mt-2 text-sm font-medium">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
