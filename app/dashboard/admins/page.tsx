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

const Admins = () => {
  const [admins, setAdmins] = useState<Manager[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Manager | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getAdmins = async () => {
    try {
      const res = await api.get("/api/staff/all-admins");
      console.log(" Backend response:", res.data);
      
      if (Array.isArray(res.data)) {
        setAdmins(res.data);
        setFilteredAdmins(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setAdmins(res.data.data);
        setFilteredAdmins(res.data.data);
      } else if (res.data.admins && Array.isArray(res.data.admins)) {
        setAdmins(res.data.admins);
        setFilteredAdmins(res.data.admins);
      } else {
        console.error(" Noto'g'ri ma'lumot formati:", res.data);
        setAdmins([]);
        setFilteredAdmins([]);
        toast.error("Ma'lumot formati noto'g'ri!");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 404) {
          toast.error("API endpoint topilmadi!");
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
    getAdmins();
  }, []);

  useEffect(() => {
    let filtered = admins;

    if (filterStatus !== "all") {
      filtered = filtered.filter((admin) => admin.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (admin) =>
          admin.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAdmins(filtered);
  }, [filterStatus, searchQuery, admins]);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      role: formData.get("role") || "Admin",
      password: formData.get("password"),
    };

    try {
      if (editingAdmin) {
        await api.post(`/api/staff/edited-admin`, { ...data, id: editingAdmin.id });
        toast.success("Admin muvaffaqiyatli yangilandi!");
      } else {
        await api.post("/api/staff/create-admin", data);
        toast.success("Admin muvaffaqiyatli qo'shildi!");
      }
      setOpen(false);
      setEditingAdmin(null);
      getAdmins();
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

  const handleEdit = (admin: Manager) => {
    setEditingAdmin(admin);
    setOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/api/staff/deleted-admin`, { data: { id } });
      toast.success("Admin o'chirildi!");
      setDeleteId(null);
      getAdmins();
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

  const handleLeave = async (id: string | number) => {
    try {
      await api.post(`/api/staff/leave-staff`, { staff_id: id });
      toast.success("Admin ta'tilga chiqarildi!");
      getAdmins();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "Ta'tilga chiqarishda xatolik!";
        toast.error(message);
      } else {
        toast.error("Ta'tilga chiqarishda xatolik!");
      }
      console.error(err);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingAdmin(null);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Adminlar ro'yxati</h1>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setSearchOpen(true)}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
          </Button>

          <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-#111">
                + Admin Qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? "Admin tahrirlash" : "Tahrirlash"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="First name"
                    defaultValue={editingAdmin?.first_name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Last name"
                    defaultValue={editingAdmin?.last_name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    defaultValue={editingAdmin?.email || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" defaultValue={editingAdmin?.role || "Admin"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {!editingAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      required={!editingAdmin}
                    />
                  </div>
                )}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Save changes
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
              <SelectItem value="nofaol">Nofaol</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Search Admins</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={() => setSearchOpen(false)}
              className="w-full"
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Ism</TableHead>
              <TableHead>Familiya</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={6} className="text-center py-10">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            ) : !Array.isArray(filteredAdmins) || filteredAdmins.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Adminlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="border-border hover:bg-accent/50">
                  <TableCell className="font-medium">{admin.first_name}</TableCell>
                  <TableCell>{admin.last_name}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell className="text-blue-400">{admin.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.status === "faol"
                          ? "bg-green-900/30 text-green-500"
                          : admin.status === "ta'tilda"
                          ? "bg-yellow-900/30 text-yellow-500"
                          : "bg-red-900/30 text-red-500"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => handleEdit(admin)}
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(admin.id)}
                        className="flex items-center gap-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        O'chirish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleLeave(admin.id)}
                        className="flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4" />
                        Ta'tilga chiqarish
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
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Admin o'chirish</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Haqiqatan ham bu adminni o'chirmoqchimisiz?
          </p>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
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

export default Admins;
