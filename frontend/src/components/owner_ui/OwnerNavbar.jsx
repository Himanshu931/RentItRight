import { Link, NavLink } from "react-router-dom";

const OwnerNavbar = ({ user }) => {

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
                    <Link to="/owner" className="flex items-center gap-2">
                        <img src="./src/assets/logo.png" alt="logo" width="35px" />
                        <h2 className="text-2xl font-bold text-text-primary">
                            RentIt<span className="text-bright">Right</span>
                        </h2>
                    </Link>


                    <nav className="hidden md:flex items-center gap-4">
                        <NavLink to="/owner" className={navItemClass}>
                            Dashboard
                        </NavLink>

                        <NavLink to="/listings" className={navItemClass}>
                            Listings
                        </NavLink>

                        <NavLink to="/owner/bookings" className={navItemClass}>
                            Bookings
                        </NavLink>

                        <NavLink to="/owner/earnings" className={navItemClass}>
                            Earnings
                        </NavLink>

                        <NavLink to="/owner/messages" className={navItemClass}>
                            Messages
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

export default OwnerNavbar;
