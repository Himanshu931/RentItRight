import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin_ui/Navbar";
import Footer from "../components/guest_ui/Footer";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default AdminLayout;
