import { useState } from "react";

import RentalsHeader from "../../components/renter_ui/rentals/RentalsHeader";
import RentalsTabs from "../../components/renter_ui/rentals/RentalsTabs";
import RentalsGrid from "../../components/renter_ui/rentals/RentalsGrid";
import RentalsEmptyState from "../../components/renter_ui/rentals/RentalsEmptyState";

export default function Rentals() {
  const [activeTab, setActiveTab] = useState("active");

  /* 🔌 BACKEND READY DATA */
  const rentals = [
    {
      id: 1,
      status: "active",
      title: "Modern Coastal Estate",
      startDate: "Oct 12",
      endDate: "Oct 28, 2023",
      price: 4200,
      badge: "Active",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBdFFTVFLKp0YmD6sjbD6-Kth1NWz91De7EwqGJ7X1zsLLJI6FWiJIRjbYxUQTeQ1F9r4hAGjW3wjGyhZk6n3ifcPcdSAjkBVSHHarBDJk_OnrI02LCM5wFEZ33yPkMRT7xTqUJMna8MIj7hsGZ7gYQFaPxurCgd79mSGIYd7BkZDWsZZm-fco39w-yEbxM1ylsLQdHpW3HNxElvO2idJUf5jj_4o-eNDBdBgh18T2lhLLxMAEL0CqUZw9voHDvRKTY8vkYW8hthPg",
    },
    {
      id: 2,
      status: "active",
      title: "Red V-Raptor Cinema Kit",
      startDate: "Oct 15",
      endDate: "Oct 20, 2023",
      price: 1850,
      badge: "In Progress",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCq-5QcYJNXl2y4BbVISht9sYPptlJQ9_Q6meSQFagtFPYamZk6BcFiZLk-QJCEv5uTT7opiwFWGMVoAnu3Lgradv8dVXBybYMHahYWF3vu9znobbfFb5nomFzvOoIBmyiXWSUrEwU0l2Kms8sGWkEz4_pc3Gc9YdffLDWrkghVbvAUUUI7R3LaGrg5ZiR3vOEiKZR5rCR3hkbtc_ffo7_gzNS0lFmKtdcMhrt8MNqCAxwlvaaj5M130zLPyrUqiH9YzCzNNLRcnUk",
    },
    {
      id: 3,
      status: "active",
      title: "Porsche Taycan Turbo S",
      startDate: "Oct 18",
      endDate: "Oct 22, 2023",
      price: 2100,
      badge: "Active",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDT1yFrErIC2xI8nYIVe9oqz4fdEOYS_sO50Le7ueyGEzXQ_jxGMLRTOFupJIlRmb5XkWA5jMAHh8sxof0tzWlMp3uvivvi3xERR8lfaAg2D6CJvvjanGhvcH17blaPrreJFajNN3tuDHFXcW_E8sISIDfr7IpLhHPROSmgR5YXq4Acp5LhU5u8vdHZo2MMKlKGXheKTKf8_go1hN-tUGxrTrOYIoHPR50VmFtwesdJthrFSz1B_4MWmMePqIdzFk0ben4RIdY5Ux8",
    },
  ];

  const filteredRentals = rentals.filter(
    (r) => r.status === activeTab
  );

  return (
    <main className="px-8 lg:px-40 py-10 max-w-[1440px] mx-auto w-full">
      <RentalsHeader />

      <RentalsTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        counts={{
          active: rentals.filter(r => r.status === "active").length,
          upcoming: rentals.filter(r => r.status === "upcoming").length,
        }}
      />

      {filteredRentals.length > 0 ? (
        <RentalsGrid rentals={filteredRentals} />
      ) : (
        <RentalsEmptyState />
      )}
    </main>
  );
}
