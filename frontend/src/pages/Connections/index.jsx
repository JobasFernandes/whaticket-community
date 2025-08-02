import { useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import {
  Edit,
  Trash2,
  Plus,
  Smartphone,
  Wifi,
  WifiOff,
  QrCode,
  CheckCircle,
  XCircle,
  Phone,
  Battery,
  Power
} from "lucide-react";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";
import api from "../../services/api.js";
import WhatsAppModal from "../../components/WhatsAppModal";
import QrcodeModal from "../../components/QrcodeModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { WhatsAppsContext } from "../../context/WhatsApp/context";

const Connections = () => {
  const { whatsApps, loading } = useContext(WhatsAppsContext);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const confirmationModalInitialState = {
    action: "",
    title: "",
    message: "",
    whatsAppId: "",
    open: false
  };
  const [confirmModalInfo, setConfirmModalInfo] = useState(
    confirmationModalInitialState
  );

  const handleStartWhatsAppSession = async whatsAppId => {
    try {
      await api.post(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleRequestNewQrCode = async whatsAppId => {
    try {
      await api.put(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenWhatsAppModal = () => {
    setSelectedWhatsApp(null);
    setWhatsAppModalOpen(true);
  };

  const handleCloseWhatsAppModal = useCallback(() => {
    setWhatsAppModalOpen(false);
    setSelectedWhatsApp(null);
  }, [setSelectedWhatsApp, setWhatsAppModalOpen]);

  const handleOpenQrModal = whatsApp => {
    setSelectedWhatsApp(whatsApp);
    setQrModalOpen(true);
  };

  const handleCloseQrModal = useCallback(() => {
    setQrModalOpen(false);
    setSelectedWhatsApp(null);
  }, [setQrModalOpen, setSelectedWhatsApp]);

  const handleEditWhatsApp = whatsApp => {
    setSelectedWhatsApp(whatsApp);
    setWhatsAppModalOpen(true);
  };

  const handleOpenConfirmationModal = (action, whatsAppId) => {
    if (action === "disconnect") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.disconnectTitle"),
        message: i18n.t("connections.confirmationModal.disconnectMessage"),
        whatsAppId: whatsAppId
      });
    }

    if (action === "delete") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.deleteTitle"),
        message: i18n.t("connections.confirmationModal.deleteMessage"),
        whatsAppId: whatsAppId
      });
    }
    setConfirmModalOpen(true);
  };

  const handleSubmitConfirmationModal = async () => {
    if (confirmModalInfo.action === "disconnect") {
      try {
        await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
      } catch (err) {
        toastError(err);
      }
    }

    if (confirmModalInfo.action === "delete") {
      try {
        await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t("connections.toasts.deleted"));
      } catch (err) {
        toastError(err);
      }
    }

    setConfirmModalInfo(confirmationModalInitialState);
    setConfirmModalOpen(false);
  };

  const renderActionButtons = whatsApp => {
    return (
      <div className="flex items-center justify-center gap-1">
        {whatsApp.status === "qrcode" && (
          <button
            onClick={() => handleOpenQrModal(whatsApp)}
            className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
            title={i18n.t("connections.tooltips.qrCode")}
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        )}
        {whatsApp.status === "DISCONNECTED" && (
          <button
            onClick={() => handleStartWhatsAppSession(whatsApp.id)}
            className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
            title={i18n.t("connections.tooltips.start")}
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        )}
        {(whatsApp.status === "CONNECTED" ||
          whatsApp.status === "PAIRING" ||
          whatsApp.status === "TIMEOUT") && (
          <button
            onClick={() =>
              handleOpenConfirmationModal("disconnect", whatsApp.id)
            }
            className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
            title={i18n.t("connections.tooltips.disconnect")}
          >
            <WifiOff className="w-3.5 h-3.5" />
          </button>
        )}
        {whatsApp.status === "OPENING" && (
          <button
            onClick={() => handleRequestNewQrCode(whatsApp.id)}
            className="p-1.5 text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded transition-colors"
            title={i18n.t("connections.tooltips.restart")}
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  const renderStatusBadge = whatsApp => {
    const statusConfig = {
      CONNECTED: {
        color:
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        icon: CheckCircle,
        text: i18n.t("connections.status.CONNECTED")
      },
      DISCONNECTED: {
        color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        icon: XCircle,
        text: i18n.t("connections.status.DISCONNECTED")
      },
      qrcode: {
        color:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        icon: QrCode,
        text: i18n.t("connections.status.qrcode")
      },
      OPENING: {
        color:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        icon: Wifi,
        text: i18n.t("connections.status.OPENING")
      },
      PAIRING: {
        color:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
        icon: Smartphone,
        text: i18n.t("connections.status.PAIRING")
      },
      TIMEOUT: {
        color:
          "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
        icon: XCircle,
        text: i18n.t("connections.status.TIMEOUT")
      }
    };

    const config = statusConfig[whatsApp.status] || statusConfig.DISCONNECTED;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatPhoneNumber = number => {
    if (!number) return "-";

    // Format Brazilian phone numbers
    if (number.length === 13 && number.startsWith("55")) {
      const ddd = number.slice(2, 4);
      const phoneNumber = number.slice(4);
      return `+55 (${ddd}) ${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
    }

    // For other countries, just add + prefix
    return `+${number}`;
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={confirmModalInfo.title}
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleSubmitConfirmationModal}
      >
        {confirmModalInfo.message}
      </ConfirmationModal>
      <QrcodeModal
        open={qrModalOpen}
        onClose={handleCloseQrModal}
        whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}
      />
      <WhatsAppModal
        open={whatsAppModalOpen}
        onClose={handleCloseWhatsAppModal}
        whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
      />

      {/* Mobile title */}
      <div className="md:hidden px-4 py-2">
        <Title className="text-center">{i18n.t("connections.title")}</Title>
      </div>

      <MainHeader>
        {/* Desktop title */}
        <div className="hidden md:block">
          <Title>{i18n.t("connections.title")}</Title>
        </div>

        <MainHeaderButtonsWrapper>
          <button
            onClick={handleOpenWhatsAppModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all duration-200"
            title={i18n.t("connections.buttons.add")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("connections.buttons.add")}
            </span>
          </button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      {/* Connections Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                {/* Name column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("connections.table.name")}
                </th>
                {/* Number column - hidden on mobile */}
                <th className="hidden md:table-cell px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("connections.table.number")}
                </th>
                {/* Status column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("connections.table.status")}
                </th>
                {/* Last Update column - hidden on mobile and tablet */}
                <th className="hidden xl:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("connections.table.lastUpdate")}
                </th>
                {/* Default column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[180px]">
                  {i18n.t("connections.table.default")}
                </th>
                {/* Actions column */}
                <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  {i18n.t("connections.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <TableRowSkeleton columns={6} />
              ) : (
                whatsApps?.length > 0 &&
                whatsApps.map(whatsApp => (
                  <tr
                    key={whatsApp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    {/* Name with connection info on mobile */}
                    <td className="px-4 py-1">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {whatsApp.name}
                          </div>
                          {/* Mobile info */}
                          <div className="md:hidden space-y-1 mt-1">
                            {whatsApp.number && (
                              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>
                                  {formatPhoneNumber(whatsApp.number)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {renderStatusBadge(whatsApp)}
                              {whatsApp.isDefault && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Padrão
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {format(
                                parseISO(whatsApp.updatedAt),
                                "dd/MM/yy HH:mm"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Number - hidden on mobile */}
                    <td className="hidden md:table-cell px-4 py-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{formatPhoneNumber(whatsApp.number)}</span>
                      </div>
                    </td>

                    {/* Status - hidden on mobile */}
                    <td className="hidden lg:table-cell px-4 py-1 text-center">
                      {renderStatusBadge(whatsApp)}
                    </td>

                    {/* Last Update - hidden on mobile and tablet */}
                    <td className="hidden xl:table-cell px-4 py-1 text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {format(parseISO(whatsApp.updatedAt), "dd/MM/yy HH:mm")}
                      </div>
                    </td>

                    {/* Default - hidden on mobile */}
                    <td className="hidden lg:table-cell px-4 py-1 text-center">
                      {whatsApp.isDefault && (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-1">
                      <div className="flex items-center justify-center gap-1">
                        {renderActionButtons(whatsApp)}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditWhatsApp(whatsApp)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                          title={i18n.t("connections.tooltips.edit")}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            handleOpenConfirmationModal("delete", whatsApp.id)
                          }
                          className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                          title={i18n.t("connections.tooltips.delete")}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainContainer>
  );
};

export default Connections;
