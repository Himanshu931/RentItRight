import RentalCard from "./RentalCard";

const RentalSection = ({ rentals }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text-primary mb-8">
        Active & Upcoming Rentals
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {rentals?.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalSection;