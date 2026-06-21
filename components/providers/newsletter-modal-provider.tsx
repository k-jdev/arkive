"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import NewsletterModal from "@/components/sections/home/newsletter-modal";

interface NewsletterModalContextValue {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const NewsletterModalContext = createContext<
  NewsletterModalContextValue | undefined
>(undefined);

export function NewsletterModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openModal, closeModal }),
    [open, openModal, closeModal],
  );

  return (
    <NewsletterModalContext.Provider value={value}>
      {children}
      <NewsletterModal open={open} onClose={closeModal} />
    </NewsletterModalContext.Provider>
  );
}

export function useNewsletterModal() {
  const context = useContext(NewsletterModalContext);
  if (!context) {
    throw new Error(
      "useNewsletterModal must be used within NewsletterModalProvider",
    );
  }
  return context;
}
