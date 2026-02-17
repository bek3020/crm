"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.clear(); 
    sessionStorage.clear();

    document.cookie = "sidebar_state=; path=/; max-age=0;";

    router.push("/login");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <p>Chiqilmoqda...</p>
    </div>
  );
};

export default Logout;
