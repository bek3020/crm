import { ReactNode } from "react";
import Header from "./Header";
import { SidebarApp } from "./SidebarApp";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background text-foreground">
        <SidebarApp />

        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
