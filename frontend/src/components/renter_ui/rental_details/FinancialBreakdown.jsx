export default function FinancialBreakdown({ pricing }) {
  return (
    <div className="bg-surface border-1 border-app/80 rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase mb-6">Financial Breakdown</h3>
      <div className="border-b border-divider">
      {[
        ["Daily Rate", `₹${pricing.dailyRate}`],
        ["Duration", `${pricing.durationDays} Days`],
        ["Subtotal", `₹${pricing.subtotal}`],
        ["Security Deposit", `₹${pricing.deposit}`],
      ].map(([label, value]) => (
        <div key={label} className="flex justify-between text-sm mb-3">
          <span className="text-text-secondary">{label}</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}</div>

      <div className="mt-4 p-4 bg-accent/20 rounded-xl flex flex-col">
        <span className="font-black text-xs text-text-secondary uppercase">Total Paid</span>
        <span className="font-black text-3xl text-text-primary">₹{pricing.totalPaid}</span>
      </div>
    </div>
  );
}
