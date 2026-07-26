import React from 'react';
import "../globals.css";

// For now, this is just a wrapper. In Phase 10, the Sidebar will be injected here.
export const metadata = {
  title: "Admin | LA FORÊT",
  robots: "noindex, nofollow"
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col antialiased">
      {children}
    </div>
  );
}
