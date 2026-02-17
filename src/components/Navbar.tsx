import "../index.css";
import { NavLink } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

type Role = "admin" | "seller" | "buyer" | undefined;

interface NavbarProps {
  role?: Role;
}

// Role-based nav links
const navLinks: Record<NonNullable<Role>, { to: string; label: string }[]> = {
  admin: [
    { to: "/admin/dashboard", label: "Admin Dashboard" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/products", label: "Manage Products" },
  ],
  seller: [
    { to: "/seller/dashboard", label: "Dashboard" },
    { to: "/seller/products/create", label: "Create Product" },
    { to: "/seller/products", label: "Seller Products" },
  ],
  buyer: [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/my-orders", label: "My-Orders" },
  ],
};

// Role badge styles
const roleBadge: Record<NonNullable<Role>, string> = {
  admin: "bg-red-100 text-red-600",
  seller: "bg-indigo-100 text-indigo-600",
  buyer: "bg-green-100 text-green-600",
};

export default function Navbar({ role }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const resolvedRole: NonNullable<Role> = role ?? "buyer";
  const links = navLinks[resolvedRole];

  return (
    <nav className="relative border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <NavLink to="/" className="text-2xl font-bold text-indigo-900">
            DokoMart
          </NavLink>
          {/* Role Badge */}
          {role && (
            <span
              className={`hidden rounded-full px-2 py-0.5 text-xs font-semibold capitalize sm:inline-block ${roleBadge[resolvedRole]}`}
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
                  ? "font-semibold text-pink-500"
                  : "text-gray-700 transition-colors hover:text-pink-500"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Search Bar */}
        <div className="w-full px-5 md:w-auto md:px-0">
          <div className="flex w-full overflow-hidden rounded border md:w-80 lg:w-96">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 px-3 py-2 text-sm outline-none md:text-base"
            />
            <button className="flex items-center justify-center bg-pink-500 px-3 text-white transition-colors hover:bg-pink-600">
              <CiSearch size={20} />
            </button>
          </div>
        </div>

        {/* Hamburger — mobile only */}
        <div className="flex shrink-0 items-center md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-pink-500 focus:outline-none"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 flex w-full flex-col items-center gap-4 bg-white py-6 shadow-md md:hidden">
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
                  ? "font-semibold text-pink-500"
                  : "text-gray-700 hover:text-pink-500"
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
