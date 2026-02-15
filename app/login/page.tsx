"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// Shadcn UI komponentlari - Import yo'llarini faylingizdagi nomga moslang!
// Odatda bular kichik harfda bo'ladi: card, input, button
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card"; // 'Card' emas 'card' bo'lishi ehtimoli yuqori
import { Input } from "@/components/ui/Input"; // 'Input' emas 'input'
import { Button } from "@/components/ui/Button"; // 'Button' emas 'button'

interface LoginErrorResponse {
  message?: string;
}

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Backend URL ni shakllantirish
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    
    // Slash'lar bilan muammo bo'lmasligi uchun xavfsiz URL yasash
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/sign-in`;

    try {
      const response = await axios.post(apiUrl, {
        email: formData.email,
        password: formData.password,
      });

      // Backend ma'lumotni 'data' ichida yoki to'g'ridan-to'g'ri qaytarishi mumkin
      const data = response.data;
      const token = data.token || data.accessToken || data.data?.token;

      if (token) {
        // Ma'lumotlarni saqlash
        localStorage.setItem("token", token);
        
        const userObj = data.user || data.data?.user;
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        // Dashboard yoki asosiy sahifaga yo'naltirish
        router.push("/");
        
        // Next.js state-larini yangilash uchun birozdan so'ng refresh qilish yaxshiroq
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        setError("Login muvaffaqiyatli, lekin serverdan token kelmadi.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<LoginErrorResponse>;
      // Server qaytargan xatoni o'qish
      const serverMessage = axiosError.response?.data?.message;
      
      if (axiosError.code === "ERR_NETWORK") {
        setError("Internet bilan aloqa yo'q yoki Backend ishlamayapti");
      } else {
        setError(serverMessage || "Email yoki parol xato!");
      }
      
      console.error("Batafsil xato:", axiosError.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4 text-white">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Kirish
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Tizimga kirish uchun malumotlarni kiriting
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium leading-none text-zinc-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="misol@pochta.uz"
                className="bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-white text-white placeholder:text-zinc-600"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium leading-none text-zinc-300">
                Parol
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-white text-white placeholder:text-zinc-600"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-500 font-bold py-6 text-lg transition-all"
              type="submit"
              disabled={loading}
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;