import Hero from "../../components/guest_ui/guest_dashboard/Hero";
import Steps from "../../components/guest_ui/guest_dashboard/Steps";
import Categories from "../../components/guest_ui/guest_dashboard/Categories";
import homeRedirect from "../../hooks/homeRedirect";

const GuestHome=()=> {
  homeRedirect();
  return (

    
    <>
      <main>
        <Hero/>
        <Steps />
        <Categories/>
        {/* Trust */}
        {/* CTA */}

      </main>
    </>
  );
}

export default GuestHome;
