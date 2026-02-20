import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Shield,
  Truck,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { addToCart as addToCartRedux } from "../redux/slice/cartSlice";
import cartApi from "../api/cart.api";
import api from "../api/axios";
import notify from "../helpers/notify";
import NoImageFound from "../assets/NoImage.png";

type ProductImage = { path: string };
type Product = {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  stock: number;
  images: ProductImage[];
};

const heroSlides = [
  {
    id: 1,
    title: "Summer Collection 2024",
    subtitle: "Get up to 50% off on trending items",
    bg: "from-indigo-500 to-purple-600",
    image: "🛍️",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Discover the latest products",
    bg: "from-pink-500 to-rose-600",
    image: "✨",
  },
  {
    id: 3,
    title: "Flash Sale",
    subtitle: "Limited time offers - Shop now!",
    bg: "from-emerald-500 to-teal-600",
    image: "⚡",
  },
];

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.data);
  const isSeller = user?.role === "seller";

  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products?limit=8");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      notify.error("Please login first");
      navigate("/login");
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
      notify.success("Added to cart!");
    } catch (err) {
      notify.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─────────────────────────────────────────────────────── */}
      {/* HERO CAROUSEL */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="relative h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`h-full w-full bg-gradient-to-r ${slide.bg} flex items-center justify-center`}
            >
              <div className="mx-auto max-w-7xl px-4 text-center text-white">
                <div className="mb-6 text-8xl">{slide.image}</div>
                <h1 className="mb-4 text-5xl font-bold md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mb-8 text-xl md:text-2xl">{slide.subtitle}</p>
                <button
                  onClick={() => navigate("/products")}
                  className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-indigo-600 shadow-lg transition-transform hover:scale-105"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/30 p-2 backdrop-blur-sm transition-all hover:bg-white/50"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-white" : "w-3 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* FEATURES */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-4">
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
            { icon: Shield, title: "Secure Payment", desc: "100% protected" },
            { icon: TrendingUp, title: "Best Prices", desc: "Guaranteed" },
            { icon: ShoppingBag, title: "Easy Returns", desc: "30-day policy" },
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-indigo-100 p-4">
                <feature.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* FEATURED PRODUCTS */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600">Discover our most popular items</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {product.images?.length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${product.images[0].path}`}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <img
                          src={NoImageFound}
                          alt="No image"
                          className="h-16 opacity-40"
                        />
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="mb-2 truncate text-lg font-semibold text-gray-900">
                      {product.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                      {product.shortDescription}
                    </p>

                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        ${product.price}
                      </span>
                      <span
                        className={`text-sm ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {product.stock > 0
                          ? `${product.stock} left`
                          : "Sold out"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!isSeller && (
                        <button
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                          Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className={`rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 ${
                          !isSeller ? "" : "flex-1"
                        }`}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/products")}
              className="rounded-full border-2 border-indigo-600 px-8 py-3 font-semibold text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────── */}
      {/* CTA BANNER */}
      {/* ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">Join Our Community</h2>
          <p className="mb-8 text-xl">
            Subscribe to get special offers and updates
          </p>
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg px-4 py-3 text-gray-900 outline-none"
            />
            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition-transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
