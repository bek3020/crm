"use client";

import {
  LayoutDashboard,
  UserCog,
  Users,
  GraduationCap,
  Users2,
  BookOpen,
  CreditCard,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mainNav = [
  { title: "Asosiy", icon: LayoutDashboard, url: "/dashboard" },
  { title: "Menajerlar", icon: UserCog, url: "/dashboard/managers" },
  { title: "Adminlar", icon: Users, url: "/dashboard/admins" },
  { title: "Ustozlar", icon: GraduationCap, url: "/dashboard/teachers" },
  { title: "Studentlar", icon: Users2, url: "/dashboard/students" },
  { title: "Guruhlar", icon: Users2, url: "/dashboard/groups" },
  { title: "Kurslar", icon: BookOpen, url: "/dashboard/courses" },
  { title: "Payment", icon: CreditCard, url: "/dashboard/payments" },
];

export function SidebarApp() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "sidebar_state=; path=/; max-age=0;";
    router.push("/login");
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-6 bg-card">
        <h2 className="font-bold text-xl tracking-tight text-foreground">
          Admin CRM
        </h2>
      </SidebarHeader>

      <SidebarContent className="px-2 overflow-y-auto sidebar-scroll h-[calc(100vh-120px)] bg-card">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium mb-2 px-4">
            Menu
          </SidebarGroupLabel>

          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-accent hover:text-accent-foreground transition-all py-6 rounded-lg px-4"
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-[15px]">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-muted-foreground font-medium mb-2 px-4">
            Boshqalar
          </SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-accent hover:text-accent-foreground py-6 px-4 rounded-lg"
              >
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[15px]">Sozlamalar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="hover:bg-accent hover:text-accent-foreground py-6 px-4 rounded-lg"
              >
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-[15px]">Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border bg-card">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 py-6 px-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[15px]">Chiqish</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
