import Header from "@/components/layout/header";
import { NewsletterModalProvider } from "@/components/providers/newsletter-modal-provider";

export default function DeckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh h-screen flex flex-col bg-neutral-950">
      <NewsletterModalProvider>
        <Header />
        {children}
      </NewsletterModalProvider>
    </div>
  );
}
