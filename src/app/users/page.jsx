"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { getUsers, deleteUser } from "@/services/users";
import { Button } from "antd";
import Search from "../../components/search/Search";
import DynamicTable from "../../components/dynamictable/DynamicTable";
import Edit from "../../components/edit/Edit";
import Swal from "sweetalert2";
import ChangeRoleModal from "@/src/components/changeRole/ChangeRole";

const UsersPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire({
        title: "موفقیت",
        text: "کاربر با موفقیت حذف شد",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        title: "خطا",
        text: "حذف انجام نشد",
        icon: "error",
      });
    },
  });

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setRoleModalOpen(true);
  };

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

      customClass: {
        actions: "flex gap-3 justify-center",
        confirmButton: "bg-blue-500 text-white rounded px-4 py-2",
        cancelButton: "bg-red-500 text-white rounded px-4 py-2",
      },
    });

    if (!result.isConfirmed) return;
    deleteMutation.mutate(record.id);
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
          >
            تغییر رمز
          </Button>
        </div>
      </div>
      <div className=" ">
        <Search />
        {roleModalOpen && selectedUser && (
          <ChangeRoleModal
            open={roleModalOpen}
            user={selectedUser}
            onClose={() => setRoleModalOpen(false)}
            onSuccess={() => queryClient.invalidateQueries(["users"])}
          />
        )}

        <DynamicTable
          data={users}
          onEdit={(id) => setEditUserId(id)}
          onDelete={handleDelete}
          onChangeRole={handleChangeRole}
        />

        {editUserId && (
          <Edit
            userId={editUserId}
            onClose={() => setEditUserId(null)}
            onSuccess={() => queryClient.invalidateQueries(["users"])}
          />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
