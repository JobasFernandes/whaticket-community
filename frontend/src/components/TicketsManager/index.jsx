import { useContext, useEffect, useRef, useState } from "react";
import {
  Search,
  Inbox,
  CheckSquare,
  Plus,
  Loader2,
  Filter
} from "lucide-react";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsList";
import TabPanel from "../TabPanel";
import { i18n } from "../../translate/i18n.js";
import { AuthContext } from "../../context/Auth/context";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";

const TicketsManager = () => {
  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const searchInputRef = useRef();
  const { user, loading } = useContext(AuthContext);
  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const userQueueIds = user?.queues?.map(q => q.id) || [];
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds);
  const userQueues = user?.queues;
  const userProfile = user?.profile;

  useEffect(() => {
    if (userProfile?.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userQueues) {
      const newUserQueueIds = userQueues.map(q => q.id);
      setSelectedQueueIds(newUserQueueIds);
    }
  }, [userQueues]);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
      setSearchParam("");
    }
  }, [tab]);

  let searchTimeout;

  const handleSearch = e => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = newValue => {
    setTab(newValue);
  };

  const handleChangeTabOpen = newValue => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = status => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  // Don't render if user is not loaded yet
  if (loading || !user || !user.id) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] bg-white dark:bg-[#1e1e1e]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full rounded-l-lg rounded-br-lg md:rounded-br-none overflow-hidden bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700">
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={() => setNewTicketModalOpen(false)}
      />

      {/* Main Tabs Header */}
      <div className="flex-none bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {[
            {
              value: "open",
              icon: Inbox,
              label: i18n.t("tickets.tabs.open.title")
            },
            {
              value: "closed",
              icon: CheckSquare,
              label: i18n.t("tickets.tabs.closed.title")
            },
            {
              value: "search",
              icon: Search,
              label: i18n.t("tickets.tabs.search.title")
            }
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleChangeTab(value)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors border-b-2 min-h-[60px] ${
                tab === value
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-600 dark:text-gray-400 border-transparent hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Options Bar */}
      <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        {tab === "search" ? (
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="search"
              placeholder={i18n.t("tickets.search.placeholder")}
              onChange={handleSearch}
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewTicketModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{i18n.t("ticketsManager.buttons.newTicket")}</span>
              </button>

              <Can
                role={userProfile}
                perform="tickets-manager:showall"
                yes={() => (
                  <label className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAllTickets}
                      onChange={() =>
                        setShowAllTickets(prevState => !prevState)
                      }
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="font-medium">
                      {i18n.t("tickets.buttons.showAll")}
                    </span>
                  </label>
                )}
              />
            </div>
          </>
        )}

        <div className="flex-shrink-0">
          <TicketsQueueSelect
            selectedQueueIds={selectedQueueIds}
            userQueues={userQueues}
            onChange={setSelectedQueueIds}
          />
        </div>
      </div>

      {/* Tab Panels */}
      <TabPanel
        value={tab}
        name="open"
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Sub-tabs for Open */}
        <div className="flex bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          {[
            {
              value: "open",
              label: i18n.t("ticketsList.assignedHeader"),
              count: openCount,
              color: "blue"
            },
            {
              value: "pending",
              label: i18n.t("ticketsList.pendingHeader"),
              count: pendingCount,
              color: "orange"
            }
          ].map(({ value, label, count, color }) => (
            <button
              key={value}
              onClick={() => handleChangeTabOpen(value)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                tabOpen === value
                  ? `text-${color}-600 dark:text-${color}-400 bg-white dark:bg-[#1e1e1e] border-b-2 border-${color}-600 dark:border-${color}-400`
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div
            className={`absolute inset-0 ${tabOpen === "open" ? "block" : "hidden"}`}
          >
            <TicketsList
              status="open"
              showAll={showAllTickets}
              selectedQueueIds={selectedQueueIds}
              updateCount={setOpenCount}
            />
          </div>
          <div
            className={`absolute inset-0 ${tabOpen === "pending" ? "block" : "hidden"}`}
          >
            <TicketsList
              status="pending"
              selectedQueueIds={selectedQueueIds}
              updateCount={setPendingCount}
            />
          </div>
        </div>
      </TabPanel>

      <TabPanel value={tab} name="closed" className="flex-1 overflow-hidden">
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>

      <TabPanel value={tab} name="search" className="flex-1 overflow-hidden">
        <TicketsList
          searchParam={searchParam}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
    </div>
  );
};

export default TicketsManager;
