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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  _id: string;
  student_id: string;
  group_id: string;
  payment_price: number;
  month: string;
  method: string;
  paidAt: string;
  student_name?: string;
  group_name?: string;
}

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
}

const PaymentsPage = () => {
  const [debtors, setDebtors] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const [formData, setFormData] = useState({
    student_id: "",
    group_id: "",
    payment_price: "",
    month: "",
    method: "naqd",
    paidAt: new Date().toISOString().split("T")[0],
  });

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    setSelectedMonth(currentMonth);
    getDebtors(currentMonth);
  }, []);

  const getDebtors = async (month: string) => {
    try {
      setLoading(true);
      console.log(" Qarzdorlarni yuklash:", month);

      const res = await api.get(
        `/api/payment/get-debtors-student?month=${month}`,
      );
      console.log(" Qarzdorlar:", res.data);

      if (Array.isArray(res.data)) {
        setDebtors(res.data);
        toast.success(`${res.data.length} ta qarzdor topildi`);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setDebtors(res.data.data);
        toast.success(`${res.data.data.length} ta qarzdor topildi`);
      } else {
        setDebtors([]);
      }
    } catch (err: unknown) {
      console.error(" Xato:", err);
      toast.error("Qarzdorlarni yuklashda xatolik!");
      setDebtors([]);
    } finally {
      setLoading(false);
    }
  };

  const searchStudent = async (name: string) => {
    if (!name || name.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      console.log(" Student qidirish:", name);
      const res = await api.get(`/api/payment/search-student?name=${name}`);
      console.log("Qidiruv natijalari:", res.data);

      if (Array.isArray(res.data)) {
        setSearchResults(res.data);
      } else if (res.data.data && Array.isArray(res.data.data)) {
        setSearchResults(res.data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err: unknown) {
      console.error(" Qidiruv xatosi:", err);
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchStudent(value);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      student_id: formData.student_id,
      group_id: formData.group_id,
      payment_price: Number(formData.payment_price),
      month: formData.month,
      method: formData.method,
      paidAt: formData.paidAt,
    };

    try {
      console.log(" To'lov qo'shish:", data);
      await api.post("/api/payment/payment-student", data);
      toast.success("To'lov muvaffaqiyatli qo'shildi!");
      setOpen(false);

      // Formni tozalash
      setFormData({
        student_id: "",
        group_id: "",
        payment_price: "",
        month: "",
        method: "naqd",
        paidAt: new Date().toISOString().split("T")[0],
      });

      // Qarzdorlarni yangilash
      getDebtors(selectedMonth);
    } catch (err: unknown) {
      console.error("To'lov xatosi:", err);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        const message =
          axiosError.response?.data?.message || "To'lov qo'shishda xatolik!";
        toast.error(message);
      } else {
        toast.error("To'lov qo'shishda xatolik!");
      }
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    getDebtors(month);
  };

  const selectStudent = (student: Student) => {
    setFormData({
      ...formData,
      student_id: student._id,
    });
    setSearchQuery(`${student.first_name} ${student.last_name}`);
    setSearchResults([]);
  };

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tolovlar</h1>

        <div className="flex gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-black hover:bg-gray-200">
                + Tolov qoshish
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#111] border-zinc-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>Yangi tolov qoshish</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="student_search">Talaba</Label>
                  <div className="relative">
                    <Input
                      id="student_search"
                      placeholder="Talaba ismi bilan qidiring..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      required
                    />
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-md max-h-48 overflow-y-auto">
                        {searchResults.map((student) => (
                          <div
                            key={student._id}
                            onClick={() => selectStudent(student)}
                            className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
                          >
                            {student.first_name} {student.last_name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group_id">Guruh</Label>
                  <Input
                    id="group_id"
                    name="group_id"
                    placeholder="Guruh nomi bilan qidiring..."
                    value={formData.group_id}
                    onChange={(e) =>
                      setFormData({ ...formData, group_id: e.target.value })
                    }
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_price">Tolov miqdori</Label>
                  <Input
                    id="payment_price"
                    name="payment_price"
                    type="number"
                    placeholder="20000"
                    value={formData.payment_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_price: e.target.value,
                      })
                    }
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="month">Oy</Label>
                  <Input
                    id="month"
                    name="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({ ...formData, month: e.target.value })
                    }
                    className="bg-zinc-900 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method">Tolov usuli</Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value) =>
                      setFormData({ ...formData, method: value })
                    }
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                      <SelectItem value="naqd">Naqd</SelectItem>
                      <SelectItem value="karta">Karta</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidAt">Sana</Label>
                  <Input
                    id="paidAt"
                    name="paidAt"
                    type="date"
                    value={formData.paidAt}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAt: e.target.value })
                    }
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
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Saqlash
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="w-48 bg-zinc-900 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#111] overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">
            Qarzdorlar - {selectedMonth}
          </h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Ism</TableHead>
              <TableHead className="text-zinc-400">Familiya</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Holat</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading">
                <TableCell colSpan={4} className="text-center py-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Yuklanmoqda...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : !Array.isArray(debtors) || debtors.length === 0 ? (
              <TableRow key="empty">
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-zinc-500"
                >
                  Qarzdorlar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              debtors.map((debtor) => (
                <TableRow
                  key={debtor._id}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell className="font-medium">
                    {debtor.first_name}
                  </TableCell>
                  <TableCell>{debtor.last_name}</TableCell>
                  <TableCell className="text-zinc-400">-</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-500">
                      Qarzdor
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentsPage;
