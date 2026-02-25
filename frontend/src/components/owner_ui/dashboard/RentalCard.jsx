const RentalCard = ({ rental }) => {
  return (
    <div className="bg-card border border-divider rounded-2xl overflow-hidden hover:shadow-lg transition">

      <div className="relative">
        <img
          src={rental.image}
          alt={rental.title}
          className="w-full h-56 object-cover"
        />
      </div>

      <div className="p-6 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-text-primary">
            {rental.title}
          </h3>

          <span className="text-sm text-yellow-400">
            ⭐ {rental.rating}
          </span>
        </div>

        <p className="text-sm text-text-secondary">
          Rented by {rental.rentedBy} ·{" "}
          <span className="text-bright">
            {rental.status}
          </span>
        </p>

        <p className="text-lg font-semibold text-text-primary">
          ${rental.pricePerDay}
          <span className="text-sm text-text-secondary font-normal">
            /day
          </span>
        </p>
      </div>

    </div>
  );
};

export default RentalCard;