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
import { Pencil, Trash2, Search, Info, UserX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Managers = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getManagers = async () => {
    try {
      const res = await api.get("/api/staff/all-managers");
      
      if (Array.isArray(res.data)) {
        setManagers(res.data);
        setFilteredManagers(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setManagers(res.data.data);
        setFilteredManagers(res.data.data);
      } else {
        setManagers([]);
        setFilteredManagers([]);
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
    getManagers();
  }, []);

  useEffect(() => {
    let filtered = managers;

    if (filterStatus !== "all") {
      filtered = filtered.filter((manager) => manager.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (manager) =>
          manager.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          manager.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          manager.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  }, [filterStatus, searchQuery, managers]);

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
        toast.success("Manager yangilandi!");
      } else {
        await api.post("/api/staff/create-manager", data);
        toast.success("Manager qo'shildi!");
      }
      setOpen(false);
      setEditingManager(null);
      getManagers();
    } catch (err: unknown) {
      toast.error("Xatolik yuz berdi!");
      console.error(err);
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
      toast.error("O'chirishda xatolik!");
      console.error(err);
    }
  };

  const handleLeave = async (id: string | number) => {
    try {
      await api.post(`/api/staff/leave-staff`, { staff_id: id });
      toast.success("Manager ta'tilga chiqarildi!");
      getManagers();
    } catch (err: unknown) {
      toast.error("Ta'tilga chiqarishda xatolik!");
      console.error(err);
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
        <h1 className="text-2xl font-bold">Foydalanuvchilar ro'yxati</h1>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Search Managers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Search by name or email..."
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
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : !Array.isArray(filteredManagers) || filteredManagers.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                  Managerlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredManagers.map((m) => (
                <TableRow key={m.id} className="border-zinc-800 hover:bg-zinc-900/50">
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

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Manager o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">
            Haqiqatan ham bu managerni o'chirmoqchimisiz?
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
