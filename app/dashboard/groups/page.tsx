"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
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
import { Calendar, Trash2 } from "lucide-react";

interface Group {
  _id: string;
  name: string;
  teacher_id: string;
  teacher_name?: string;
  course_id: string;
  course_name?: string;
  students_count: number;
  start_date: string;
  end_date: string;
}

interface SearchResult {
  _id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
}

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [endDate, setEndDate] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    teacher_id: "",
    course_id: "",
    start_date: "",
  });

  const [teacherSearch, setTeacherSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [teacherResults, setTeacherResults] = useState<SearchResult[]>([]);
  const [courseResults, setCourseResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      setLoading(true);
      console.log(" Guruhlarni yuklash...");
      
      const res = await api.get("/api/group/get-all-group");
      console.log("Guruhlar:", res.data);
      
      if (Array.isArray(res.data)) {
        setGroups(res.data);
        toast.success(`${res.data.length} ta guruh yuklandi!`);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setGroups(res.data.data);
        toast.success(`${res.data.data.length} ta guruh yuklandi!`);
      } else {
        setGroups([]);
      }
    } catch (err: unknown) {
      console.error(" Xato:", err);
      toast.error("Guruhlarni yuklashda xatolik!");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const searchTeacher = async (name: string) => {
    if (!name || name.length < 2) {
      setTeacherResults([]);
      return;
    }

    try {
      const res = await api.get(`/api/group/search-teacher?name=${name}`);
      if (Array.isArray(res.data)) {
        setTeacherResults(res.data);
      } else if (res.data.data) {
        setTeacherResults(res.data.data);
      }
    } catch (err) {
      console.error("Teacher search error:", err);
      setTeacherResults([]);
    }
  };

  const searchCourse = async (name: string) => {
    if (!name || name.length < 2) {
      setCourseResults([]);
      return;
    }

    try {
      const res = await api.get(`/api/group/search-course?name=${name}`);
      if (Array.isArray(res.data)) {
        setCourseResults(res.data);
      } else if (res.data.data) {
        setCourseResults(res.data.data);
      }
    } catch (err) {
      console.error("Course search error:", err);
      setCourseResults([]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/group/create-group", formData);
      toast.success("Guruh muvaffaqiyatli qo'shildi!");
      setOpen(false);
      setFormData({
        name: "",
        teacher_id: "",
        course_id: "",
        start_date: "",
      });
      setTeacherSearch("");
      setCourseSearch("");
      getGroups();
    } catch (err: unknown) {
      console.error(" Guruh qo'shish xatosi:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        const message = axiosError.response?.data?.message || "Guruh qo'shishda xatolik!";
        toast.error(message);
      } else {
        toast.error("Guruh qo'shishda xatolik!");
      }
    }
  };

  const handleSetEndDate = async () => {
    if (!selectedGroup || !endDate) return;

    try {
      await api.put("/api/group/edit-end-group", {
        id: selectedGroup._id,
        end_date: endDate,
      });
      toast.success("Tugash vaqti belgilandi!");
      setEndDateOpen(false);
      setSelectedGroup(null);
      setEndDate("");
      getGroups();
    } catch (err: unknown) {
      console.error("Xato:", err);
      toast.error("Tugash vaqtini belgilashda xatolik!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete("/api/group/end-group", { data: { id } });
      toast.success("Guruh tugatildi!");
      setDeleteId(null);
      getGroups();
    } catch (err: unknown) {
      console.error("Xato:", err);
      toast.error("Guruhni tugatishda xatolik!");
    }
  };

  const selectTeacher = (teacher: SearchResult) => {
    setFormData({ ...formData, teacher_id: teacher._id });
    setTeacherSearch(`${teacher.first_name} ${teacher.last_name}`);
    setTeacherResults([]);
  };

  const selectCourse = (course: SearchResult) => {
    setFormData({ ...formData, course_id: course._id });
    setCourseSearch(course.name || "");
    setCourseResults([]);
  };

  const openEndDateDialog = (group: Group) => {
    setSelectedGroup(group);
    setEndDate(group.end_date || "");
    setEndDateOpen(true);
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Guruhlar royxati</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-gray-200">
              + Guruh Qoshish
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Yangi guruh</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Guruh nomi</Label>
                <Input
                  id="name"
                  placeholder="Guruh nomi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher">Ustoz</Label>
                <div className="relative">
                  <Input
                    id="teacher"
                    placeholder="Ustoz ismi bilan qidiring..."
                    value={teacherSearch}
                    onChange={(e) => {
                      setTeacherSearch(e.target.value);
                      searchTeacher(e.target.value);
                    }}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                  {teacherResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md max-h-48 overflow-y-auto">
                      {teacherResults.map((teacher) => (
                        <div
                          key={teacher._id}
                          onClick={() => selectTeacher(teacher)}
                          className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                        >
                          {teacher.first_name} {teacher.last_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Kurs</Label>
                <div className="relative">
                  <Input
                    id="course"
                    placeholder="Kurs nomi bilan qidiring..."
                    value={courseSearch}
                    onChange={(e) => {
                      setCourseSearch(e.target.value);
                      searchCourse(e.target.value);
                    }}
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                  {courseResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md max-h-48 overflow-y-auto">
                      {courseResults.map((course) => (
                        <div
                          key={course._id}
                          onClick={() => selectCourse(course)}
                          className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                        >
                          {course.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Boshlangan vaqti</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-zinc-900 border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 border-zinc-700"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Saqlash
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#111] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">No</TableHead>
              <TableHead className="text-zinc-400">Guruh nomi</TableHead>
              <TableHead className="text-zinc-400">Ustoz</TableHead>
              <TableHead className="text-zinc-400">Oquvchilar soni</TableHead>
              <TableHead className="text-zinc-400">Boshlangan vaqti</TableHead>
              <TableHead className="text-zinc-400">Tugagan vaqti</TableHead>
              <TableHead className="text-zinc-400 text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Yuklanmoqda...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !Array.isArray(groups) || groups.length === 0 ? (
              <TableRow key="empty">
                <TableCell colSpan={7} className="text-center py-10 text-zinc-500">
                  Guruhlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              groups.map((group, index) => (
                <TableRow key={group._id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{group.name}</TableCell>
                  <TableCell className="text-zinc-400">{group.teacher_name || "-"}</TableCell>
                  <TableCell className="text-blue-400">{group.students_count || 0}</TableCell>
                  <TableCell className="text-zinc-400">
                    {group.start_date ? new Date(group.start_date).toLocaleString("uz-UZ") : "-"}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {group.end_date ? new Date(group.end_date).toLocaleString("uz-UZ") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuItem
                        onClick={() => openEndDateDialog(group)}
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Tugash vaqtini belgilash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(group._id)}
                        className="flex items-center gap-2 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                        Guruhni tugatish
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* End Date Dialog */}
      <Dialog open={endDateOpen} onOpenChange={setEndDateOpen}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Tugash vaqtini belgilash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="end_date">Tugash vaqti</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEndDateOpen(false)}
                className="flex-1 border-zinc-700"
              >
                Bekor qilish
              </Button>
              <Button
                onClick={handleSetEndDate}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Saqlash
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#111] border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Guruhni tugatish</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-400">
            Haqiqatan ham bu guruhni tugatmoqchimisiz?
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
              Tugatish
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupsPage;
