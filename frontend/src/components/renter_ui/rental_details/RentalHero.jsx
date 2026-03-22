export default function RentalHero({ rental }) {
  return (
    <div className="bg-surface border-1 border-app/80 rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto">
          <img src={rental.image} alt={rental.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <div className="flex flex-row justify-center items-center gap-4">
                <span className="text-success text-xs font-bold uppercase border-1 border-green rounded-xl py-1 px-3 font-bold bg-[#162a29]">
                  {rental.status}
                </span>
                <h1 className="text-2xl font-black">{rental.title}</h1>
              </div>
              <p className="text-text-secondary text-sm">{rental.location}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t border-divider pt-4">
            <p className="text-sm text-text-secondary">
              Rental Type: <span className="font-bold uppercase">{rental.rentalType}</span>
            </p>
            <p className="text-xs text-text-secondary">
              Agreement signed {rental.agreementDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
