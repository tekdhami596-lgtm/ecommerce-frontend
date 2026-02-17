import { IoCartOutline } from "react-icons/io5";
import { LogOut, User } from "lucide-react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/slice/userSlice";
import { Link } from "react-router-dom";

export default function Header() {
  const user = useSelector((root: RootState) => root.user.data);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const dispatch = useDispatch();

  const role = user?.role; // "admin" | "seller" | "buyer" | undefined
  const isBuyer = !role || role === "buyer";

  return (
    <>
      <header className="w-full bg-purple-600 text-sm text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-2">
          {/* User greeting */}
          {user?.firstName && (
            <span className="hidden text-base sm:inline">
              {user.firstName} {user.lastName}
            </span>
          )}

          {/* Auth: Login / Logout */}
          {user ? (
            <button
              className="flex cursor-pointer items-center gap-1 hover:text-pink-300"
              onClick={() => dispatch(logout())}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 hover:text-pink-300"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          {/* Cart — buyers only */}
          {isBuyer && (
            <Link to="/cart" className="relative hover:text-pink-300">
              <IoCartOutline size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-pink-500 px-1 text-xs">
                  {totalQuantity}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>

      <Navbar role={role} />
    </>
  );
}
