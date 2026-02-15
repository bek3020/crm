"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. LocalStorage va barcha tokenlarni tozalaymiz
    localStorage.clear(); // Hamma narsani (token, user info) o'chiradi
    sessionStorage.clear();

    // 2. Sidebar holati uchun cookieni ham o'chiramiz
    document.cookie = "sidebar_state=; path=/; max-age=0;";

    // 3. Darhol login sahifasiga o'tkazamiz
    router.push("/login");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <p>Chiqilmoqda...</p>
    </div>
  );
};

export default Logout;
