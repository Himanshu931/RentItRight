export default function RentalProgress({ rental }) {
  return (
    <div className="bg-surface border-1 border-app/80 rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase mb-6">Rental Progress</h3>

      <div className="flex justify-between mb-4">
        <p className="font-bold">{rental.startDate}</p>
        <p className="font-bold">{rental.endDate}</p>
      </div>

      <div className="h-2 bg-divider rounded-full overflow-hidden">
        <div
          className="h-full bg-success rounded-full transition-all duration-500"
          style={{ width: `${rental.progressPercent}%` }}
        />
      </div>

      <div className="mt-4 flex justify-center">
        <span className="bg-success/20 text-success text-xs font-bold px-4 py-1 rounded-full">
          {rental.daysRemaining} Days Remaining
        </span>
      </div>
    </div>
  );
}
