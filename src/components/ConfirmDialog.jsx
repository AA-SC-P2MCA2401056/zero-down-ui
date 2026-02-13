import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg p-4 relative">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 p-1 rounded-full hover:bg-slate-100"
        >
          <X size={16} className="text-slate-500" />
        </button>

        {/* Icon + title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-amber-100">
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-600 mb-4">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-3 py-1.5 rounded-md text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 rounded-md text-sm bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
