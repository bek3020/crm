// "use client";

// import React, { useState } from "react";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/Card";
// import { Input } from "@/components/ui/Input";
// import { Button } from "@/components/ui/Button";

// interface LoginErrorResponse {
//   message?: string;
// }

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const inputFields = [
//     {
//       id: "email",
//       type: "email",
//       label: "Email",
//       placeholder: "usern88@mail.ru",
//     },
//     {
//       id: "password",
//       type: "password",
//       label: "Parol",
//       placeholder: "••••••••",
//     },
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
//     const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/sign-in`;

//     try {
//       const response = await axios.post(apiUrl, formData);

//       const data = response.data;
//       const token = data.token || data.accessToken || data.data?.token;

//       if (token) {
//         localStorage.setItem("token", token);
//         if (data.user || data.data?.user) {
//           localStorage.setItem(
//             "user",
//             JSON.stringify(data.user || data.data.user),
//           );
//         }
//         router.push("/dashboard");
//         router.refresh();
//       } else {
//         setError("Token kelmadi, Backend response formatini tekshiring.");
//       }
//     } catch (err) {
//       const axiosError = err as AxiosError<LoginErrorResponse>;
//       const serverMessage = axiosError.response?.data?.message;
//       setError(serverMessage || "Email yoki parol xato!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-black px-4">
//       <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950 text-white shadow-2xl">
//         <CardHeader className="space-y-1 flex flex-col gap-1 text-center">
//           <CardTitle className="text-3xl font-bold">Kirish</CardTitle>
//           <CardDescription className="text-zinc-400">
//             Tizimga kirish uchun malumotlarni kiriting
//           </CardDescription>
//         </CardHeader>

//         <form onSubmit={handleSubmit}>
//           <CardContent className="grid gap-4">
//             {error && (
//               <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center animate-pulse">
//                 {error}
//               </div>
//             )}
//             {inputFields.map((field) => (
//               <div key={field.id} className="grid gap-2">
//                 <label
//                   htmlFor={field.id}
//                   className="text-sm font-medium text-zinc-300"
//                 >
//                   {field.label}
//                 </label>
//                 <Input
//                   id={field.id}
//                   type={field.type}
//                   placeholder={field.placeholder}
//                   className="bg-zinc-900 mb-3 border-zinc-800 focus:ring-1 focus:ring-white text-white"
//                   value={formData[field.id as keyof typeof formData]}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             ))}
//           </CardContent>

//           <CardFooter className="mb-[30px]">
//             <Button
//               className="w-full mb-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 font-bold"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Yuklanmoqda..." : "Tizimga kirish"}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )ccv;
// };

// export default Login;

cc

// ...existing code...
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
  error?: string;
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

    // client-side validation
    const email = formData.email.trim();
    const password = formData.password;
    if (!email || !password) {
      setError("Email va parolni to'ldiring.");
      setLoading(false);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:7070";
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/api/auth/sign-in`;

    const payload = { email, password };

    try {
      console.log("Login request:", apiUrl, payload);

      const response = await axios.post(apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
        // let 4xx responses be handled in code instead of throwing
        validateStatus: (status) => status < 500,
      });

      console.log("Login response status:", response.status, "data:", response.data);

      // handle client errors (400/401/403) explicitly
      if (response.status >= 400) {
        const data = response.data as LoginErrorResponse | undefined;
        const serverMsg = (data && (data.message || data.error)) || `Request failed with status ${response.status}`;
        setError(String(serverMsg));
        setLoading(false);
        return;
      }

      const data = response.data ?? {};
      const token = data.token || data.accessToken || data.data?.token;

      if (token && typeof window !== "undefined") {
        try {
          localStorage.setItem("token", String(token));
          const user = data.user || data.data?.user;
          if (user) localStorage.setItem("user", JSON.stringify(user));
        } catch (storageErr) {
          console.warn("localStorage error:", storageErr);
        }

        await router.push("/dashboard");
        router.refresh();
      } else {
        setError("Token kelmadi — backend response formatini tekshiring.");
        console.error("No token in login response:", data);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<LoginErrorResponse> | Error;
      if ("isAxiosError" in axiosErr && axiosErr.isAxiosError) {
        const serverMsg = axiosErr.response?.data?.message ?? axiosErr.response?.data?.error;
        if (serverMsg) setError(String(serverMsg));
        else if (axiosErr.message?.includes("Network Error")) setError("Tarmoq xatosi: backend bilan bog'lanib bo'lmadi.");
        else setError("Email yoki parol xato!");
        console.error("Axios login error:", axiosErr.response ?? axiosErr.message);
      } else {
        setError("Noma'lum xatolik yuz berdi");
        console.error("Non-Axios error:", err);
      }
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
                  className="bg-zinc-900 mb-3 border-zinc-800 focus:ring-1 focus:ring-white text-white"
                  value={formData[field.id as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </CardContent>

          <CardFooter className="mb-[30px]">
            <Button
              className="w-full mb-3 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-600 font-bold"
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
// ...existing code...