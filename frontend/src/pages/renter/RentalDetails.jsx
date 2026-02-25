import Breadcrumbs from "../../components/renter_ui/rental_details/Breadcrumbs";
import RentalHero from "../../components/renter_ui/rental_details/RentalHero";
import RentalProgress from "../../components/renter_ui/rental_details/RentalProgress";
import FinancialBreakdown from "../../components/renter_ui/rental_details/FinancialBreakdown";
import OwnerInfo from "../../components/renter_ui/rental_details/OwnerInfo";
import RentalPolicies from "../../components/renter_ui/rental_details/RentalPolicies";
import RentalActions from "../../components/renter_ui/rental_details/RentalActions";
import ActivityTimeline from "../../components/renter_ui/rental_details/ActivityTimeline";


export default function RentalDetails() {
  /* 🔌 BACKEND READY OBJECT (API → state later) */
  const rental = {
    id: "RR-8829",
    status: "active",
    title: "Modern Coastal Estate",
    location: "Malibu, California",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdFFTVFLKp0YmD6sjbD6-Kth1NWz91De7EwqGJ7X1zsLLJI6FWiJIRjbYxUQTeQ1F9r4hAGjW3wjGyhZk6n3ifcPcdSAjkBVSHHarBDJk_OnrI02LCM5wFEZ33yPkMRT7xTqUJMna8MIj7hsGZ7gYQFaPxurCgd79mSGIYd7BkZDWsZZm-fco39w-yEbxM1ylsLQdHpW3HNxElvO2idJUf5jj_4o-eNDBdBgh18T2lhLLxMAEL0CqUZw9voHDvRKTY8vkYW8hthPg",
    rentalType: "weekly",
    agreementDate: "Oct 10, 2023",
    startDate: "Oct 12, 2023",
    endDate: "Oct 28, 2023",
    progressPercent: 75,
    daysRemaining: 12,
    pricing: {
      dailyRate: 600,
      durationDays: 7,
      subtotal: 4200,
      deposit: 1000,
      totalPaid: 5200,
    },
    owner: {
      name: "Elite Properties Inc.",
      rating: 4.9,
      reviews: 124,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2a3GbNuA-5NkUDoV_O-5XdrsVkXZOULXIzsTmu4ebVnJ1NVtJrAT_MifQ4ogBKvO88S178UkIGdEvWlm-yag5yiunM1rEhDzlLBHKCS2BjkpqS4anmPpbXoTLuXusKhBiP3B4Tv_gbk0Au22fFEQRjGnwukfKKVy7jBwIhu5G5USN4Q_mJdTA1ItvV9Hj0QTEGIVKBf3JHgT7DLIUyWSrkXjf9av_lLTwEV3gjlkxwjaEan1SySe1JCT2PkZDOY4CRoBA8Kid2yo",
    },
    policies: [
      {
        title: "Late Return Policy",
        description: "$100/hr charge after 2 hours delay.",
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
        title: "Rental Started",
        description: "Picked up on Oct 12, 2023 · 10:30 AM",
        type: "success",
      },
      {
        id: 2,
        title: "Agreement Signed",
        description: "Oct 10, 2023 · 04:15 PM",
        type: "info",
      },
    ],
  };

  return (
    <main className="flex-1 px-6 py-10 max-w-[900px] mx-auto space-y-6">
      <Breadcrumbs rentalId={rental.id} />
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
