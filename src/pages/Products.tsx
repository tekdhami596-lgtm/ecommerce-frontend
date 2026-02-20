import { useEffect, useState } from "react";
import NoImageFound from "../assets/NoImage.png";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart as addToCartRedux } from "../redux/slice/cartSlice";
import { RootState } from "../redux/store";
import cartApi from "../api/cart.api";
import notify from "../helpers/notify";
import api from "../api/axios";

type ProductImage = { path: string };
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
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const user = useSelector((state: RootState) => state.user.data);
  const isSeller = user?.role === "seller";

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const categoryId = searchParams.get("categoryId");
      const search = searchParams.get("search");

      const params = new URLSearchParams();
      params.set("limit", "100");
      if (categoryId) params.set("categoryId", categoryId);
      if (search) params.set("q", search);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      notify.error("Please login first");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (isSeller) {
      notify.error("Sellers cannot add items to cart");
      return;
    }
    try {
      const res = await cartApi.create({ productId: product.id });
      const cartData = res.data.data;
      dispatch(
        addToCartRedux({
          id: cartData.id,
          productId: product.id,
          title: product.title,
          price: product.price,
          stock: product.stock,
          quantity: cartData.quantity ?? 1,
          image: product.images?.[0]?.path || "",
        }),
      );
      notify.success("Item added to cart successfully");
    } catch (err) {
      console.error("Failed to add to cart", err);
      notify.error("Failed to add to cart");
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
                src={`${import.meta.env.VITE_API_URL}/${product.images[0].path}`}
                alt={product.title}
                className="object-fit h-full w-full transition duration-300 group-hover:scale-105"
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
                className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </span>
            </div>

            {!isSeller && (
              <button
                disabled={product.stock === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="mt-2 w-full cursor-pointer rounded bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            )}

            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="mt-1 w-full cursor-pointer rounded border border-indigo-600 px-3 py-1 text-indigo-600 hover:bg-indigo-50"
            >
              View Product Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
