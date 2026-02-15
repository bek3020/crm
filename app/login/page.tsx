"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface LoginErrorResponse {
  message?: string;
}

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const inputFields = [
    {
      id: "email",
      type: "email",
      label: "Email",
      placeholder: "usern88@mail.ru",
    },
    {
      id: "password",
      type: "password",
      label: "Parol",
      placeholder: "••••••••",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/sign-in`;

    try {
      const response = await axios.post(apiUrl, formData);

      const data = response.data;
      const token = data.token || data.accessToken || data.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        if (data.user || data.data?.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user || data.data.user),
          );
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Token kelmadi, Backend response formatini tekshiring.");
      }
    } catch (err) {
      const axiosError = err as AxiosError<LoginErrorResponse>;
      const serverMessage = axiosError.response?.data?.message;
      setError(serverMessage || "Email yoki parol xato!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col gap-1 text-center">
          <CardTitle className="text-3xl font-bold">Kirish</CardTitle>
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
            {inputFields.map((field) => (
              <div key={field.id} className="grid gap-2">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium text-zinc-300"
                >
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="bg-zinc-900 border-zinc-800 focus:ring-1 focus:ring-white text-white"
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </CardContent>

          <CardFooter>
            <Button
              className="w-full bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 font-bold"
              type="submit"
              disabled={loading}
            >
              {loading ? "Yuklanmoqda..." : "Tizimga kirish"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
