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
import { Trash2, Search, Info, UserX, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StudentsPage = () => {
  const [students, setStudents] = useState<Manager[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStudents = async () => {
    try {
      const res = await api.get("/api/student/get-all-students");
      
      if (Array.isArray(res.data)) {
        setStudents(res.data);
        setFilteredStudents(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
        setFilteredStudents(res.data.data);
      } else {
        setStudents([]);
        setFilteredStudents([]);
        toast.error("Ma'lumot formati noto'g'ri!");
      }
    } catch (err: unknown) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (filterStatus !== "all") {
      filtered = filtered.filter((student) => student.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [filterStatus, searchQuery, students]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      phone: formData.get("phone"),
    };

    try {
      await api.post("/api/student/create-student", data);
      toast.success("Student qo'shildi!");
      setOpen(false);
      getStudents();
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
      await api.delete(`/api/student/delete-student`, { data: { id } });
      toast.success("Student o'chirildi!");
      setDeleteId(null);
      getStudents();
    } catch (err: unknown) {
      toast.error("O'chirishda xatolik!");
      console.error(err);
    }
  };

  const handleLeave = async (id: string | number) => {
    try {
      await api.post(`/api/student/leave-student`, { student_id: id });
      toast.success("Student ta'tilga chiqarildi!");
      getStudents();
    } catch (err: unknown) {
      toast.error("Ta'tilga chiqarishda xatolik!");
      console.error(err);
    }
  };

  const handleReturn = async (id: string | number) => {
    try {
      await api.post(`/api/student/return-student`, { student_id: id });
      toast.success("Student qaytarildi!");
      getStudents();
    } catch (err: unknown) {
      toast.error("Qaytarishda xatolik!");
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Studentlar ro'yxati</h1>

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
              <Button className="bg-white hover:bg-white-200">
                + Student Qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111] border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Yangi student</DialogTitle>
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
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+998901234567"
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
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ta'tilda">Ta'tilda</SelectItem>
              <SelectItem value="faol">Faol</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Search Students</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-white"
            />
            <Button
              onClick={() => setSearchOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Save changes
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
              <TableHead className="text-zinc-400">Telefon raqam</TableHead>
              <TableHead className="text-zinc-400">Guruhlar soni</TableHead>
              <TableHead className="text-zinc-400">Holat</TableHead>
              <TableHead className="text-zinc-400 text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={6} className="text-center py-10">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : !Array.isArray(filteredStudents) || filteredStudents.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                  Studentlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium">{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell className="text-zinc-400">{student.email}</TableCell>
                  <TableCell className="text-blue-400">0</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === "faol"
                          ? "bg-green-900/30 text-green-500"
                          : student.status === "ta'tilda"
                          ? "bg-yellow-900/30 text-yellow-500"
                          : "bg-red-900/30 text-red-500"
                      }`}
                    >
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(student.id)}
                        className="flex items-center gap-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        O'chirish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLeave(student.id)}
                        className="flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        Ta'tilga chiqarish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReturn(student.id)}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Yangi Guruhga qoshish 
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
            <DialogTitle>Student o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">
            Haqiqatan ham bu studentni o'chirmoqchimisiz?
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
              O'chirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
