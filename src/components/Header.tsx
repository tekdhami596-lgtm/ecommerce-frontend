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

  const role = user?.role;
  const isBuyer = !role || role === "buyer";

  return (
    <>
      {/* ✅ FIXED: removed bottom border/margin that caused gap */}
      <header className="sticky top-0 z-50 w-full bg-indigo-600 text-sm text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-2.5">
          {user?.firstName && (
            <span className="hidden text-sm font-medium sm:inline">
              {user.firstName} {user.lastName}
            </span>
          )}

          {user ? (
            <button
              className="flex cursor-pointer items-center gap-1.5 transition-colors hover:text-indigo-200"
              onClick={() => dispatch(logout())}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 transition-colors hover:text-indigo-200"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          {isBuyer && (
            <Link
              to="/cart"
              className="relative transition-colors hover:text-indigo-200"
            >
              <IoCartOutline size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs font-bold">
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
