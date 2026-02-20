import "../index.css";
import { NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

type Role = "admin" | "seller" | "buyer" | undefined;

interface NavbarProps {
  role?: Role;
}

const navLinks: Record<NonNullable<Role>, { to: string; label: string }[]> = {
  admin: [
    { to: "/admin/dashboard", label: "Admin Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/products", label: "Manage Products" },
  ],
  seller: [
    { to: "/seller/dashboard", label: "Dashboard" },
    { to: "/seller/products/create", label: "Create Product" },
    { to: "/seller/products", label: "My Products" },
  ],
  buyer: [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/my-orders", label: "My Orders" },
  ],
};

const roleBadge: Record<NonNullable<Role>, string> = {
  admin: "bg-red-100 text-red-700 border border-red-200",
  seller: "bg-amber-100 text-amber-700 border border-amber-200",
  buyer: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export default function Navbar({ role }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const resolvedRole: NonNullable<Role> = role ?? "buyer";
  const links = navLinks[resolvedRole];

  return (
    // ✅ FIXED: Changed to white background with subtle shadow, removed border-b
    // ✅ FIXED: top-[42px] matches actual header height (py-2.5 = 10px top + 10px bottom + content ≈ 42px)
    <nav className="sticky top-[42px] z-40 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <NavLink to="/" className="text-2xl font-bold text-indigo-700">
            DokoMart
          </NavLink>
          {role && (
            <span
              className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleBadge[resolvedRole]}`}
            >
              {resolvedRole}
            </span>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden gap-6 font-medium md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 transition-colors hover:text-indigo-600"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full px-5 md:w-auto md:px-0">
          <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 md:w-80 lg:w-96">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none md:text-base"
            />
            <button className="flex items-center justify-center bg-indigo-600 px-4 text-white transition-colors hover:bg-indigo-700">
              <CiSearch size={20} />
            </button>
          </div>
        </div>

        {/* Hamburger */}
        <div className="flex shrink-0 items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-indigo-600 focus:outline-none"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 flex w-full flex-col items-center gap-4 border-t border-gray-200 bg-white py-6 shadow-lg md:hidden">
          {role && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadge[resolvedRole]}`}
            >
              {resolvedRole}
            </span>
          )}
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "font-semibold text-indigo-600"
                  : "text-gray-700 hover:text-indigo-600"
              }
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
