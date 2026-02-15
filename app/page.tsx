"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      router.replace("/dashboard");
    }
    setLoading(false);
  }, [router]);

  return (
    <div className="bg-black h-screen w-full flex items-center justify-center text-white font-bold">
      Yuklanmoqda...
    </div>
  );
};

export default Home;