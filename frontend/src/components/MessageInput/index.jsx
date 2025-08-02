import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import MicRecorder from "mic-recorder-to-mp3-fixed";
import clsx from "clsx";
import {
  Paperclip,
  Smile,
  Send,
  X,
  Mic,
  CheckCircle,
  XCircle,
  Loader2,
  MoreVertical
} from "lucide-react";

import { i18n } from "../../translate/i18n.js";
import api from "../../services/api.js";
import RecordingTimer from "./RecordingTimer";
import { ReplyMessageContext } from "../../context/ReplyingMessage/context";
import { AuthContext } from "../../context/Auth/context";
import { useThemeContext } from "../../hooks/useThemeContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError.js";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const MessageInput = ({ ticketStatus }) => {
  const { ticketId } = useParams();

  const [medias, setMedias] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMobileEmoji, setShowMobileEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [quickAnswers, setQuickAnswer] = useState([]);
  const [typeBar, setTypeBar] = useState(false);
  const inputRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const { setReplyingMessage, replyingMessage } =
    useContext(ReplyMessageContext);
  const { user } = useContext(AuthContext);
  const { darkMode } = useThemeContext();

  const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

  useEffect(() => {
    inputRef.current.focus();
  }, [replyingMessage]);

  useEffect(() => {
    inputRef.current.focus();
    return () => {
      setInputMessage("");
      setShowEmoji(false);
      setShowMobileEmoji(false);
      setMedias([]);
      setReplyingMessage(null);
    };
  }, [ticketId, setReplyingMessage]);

  useEffect(() => {
    // Reset textarea height when message is cleared
    if (inputMessage === "" && inputRef.current) {
      inputRef.current.style.height = "44px";
    }
  }, [inputMessage]);

  const handleChangeInput = e => {
    setInputMessage(e.target.value);
    handleLoadQuickAnswer(e.target.value);

    // Auto-resize do textarea
    e.target.style.height = "44px";
    const scrollHeight = e.target.scrollHeight;
    const maxHeight = 88; // 3 linhas
    e.target.style.height = Math.min(scrollHeight, maxHeight) + "px";
  };

  const handleQuickAnswersClick = value => {
    setInputMessage(value);
    setTypeBar(false);
  };

  const handleAddEmoji = e => {
    setInputMessage(prevState => prevState + e.native);
    setShowEmoji(false);
    setShowMobileEmoji(false);
  };

  const handleChangeMedias = e => {
    if (!e.target.files) {
      return;
    }

    const selectedMedias = Array.from(e.target.files);
    setMedias(selectedMedias);
  };

  const handleInputPaste = e => {
    if (e.clipboardData.files[0]) {
      setMedias([e.clipboardData.files[0]]);
    }
  };

  const handleUploadMedia = async e => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("fromMe", true);
    medias.forEach(media => {
      formData.append("medias", media);
      formData.append("body", media.name);
    });

    try {
      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    setLoading(false);
    setMedias([]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;
    setLoading(true);

    const message = {
      read: 1,
      fromMe: true,
      mediaUrl: "",
      body: signMessage
        ? `*${user?.name}:*\n${inputMessage.trim()}`
        : inputMessage.trim(),
      quotedMsg: replyingMessage
    };
    try {
      await api.post(`/messages/${ticketId}`, message);
    } catch (err) {
      toastError(err);
    }

    setInputMessage("");
    setShowEmoji(false);
    setShowMobileEmoji(false);
    setLoading(false);
    setReplyingMessage(null);
  };

  const handleStartRecording = async () => {
    setLoading(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await Mp3Recorder.start();
      setRecording(true);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  const handleLoadQuickAnswer = async value => {
    if (value && value.indexOf("/") === 0) {
      try {
        const { data } = await api.get("/quickAnswers/", {
          params: { searchParam: inputMessage.substring(1) }
        });
        setQuickAnswer(data.quickAnswers);
        if (data.quickAnswers.length > 0) {
          setTypeBar(true);
        } else {
          setTypeBar(false);
        }
      } catch (err) {
        setTypeBar(false);
      }
    } else {
      setTypeBar(false);
    }
  };

  const handleUploadAudio = async () => {
    setLoading(true);
    try {
      const [, blob] = await Mp3Recorder.stop().getMp3();
      if (blob.size < 10000) {
        setLoading(false);
        setRecording(false);
        return;
      }

      const formData = new FormData();
      const filename = `${new Date().getTime()}.mp3`;
      formData.append("medias", blob, filename);
      formData.append("body", filename);
      formData.append("fromMe", true);

      await api.post(`/messages/${ticketId}`, formData);
    } catch (err) {
      toastError(err);
    }

    setRecording(false);
    setLoading(false);
  };

  const handleCancelAudio = async () => {
    try {
      await Mp3Recorder.stop().getMp3();
      setRecording(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenMenuClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = event => {
    setAnchorEl(null);
  };

  const renderReplyingMessage = message => {
    return (
      <div className="flex items-center justify-center w-full pt-2 px-4">
        <div className="flex-1 mr-2 bg-gray-100 dark:bg-[#1e1e1e] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex">
            <div
              className={clsx("w-1 flex-shrink-0", {
                "bg-green-500": message.fromMe,
                "bg-blue-500": !message.fromMe
              })}
            />
            <div className="p-3 flex-1 overflow-hidden">
              {!message.fromMe && (
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  {message.contact?.name}
                </div>
              )}
              <div className="text-sm text-gray-900 dark:text-white break-words">
                {message.body}
              </div>
            </div>
          </div>
        </div>
        <button
          disabled={loading || ticketStatus !== "open"}
          onClick={() => setReplyingMessage(null)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <X size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    );
  };

  if (medias.length > 0) {
    return (
      <div className="bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMedias([])}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          <div className="flex-1 mx-4">
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-green-600" />
              </div>
            ) : (
              <span className="text-sm text-gray-900 dark:text-white truncate">
                {medias[0]?.name}
              </span>
            )}
          </div>

          <button
            onClick={handleUploadMedia}
            disabled={loading}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1e1e1e] sm:fixed sm:bottom-0 sm:w-full md:relative">
      {replyingMessage && !recording && renderReplyingMessage(replyingMessage)}

      {recording ? (
        // Recording Mode - Only show recording controls
        <div
          className="flex items-center justify-center p-2 gap-4"
          style={{ minHeight: "60px" }}
        >
          <button
            onClick={handleCancelAudio}
            disabled={loading}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
          >
            <XCircle size={20} className="text-red-600" />
          </button>

          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 size={20} className="animate-spin text-green-600" />
            ) : (
              <RecordingTimer />
            )}
          </div>

          <button
            onClick={handleUploadAudio}
            disabled={loading}
            className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={20} className="text-green-600" />
          </button>
        </div>
      ) : (
        // Normal Mode - Show all controls
        <div className="flex items-center p-2 pb-0 gap-2">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-1">
            {/* Emoji Picker */}
            <div className="relative">
              <button
                disabled={loading || recording || ticketStatus !== "open"}
                onClick={() => setShowEmoji(prev => !prev)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Smile size={20} className="text-gray-600 dark:text-gray-300" />
              </button>{" "}
              {showEmoji && (
                <div className="absolute bottom-12 left-0 z-50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowEmoji(false)}
                  />
                  <div className="relative z-50">
                    <Picker
                      data={data}
                      onEmojiSelect={handleAddEmoji}
                      perLine={16}
                      previewPosition="none"
                      searchPosition="none"
                      skinTonePosition="none"
                      theme={darkMode ? "dark" : "light"}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* File Upload */}
            <div>
              <input
                multiple
                type="file"
                id="upload-button"
                disabled={loading || recording || ticketStatus !== "open"}
                className="hidden"
                onChange={handleChangeMedias}
              />
              <label
                htmlFor="upload-button"
                className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${
                  loading || recording || ticketStatus !== "open"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Paperclip
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </label>
            </div>

            {/* Sign Message Toggle */}
            <div className="flex items-center gap-2 px-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signMessage}
                  onChange={e => setSignMessage(e.target.checked)}
                  className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-xs">
                  {i18n.t("messagesInput.signMessage")}
                </span>
              </label>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden relative">
            <button
              onClick={handleOpenMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical
                size={20}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>

            {anchorEl && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAnchorEl(null)}
                />
                <div className="absolute bottom-12 left-0 z-50 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 w-48">
                  <button
                    onClick={() => {
                      setShowMobileEmoji(prev => !prev);
                      setAnchorEl(null);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Smile size={16} />
                    Emoji
                  </button>

                  <label
                    className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${
                      loading || recording || ticketStatus !== "open"
                        ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    }`}
                  >
                    <Paperclip size={16} />
                    Anexar
                    <input
                      multiple
                      type="file"
                      disabled={loading || recording || ticketStatus !== "open"}
                      className="hidden"
                      onChange={handleChangeMedias}
                    />
                  </label>

                  <div className="px-4 py-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={signMessage}
                        onChange={e => setSignMessage(e.target.checked)}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded"
                      />
                      {i18n.t("messagesInput.signMessage")}
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Emoji Picker */}
          {showMobileEmoji && (
            <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0"
                onClick={() => setShowMobileEmoji(false)}
              />
              <div className="relative bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <Picker
                  data={data}
                  onEmojiSelect={handleAddEmoji}
                  perLine={8}
                  previewPosition="none"
                  searchPosition="none"
                  skinTonePosition="none"
                  theme={darkMode ? "dark" : "light"}
                />
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              className="w-full resize-none bg-gray-100 dark:bg-[#1e1e1e] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 rounded-2xl px-4 py-3 pr-12 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 overflow-hidden"
              placeholder={
                ticketStatus === "open"
                  ? i18n.t("messagesInput.placeholderOpen")
                  : i18n.t("messagesInput.placeholderClosed")
              }
              rows={1}
              value={inputMessage}
              onChange={handleChangeInput}
              disabled={recording || loading || ticketStatus !== "open"}
              onPaste={e => {
                ticketStatus === "open" && handleInputPaste(e);
              }}
              onKeyPress={e => {
                if (loading || e.shiftKey) return;
                else if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                minHeight: "44px",
                maxHeight: "88px", // 3 linhas aproximadamente (44px + 22px + 22px)
                height: "auto",
                overflowY: inputMessage.length > 200 ? "auto" : "hidden"
              }}
            />

            {/* Quick Answers */}
            {typeBar && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {quickAnswers.map((value, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAnswersClick(value.message)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  >
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {value.shortcut}
                    </span>{" "}
                    - {value.message}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 pb-2">
            {inputMessage.trim() ? (
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className="p-3 rounded-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white transition-colors"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                disabled={loading || ticketStatus !== "open"}
                className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50"
              >
                <Mic size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
