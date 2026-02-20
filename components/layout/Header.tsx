"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "../mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Users2 } from "lucide-react";

interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
}

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("User data parse error:", error);
        }
      }
    }
  }, []);

  const getInitials = () => {
    if (!user) return "U";
    const first = user.first_name?.[0] || "";
    const last = user.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = () => {
    if (!user) return "Foydalanuvchi";
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Foydalanuvchi";
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6 bg-background/95 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 border rounded-md hover:bg-accent transition-colors" />
        <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
        <h1 className="text-sm md:text-base font-semibold text-foreground">
          Asosiy
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <div className="flex items-center gap-3 border-l pl-4 md:pl-6 ml-2">
          <div className="text-right hidden sm:flex flex-col">
            <span className="text-sm font-semibold leading-none text-foreground">
              {getFullName()}
            </span>
            <span className="text-[11px] text-muted-foreground mt-1 flex items-center justify-end gap-1 font-medium uppercase">
              <Users2 className="w-3 h-3" /> {user?.role || "User"}
            </span>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-primary/10 overflow-hidden bg-accent flex items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              {getInitials()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
