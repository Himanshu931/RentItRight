export default function OwnerInfo({ owner }) {
  return (
    <div className="bg-surface border-1 border-app/80 rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase mb-6">Owner Information</h3>

      <div className="flex items-center gap-4 mb-6">
        <img src={owner.avatar} className="size-14 rounded-full object-cover" />
        <div>
          <p className="font-bold">{owner.name}</p>
          <p className="text-sm text-text-secondary">
            ⭐ {owner.rating} ({owner.reviews} reviews)
          </p>
        </div>
      </div>

      <button className="w-full bg-accent text-white py-3 rounded-xl font-bold">
        Chat with Owner
      </button>
    </div>
  );
}
