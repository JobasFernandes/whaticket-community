import { useEffect, useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import toastError from "../../errors/toastError.js";
import api from "../../services/api.js";
import { i18n } from "../../translate/i18n.js";

const QueueSelect = ({ selectedQueueIds = [], onChange }) => {
  const [queues, setQueues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const t = (key, fallback) => {
    try {
      const translation = i18n.t(key);
      return translation && translation !== key ? translation : fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  const handleToggleQueue = queueId => {
    const newSelected = selectedQueueIds.includes(queueId)
      ? selectedQueueIds.filter(id => id !== queueId)
      : [...selectedQueueIds, queueId];
    onChange(newSelected);
  };

  const selectedQueues = queues.filter(queue =>
    selectedQueueIds.includes(queue.id)
  );

  return (
    <div className="space-y-1">
      {/* Dropdown */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <Layers className="h-3.5 w-3.5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            block w-full pl-8 pr-8 py-2 
            border border-gray-300 dark:border-gray-600 
            rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            transition-all duration-200
            text-sm text-left
          "
        >
          {selectedQueues.length > 0
            ? `${selectedQueues.length} ${
                selectedQueues.length === 1
                  ? t("queueSelect.selectedSingle", "fila selecionada")
                  : t("queueSelect.selectedPlural", "filas selecionadas")
              }`
            : t("queueSelect.placeholder", "Selecionar filas...")}
        </button>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {queues.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                {t("queueSelect.noQueues", "Nenhuma fila disponível")}
              </div>
            ) : (
              queues.map(queue => (
                <label
                  key={queue.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedQueueIds.includes(queue.id)}
                    onChange={() => handleToggleQueue(queue.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
                    style={{ accentColor: queue.color }}
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
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

export default QueueSelect;
