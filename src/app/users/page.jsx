"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicTable from "../dynamictable/page";
import Register from "../register/page";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Search from "../search/page";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const USERS_API_URL = "http://185.205.203.42:7000/api/user";

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
      </div>

      <DynamicTable />
    </div>
  );
};

export default UsersPage;
