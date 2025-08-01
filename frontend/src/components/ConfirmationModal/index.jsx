import React from "react";
import { AlertCircle, X } from "lucide-react";
import { i18n } from "../../translate/i18n.js";

const ConfirmationModal = ({ title, children, open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-sm w-full border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-base font-medium text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={() => onClose(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {children}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onClose(false)}
            className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {i18n.t("confirmationModal.buttons.cancel")}
          </button>
          <button
            onClick={() => {
              onClose(false);
              onConfirm();
            }}
            className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded transition-colors"
          >
            {i18n.t("confirmationModal.buttons.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
