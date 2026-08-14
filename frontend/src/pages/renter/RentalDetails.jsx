import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/renter_ui/rental_details/Breadcrumbs";
import RentalHero from "../../components/renter_ui/rental_details/RentalHero";
import RentalProgress from "../../components/renter_ui/rental_details/RentalProgress";
import FinancialBreakdown from "../../components/renter_ui/rental_details/FinancialBreakdown";
import OwnerInfo from "../../components/renter_ui/rental_details/OwnerInfo";
import RentalPolicies from "../../components/renter_ui/rental_details/RentalPolicies";
import RentalActions from "../../components/renter_ui/rental_details/RentalActions";
import ActivityTimeline from "../../components/renter_ui/rental_details/ActivityTimeline";

export default function RentalDetails() {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        setLoading(true);
        // Fetch CSRF Token
        const csrfResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
          method: "GET",
          credentials: "include",
        });
        const csrfData = await csrfResponse.json();

        // Fetch Rental Details
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/booking/${rentalId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfData.csrfToken,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rental details");
        }

        const data = await response.json();
        const booking = data.booking;

        // Calculate progress percentage
        const start = new Date(booking.start_date);
        const end = new Date(booking.end_date);
        const now = new Date();
        const totalDuration = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const progressPercent = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

        // Calculate days remaining
        const diffTime = end.getTime() - now.getTime();
        const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        // Map API data to UI structure
        const mappedRental = {
          id: booking._id,
          status: booking.booking_status,
          title: booking.item_id?.title || "Unknown Item",
          location: booking.address ? `${booking.address.district}, ${booking.address.state}` : "Location not available",
          image: booking.item_id?.images?.[0] || "https://via.placeholder.com/400x300?text=No+Image",
          rentalType: booking.pricing?.appliedPricing || "Daily",
          agreementDate: new Date(booking.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          startDate: new Date(booking.start_date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          endDate: new Date(booking.end_date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          progressPercent: Math.round(progressPercent),
          daysRemaining: daysRemaining,
          pricing: {
            dailyRate: booking.pricing?.baseRate || 0,
            durationDays: booking.total_days || 0,
            subtotal: booking.pricing?.subtotal || 0,
            deposit: booking.pricing?.securityDeposit || 0,
            totalPaid: booking.pricing?.totalAmount || 0,
          },
          owner: {
            name: booking.owner_id?.name || "Private Owner",
            rating: 4.8, // Mocked as API doesn't provide it yet
            reviews: 42, // Mocked as API doesn't provide it yet
            avatar: booking.owner_id?.profileImage || "https://ui-avatars.com/api/?name=" + encodeURIComponent(booking.owner_id?.name || "PO") + "&background=random",
          },
          policies: [
            {
              title: "Late Return Policy",
              description: "₹50/hr charge after 2 hours delay.",
              icon: "history",
            },
            {
              title: "Damage Policy",
              description: "Security deposit covers minor incidental damages.",
              icon: "shield",
            },
          ],
          timeline: [
            {
              id: 1,
              title: "Request " + booking.booking_status,
              description: new Date(booking.createdAt).toLocaleString(),
              type: "info",
            },
            ...(booking.booking_status === "confirmed" || booking.booking_status === "ongoing" || booking.booking_status === "completed" ? [{
              id: 2,
              title: "Booking Confirmed",
              description: "Your request was approved by the owner",
              type: "success",
            }] : []),
          ],
        };

        setRental(mappedRental);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  if (loading) {
    return (
      <main className="flex-1 px-6 py-10 max-w-[900px] mx-auto flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-bright border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-bold">Loading rental details...</p>
        </div>
      </main>
    );
  }

  if (error || !rental) {
    return (
      <main className="flex-1 px-6 py-10 max-w-[900px] mx-auto flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-6">
          <div className="size-20 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red text-4xl">error</span>
          </div>
          <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
          <p className="text-text-secondary max-w-md mx-auto">{error || "Could not find the rental details you're looking for."}</p>
          <button
            onClick={() => navigate("/rentals")}
            className="bg-bright text-surface px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform cursor-pointer"
          >
            Back to My Rentals
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-10 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs />
      <RentalHero rental={rental} />
      <RentalProgress rental={rental} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancialBreakdown pricing={rental.pricing} />
        <div className="flex flex-col gap-6">
          <OwnerInfo owner={rental.owner} />
          <RentalPolicies policies={rental.policies} />
        </div>
      </div>

      <RentalActions />
      <ActivityTimeline timeline={rental.timeline} />
    </main>
  );
}

