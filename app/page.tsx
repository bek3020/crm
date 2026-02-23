"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
      } else {
        router.replace("/dashboard");
      }
    }
    
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, [router]);
  
  if (!loading) return null;

  return (
    <div className="bg-background h-screen w-full flex items-center justify-center text-foreground font-medium">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span>Yuklanmoqda...</span>
      </div>
    </div>
  );
};

export default Home;
