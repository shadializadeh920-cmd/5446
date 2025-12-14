"use client";

import { Table, Button, Switch } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Edit from "../edit/Edit";

const DynamicTable = ({ data, onDelete, onChangeRole }) => {
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    {
      title: "شناسه",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 80,
    },
    {
      title: "نام",
      dataIndex: "fullname",
      key: "fullname",
      align: "center",
    },
    {
      title: "نام کاربری",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "نقش",
      key: "role",
      align: "center",
      render: (_, record) => {
        const roles = record.roles || [];
        return roles.length ? roles[roles.length - 1].name : "-";
      },
    },
    {
      title: "وضعیت",
      key: "active",
      align: "center",
      render: (_, record) => <Switch checked={record.active} />,
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
              onClick={() => setEditingUser(record.id)}
            >
              ویرایش
            </Button>

            <Button
              type="primary"
              icon={<DeleteOutlined />}
              className="!px-3 !py-1 !bg-red-300 !border-rose-700 !text-rose-700 rounded"
              onClick={() => onDelete(record)}
            >
              حذف
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              className="!px-3 !py-1 !bg-green-300 !border-green-600 !text-green-600 rounded"
              onClick={() => onChangeRole(record)}
            >
              تغییر نقش
            </Button>

            <Button className="!px-3 !py-1 !bg-purple-400 !text-purple-600 !border-purple-600 rounded">
              تغییر رمز
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        style={{ direction: "rtl" }}
      />

      {editingUser && (
        <Edit userId={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </>
  );
};

export default DynamicTable;
