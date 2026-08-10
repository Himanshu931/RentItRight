import Hero from "../../components/guest_ui/guest_dashboard/Hero";
import Steps from "../../components/guest_ui/guest_dashboard/Steps";
import Categories from "../../components/guest_ui/guest_dashboard/Categories";
import Trust from "../../components/guest_ui/guest_dashboard/Trust";
import CTA from "../../components/guest_ui/guest_dashboard/CTA";
import homeRedirect from "../../hooks/homeRedirect";
import SEO from "../../components/common/SEO";

const GuestHome = () => {
  homeRedirect();

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://rentitright.vercel.app/#organization",
        "name": "RentItRight",
        "url": "https://rentitright.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "@id": "https://rentitright.vercel.app/#logo",
          "url": "https://rentitright.vercel.app/src/assets/favicon.png",
          "caption": "RentItRight Logo"
        },
        "description": "Peer-to-peer item renting made simple. Rent tools, electronics, appliances, and more from people around you safely and locally."
      },
      {
        "@type": "WebSite",
        "@id": "https://rentitright.vercel.app/#website",
        "url": "https://rentitright.vercel.app",
        "name": "RentItRight",
        "publisher": {
          "@id": "https://rentitright.vercel.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://rentitright.vercel.app/explore?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Rent Anything. Anytime. Locally."
        description="Access premium equipment, tools, cameras, and appliances without the ownership burden. RentItRight is the ultra-modern peer-to-peer local renting marketplace."
        keywords="peer to peer rental, rent tools, rent cameras, rent equipment locally, RentItRight, rent gear, rent it right"
        schema={homeSchema}
      />
      <main className="bg-app min-h-screen">
        <Hero />

        <Steps />

        {/* Subtle Gradient Divider */}
        <div
          className="h-px w-full max-w-[1400px] mx-auto opacity-[0.1]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(47,183,164,0.3), transparent)" }}
        />

        <Categories />

        <Trust />

        <CTA />

        {/* Footer could go here too if needed, but usually it's in App.jsx */}
      </main>
    </>
  );
};

export default GuestHome;
