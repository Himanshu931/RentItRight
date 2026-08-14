import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RentalCard({ rental }) {
  const [isPaying, setIsPaying] = useState(false);

  const handleWalletPay = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPaying) return;
    setIsPaying(true);

    try {
      // Fetch CSRF token first
      const csrfRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
      });
      const csrfData = await csrfRes.json();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfData.csrfToken
        },
        body: JSON.stringify({ bookingId: rental.id }),
        credentials: "include"
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Paid with wallet!");
        window.location.reload();
      } else {
        toast.error(data.message || "Payment failed");
      }
    } catch (err) {
      toast.error("Network error while processing payment");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <Link to={`/rentals/${rental.id}`} className="block">
      <div className="bg-surface border-2 border-app/80 rounded-xl overflow-hidden hover:border-bright/40 transition-all">
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${rental.image})` }}
        >
          <span className="absolute top-4 left-4 bg-accent/90 text-background-dark text-[10px] font-black px-3 py-1 rounded-full uppercase">
            {rental.badge}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold hover:text-bright transition-colors">
                {rental.title}
              </h3>
              <p className="text-text-secondary text-xs flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>
                {rental.startDate} — {rental.endDate}
              </p>
            </div>

            <p className="text-bright font-bold">₹{rental.price}</p>
          </div>

          <div className="flex justify-around border-t border-divider pt-4">
            {["chat_bubble", "event_repeat", "cancel"].map((icon) => (
              <button
                key={icon}
                className="flex flex-col items-center text-text-secondary/50"
              >
                <div className="size-10 rounded-full bg-app flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    {icon}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {rental.paymentStatus === "pending" && rental.status === "confirmed" && (
            <button 
              onClick={handleWalletPay}
              disabled={isPaying}
              className={`mt-2 w-full py-2 rounded-lg font-bold transition-all ${
                isPaying 
                  ? 'bg-divider text-text-secondary cursor-not-allowed' 
                  : 'bg-bright text-background-dark hover:bg-bright/90 active:scale-95'
              }`}
            >
              {isPaying ? 'Processing...' : 'Pay with Wallet'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

