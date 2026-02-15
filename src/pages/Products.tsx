import axios from "axios";
import { useEffect, useState } from "react";
import NoImageFound from "../assets/NoImage.png";
import cartApi from "../api/cart.api";
import { useNavigate } from "react-router-dom";

type ProductImage = {
  path: string;
};

type Product = {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  stock: number;
  images: ProductImage[];
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/products/?limit=100",
      );

      setProducts(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group rounded-xl bg-white shadow-md transition hover:shadow-xl"
        >
          <div className="relative h-48 overflow-hidden rounded-t-xl bg-gray-200">
            {product.images?.length > 0 ? (
              <img
                src={`http://localhost:8000/${product.images[0].path}`}
                alt={product.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <img
                  src={NoImageFound}
                  alt="No image"
                  className="h-12 opacity-50"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 p-4">
            <h2 className="truncate text-lg font-semibold text-gray-800">
              {product.title}
            </h2>

            <p className="line-clamp-2 text-sm text-gray-500">
              {product.shortDescription}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg font-bold text-indigo-600">
                ${product.price}
              </span>

              <span
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                cartApi.create({ productId: product.id });
              }}
            >
              Add to cart
            </button>
            <button>View Product Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
