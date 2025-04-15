import React, { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 overflow-y-auto h-full w-full flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative p-5 border w-[480px] shadow-lg rounded-md bg-white">
        {" "}
        {/* w-96 を w-[480px] に変更 */}
        <div
          onClick={onClose}
          className="absolute top-2 right-2 hover:bg-gray-200 rounded-full p-1 cursor-pointer"
        >
          <AiOutlineClose className="h-6 w-6 text-black" />
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
