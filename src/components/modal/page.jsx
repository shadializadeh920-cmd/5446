import { Button } from "antd";
import React, { useState } from "react";

const ModalPage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(null);
  const openModal = (modalId) => {
    setModalIsOpen(modalId);
  };
  const closeModal = () => {
    setModalIsOpen(null);
  };
  return (
    <div>
      <Button onClick={() => openModal("modal1")}></Button>
      <Button onClick={() => openModal("modal2")}></Button>
      <Button onClick={() => openModal("modal3")}></Button>
      <Button onClick={() => openModal("modal4")}></Button>
      <Modal
        isOpen={modalIsOpen === "modal1"}
        onRequestClose={closeModal}
        contentLabel="مدال ۱"
      ></Modal>
    </div>
  );
};

export default ModalPage;
