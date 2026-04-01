import { Search } from "lucide-react";
const ExploreSearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-10">
      <div className="relative max-w-3xl mx-auto rounded-3xl bg-card border border-divider flex items-center h-14 px-4">

        <Search className="text-text-secondary mr-3" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-text-primary placeholder:text-text-secondary"
          placeholder="Search items near you..."
        />

        <button className="ml-2 bg-accent text-text-primary font-bold px-4 py-1.5 rounded-lg text-sm">
          Search
        </button>
      </div>
    </div>
  );
};

export default ExploreSearchBar;
