import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { NewsletterModalProvider } from "@/components/providers/newsletter-modal-provider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NewsletterModalProvider>
      <Header />
      {children}
      <Footer />
    </NewsletterModalProvider>
  );
}
