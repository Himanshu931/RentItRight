
import { useState, useEffect } from "react";
import DashboardHeader from "../../components/renter_ui/renter_dashboard/DashboardHeader";
import StatsCard from "../../components/renter_ui/renter_dashboard/StatsCard";
import BookingCard from "../../components/renter_ui/renter_dashboard/BookingCard";
import QuickActions from "../../components/renter_ui/renter_dashboard/QuickActions";
// import BecomeLenderCard from "../../components/renter_ui/renter_dashboard/BecomeLenderCard";
import { Link, useNavigate } from "react-router-dom";
import homeRedirect from "../../hooks/homeRedirect";
import useAuth from "../../hooks/authHook";

export default function RenterDashboard() {
  homeRedirect();
  const navigate = useNavigate();
  const [activeRentals, setActiveRentals] = useState(0);
  const [upcomingRentals, setUpcomingRentals] = useState(0);
  const [wishlist, setWishlist] = useState(0);


  // Fetching Stats from Backend
  
  const fetchStats = async () => {
    try {

      // Fetch CSRF Token
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      })
      const csrfData = await csrf.json();

      // Fetch Dashboard Data
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        credentials: "include"
      })

      const data = await response.json();
      console.log("data", data.data)

      setActiveRentals(data.data.activeRentals);
      setUpcomingRentals(data.data.upcomingRentals);
      setWishlist(data.data.wishlist);

    }
    catch (error) {
      console.log(error);
    }
  }

  // Fetching user names from useAuth()
  const { user } = useAuth();
  const name = user?.name;

  useEffect(() => {
    fetchStats();
  }, []);

  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Active Rentals",
      value: activeRentals,
      icon: "shopping_bag",
    },
    {
      id: 2,
      title: "Upcoming",
      value: upcomingRentals,
      icon: "event_upcoming",
    },
    {
      id: 3,
      title: "Wishlist",
      value: wishlist,
      icon: "bookmark",
    },
  ]);

  // const bookings = [
  //   {
  //     id: 1,
  //     status: "active",
  //     title: "Sony Alpha A7 IV",
  //     dateRange: "Oct 12 - Oct 15",
  //     category: "Professional Kit",
  //     price: 145,
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuC_h7KKcXlbKA7xsOb8aZ0zwtcGMKwVFhL_PSNIx2QYVTznfrGSGJwsyL8xUYg4kw4pr06PuDTRXXojHm6aCCCe_GbupnZvwLVBEsvqzgTyXBciBWFMG-K_52FLbca44C4WiDm513WHtrkTUT55uHxAYyMvSLrpW7kbumdl3QuyqRTqATvnanu8zQsr7Mxll3VOKU-YqeOSL0Y9g0-0Oop9PtGE5Crf4DN3MMr5wksioQXZKMLW1HRrCmQP5QZMuqXnZrz_N1tdBME",
  //   },
  //   {
  //     id: 2,
  //     status: "upcoming",
  //     title: "Specialized Stumpjumper",
  //     dateRange: "Oct 18 - Oct 20",
  //     category: "Mountain Bike",
  //     price: 89,
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCGc-oxaE2UdNo4fWPjF6rZlTh2M8G1cs8dBvUBgiiiUnnJ2Os6NCWxiHfT99ySxmfol7gsFg6zN37Y3agOxpu6CmuLq8MirqoPrRaEXy0hWypUEGsiQBCSr7wVw3DpauPEiDPGFdpWPySR7fyJNtYMbxrHoY_u9zTZuTAdce8MLTMW4wDTeZCGXRZyIPJOVi25kLtR1jl-EIw2QhYutzSQxydkCkoFDueDVOwbqaTh8dL836LVOgzBCrhkhk08SBYioIv6PqkY5ms",
  //   },
  //   {
  //     id: 3,
  //     status: "active",
  //     title: "North Face 4-Person Tent",
  //     dateRange: "Oct 10 - Oct 14",
  //     category: "Camping Gear",
  //     price: 65,
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuBDnnN-3h1lGS6BmoRFX9xMHJQmkQZt6PlA3bedEl9YcdIWsQr284FvyM2g-Ko0L5IR9_CzqLWWErDLaYg9b5GpyxlHVWC4gQccl7Aa9fShSK0qZmFZtjTl9soCG3cQooHMN-iqeHd3UmHvG7XlIi1N50JoRqhGELNBhspv-RsuVcO7DMEfqe8hYYoioOe3XWPajEZpCARZXXQTHxDsTuC7MtWJYa4utm4RGp9bfeT6hj5xm9CBb5c6T5lZgTzNslyKgCBQ9ah4RL8",
  //   },
  // ];
  const bookings =[];
  const quickActions = [
    { id: 1, icon: "search_insights", label: "Discover New Gear", to: "/renter_explore" },
    { id: 2, icon: "receipt_long", label: "Manage Payments", to: "/payments" },
    { id: 3, icon: "forum", label: "Contact Support", to: "/support" },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-background-dark">
      <div className="max-w-[1400px] mx-auto px-8 py-10">

        <DashboardHeader userName={name} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Bookings */}
          
          

          <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
            {bookings?.length > 0 ? (
              <div className="col-span-12 lg:col-span-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Current Bookings</h3>
              <Link to="/rentals" className="cursor-pointer text-bright text-sm font-bold hover:underline">
                View All History
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
            ) : (
              <div className="flex-1 bg-surface border border-app/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-full">
                <div className="w-24 h-24 bg-bright/10 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-bright/20 to-transparent blur-xl"></div>
                  <span className="material-symbols-outlined text-6xl text-bright relative">
                    inventory_2
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight">
                  No Active Rentals Yet
                </h3>
                
                <p className="text-text-secondary text-sm max-w-sm mb-8 leading-relaxed font-medium">
                  Start your rental journey by exploring available items and booking your first rental.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={()=>{
                      navigate('/renter_explore')
                    }}
                    className="flex items-center justify-center gap-2 bg-bright text-surface px-8 py-4 rounded-[1.25rem] font-black hover:scale-[1.01] active:scale-99 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined font-bold">add_circle</span>
                    Rent New Item
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <QuickActions actions={quickActions} />
            {/* <BecomeLenderCard /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
