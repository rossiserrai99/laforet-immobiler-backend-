import React from 'react';
import { Header, Footer, FloatingWhatsApp } from "@/components/layout";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
