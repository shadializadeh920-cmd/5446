"use client";
import { Table, Spin, Alert } from "antd";
import { useEffect, useState } from "react";

const USER_API = "http://185.205.203.42:7000/api/user";
const getAuthToken = () => {
  const cookieMatch = document.cookie.match(/(?:^|; )token=([^;]+)/);
  return cookieMatch ? cookieMatch[1] : null;
};
const DynamicTable = () => {
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
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default DynamicTable;
