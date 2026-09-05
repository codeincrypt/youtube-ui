"use client";

import { Suspense, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="stage">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-[268px]">
        <div className="mx-auto max-w-[1180px] px-4 pt-4 pb-16 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-16" />}>
            <TopBar onMenu={() => setMenuOpen(true)} />
          </Suspense>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
