import { useEffect } from "react";

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  schema,
}) {
  useEffect(() => {
    // 1. Update document title
    const prevTitle = document.title;
    const defaultTitle = "RentItRight | Peer-to-Peer Rental Marketplace";
    document.title = title ? `${title} | RentItRight` : defaultTitle;

    // Helper to update or create a meta tag
    const updateMeta = (nameOrProperty, content, isProperty = false) => {
      const attrName = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attrName}="${nameOrProperty}"]`);
      if (content) {
        if (!element) {
          element = document.createElement("meta");
          element.setAttribute(attrName, nameOrProperty);
          document.head.appendChild(element);
        }
        element.setAttribute("content", content);
      } else if (element) {
        element.remove();
      }
    };

    // Helper to update or create a link tag
    const updateLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (href) {
        if (!element) {
          element = document.createElement("link");
          element.setAttribute("rel", rel);
          document.head.appendChild(element);
        }
        element.setAttribute("href", href);
      } else if (element) {
        element.remove();
      }
    };

    const siteUrl = "https://rentitright.vercel.app";
    const absoluteUrl = url ? (url.startsWith("http") ? url : `${siteUrl}${url}`) : window.location.href;
    const defaultDesc = "Peer-to-peer item renting made simple. Rent tools, electronics, appliances, and more from people around you safely and locally on RentItRight.";
    const defaultKeywords = "renting, peer-to-peer rental, rent camera gear, rent tools, rent electronics, RentItRight";
    const defaultImage = `${siteUrl}/og-image.png`;

    // 2. Set Standard Meta Tags
    updateMeta("description", description || defaultDesc);
    updateMeta("keywords", keywords || defaultKeywords);
    updateMeta("author", "RentItRight");

    // 3. Set Open Graph (OG) tags
    updateMeta("og:title", title ? `${title} | RentItRight` : defaultTitle, true);
    updateMeta("og:description", description || defaultDesc, true);
    updateMeta("og:image", image || defaultImage, true);
    updateMeta("og:url", absoluteUrl, true);
    updateMeta("og:type", type, true);
    updateMeta("og:site_name", "RentItRight", true);

    // 4. Set Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title ? `${title} | RentItRight` : defaultTitle);
    updateMeta("twitter:description", description || defaultDesc);
    updateMeta("twitter:image", image || defaultImage);

    // 5. Set Canonical Link
    updateLink("canonical", absoluteUrl);

    // 6. Set Structured Data (JSON-LD) Schema
    let schemaScript = document.getElementById("jsonld-seo-schema");
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "jsonld-seo-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

    // Cleanup function when component unmounts or dependencies change
    return () => {
      // Revert title if unmounted
      document.title = prevTitle;
      
      // Cleanup dynamic schema script if needed
      const currentSchemaScript = document.getElementById("jsonld-seo-schema");
      if (currentSchemaScript && !schema) {
        currentSchemaScript.remove();
      }
    };
  }, [title, description, keywords, image, url, type, schema]);

  return null;
}
