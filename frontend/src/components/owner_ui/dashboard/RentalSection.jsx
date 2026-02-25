import RentalCard from "./RentalCard";

const RentalSection = ({ rentals }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">
          Active & Upcoming Rentals
        </h2>
        <button className="text-bright text-sm font-bold hover:underline">
          View All History
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {rentals?.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalSection;