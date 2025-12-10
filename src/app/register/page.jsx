"use client";
import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Button, Alert } from "antd";

export default function Register() {
  const initialValues = { username: "", email: "", password: "" };

  const validationSchema = Yup.object({
    username: Yup.string().required("نام کاربری الزامی است"),
    email: Yup.string().email("ایمیل معتبر نیست").required("ایمیل الزامی است"),
    password: Yup.string()
      .min(6, "رمز عبور حداقل ۶ کاراکتر است")
      .required("رمز عبور الزامی است"),
  });

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (!token) {
        setStatus("توکن یافت نشد، لطفاً ابتدا وارد شوید.");
        return;
      }

      const payload = {
        fullname: values.username,
        username: values.username,
        password: values.password,
        system: "web",
        groupId: 1,
        description: "",
        clientIds: [1],
      };

      const res = await fetch("http://185.205.203.42:7000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setStatus(`خطای سرور (${res.status}): ${errorText}`);
        console.error("Server error:", errorText);
        return;
      }

      const text = await res.text();
      const data = JSON.parse(text);
      setStatus(data.message || "ثبت‌نام با موفقیت انجام شد");
      resetForm();
    } catch (err) {
      setStatus("خطا: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-bold text-gray-700 mb-6">
        فرم ثبت‌ نام
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, handleChange, setFieldValue, status }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">نام کاربری:</label>
              <Input
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="نام کاربری خود را وارد کنید"
                className="rounded-md border-gray-300"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">ایمیل:</label>
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="ایمیل خود را وارد کنید"
                className="rounded-md border-gray-300"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">رمز عبور:</label>
              <Input.Password
                name="password"
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                className="rounded-md border-gray-300"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting}
              className="w-full !bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !py-2 rounded-md"
            >
              ثبت‌ نام
            </Button>

            {status && (
              <Alert
                className="mt-4 rounded-md"
                title={status}
                type={status.includes("خطا") ? "error" : "success"}
                showIcon
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
