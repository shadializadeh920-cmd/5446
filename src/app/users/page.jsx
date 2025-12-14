"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "antd";
import Search from "../../components/search/Search";
import DynamicTable from "../../components/dynamictable/DynamicTable";
import Edit from "../../components/edit/Edit";
import Swal from "sweetalert2";
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [editUserId, setEditUserId] = useState(null);
  const USERS_API_URL = "http://185.205.203.42:7000/api/user";
  const getAuthToken = () => {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
    return match ? match[1] : null;
  };

  const fetchUsers = async () => {
    const cookieMatch = document.cookie.match(/(?:^|; )token=([^;]+)/);
    const authToken = cookieMatch ? cookieMatch[1] : null;

    if (!authToken) {
      setError("شما وارد نشده‌اید. لطفاً مجدداً وارد شوید.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(USERS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("توکن شما منقضی شده است. لطفاً دوباره وارد شوید.");
          router.push("/login");
        } else if (response.status === 404) {
          setError("آدرس API پیدا نشد. لطفاً endpoint را بررسی کنید.");
        } else {
          const data = await response.json().catch(() => ({}));
          setError(data.message || `خطای سرور: ${response.status}`);
        }
        return;
      }

      const result = await response.json();
      setUsers(result.data || []);
    } catch (err) {
      setError(`مشکل در اتصال شبکه: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <div>در حال بارگذاری لیست کاربران...</div>;
  if (error) return <div style={{ color: "red" }}>خطا: {error}</div>;
  if (users.length === 0) return <div>هیچ کاربری یافت نشد.</div>;

  const handleEdit = (id) => {
    setEditUserId(id);
  };
  const handleDelete = async (record) => {
    const result = await Swal.fire({
      title: "هشدار",
      text: "بعد از حذف این سطر امکان بازگردانی نمی‌باشد",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "انصراف",
      buttonsStyling: false,
      customClass: {
        actions: "flex gap-3 justify-center",
        confirmButton: "bg-blue-500 text-white rounded px-4 py-2",
        cancelButton: "bg-red-500 text-white rounded px-4 py-2",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = getAuthToken();

      const res = await fetch(`${USERS_API_URL}/${record.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("delete failed");
      }

      setUsers((prev) => prev.filter((u) => u.id !== record.id));

      await Swal.fire({
        title: "موفقیت",
        text: "کاربر با موفقیت حذف شد",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "خطا",
        text: "حذف انجام نشد",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <div className="w-full border-b border-b-zinc-400 p-4 flex items-center justify-between flex-row-reverse">
        <h1 className="font-bold text-right">کاربران</h1>

        <div className="flex gap-2 flex-row-reverse">
          <Button
            type="primary"
            className="!px-3 !py-1   !bg-green-300 !border-green-600 !text-green-600 rounded"
            onClick={() => router.push("/register")}
          >
            تعریف کاربر
          </Button>
          <Button
            type="primary"
            className="!px-3 !py-1  !bg-purple-400 !text-purple-600 !border-purple-600 rounded"
            onClick={() => handleDelete(record.id)}
          >
            تغییر نقش
          </Button>
          <Button
            type="primary"
            className="!px-3 !py-1  !bg-red-300 !border-rose-700 !text-rose-700 rounded"
            onClick={() => handleDelete(record.id)}
          >
            تغییر رمز
          </Button>
        </div>
      </div>
      <div className=" ">
        <Search />
        <DynamicTable
          data={users}
          onEdit={(id) => setEditUserId(id)}
          onDelete={handleDelete}
        />

        {editUserId && (
          <Edit
            userId={editUserId}
            onClose={() => setEditUserId(null)}
            onSuccess={fetchUsers}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
