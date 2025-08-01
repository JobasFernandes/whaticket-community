import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { i18n } from "../../translate/i18n.js";

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleQueue = queueId => {
    const newSelected = selectedQueueIds.includes(queueId)
      ? selectedQueueIds.filter(id => id !== queueId)
      : [...selectedQueueIds, queueId];
    onChange(newSelected);
  };

  const selectedQueues =
    userQueues?.filter(queue => selectedQueueIds.includes(queue.id)) || [];

  return (
    <div className="relative w-32">
      {/* Dropdown Button */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            block w-full pl-7 pr-7 py-1.5 
            border border-gray-300 dark:border-gray-600 
            rounded-md shadow-sm
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-xs text-left
          "
        >
          {i18n.t("ticketsQueueSelect.placeholder")}
        </button>
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
          <ChevronDown
            className={`h-3.5 w-3.5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {!userQueues || userQueues.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                Nenhuma fila disponível
              </div>
            ) : (
              userQueues.map(queue => (
                <label
                  key={queue.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedQueueIds.includes(queue.id)}
                    onChange={() => handleToggleQueue(queue.id)}
                    className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-1"
                    style={{ accentColor: queue.color }}
                  />
                  <span className="ml-2 text-xs text-gray-900 dark:text-white flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: queue.color }}
                    />
                    {queue.name}
                  </span>
                </label>
              ))
            )}
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default TicketsQueueSelect;
