const StatCard = ({ label, value }) => {
  return (
    <div className="bg-card border border-divider rounded-2xl p-8 w-full">
      <p className="text-text-secondary text-sm uppercase tracking-wide mb-3">
        {label}
      </p>
      <h3 className="text-3xl font-semibold text-text-primary">
        {value}
      </h3>
    </div>
  );
};

const StatsCards = ({ stats }) => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <StatCard label="Total Listings" value={stats?.totalListings} />
      <StatCard label="Active Rentals" value={stats?.activeRentals} />
      <StatCard label="Upcoming Returns" value={stats?.upcomingReturns} />
      <StatCard label="Total Earnings" value={`$${stats?.totalEarnings}`} />
    </div>
  );
};

export default StatsCards;