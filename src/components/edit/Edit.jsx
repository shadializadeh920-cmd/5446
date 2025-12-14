"use client";

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";

export default function Edit({ userId, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState("");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    setMounted(true);
  }, [userId]);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("✅ TOKEN FROM COOKIE 👉", token);

    fetch("http://185.205.203.42:7000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ RAW JSON:", data);

        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        console.log("✅ FINAL LIST:", list);

        setOptions(list);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (selected && options.length > 0) {
      const user = options.find((u) => String(u.id) === String(selected));
      if (user) {
        setText(user.username);
        setFullname(user.fullname);
      }
    }
  }, [selected, options]);

  useEffect(() => {
    if (options.length > 0) {
      setSelected(String(options[0].id));
    }
  }, [options]);

  const handleSubmit = async () => {
    const token = Cookies.get("token");

    const body = {
      id: Number(selected),
      fullname: text.trim(),
      clientIds: [1],
    };

    console.log("✅ SEND BODY:", body);

    try {
      const res = await fetch("http://185.205.203.42:7000/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const raw = await res.text();
      console.log("✅ STATUS:", res.status);
      console.log("✅ RAW RESPONSE 👉", raw);

      if (res.ok) {
        alert("✅ ویرایش با موفقیت انجام شد");
      } else {
        alert("❌ خطا در ویرایش");
      }
    } catch (error) {
      console.error("❌ FETCH ERROR:", error);
      alert("❌ خطای ارتباط با سرور");
    }
  };

  const handleInputChange = (e) => {
    if (e.target.value.length <= 50) {
      setText(e.target.value);
    }
  };

  const toPersianNumber = (num) =>
    num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

  if (!mounted) return null;

  return (
    <>
      <Modal
        open={!!userId}
        onCancel={onClose}
        closeIcon={<CloseOutlined />}
        footer={null}
      >
        <h2 className="text-center mb-4">ویرایش کاربر</h2>

        <div className="flex flex-col gap-4 text-right">
          <label className="text-sm font-medium">نام*</label>
          <div className="relative">
            <Input
              value={text}
              onChange={handleInputChange}
              maxLength={50}
              dir="rtl"
            />

            <span
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none "
              dir="ltr"
            >
              {toPersianNumber(text.length)}/{toPersianNumber(50)}
            </span>
          </div>

          <Select
            className="w-full"
            direction="rtl"
            value={selected}
            onChange={setSelected}
            options={
              Array.isArray(options)
                ? options.map((user) => ({
                    value: String(user.id),
                    label: user.fullname || user.username,
                  }))
                : []
            }
          />

          <div className="flex w-full justify-between ">
            <Button className="w-1/2" onClick={() => setIsOpen(false)}>
              انصراف
            </Button>
            <Button className="w-1/2" type="primary" onClick={handleSubmit}>
              ثبت
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
