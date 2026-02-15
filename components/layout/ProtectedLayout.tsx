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
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          backgroundColor: "#000",
        }}
      >
        <SidebarApp />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Header />
          <main
            style={{
              padding: "20px",
              color: "#fff",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
