import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import GuestLayout from "./layouts/GuestLayout";
import GuestHome from "./pages/guest/GuestHome";
import Explore from "./pages/guest/Explore";
import ItemDetail from "./pages/guest/ItemDetail";

import RenterDashboard from "./pages/renter/RenterDashboard";
import RenterLayout from "./layouts/RenterLayout";
import Rentals from "./pages/renter/Rentals";
import RentalDetails from "./pages/renter/RentalDetails";
import RenterExplore from "./pages/renter/RenterExplore";
import RenterItemDetails from "./pages/renter/RenterItemDetails"
import RenterWishlist from "./pages/renter/RenterWishlist";
import RentCheckout from "./pages/renter/RentCheckout";
import RoleRedirect from "./pages/auth/roleBasedRedirection";

import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerListings from "./pages/owner/OwnerListings";
import OwnerBookings from "./pages/owner/OwnerBookings";


import AdminLayout from "./layouts/AdminLayout"
import { NotFound } from "./pages/NotFound";
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        {/* Guest pages */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<GuestHome />} />
          <Route path="/role-redirect" element={<RoleRedirect />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Route>

        {/* Renter pages */}
        <Route element={<RenterLayout />}>
          <Route path="/renter" element={<RenterDashboard />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/:rentalId" element={<RentalDetails />} />
          <Route path="/renter_explore" element={<RenterExplore />} />
          <Route path="/renter/rent_items/:id" element={<RenterItemDetails />} />
          <Route path="/wishlist" element={<RenterWishlist />} />
          <Route path="/renter/rent/:id" element={<RentCheckout />}
          />

        </Route>

        {/* Owner pages */}
        <Route element={<OwnerLayout />}>
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/listings" element={<OwnerListings />} />
          <Route path="/bookings" element={<OwnerBookings />} />
        </Route>


        {/* Admin pages */}
        <Route element={<AdminLayout/>}>
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
