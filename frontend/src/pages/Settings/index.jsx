import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  Save,
  Loader2
} from "lucide-react";
import openSocket from "../../services/socket-io.js";
import { toast } from "react-toastify";

import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/settings");
        setSettings(data);
      } catch (err) {
        toastError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const socket = openSocket();
    if (!socket) return;

    socket.on("settings", data => {
      if (data.action === "update") {
        setSettings(prevState => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex(s => s.key === data.setting.key);
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChangeSetting = async e => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = key => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : "";
  };

  const copyToClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(i18n.t("settings.apiToken.copySuccess"));
    } catch (err) {
      console.error("Erro ao copiar:", err);
      toast.error(i18n.t("settings.apiToken.copyError"));
    }
  };

  if (isLoading) {
    return (
      <MainContainer>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600 dark:text-gray-400">
              {i18n.t("settings.loading")}
            </p>
          </div>
        </div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <MainHeader>
        <div className="hidden md:block pb-1">
          <Title className="pt-1">{i18n.t("settings.title")}</Title>
        </div>
      </MainHeader>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* User Creation Setting */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {i18n.t("settings.settings.userCreation.name")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {i18n.t("settings.settings.userCreation.description")}
                    </p>
                  </div>
                </div>

                <div className="ml-4">
                  <select
                    name="userCreation"
                    value={getSettingValue("userCreation")}
                    onChange={handleChangeSetting}
                    className="min-w-[180px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="enabled">
                      {i18n.t("settings.settings.userCreation.options.enabled")}
                    </option>
                    <option value="disabled">
                      {i18n.t(
                        "settings.settings.userCreation.options.disabled"
                      )}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* API Token Setting */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {i18n.t("settings.apiToken.title")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {i18n.t("settings.apiToken.description")}
                  </p>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={getSettingValue("userApiToken")}
                      className="w-full px-4 py-3 pr-12 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder={i18n.t("settings.apiToken.placeholder")}
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(getSettingValue("userApiToken"))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      title={i18n.t("settings.apiToken.copyButton")}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                          {i18n.t("settings.apiToken.securityTitle")}
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                          {i18n.t("settings.apiToken.securityDescription")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Settings;
