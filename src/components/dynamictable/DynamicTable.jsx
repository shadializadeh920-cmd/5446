"use client";
import { Table, Spin, Alert, Button, Switch } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Edit from "../edit/Edit";

const USER_API = "http://185.205.203.42:7000/api/user";
const getAuthToken = () => {
  const cookieMatch = document.cookie.match(/(?:^|; )token=([^;]+)/);
  return cookieMatch ? cookieMatch[1] : null;
};
const DynamicTable = ({ onDelete }) => {
  const [editingUser, setEditingUser] = useState(null);
  const router = useRouter();
  const onEdit = (recordId) => {
    console.log("ویرایش کاربر:", recordId);

    setEditingUser(recordId);
    // setIsModalOpen(true);
  };

  const columns = [
    {
      title: "شناسه",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
    },
    { title: "نام", dataIndex: "fullname", key: "fullname", align: "center" },
    {
      title: "نام کاربری",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "نقش",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => role || "—",
    },
    {
      title: "وضعیت",
      dataIndex: "active",
      key: "active",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.active}
          onChange={(checked) => handleChangeStatus(record.id, checked)}
        />
      ),
    },
    {
      title: "عملیات",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex flex-col gap-2 item-center">
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="!px-3 !py-1 !border-amber-700 !bg-orange-300 !text-amber-700 rounded"
              onClick={() => onEdit(record.id)}
            >
              ویرایش
            </Button>
            <Button
              onClick={() => onDelete(record, setUsers)}
              type="primary"
              icon={<DeleteOutlined />}
              className="!px-3 !py-1 !bg-red-300 !border-rose-700 !text-rose-700 rounded"
            >
              حذف
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              className="!px-3 !py-1 !bg-green-300 !border-green-600 !text-green-600 rounded"
              onClick={() => handleChangeRole(record)}
            >
              تغییر نقش
            </Button>
            <Button
              className="!px-3 !py-1 !bg-purple-400 !text-purple-600 !border-purple-600 rounded"
              onClick={() => handleChangePassword(record)}
            >
              تغییر رمز
            </Button>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    setUsers([
      {
        id: 1,
        fullname: "مدیر سامانه",
        username: "Admin",
        role: "Admin",
        active: true,
      },
    ]);
  }, []);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("token mojood nist");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(USER_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`خطا: ${response.status}`);
        const data = await response.json();
        console.log("Response from API:", data);
        if (data.data && Array.isArray(data.data)) {
          setUsers(data.data);
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  if (loading)
    return (
      <div>
        <Spin />
      </div>
    );
  if (error)
    return (
      <div>
        <Alert />
      </div>
    );

  return (
    <div>
      <Table
        dataSource={users}
        columns={columns}
        style={{ direction: "rtl" }}
        rowKey="id"
      />
      {editingUser && (
        <Edit
          userId={editingUser}
          onClose={() => {
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default DynamicTable;
