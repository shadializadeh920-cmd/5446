"use client";

import { useState } from "react";
import { RefahIcon } from "../../app/refahicon/page";
import {
  UserOutlined,
  LockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

function toPersianNumber(num) {
  return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

export default function LoginPage() {
  const maxLength = 50;
  const router = useRouter();
  const defaultUsername = "admin";
  const defaultPassword = "P@ssw0rd";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const handleUsernameChange = (e) => {
    if (e.target.value.length <= maxLength) setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    if (e.target.value.length <= maxLength) setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage("");

    if (!username.trim() || !password.trim()) {
      setAuthMessage("نام کاربری و رمز عبور نمی‌توانند خالی باشند.");
      return;
    }

    setIsLoading(true);
    const LOGIN_API_URL = "http://185.205.203.42:7000/api/user/authenticate";

    try {
      const res = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.message || `خطا: ${res.status}`);
      }

      console.log("Login response:", data);

      const token = data.token || data.data?.token;
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
        router.push("/users");
      } else {
        setAuthMessage("توکن دریافت نشد، لطفاً دوباره تلاش کنید.");
      }
    } catch (error) {
      setAuthMessage(`خطا در اتصال: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="max-w-xs text-center">
          <p className="text-gray-700">
            لطفا نام کاربری و رمز عبور خود را وارد کنید تا وارد سامانه شوید.
          </p>
        </div>
      </div>

      <div className="m-14 w-full flex-1 flex flex-col justify-center items-center bg-gradient-to-tr from-purple-600 to-pink-600 text-white px-12 py-8">
        <div className="w-full max-w-md">
          <div className="flex">
            <RefahIcon width="750px" height="150px" fill="#fff" />
          </div>

          <form
            className="space-y-8 flex flex-col items-center mt-10"
            onSubmit={handleSubmit}
          >
            <div className="relative w-[30rem]">
              <div className="absolute top-1/2 left-0.5 -translate-y-1/2 text-gray-400 text-sm font-mono select-none pointer-events-none z-20">
                {toPersianNumber(username.length)}/{toPersianNumber(maxLength)}
              </div>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none z-20">
                <UserOutlined />
              </div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder={defaultUsername}
                className="relative z-10 w-full p-3 pr-20 pl-10 rounded bg-white text-black text-right border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="rtl"
                maxLength={maxLength}
              />
            </div>

            <div className="relative w-[30rem]">
              <div className="absolute top-1/2 left-0.5 -translate-y-1/2 text-gray-400 text-sm font-mono select-none pointer-events-none z-20">
                {toPersianNumber(password.length)}/{toPersianNumber(maxLength)}
              </div>
              <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none z-20">
                <LockOutlined />
              </div>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder={defaultPassword}
                className="relative z-10 w-full p-3 pr-20 pl-10 rounded bg-white text-black text-right border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                dir="rtl"
                maxLength={maxLength}
              />
            </div>

            {authMessage && (
              <p
                className={`text-center mt-4 ${
                  authMessage.includes("موفقیت‌آمیز")
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {authMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-[30rem] py-2 rounded-2xl hover:opacity-90 transition text-white font-semibold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-orange-500"
              }`}
            >
              {isLoading ? (
                "در حال ورود..."
              ) : (
                <>
                  ورود به سامانه <ArrowRightOutlined />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
