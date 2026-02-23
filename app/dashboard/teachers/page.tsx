"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Manager } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2, Search, Info, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Manager[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getTeachers = async () => {
    try {
      console.log("Ustozlarni yuklash boshlandi...");
      console.log(" Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
      
      const res = await api.get("/api/teacher/get-all-teachers");
      console.log(" Backend response:", res.data);
      console.log(" Response status:", res.status);
      
      if (Array.isArray(res.data)) {
        setTeachers(res.data);
        setFilteredTeachers(res.data);
        toast.success(`${res.data.length} ta ustoz yuklandi!`);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setTeachers(res.data.data);
        setFilteredTeachers(res.data.data);
        toast.success(`${res.data.data.length} ta ustoz yuklandi!`);
      } else {
        console.error(" Noto'g'ri ma'lumot formati:", res.data);
        setTeachers([]);
        setFilteredTeachers([]);
        toast.error("Ma'lumot formati noto'g'ri!");
      }
    } catch (err: unknown) {
      console.error(" API Error:", err);
      
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { 
          response?: { 
            status?: number; 
            data?: unknown;
            statusText?: string;
          };
          message?: string;
        };
        
        console.error(" Error status:", axiosError.response?.status);
        console.error(" Error data:", axiosError.response?.data);
        
        if (axiosError.response?.status === 404) {
          toast.error("API endpoint topilmadi! URL: /api/teacher/get-all-teachers");
        } else if (axiosError.response?.status === 403) {
          toast.warning("Backend token talab qilmoqda. Login qiling yoki backend sozlamalarini tekshiring.");
        } else if (axiosError.response?.status === 401) {
          toast.warning("Token muddati tugagan yoki noto'g'ri.");
        } else if (axiosError.message?.includes("Network Error")) {
          toast.error("Backend bilan bog'lanib bo'lmadi! Backend ishga tushganini tekshiring.");
        } else {
          toast.error("Ma'lumotlarni yuklashda xatolik!");
        }
      } else {
        toast.error("Noma'lum xatolik yuz berdi!");
      }
      
      setTeachers([]);
      setFilteredTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  useEffect(() => {
    let filtered = teachers;

    if (filterStatus !== "all") {
      filtered = filtered.filter((teacher) => teacher.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  }, [filterStatus, searchQuery, teachers]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
    };

    try {
      await api.post("/api/teacher/create-teacher", data);
      toast.success("Ustoz muvaffaqiyatli qo'shildi!");
      setOpen(false);
      getTeachers();
      
      (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "Xatolik yuz berdi!";
        toast.error(message);
      } else {
        toast.error("Xatolik yuz berdi!");
      }
      console.error(err);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/api/teacher/fire-teacher`, { data: { id } });
      toast.success("Ustoz ishdan bo'shatildi!");
      setDeleteId(null);
      getTeachers();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "O'chirishda xatolik!";
        toast.error(message);
      } else {
        toast.error("O'chirishda xatolik!");
      }
      console.error(err);
    }
  };

  const handleReturn = async (id: string | number) => {
    try {
      await api.post(`/api/teacher/return-teacher`, { id });
      toast.success("Ustoz qaytarildi!");
      getTeachers();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "Qaytarishda xatolik!";
        toast.error(message);
      } else {
        toast.error("Qaytarishda xatolik!");
      }
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Ustozlar royxati</h1>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                + Ustoz qoshish
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111] border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Yangi ustoz</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Ism</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="Ism"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Familiya</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Familiya"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.ru"
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Saqlash
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="all">Hammasi</SelectItem>
              <SelectItem value="ta'tilda">Tatilda</SelectItem>
              <SelectItem value="faol">Faol</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Ustoz qidirish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Ism, familiya yoki email bo'yicha qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Button
              onClick={() => setSearchOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Yopish
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-zinc-800 bg-[#111] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Ism</TableHead>
              <TableHead className="text-zinc-400">Familiya</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Rol</TableHead>
              <TableHead className="text-zinc-400">Holat</TableHead>
              <TableHead className="text-zinc-400 text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Yuklanmoqda...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !Array.isArray(filteredTeachers) || filteredTeachers.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                  Ustozlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium">{teacher.first_name}</TableCell>
                  <TableCell>{teacher.last_name}</TableCell>
                  <TableCell className="text-zinc-400">{teacher.email}</TableCell>
                  <TableCell className="text-blue-400">{teacher.role || "Ustoz"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === "faol"
                          ? "bg-green-900/30 text-green-500"
                          : teacher.status === "ta'tilda"
                          ? "bg-yellow-900/30 text-yellow-500"
                          : "bg-red-900/30 text-red-500"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(teacher.id)}
                        className="flex items-center gap-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        Ishdan boshatish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReturn(teacher.id)}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Qaytarish
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Info
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Ustozni ishdan boshatish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">
            Haqiqatan ham bu ustozni ishdan boshatmoqchimisiz?
          </p>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-zinc-700"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Ishdan boshatish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
