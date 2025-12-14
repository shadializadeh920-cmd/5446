"use client";

import { Modal, Select, Spin } from "antd";
import { useEffect, useState } from "react";

const ROLES_API = "http://185.205.203.42:7000/api/role";
const CHANGE_ROLE_API = "http://185.205.203.42:7000/api/user/changerole";

const ChangeRoleModal = ({ open, onClose, user, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const getAuthToken = () => {
    const match = document.cookie.match(/(?:^|; )token=([^;]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (!open) return;

    const fetchRoles = async () => {
      setLoading(true);
      const token = getAuthToken();

      const res = await fetch(ROLES_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRoles(data.data || []);
      setLoading(false);
    };

    fetchRoles();
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedRole) return;

    const token = getAuthToken();
    console.log("userId:", user.id);
    console.log("roleId:", selectedRole);
    await fetch(CHANGE_ROLE_API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roleIds: [selectedRole],
        userIds: [user.id],
      }),
    });

    onSuccess();
    onClose();
  };

  return (
    <Modal
      open={open}
      title={`تغییر نقش ${user?.fullname}`}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="ذخیره"
      cancelText="لغو"
    >
      {loading ? (
        <Spin />
      ) : (
        <Select
          className="w-full"
          placeholder="انتخاب نقش"
          onChange={setSelectedRole}
          options={roles.map((r) => ({
            value: r.id,
            label: r.name,
          }))}
        />
      )}
    </Modal>
  );
};

export default ChangeRoleModal;
