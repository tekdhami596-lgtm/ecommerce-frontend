import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NoImage from "../assets/NoImage.png";
import api from "../api/axios";
import cartApi from "../api/cart.api";
import notify from "../helpers/notify";
import { useDispatch } from "react-redux";
import { addToCart as addToCartRedux } from "../redux/slice/cartSlice";

type ProductImage = {
  path: string;
};

type Seller = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  seller: Seller;
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>(NoImage);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setProduct(res.data.data);
        console.log(res.data.data);
        setMainImage(res.data.data.images[0]?.path || NoImage);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(productId)) {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const handleAddToCart = async (product: Product) => {
    try {
      // Call your API to add the product
      const res = await cartApi.create({ productId: product.id });
      const cartData = res.data.data;
      console.log({ cartData });
      const cartItem = {
        id: cartData.id, // ✅ use cart id from backend (NOT product.id)
        productId: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        quantity: cartData.quantity ?? 1,
        image: cartData.images?.[0].path || "", // ✅ REQUIRED FIELD
      };

      // Update Redux cart state
      dispatch(addToCartRedux(cartItem));
      notify.success("Item added to cart successfully");
    } catch (err) {
      console.error("Failed to add to cart", err);
      notify.error("Failed to add to cart");
    }
  };

  if (loading) return <p className="mt-20 text-center">Loading...</p>;
  if (!product) return <p className="mt-20 text-center">Product not found</p>;

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left: Images */}
        <div className="md:w-1/2">
          <img
            src={`http://localhost:8000/${mainImage}`}
            alt={product.title}
            className="h-[400px] w-full rounded border object-contain"
          />
          <div className="mt-4 flex gap-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:8000/${img.path}`}
                alt={`Thumbnail ${idx}`}
                className={`h-20 w-20 cursor-pointer rounded border object-contain ${
                  mainImage === img.path ? "border-blue-500" : ""
                }`}
                onClick={() => setMainImage(img.path)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product & Seller Info */}
        <div className="flex flex-col justify-between md:w-1/2">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="mt-2 text-xl text-green-600">₹{product.price}</p>
            <p className="mt-2 text-gray-600">Stock: {product.stock}</p>
            <p className="mt-4">{product.shortDescription}</p>
            <p className="mt-4">{product.description}</p>

            {/* Seller Info */}
            <div className="mt-6 rounded border bg-gray-50 p-4">
              <h2 className="text-xl font-semibold">Seller Details</h2>
              <p>
                Name: {product.seller.firstName} {product.seller.lastName}
              </p>
              <p>Email: {product.seller.email}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              disabled={product.stock === 0}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="flex-1 rounded bg-blue-600 py-3 text-white transition hover:bg-blue-700"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button className="flex-1 rounded bg-green-600 py-3 text-white transition hover:bg-green-700">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
