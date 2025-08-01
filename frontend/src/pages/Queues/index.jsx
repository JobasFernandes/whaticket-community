import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import openSocket from "../../services/socket-io.js";
import { Edit, Trash2, Plus, Palette, MessageSquare } from "lucide-react";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError.js";
import api from "../../services/api.js";
import QueueModal from "../../components/QueueModal";
import ConfirmationModal from "../../components/ConfirmationModal";

const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    const newQueues = [];

    queues.forEach(queue => {
      const queueIndex = state.findIndex(q => q.id === queue.id);
      if (queueIndex !== -1) {
        state[queueIndex] = queue;
      } else {
        newQueues.push(queue);
      }
    });

    return [...state, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    const queueIndex = state.findIndex(u => u.id === queue.id);

    if (queueIndex !== -1) {
      state[queueIndex] = queue;
      return [...state];
    } else {
      return [queue, ...state];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    const queueIndex = state.findIndex(q => q.id === queueId);
    if (queueIndex !== -1) {
      state.splice(queueIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Queues = () => {
  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const socket = openSocket();

    socket.on("queue", data => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = queue => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async queueId => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("queues.confirmationModal.success"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
    setConfirmModalOpen(false);
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${
            selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QueueModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
      />

      {/* Mobile title */}
      <div className="md:hidden px-4 py-2">
        <Title className="text-center">{i18n.t("queues.title")}</Title>
      </div>

      <MainHeader>
        {/* Desktop title */}
        <div className="hidden md:block">
          <Title>{i18n.t("queues.title")}</Title>
        </div>

        <MainHeaderButtonsWrapper>
          {/* Add Queue Button */}
          <button
            onClick={handleOpenQueueModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all duration-200"
            title={i18n.t("queues.buttons.add")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("queues.buttons.add")}
            </span>
          </button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      {/* Queue Table */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700">
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                {/* Name column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("queues.table.name")}
                </th>
                {/* Color column - hidden on mobile */}
                <th className="hidden md:table-cell px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  {i18n.t("queues.table.color")}
                </th>
                {/* Greeting column - hidden on mobile */}
                <th className="hidden lg:table-cell px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {i18n.t("queues.table.greeting")}
                </th>
                {/* Actions column */}
                <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  {i18n.t("queues.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
              {queues.map(queue => (
                <tr
                  key={queue.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {/* Name with queue info on mobile */}
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: queue.color }}
                      >
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {queue.name}
                        </div>
                        {/* Mobile info */}
                        <div className="md:hidden space-y-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                            <Palette className="h-3 w-3 flex-shrink-0" />
                            <div
                              className="w-4 h-3 rounded"
                              style={{ backgroundColor: queue.color }}
                            />
                            <span className="text-xs text-gray-500">
                              {queue.color}
                            </span>
                          </div>
                          {queue.greetingMessage && (
                            <div className="flex items-start gap-1 text-xs text-gray-600 dark:text-gray-400">
                              <MessageSquare className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span className="truncate max-w-[180px]">
                                {queue.greetingMessage}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Color - hidden on mobile */}
                  <td className="hidden md:table-cell px-4 py-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-8 h-4 rounded"
                        style={{ backgroundColor: queue.color }}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {queue.color}
                      </span>
                    </div>
                  </td>

                  {/* Greeting - hidden on mobile and tablet */}
                  <td className="hidden lg:table-cell px-4 py-1">
                    <div
                      className="text-sm text-gray-600 dark:text-gray-300 max-w-[300px] truncate"
                      title={queue.greetingMessage}
                    >
                      {queue.greetingMessage || "-"}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditQueue(queue)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title={i18n.t("common.edit")}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setSelectedQueue(queue);
                          setConfirmModalOpen(true);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title={i18n.t("common.delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </tbody>
          </table>
        </div>
      </div>
    </MainContainer>
  );
};

export default Queues;
