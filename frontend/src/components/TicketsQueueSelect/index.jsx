import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { i18n } from "../../translate/i18n.js";

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ right: false });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 256;

      const shouldOpenLeft =
        rect.left > 200 || rect.left + dropdownWidth > viewportWidth - 50;

      setDropdownPosition({ right: shouldOpenLeft });
    }
  }, [isOpen]);

  const handleToggleQueue = queueId => {
    const newSelected = selectedQueueIds.includes(queueId)
      ? selectedQueueIds.filter(id => id !== queueId)
      : [...selectedQueueIds, queueId];
    onChange(newSelected);
  };

  const selectedQueues =
    userQueues?.filter(queue => selectedQueueIds.includes(queue.id)) || [];

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center gap-2 px-3 py-2
            border border-gray-300 dark:border-gray-600 
            rounded-lg shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
            transition-all duration-200
            text-sm font-medium min-w-[120px]
          "
        >
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="flex-1 text-left">
            {selectedQueueIds.length > 0
              ? `${selectedQueueIds.length} ${selectedQueueIds.length === 1 ? i18n.t("ticketsQueueSelect.queue") : i18n.t("ticketsQueueSelect.queues")}`
              : i18n.t("ticketsQueueSelect.placeholder")}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute z-50 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto`}
            style={{
              ...(dropdownPosition.right
                ? { right: 0, left: "auto" }
                : { left: 0, right: "auto" })
            }}
          >
            {!userQueues || userQueues.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {i18n.t("ticketsQueueSelect.noQueues")}
              </div>
            ) : (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">
                  {i18n.t("ticketsQueueSelect.filterTitle")}
                </div>
                {userQueues.map(queue => (
                  <label
                    key={queue.id}
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedQueueIds.includes(queue.id)}
                      onChange={() => handleToggleQueue(queue.id)}
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
                      style={{ accentColor: queue.color }}
                    />
                    <span className="ml-3 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: queue.color }}
                      />
                      {queue.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default TicketsQueueSelect;
