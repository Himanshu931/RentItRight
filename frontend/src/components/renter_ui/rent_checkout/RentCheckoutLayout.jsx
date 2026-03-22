import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RentalCalendar from "./RentalCalendar";
import RentalDuration from "./RentalDuration";
import CostSummary from "./CostSummary";

export default function RentCheckoutLayout({ item, availability, user }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRequestBooking = async (totalAmount, breakdown) => {
    if (!startDate || !endDate) {
      setError("Please select rental dates");
      return;
    }

    if (!user?.address?.district || !user?.name) {
      // Small refinement: Check for address
      alert("Please update your profile with name and address before booking.");
      navigate("/renter/profile");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const csrf = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrf.json();

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        body: JSON.stringify({
          itemId: item.id,
          ownerId: item.owner?.id,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          address: {
            district: user.address?.district || "Unknown",
            state: user.address?.state || "Unknown",
            pincode: user.address?.pincode || "000000"
          },
          pricing: {
            baseRate: breakdown.rentalFee,
            discountApplied: breakdown.appliedDiscount,
            securityDeposit: breakdown.securityDeposit,
            tax: 0, // Not handled yet
            platformFee: breakdown.serviceFee,
            totalAmount: totalAmount
          }
        }),
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        alert("Booking request sent successfully! Redirecting to your rentals...");
        navigate("/rentals");
      } else {
        throw new Error(data.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      alert(err.message || "Failed to send booking request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app text-white px-8 py-10 pt-30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}
          <RentalCalendar
            disabledDates={availability.disabledDates}
            onSelect={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setError(null);
            }}
          />

          <RentalDuration
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {/* RIGHT */}
        <CostSummary
          item={item}
          startDate={startDate}
          endDate={endDate}
          onRequestBooking={handleRequestBooking}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
