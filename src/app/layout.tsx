import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { baseMetadata } from "@/config/metadata";
import { Oxygen } from "next/font/google";
import { cn } from "@/lib/utils";

const fontHeading = Oxygen({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={cn(fontHeading.variable)}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
        <meta name="google-site-verification" content="BpG6TiWALZCQvUimoLjdpU3RhdEc5dJtvvVap1iV6Bs" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          "bg-[linear-gradient(to_bottom,#f8fafc,#ffffff)]"
        )}
      >
        <div className="relative">
          <Header />
          <main className="min-h-screen backdrop-blur-[2px]">
            {children}
          </main>
          <Footer />
          <ToasterProvider />
        </div>
      </body>
    </html>
  );
}
