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
import { Pencil, Trash2 } from "lucide-react";

const Managers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const getManagers = async () => {
    try {
      const res = await api.get("/api/staff/all-managers");
      console.log("📦 Backend response:", res.data);
      
      // Backend ma'lumot formatini tekshirish
      if (Array.isArray(res.data)) {
        setManagers(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setManagers(res.data.data);
      } else if (res.data.managers && Array.isArray(res.data.managers)) {
        setManagers(res.data.managers);
      } else {
        console.error("❌ Noto'g'ri ma'lumot formati:", res.data);
        setManagers([]);
        toast.error("Ma'lumot formati noto'g'ri!");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          toast.error("API endpoint topilmadi. Backend'ni tekshiring!");
        } else if (axiosError.response?.status === 403) {
          toast.error("Sizda bu ma'lumotlarni ko'rish huquqi yo'q!");
        } else {
          const message = axiosError.response?.data?.message || "Ma'lumotlarni yuklashda xatolik!";
          toast.error(message);
        }
      } else {
        toast.error("Ma'lumotlarni yuklashda xatolik!");
      }
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getManagers();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      role: "Manager",
    };

    try {
      if (editingManager) {
        await api.post(`/api/staff/edited-manager`, { ...data, id: editingManager.id });
        toast.success("Manager muvaffaqiyatli yangilandi!");
      } else {
        await api.post("/api/staff/create-manager", data);
        toast.success("Manager muvaffaqiyatli qo'shildi!");
      }
      setOpen(false);
      setEditingManager(null);
      getManagers();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "Xatolik yuz berdi";
        toast.error(message);
      } else {
        toast.error("Noma'lum xatolik yuz berdi");
        console.error(err);
      }
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager);
    setOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/api/staff/deleted-admin`, { data: { id } });
      toast.success("Manager o'chirildi!");
      setDeleteId(null);
      getManagers();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "O'chirishda xatolik!";
        toast.error(message);
      } else {
        toast.error("O'chirishda xatolik!");
        console.error(err);
      }
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingManager(null);
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Foydalanuvchilar royxati</h1>

        <Dialog open={open} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              + Manager qoshish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingManager ? "Manager tahrirlash" : "Yangi manager malumotlari"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4 text-white">
              <div className="space-y-2">
                <Label htmlFor="first_name">Ism</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Davron"
                  defaultValue={editingManager?.first_name || ""}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Familiya</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Raimjonov"
                  defaultValue={editingManager?.last_name || ""}
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
                  defaultValue={editingManager?.email || ""}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {editingManager ? "Yangilash" : "Saqlash"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : managers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-zinc-500"
                >
                  Managerlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              managers.map((m) => (
                <TableRow
                  key={m.id}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell className="font-medium">{m.first_name}</TableCell>
                  <TableCell>{m.last_name}</TableCell>
                  <TableCell className="text-zinc-400">{m.email}</TableCell>
                  <TableCell className="text-blue-400">{m.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        m.status === "faol"
                          ? "bg-green-900/30 text-green-500"
                          : "bg-red-900/30 text-red-500"
                      }`}
                    >
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => handleEdit(m)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(m.id)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        O'chirish
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Manager o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">
            Haqiqatan ham bu managerni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
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

export default Managers;
