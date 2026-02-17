"use client";

import { ReactNode } from "react";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
