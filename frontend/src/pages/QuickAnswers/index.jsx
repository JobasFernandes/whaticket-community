import { useState, useEffect, useReducer } from "react";
import openSocket from "../../services/socket-io.js";
import { toast } from "react-toastify";
import { Search, Edit, Trash2, Plus, MessageSquare } from "lucide-react";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import QuickAnswersModal from "../../components/QuickAnswersModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError.js";

const reducer = (state, action) => {
  if (action.type === "LOAD_QUICK_ANSWERS") {
    const quickAnswers = action.payload;
    const newQuickAnswers = [];

    quickAnswers.forEach(quickAnswer => {
      const quickAnswerIndex = state.findIndex(q => q.id === quickAnswer.id);
      if (quickAnswerIndex !== -1) {
        state[quickAnswerIndex] = quickAnswer;
      } else {
        newQuickAnswers.push(quickAnswer);
      }
    });

    return [...state, ...newQuickAnswers];
  }

  if (action.type === "UPDATE_QUICK_ANSWERS") {
    const quickAnswer = action.payload;
    const quickAnswerIndex = state.findIndex(q => q.id === quickAnswer.id);

    if (quickAnswerIndex !== -1) {
      state[quickAnswerIndex] = quickAnswer;
      return [...state];
    } else {
      return [quickAnswer, ...state];
    }
  }

  if (action.type === "DELETE_QUICK_ANSWERS") {
    const quickAnswerId = action.payload;

    const quickAnswerIndex = state.findIndex(q => q.id === quickAnswerId);
    if (quickAnswerIndex !== -1) {
      state.splice(quickAnswerIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const QuickAnswers = () => {
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [quickAnswers, dispatch] = useReducer(reducer, []);
  const [selectedQuickAnswers, setSelectedQuickAnswers] = useState(null);
  const [quickAnswersModalOpen, setQuickAnswersModalOpen] = useState(false);
  const [deletingQuickAnswers, setDeletingQuickAnswers] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchQuickAnswers = async () => {
        try {
          const { data } = await api.get("/quickAnswers/", {
            params: { searchParam, pageNumber }
          });
          dispatch({ type: "LOAD_QUICK_ANSWERS", payload: data.quickAnswers });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchQuickAnswers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const socket = openSocket();

    socket.on("quickAnswer", data => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICK_ANSWERS", payload: data.quickAnswer });
      }

      if (data.action === "delete") {
        dispatch({
          type: "DELETE_QUICK_ANSWERS",
          payload: +data.quickAnswerId
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSearch = event => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleOpenQuickAnswersModal = () => {
    setSelectedQuickAnswers(null);
    setQuickAnswersModalOpen(true);
  };

  const handleCloseQuickAnswersModal = () => {
    setSelectedQuickAnswers(null);
    setQuickAnswersModalOpen(false);
  };

  const handleEditQuickAnswers = quickAnswer => {
    setSelectedQuickAnswers(quickAnswer);
    setQuickAnswersModalOpen(true);
  };

  const handleDeleteQuickAnswers = async quickAnswerId => {
    try {
      await api.delete(`/quickAnswers/${quickAnswerId}`);
      toast.success(i18n.t("quickAnswers.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingQuickAnswers(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber(prevState => prevState + 1);
  };

  const handleScroll = e => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingQuickAnswers &&
          `${i18n.t("quickAnswers.confirmationModal.deleteTitle")} ${
            deletingQuickAnswers.shortcut
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteQuickAnswers(deletingQuickAnswers.id)}
      >
        {i18n.t("quickAnswers.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QuickAnswersModal
        open={quickAnswersModalOpen}
        onClose={handleCloseQuickAnswersModal}
        aria-labelledby="form-dialog-title"
        quickAnswerId={selectedQuickAnswers && selectedQuickAnswers.id}
      />

      {/* Title for mobile - outside header */}
      <div className="md:hidden px-4 py-2">
        <Title className="text-center">{i18n.t("quickAnswers.title")}</Title>
      </div>

      <MainHeader>
        {/* Title for desktop - inside header */}
        <div className="hidden md:block">
          <Title>{i18n.t("quickAnswers.title")}</Title>
        </div>

        <MainHeaderButtonsWrapper>
          {/* Search Input */}
          <div className="relative flex-1 md:flex-none md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder={i18n.t("quickAnswers.searchPlaceholder")}
              value={searchParam}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-all duration-200"
            />
          </div>

          {/* Add Quick Answer Button */}
          <button
            onClick={handleOpenQuickAnswersModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all duration-200 md:px-4 sm:px-3 sm:w-auto"
            title={i18n.t("quickAnswers.buttons.add")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">
              {i18n.t("quickAnswers.buttons.add")}
            </span>
          </button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      {/* Quick Answers Table */}
      <div
        className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700"
        onScroll={handleScroll}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50 sticky top-0">
              <tr>
                {/* Shortcut column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  {i18n.t("quickAnswers.table.shortcut")}
                </th>
                {/* Message column */}
                <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider max-w-0 w-full">
                  {i18n.t("quickAnswers.table.message")}
                </th>
                {/* Actions column */}
                <th className="px-4 py-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-24">
                  {i18n.t("quickAnswers.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1e1e1e] divide-y divide-gray-200 dark:divide-gray-700">
              {quickAnswers.map(quickAnswer => (
                <tr
                  key={quickAnswer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  {/* Shortcut */}
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {quickAnswer.shortcut}
                      </span>
                    </div>
                  </td>
                  {/* Message */}
                  <td className="px-4 py-1 max-w-0 w-full">
                    <div
                      className="text-sm text-gray-600 dark:text-gray-300 truncate"
                      title={quickAnswer.message}
                    >
                      {quickAnswer.message}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-center gap-1">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditQuickAnswers(quickAnswer)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        title={i18n.t("quickAnswers.tooltips.editQuickAnswer")}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setConfirmModalOpen(true);
                          setDeletingQuickAnswers(quickAnswer);
                        }}
                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        title={i18n.t(
                          "quickAnswers.tooltips.deleteQuickAnswer"
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && <TableRowSkeleton columns={3} />}
            </tbody>
          </table>
        </div>
      </div>
    </MainContainer>
  );
};

export default QuickAnswers;
