"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicTable from "../dynamictable/page";

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
      <h1>لیست کاربران</h1>
      <DynamicTable />
    </div>
  );
};

export default UsersPage;
