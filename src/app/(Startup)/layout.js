import { AppConfig } from "@/utils/AppConfig";
import Navbar from "@/components/homepage/Navbar/Navbar";
import Footer from "@/components/homepage/Navbar/Footer";

export default function StartupLayout({ children }) {
  return (
    <div className="bg-[#FFFBF0] min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: `${AppConfig.siteName} | ${AppConfig.siteDescription}`,
    description: AppConfig.siteDescription,
    icons: {
      icon: {
        url: "/favicon.ico",
      },
      shortcut: [
        {
          url: "/favicon.ico",
          name: "AI Monitoring System",
          description: AppConfig.siteDescription,
        },
      ],
    },
    siteName: AppConfig.siteName,
    type: "website",
    openGraph: {
      title: `${AppConfig.siteName} - ${AppConfig.siteDescription}`,
      description: AppConfig.siteDescription,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: AppConfig.siteLogo,
          width: 512,
          height: 512,
          alt: AppConfig.siteName,
        },
      ],
    },
  };
}