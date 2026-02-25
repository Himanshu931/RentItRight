import Navbar from "../../components/guest_ui/Navbar";
import Footer from "../../components/guest_ui/Footer";
import LoginBanner from "../../components/guest_ui/explore/LoginBanner";
import SearchBar from "../../components/guest_ui/explore/SearchBar";
import Filters from "../../components/guest_ui/explore/Filters";
import RentalsGrid from "../../components/guest_ui/explore/RentalsGrid";

export default function Explore() {
  return (
    <>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <LoginBanner />
        <SearchBar />
        {/* <Filters /> */}
        <RentalsGrid />
      </main>

    </>
  );
}
