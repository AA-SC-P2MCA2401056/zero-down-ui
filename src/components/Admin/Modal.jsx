import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, title, children, onClose, maxWidth = "max-w-lg" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div
        className={`w-full ${maxWidth} mx-4 bg-white rounded-2xl shadow-lg p-4 relative`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-full hover:bg-slate-100"
        >
          <X size={16} className="text-slate-500" />
        </button>

        {title && (
          <h2 className="text-lg font-semibold mb-3 pr-6">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
