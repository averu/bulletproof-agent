import React, { useState } from "react";
import { Button } from "../../../../components/Elements";
import Modal from "../../../../components/Elements/Modal";
import { TodoAdd } from "../TodoAdd/TodoAdd";

export const TodoForm: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={handleOpenModal} className="mb-6">
        追加
      </Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TodoAdd />
      </Modal>
    </>
  );
};
