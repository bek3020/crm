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
  { title: "Asosiy", icon: LayoutDashboard, url: "/" },
  { title: "Menajerlar", icon: UserCog, url: "/managers" },
  { title: "Adminlar", icon: Users, url: "/admins" },
  { title: "Ustozlar", icon: GraduationCap, url: "/teachers" },
  { title: "Studentlar", icon: Users2, url: "/students" },
  { title: "Guruhlar", icon: Users2, url: "/groups" },
  { title: "Kurslar", icon: BookOpen, url: "/courses" },
  { title: "Payment", icon: CreditCard, url: "/payments" },
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
    <Sidebar className="border-r border-white/10 bg-black">
      <SidebarHeader className="p-6 bg-black">
        <h2 className="text-white font-bold text-xl tracking-tight">
          Admin CRM
        </h2>
      </SidebarHeader>

      <SidebarContent className="bg-black px-2 overflow-y-auto sidebar-scroll h-[calc(100vh-120px)]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium mb-2 px-4">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-white/10 text-gray-400 hover:text-white transition-all py-6 rounded-lg px-4"
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
          <SidebarGroupLabel className="text-gray-500 font-medium mb-2 px-4">
            Boshqalar
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-white/10 text-gray-400 hover:text-white py-6 px-4">
                <Settings className="w-5 h-5" />
                <span className="text-[15px]">Sozlamalar</span>
              </SidebarMenuButton>
              <SidebarMenuButton className="hover:bg-white/10 text-gray-400 hover:text-white py-6 px-4">
                <UserCircle className="w-5 h-5" />
                <span className="text-[15px]">Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-black p-4 border-t border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-500 hover:bg-red-500/10 hover:text-red-400 py-6 px-4"
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
