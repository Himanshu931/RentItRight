const QuickActions = ({
  onAddItem,
  onViewBookings,
  onManageListings,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-8">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-6">
        <button
          onClick={onAddItem}
          className="bg-bright text-app px-6 py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Add New Item
        </button>

        <button
          onClick={onViewBookings}
          className="bg-card border border-divider px-6 py-3 rounded-xl text-text-primary hover:bg-white/5 transition"
        >
          View Bookings
        </button>

        <button
          onClick={onManageListings}
          className="bg-card border border-divider px-6 py-3 rounded-xl text-text-primary hover:bg-white/5 transition"
        >
          Manage Listings
        </button>
      </div>
    </div>
  );
};

export default QuickActions;