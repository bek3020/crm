"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }

    const timer = setTimeout(() => {
      setIsAuthenticated(!!token);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  return { isAuthenticated, loading };
};
