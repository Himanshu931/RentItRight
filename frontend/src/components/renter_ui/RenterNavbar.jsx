import { Link, NavLink } from "react-router-dom";

const RenterNavbar = ({ user }) => {

    const navItemClass = ({ isActive }) =>
        [
            "flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-200",
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
                    <Link to="/renter" className="flex items-center gap-2">
                        <img src="./src/assets/logo.png" alt="logo" width="35px" />
                        <h2 className="text-2xl font-bold text-text-primary">
                            RentIt<span className="text-bright">Right</span>
                        </h2>
                    </Link>

                    <nav className="hidden md:flex items-center gap-4">
                        <NavLink to="/rentals" className={navItemClass}>
                            Rentals
                        </NavLink>
                        <NavLink to="/wishlist" className={navItemClass}>
                            Wishlist
                        </NavLink>
                        <NavLink to="/messages" className={navItemClass}>
                            Messages
                        </NavLink>
                        <NavLink to="/renter_explore" className={navItemClass}>
                            Browse Items
                        </NavLink>
                    </nav>
                </div>

                {/* Right: User Section */}
                <div className="flex items-center gap-6">

                    {/* Profile Button */}
                    <button
                        className="flex items-center gap-3 text-left"
                        onClick={() => {
                            // later: open profile dropdown
                            console.log("Profile clicked");
                        }}
                    >
                        <div className="flex flex-col">
                            <span className="text-md text-text-primary font-medium">
                                {user?.name || "Guest"}
                            </span>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-card border border-divider overflow-hidden flex items-center justify-center">
                            {user?.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-text-secondary text-sm">👤</span>
                            )}
                        </div>
                    </button>

                </div>

            </div>
        </header>
    );
};

export default RenterNavbar;
