import WelcomeSection from "../../components/owner_ui/dashboard/WelcomeSection";
import StatsCard from "../../components/owner_ui/dashboard/StatsCard";
import RentalsSection from "../../components/owner_ui/dashboard/RentalSection";
import QuickActions from "../../components/owner_ui/dashboard/QuickActions";
import { useState, useEffect } from "react";

import homeRedirect from "../../hooks/homeRedirect";


const OwnerDashboard = () => {
  homeRedirect();

  const [totalListings, setTotalListings] = useState(0);
  const [activeRentals, setActiveRentals] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  // Fetching Stats from Backend
  const fetchStats = async () => {
    try {

      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      })

      const csrfData = await csrf.json();

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
      setTotalListings(data.data.totalListings);
      setTotalEarnings(data.data.totalEarnings);

    }
    catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    fetchStats();
  }, []);
  const user = {
    name: "Himanshu",
  };

  const stats = [
    {
      id: 1,
      title: "Total Listings",
      value: totalListings,
      icon: ""
    },
    {
      id: 2,
      title: "Active Rentals",
      value: activeRentals,
      icon: ""
    },
    {
      id: 3,
      title: "Total Earnings",
      value: totalEarnings,
      icon: ""
    }
  ];

  const rentals = [
    {
      id: "1",
      title: "Modern Apartment",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      rentedBy: "Sarah M.",
      status: "Active",
      pricePerDay: 85,
      rating: 4.9,
    },
    {
      id: "2",
      title: "Luxury Sports Car",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      rentedBy: "David L.",
      status: "Upcoming",
      pricePerDay: 150,
      rating: 5.0,
    },
    {
      id: "3",
      title: "Professional Camera Kit",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      rentedBy: "Emily R.",
      status: "Active",
      pricePerDay: 65,
      rating: 4.8,
    },
  ];

  /* ===============================
     HANDLERS (Connect Router Later)
  ================================ */

  const handleAddItem = () => {
    console.log("Navigate to Add Item Page");
  };

  const handleViewBookings = () => {
    console.log("Navigate to Bookings Page");
  };

  const handleManageListings = () => {
    console.log("Navigate to Listings Page");
  };
  const quickActions = [
    { id: 1, icon: "add_circle", label: "Add New Item", onClick: handleAddItem },
    { id: 2, icon: "receipt_long", label: "View Bookings", onClick: handleViewBookings },
    { id: 3, icon: "inventory_2", label: "Manage Listings", onClick: handleManageListings },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-10">

        <WelcomeSection user={user} />


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <RentalsSection rentals={rentals} />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <QuickActions actions={quickActions} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;
