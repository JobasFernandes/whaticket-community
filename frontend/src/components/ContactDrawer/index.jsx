import { useState } from "react";
import { X, User, Edit3 } from "lucide-react";

import { i18n } from "../../translate/i18n.js";

import ContactModal from "../ContactModal";
import ContactDrawerSkeleton from "../ContactDrawerSkeleton";
import MarkdownWrapper from "../MarkdownWrapper";

const ContactDrawer = ({ open, handleDrawerClose, contact, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-0 z-40"
        onClick={handleDrawerClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#1e1e1e] shadow-lg border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center min-h-[49px] justify-between p-1 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e]">
          <button
            onClick={handleDrawerClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {i18n.t("contactDrawer.header")}
          </h2>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {loading ? (
          <ContactDrawerSkeleton />
        ) : (
          <div className="flex flex-col h-full overflow-y-auto bg-gray-50 dark:bg-[#121212]">
            {/* Contact Info Card */}
            <div className="bg-white dark:bg-[#1e1e1e] m-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center p-6 space-y-4">
                {/* Avatar */}
                <div className="relative">
                  {contact.profilePicUrl ? (
                    <img
                      src={contact.profilePicUrl}
                      alt={contact.name}
                      className="w-40 h-40 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-700"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-gray-100 dark:ring-gray-700">
                      <User
                        size={60}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <a
                    href={`tel:${contact.number}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    {contact.number}
                  </a>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Edit3 size={16} />
                  {i18n.t("contactDrawer.buttons.edit")}
                </button>
              </div>
            </div>

            {/* Extra Info Section */}
            <div className="bg-white dark:bg-[#1e1e1e] m-4 mt-0 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wide mb-4">
                  {i18n.t("contactDrawer.extraInfo")}
                </h4>

                <div className="space-y-3">
                  {contact?.extraInfo?.map(info => (
                    <div
                      key={info.id}
                      className="bg-gray-50 dark:bg-[#121212] rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                    >
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-1">
                        {info.name}
                      </label>
                      <div className="text-sm text-gray-900 dark:text-white break-words">
                        <MarkdownWrapper>{info.value}</MarkdownWrapper>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        <ContactModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          contactId={contact.id}
        />
      </div>
    </>
  );
};

export default ContactDrawer;
