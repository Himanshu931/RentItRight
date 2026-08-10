import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";

const links = [
  { label: "Dashboard", to: "/admin", icon: "dashboard" },
  { label: "Users", to: "/adminusers", icon: "group" },
  { label: "Listings", to: "/adminlisting", icon: "inventory_2" },
];

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItemClass = ({ isActive }) =>
    [
      "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200",
      "text-sm font-medium",
      isActive
        ? "bg-bright text-app"
        : "text-text-secondary hover:text-text-primary hover:bg-white/5",
    ].join(" ");

  return (
    <header className="sticky top-0 w-full z-50 border-b border-divider bg-app">
      <div className="max-w-[1450px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-10">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logo} alt="logo" width="35px" />
            <h2 className="text-2xl font-bold text-text-primary">
              RentIt<span className="text-bright">Right</span>
            </h2>
            <span className="ml-1 px-2 py-0.5 rounded-md bg-bright/15 text-bright text-[10px] font-bold uppercase tracking-wider border border-bright/20">
              Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={navItemClass}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {link.icon}
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Admin Profile */}
        <div className="flex items-center gap-6 relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-3 text-left hover:bg-white/5 p-2 rounded-2xl transition-all"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex flex-col items-end">
              <span className="text-sm text-text-primary font-medium">
                Admin
              </span>
              <span className="text-[11px] text-text-muted">
                Super Admin
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-bright/15 border border-bright/30 overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-bright text-xl">
                shield_person
              </span>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-divider rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <Link
                  to="/admin/profile"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  <span className="font-medium">Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  logout
                </span>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}