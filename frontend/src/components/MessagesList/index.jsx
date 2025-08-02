import React, { useState, useEffect, useReducer, useRef } from "react";
import { isSameDay, parseISO, format } from "date-fns";
import openSocket from "../../services/socket-io.js";
import clsx from "clsx";
import {
  Clock,
  Ban,
  Check,
  CheckCheck,
  ChevronDown,
  Download,
  Loader2
} from "lucide-react";

import MarkdownWrapper from "../MarkdownWrapper";
import VcardPreview from "../VcardPreview";
import LocationPreview from "../LocationPreview";
import ModalImageCors from "../ModalImageCors";
import MessageOptionsMenu from "../MessageOptionsMenu";
import whatsBackground from "../../assets/wa-background.png";
import whatsBackgroundDark from "../../assets/wa-background-dark.png";
import { useThemeContext } from "../../hooks/useThemeContext";
import { i18n } from "../../translate/i18n.js";

import api from "../../services/api.js";
import toastError from "../../errors/toastError.js";
import Audio from "../Audio";

const reducer = (state, action) => {
  if (action.type === "LOAD_MESSAGES") {
    const messages = action.payload;
    const newMessages = [];

    messages.forEach(message => {
      const messageIndex = state.findIndex(m => m.id === message.id);
      if (messageIndex !== -1) {
        state[messageIndex] = message;
      } else {
        newMessages.push(message);
      }
    });

    return [...newMessages, ...state];
  }

  if (action.type === "ADD_MESSAGE") {
    const newMessage = action.payload;
    const messageIndex = state.findIndex(m => m.id === newMessage.id);

    if (messageIndex !== -1) {
      state[messageIndex] = newMessage;
    } else {
      state.push(newMessage);
    }

    return [...state];
  }

  if (action.type === "UPDATE_MESSAGE") {
    const messageToUpdate = action.payload;
    const messageIndex = state.findIndex(m => m.id === messageToUpdate.id);

    if (messageIndex !== -1) {
      state[messageIndex] = messageToUpdate;
    }

    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const MessagesList = ({ ticketId, isGroup }) => {
  const { darkMode } = useThemeContext();
  const [messagesList, dispatch] = useReducer(reducer, []);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  const [selectedMessage, setSelectedMessage] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const messageOptionsMenuOpen = Boolean(anchorEl);
  const currentTicketId = useRef(ticketId);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);

    currentTicketId.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchMessages = async () => {
        try {
          const { data } = await api.get("/messages/" + ticketId, {
            params: { pageNumber }
          });

          if (currentTicketId.current === ticketId) {
            dispatch({ type: "LOAD_MESSAGES", payload: data.messages });
            setHasMore(data.hasMore);
            setLoading(false);
          }

          if (pageNumber === 1 && data.messages.length > 1) {
            scrollToBottom();
          }
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchMessages();
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [pageNumber, ticketId]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("connect", () => socket.emit("joinChatBox", ticketId));

    socket.on("appMessage", data => {
      if (data.action === "create") {
        dispatch({ type: "ADD_MESSAGE", payload: data.message });
        scrollToBottom();
      }

      if (data.action === "update") {
        dispatch({ type: "UPDATE_MESSAGE", payload: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const loadMore = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleScroll = e => {
    if (!hasMore) return;
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0) {
      document.getElementById("messagesList").scrollTop = 1;
    }

    if (loading) {
      return;
    }

    if (scrollTop < 50) {
      loadMore();
    }
  };

  const handleOpenMessageOptionsMenu = (e, message) => {
    setAnchorEl(e.currentTarget);
    setSelectedMessage(message);
  };

  const handleCloseMessageOptionsMenu = e => {
    setAnchorEl(null);
  };

  const checkMessageMedia = message => {
    if (
      message.mediaType === "location" &&
      message.body.split("|").length >= 2
    ) {
      let locationParts = message.body.split("|");
      let imageLocation = locationParts[0];
      let linkLocation = locationParts[1];

      let descriptionLocation = null;

      if (locationParts.length > 2)
        descriptionLocation = message.body.split("|")[2];

      return (
        <LocationPreview
          image={imageLocation}
          link={linkLocation}
          description={descriptionLocation}
        />
      );
    } else if (message.mediaType === "vcard") {
      let array = message.body.split("\n");
      let obj = [];
      let contact = "";
      for (let index = 0; index < array.length; index++) {
        const v = array[index];
        let values = v.split(":");
        for (let ind = 0; ind < values.length; ind++) {
          if (values[ind].indexOf("+") !== -1) {
            obj.push({ number: values[ind] });
          }
          if (values[ind].indexOf("FN") !== -1) {
            contact = values[ind + 1];
          }
        }
      }
      return <VcardPreview contact={contact} numbers={obj[0]?.number} />;
    } else if (
      /^.*\.(jpe?g|png|gif)?$/i.exec(message.mediaUrl) &&
      message.mediaType === "image"
    ) {
      return <ModalImageCors imageUrl={message.mediaUrl} />;
    } else if (message.mediaType === "audio") {
      return <Audio url={message.mediaUrl} />;
    } else if (message.mediaType === "video") {
      return (
        <video
          className="object-cover w-64 h-48 rounded-lg"
          src={message.mediaUrl}
          controls
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] p-4 rounded-lg">
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            Download
          </a>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700 mt-4"></div>
        </div>
      );
    }
  };

  const renderMessageAck = message => {
    if (message.ack === 0) {
      return (
        <Clock size={14} className="text-gray-500 dark:text-gray-300 ml-1" />
      );
    }
    if (message.ack === 1) {
      return (
        <Check size={14} className="text-gray-500 dark:text-gray-300 ml-1" />
      );
    }
    if (message.ack === 2) {
      return <CheckCheck size={14} className="text-gray-300 ml-1" />;
    }
    if (message.ack === 3 || message.ack === 4) {
      return <CheckCheck size={14} className="text-green-500 ml-1" />;
    }
  };

  const renderDailyTimestamps = (message, index) => {
    if (index === 0) {
      return (
        <div
          className="flex justify-center my-4"
          key={`timestamp-${message.id}`}
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
            {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
          </div>
        </div>
      );
    }
    if (index < messagesList.length - 1) {
      let messageDay = parseISO(messagesList[index].createdAt);
      let previousMessageDay = parseISO(messagesList[index - 1].createdAt);

      if (!isSameDay(messageDay, previousMessageDay)) {
        return (
          <div
            className="flex justify-center my-4"
            key={`timestamp-${message.id}`}
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              {format(parseISO(messagesList[index].createdAt), "dd/MM/yyyy")}
            </div>
          </div>
        );
      }
    }
    if (index === messagesList.length - 1) {
      return (
        <div
          key={`ref-${message.createdAt}`}
          ref={lastMessageRef}
          className="float-left clear-both"
        />
      );
    }
  };

  const renderMessageDivider = (message, index) => {
    if (index < messagesList.length && index > 0) {
      let messageUser = messagesList[index].fromMe;
      let previousMessageUser = messagesList[index - 1].fromMe;

      if (messageUser !== previousMessageUser) {
        return <div className="mt-4" key={`divider-${message.id}`}></div>;
      }
    }
  };

  const renderQuotedMessage = message => {
    return (
      <div
        className={clsx(
          "flex mb-2 p-2 rounded-lg border-l-4 bg-gray-100 dark:bg-[#1e1e1e]",
          {
            "border-l-blue-500": !message.fromMe,
            "border-l-blue-400": message.fromMe,
            "bg-blue-50/50 dark:bg-blue-900/20": message.fromMe
          }
        )}
      >
        <div className="flex-1 overflow-hidden">
          {!message.quotedMsg?.fromMe && (
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
              {message.quotedMsg?.contact?.name}
            </div>
          )}
          <div className="text-sm text-gray-700 dark:text-gray-300 break-words">
            {message.quotedMsg?.body}
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (messagesList.length > 0) {
      const viewMessagesList = messagesList.map((message, index) => {
        if (!message.fromMe) {
          // Message from contact
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <div className="flex justify-start mb-2 group">
                <div
                  className={clsx(
                    "relative max-w-xs lg:max-w-md backdrop-blur-sm rounded-2xl rounded-tl-none shadow-lg p-3",
                    {
                      "bg-red-50/95 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50":
                        message.isDeleted,
                      "bg-white/95 dark:bg-[#1e1e1e]/95 border border-gray-200/50 dark:border-gray-700/50":
                        !message.isDeleted
                    }
                  )}
                >
                  {/* Message Actions Button */}
                  <button
                    disabled={message.isDeleted}
                    onClick={e => handleOpenMessageOptionsMenu(e, message)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <ChevronDown
                      size={14}
                      className="text-gray-500 dark:text-gray-300"
                    />
                  </button>

                  {/* Group Contact Name */}
                  {isGroup && (
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {message.contact?.name}
                    </div>
                  )}

                  {/* Media Content */}
                  {(message.mediaUrl ||
                    message.mediaType === "location" ||
                    message.mediaType === "vcard") &&
                    checkMessageMedia(message)}

                  {/* Text Content */}
                  <div className="break-words">
                    {message.quotedMsg && renderQuotedMessage(message)}
                    {/* Show body text unless it's just a media filename */}
                    {message.body &&
                      !(
                        message.mediaUrl &&
                        message.body.match(
                          /^[A-Za-z0-9]+\-\d+\.(jpg|jpeg|png|gif|mp4|mp3|wav|ogg|pdf|doc|docx)$/i
                        )
                      ) && (
                        <div
                          className={clsx("text-sm", {
                            "text-red-700 dark:text-red-300 italic":
                              message.isDeleted,
                            "text-gray-900 dark:text-white": !message.isDeleted
                          })}
                        >
                          <MarkdownWrapper>{message.body}</MarkdownWrapper>
                        </div>
                      )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-end mt-1 gap-1">
                      {message.isDeleted && (
                        <div className="flex items-center mr-2">
                          <Ban
                            size={12}
                            className="inline-block mr-1 text-red-500 dark:text-red-400"
                          />
                          <span className="text-xs italic text-red-600 dark:text-red-400">
                            {i18n.t("messagesList.deletedMessage")}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-300">
                        {format(parseISO(message.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        } else {
          // Message from me
          return (
            <React.Fragment key={message.id}>
              {renderDailyTimestamps(message, index)}
              {renderMessageDivider(message, index)}
              <div className="flex justify-end mb-2 group">
                <div
                  className={clsx(
                    "relative max-w-xs lg:max-w-md backdrop-blur-sm rounded-2xl rounded-tr-none shadow-lg p-3",
                    {
                      "bg-red-100/90 dark:bg-red-900/30 border border-red-300/50 dark:border-red-800/50":
                        message.isDeleted,
                      "bg-blue-600/90 dark:bg-blue-700/60 border border-blue-500/20 dark:border-blue-600/20":
                        !message.isDeleted
                    }
                  )}
                >
                  {/* Message Actions Button */}
                  <button
                    disabled={message.isDeleted}
                    onClick={e => handleOpenMessageOptionsMenu(e, message)}
                    className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-700/50 dark:hover:bg-blue-800/50 rounded-full"
                  >
                    <ChevronDown size={14} className="text-blue-100" />
                  </button>

                  {/* Media Content */}
                  {(message.mediaUrl ||
                    message.mediaType === "location" ||
                    message.mediaType === "vcard") &&
                    checkMessageMedia(message)}

                  {/* Text Content */}
                  <div
                    className={clsx("break-words", {
                      italic: message.isDeleted
                    })}
                  >
                    {message.quotedMsg && renderQuotedMessage(message)}
                    {/* Show body text unless it's just a media filename */}
                    {message.body &&
                      !(
                        message.mediaUrl &&
                        message.body.match(
                          /^[A-Za-z0-9]+\-\d+\.(jpg|jpeg|png|gif|mp4|mp3|wav|ogg|pdf|doc|docx)$/i
                        )
                      ) && (
                        <div
                          className={clsx("text-sm", {
                            "text-red-700 dark:text-red-200": message.isDeleted,
                            "text-white": !message.isDeleted
                          })}
                        >
                          <MarkdownWrapper>{message.body}</MarkdownWrapper>
                        </div>
                      )}

                    {/* Timestamp and Status */}
                    <div className="flex items-center justify-between mt-1">
                      {message.isDeleted && (
                        <div className="flex items-center">
                          <Ban
                            size={12}
                            className="inline-block mr-1 text-red-600 dark:text-red-400"
                          />
                          <span className="text-xs italic text-red-700 dark:text-red-300">
                            {i18n.t("messagesList.deletedMessage")}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <span
                          className={clsx("text-xs", {
                            "text-red-600 dark:text-red-300": message.isDeleted,
                            "text-blue-100": !message.isDeleted
                          })}
                        >
                          {format(parseISO(message.createdAt), "HH:mm")}
                        </span>
                        {renderMessageAck(message)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        }
      });
      return viewMessagesList;
    } else {
      return (
        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-300">
          Say hello to your new contact!
        </div>
      );
    }
  };

  return (
    <div className="overflow-hidden relative flex flex-col flex-grow">
      <MessageOptionsMenu
        message={selectedMessage}
        anchorEl={anchorEl}
        menuOpen={messageOptionsMenuOpen}
        handleClose={handleCloseMessageOptionsMenu}
      />
      <div
        id="messagesList"
        className="bg-gray-50 dark:bg-[#121212] flex flex-col flex-grow p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 pb-20 sm:pb-5"
        style={{
          backgroundImage: `url(${darkMode ? whatsBackgroundDark : whatsBackground})`,
          backgroundRepeat: "repeat"
        }}
        onScroll={handleScroll}
      >
        {messagesList.length > 0 ? renderMessages() : []}
      </div>
      {loading && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
          <Loader2
            size={24}
            className="animate-spin text-blue-600 opacity-70"
          />
        </div>
      )}
    </div>
  );
};

export default MessagesList;
