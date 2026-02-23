"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Clock, Users } from "lucide-react";

interface Course {
  _id: string;
  name: string;
  price: number | string;
  duration: string;
  students_count: number | string;
  status?: string | boolean;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
  });

  // Ma'lumot ob'ekt bo'lsa uning nomini, matn bo'lsa o'zini qaytaruvchi yordamchi funksiya
  const renderSafe = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "object" && value !== null) {
      const v = value as { name?: string };
      return v.name ?? "Noma'lum";
    }
    return String(value);
  };

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/course/get-courses");
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setCourses(data);
    } catch (err: unknown) {
      toast.error("Kurslarni yuklashda xatolik!");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      price: Number(formData.price),
      duration: formData.duration,
    };

    try {
      if (editingCourse) {
        await api.post("/api/course/edit-course", {
          ...data,
          id: editingCourse._id,
        });
        toast.success("Kurs yangilandi!");
      } else {
        await api.post("/api/course/create-course", data);
        toast.success("Kurs qo'shildi!");
      }
      handleDialogClose(false);
      getCourses();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } } | undefined;
      const message = axiosError?.response?.data?.message ?? "Xatolik yuz berdi!";
      toast.error(message);
      console.error(err);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: renderSafe(course.name),
      price: String(course.price ?? ""),
      duration: renderSafe(course.duration),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("/api/course/delete-course", { data: { id } });
      toast.success("Kurs o'chirildi!");
      setDeleteId(null);
      getCourses();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } } | undefined;
      const message = axiosError?.response?.data?.message ?? "O'chirishda xatolik!";
      toast.error(message);
      console.error(err);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    action: "freeze" | "unfreeze",
  ) => {
    try {
      await api.put(`/api/course/${action}-course`, { id });
      toast.success(`Kurs ${action === "freeze" ? "muzlatildi" : "eritildi"}!`);
      getCourses();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } } | undefined;
      const message = axiosError?.response?.data?.message ?? "Amalni bajarishda xatolik!";
      toast.error(message);
      console.error(err);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingCourse(null);
      setFormData({ name: "", price: "", duration: "" });
    }
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Kurslar boshqaruvi</h1>
        <Button
          onClick={() => setOpen(true)}
          className="bg-white text-black hover:bg-gray-200"
        >
          + Kurs Qoshish
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 italic">
          Yuklanmoqda...
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">Kurslar topilmadi</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-[#111] border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{renderSafe(course.name)}</h3>
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm font-medium text-blue-400">
                  {Number(course.price || 0).toLocaleString()} UZS
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>{renderSafe(course.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span>{renderSafe(course.students_count) || 0} oquvchi</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(course)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-zinc-700"
                >
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  onClick={() => setDeleteId(course._id)}
                  variant="outline"
                  size="sm"
                  className="border-red-900 text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Ochirish
                </Button>
              </div>

              <div className="mt-3">
                <Button
                  onClick={() =>
                    handleStatusUpdate(
                      course._id,
                      String(course.status) === "frozen"
                        ? "unfreeze"
                        : "freeze",
                    )
                  }
                  variant="outline"
                  size="sm"
                  className={`w-full ${String(course.status) === "frozen" ? "border-green-900 text-green-500" : "border-blue-900 text-blue-400"}`}
                >
                  {String(course.status) === "frozen" ? "Eritish" : "Muzlatish"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Tahrirlash" : "Yangi kurs"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Kurs nomi</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-zinc-900 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Narxi (UZS)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="bg-zinc-900 border-zinc-700"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Davomiyligi</Label>
              <Input
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="bg-zinc-900 border-zinc-700"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {editingCourse ? "Yangilash" : "Yaratish"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Kursni ochirish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400 py-4">
            Haqiqatan ham ushbu kursni ochirib tashlamoqchimisiz?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="border-zinc-700"
            >
              Bekor qilish
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600"
            >
              Ochirish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesPage;