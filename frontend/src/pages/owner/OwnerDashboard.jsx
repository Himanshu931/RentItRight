import WelcomeSection from "../../components/owner_ui/dashboard/WelcomeSection";
import StatsCards from "../../components/owner_ui/dashboard/StatsCard";
import RentalsSection from "../../components/owner_ui/dashboard/RentalSection";
import QuickActions from "../../components/owner_ui/dashboard/QuickActions";


const OwnerDashboard = () => {

  /* ===============================
     DUMMY DATA (Replace with API later)
  ================================ */

  const user = {
    name: "Himanshu",
  };

  const stats = {
    totalListings: 25,
    activeRentals: 8,
    upcomingReturns: 3,
    totalEarnings: 12500,
  };

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
  return (
    <div className="bg-app min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-[1400px] mx-auto space-y-14">

        <WelcomeSection user={user} />

        <StatsCards stats={stats} />

        <RentalsSection rentals={rentals} />

        <QuickActions
          onAddItem={handleAddItem}
          onViewBookings={handleViewBookings}
          onManageListings={handleManageListings}
        />

      </div>
    </div>
  );
};

export default OwnerDashboard;
