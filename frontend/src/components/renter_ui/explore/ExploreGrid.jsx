import ExploreCard from "./ExploreCard";
import React from "react";

const ExploreGrid = ({ rentals, linkPrefix = "/renter/rent_items" }) => {
    if (!rentals.length) {
    return (
      <p className="text-text-secondary text-sm">
        No rentals found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {rentals.map((item) => (
        <ExploreCard key={item.id} item={item} linkPrefix={linkPrefix} />
      ))}
    </div>
  );
};

export default React.memo(ExploreGrid);
