import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { X, Smartphone, Settings, Scan, Loader2 } from "lucide-react";
import openSocket from "../../services/socket-io.js";
import toastError from "../../errors/toastError.js";
import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";

const QrcodeModal = ({ open, onClose, whatsAppId }) => {
  const [qrCode, setQrCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      setIsLoading(true);
      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setQrCode(data.qrcode);
      } catch (err) {
        toastError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    if (!whatsAppId) return;
    const socket = openSocket();

    socket.on("whatsappSession", data => {
      if (data.action === "update" && data.session.id === whatsAppId) {
        setQrCode(data.session.qrcode);
        setIsLoading(false);
      }

      if (data.action === "update" && data.session.qrcode === "") {
        onClose();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [whatsAppId, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[75vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Scan className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {i18n.t("qrCode.title") || "Conectar WhatsApp"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row min-h-0">
          {/* QR Code Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {i18n.t("qrCode.loading") || "Gerando QR Code..."}
                </p>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center gap-3">
                <div className="p-1 bg-white rounded-lg shadow-md">
                  <QRCode
                    value={qrCode}
                    size={180}
                    level="M"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
                  {i18n.t("qrCode.scanInstruction") ||
                    "Escaneie o QR Code para conectar"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Scan className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {i18n.t("qrCode.waiting") || "Aguardando QR Code..."}
                </p>
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div className="flex-1 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              {i18n.t("qrCode.stepsTitle") || "Etapas para acessar"}
            </h3>

            <div className="space-y-4 sm:space-y-5">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium mb-1 text-sm sm:text-base">
                    {i18n.t("qrCode.step1Title") || "Abra o WhatsApp"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                    {i18n.t("qrCode.step1Description") || "no seu celular"}
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium mb-1 text-sm sm:text-base">
                    {i18n.t("qrCode.step2Title") || "Toque em Mais opções"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    {i18n.t("qrCode.step2Description") ||
                      "no Android ou em Configurações no iPhone"}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium mb-1 text-sm sm:text-base">
                    {i18n.t("qrCode.step3Title") ||
                      "Toque em Dispositivos conectados"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    {i18n.t("qrCode.step3Description") ||
                      "e, em seguida, em Conectar dispositivo"}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium mb-1 text-sm sm:text-base">
                    {i18n.t("qrCode.step4Title") || "Escaneie o QR Code"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                    <Scan className="w-3 h-3 sm:w-4 sm:h-4" />
                    {i18n.t("qrCode.step4Description") || "para confirmar"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {i18n.t("qrCode.securityNote") ||
                  "Mantenha seu telefone conectado à internet para sincronizar as mensagens."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QrcodeModal);
