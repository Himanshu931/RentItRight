import ImageGallery from "../../components/renter_ui/item_detail/ImageGallery";
import ItemSummaryCard from "../../components/renter_ui/item_detail/ItemSummaryCard";
import OwnerCard from "../../components/renter_ui/item_detail/OwnerCard";
import ItemDescription from "../../components/renter_ui/item_detail/ItemDescription";
import ItemSpecs from "../../components/renter_ui/item_detail/ItemSpecs";
import RentalGuidelines from "../../components/renter_ui/item_detail/RentalGuidelines";

import renterExploreDummy from "../../data/renterExploreDummy";
import { useParams } from "react-router-dom";

  
// const RenterItemDetails = ({ item }) => {
const RenterItemDetails = ()=>{  
  
  // const item = {
  //   id: "item_001",
  //   title: "Canon Camera",
  //   category: "Photography",
  //   image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
  //   pricing: {
  //     daily: 450,
  //     weekly: 2500,
  //     monthly: 8000,
  //   },
  //   description:
  //     "The RED V-RAPTOR 8K VV is a professional cinema camera designed for high-end film production. It delivers exceptional dynamic range, multi-format recording, and unmatched image quality trusted by filmmakers worldwide.",
  //   owner: {
  //     name: "Marcus V.",
  //     avatar: "https://i.pravatar.cc/150?img=12",
  //     rating: 4.9,
  //   },
  //   specs: [
  //     { label: "Max Resolution", value: "8K at 120 FPS" },
  //     { label: "Sensor Type", value: "35.4MP CMOS" },
  //   ],
  //   guidelines: [
  //     "Professional insurance is required for this equipment.",
  //     "No usage in extreme environments without protective housing.",
  //     "Late returns incur an additional 50% daily fee.",
  //   ],
  // };
  const { id } = useParams();

  const item = renterExploreDummy.find((i) => i.id === id);
  
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-20 py-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">

      {/* LEFT */}
      <div>
        <ImageGallery image={item.image} />

        <ItemDescription description={item.description} />

        <ItemSpecs specs={item.specs} />

        <RentalGuidelines rules={item.guidelines} />
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-6">
        <ItemSummaryCard item={item} />
        <OwnerCard owner={item.owner} />
      </div>
    </div>
  );
};

export default RenterItemDetails;
