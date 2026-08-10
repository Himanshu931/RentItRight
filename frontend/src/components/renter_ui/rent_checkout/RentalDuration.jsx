export default function RentalDuration({ startDate, endDate }) {
  const formatLocalDate = (d) => {
    if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "--";
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="bg-surface rounded-xl p-6">
      <h4 className="text-lg font-bold mb-4">Rental Duration</h4>

      <div className="flex justify-between text-sm opacity-80">
        <div>
          <p>Check-in</p>
          <p className="text-text-secondary">{formatLocalDate(startDate)}</p>
        </div>
        <div>
          <p>Check-out</p>
          <p className="text-text-secondary">{formatLocalDate(endDate)}</p>
        </div>
      </div>
    </div>
  );
}
