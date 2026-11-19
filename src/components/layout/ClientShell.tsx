"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const { highContrast, fontSize } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    root.classList.remove("text-base", "text-lg", "text-xl");
    if (fontSize === "large") {
      root.classList.add("text-lg");
    } else if (fontSize === "extra-large") {
      root.classList.add("text-xl");
    } else {
      root.classList.add("text-base");
    }
  }, [highContrast, fontSize]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        highContrast
          ? "bg-black text-fuchsia-200 font-semibold"
          : "bg-[#0d0118] text-slate-100"
      }`}
    >
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
