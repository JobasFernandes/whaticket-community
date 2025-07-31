import { useContext, useState } from "react";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  Activity,
  Calendar,
  CalendarRange,
  CalendarDays,
  Users,
  ChevronDown
} from "lucide-react";

import useDashboard from "../../hooks/useDashboard";
import { i18n } from "../../translate/i18n";
import Chart from "./Chart";

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const { dashboardData, loading } = useDashboard({
    period: selectedPeriod
  });

  const { tickets, userStats = [] } = dashboardData;

  const periodOptions = [
    {
      key: "lastMonth",
      label: i18n.t("dashboard.periods.lastMonth"),
      icon: CalendarRange
    },
    {
      key: "lastWeek",
      label: i18n.t("dashboard.periods.lastWeek"),
      icon: CalendarDays
    },
    {
      key: "yesterday",
      label: i18n.t("dashboard.periods.yesterday"),
      icon: Calendar
    },
    {
      key: "today",
      label: i18n.t("dashboard.periods.today"),
      icon: Calendar
    },
    {
      key: "week",
      label: i18n.t("dashboard.periods.week"),
      icon: CalendarDays
    },
    {
      key: "month",
      label: i18n.t("dashboard.periods.month"),
      icon: CalendarRange
    },
    {
      key: "all",
      label: i18n.t("dashboard.periods.all"),
      icon: Activity
    }
  ];

  const statsCards = [
    {
      title: i18n.t("dashboard.messages.inAttendance.title"),
      value: tickets.open,
      icon: MessageCircle,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: i18n.t("dashboard.messages.waiting.title"),
      value: tickets.pending,
      icon: Clock,
      color: "bg-amber-500",
      lightColor: "bg-amber-50 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      title: i18n.t("dashboard.messages.closed.title"),
      value: tickets.closed,
      icon: CheckCircle,
      color: "bg-green-500",
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      title: i18n.t("dashboard.messages.total.title"),
      value: tickets.total,
      icon: Activity,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600 dark:text-gray-400">
            {i18n.t("dashboard.loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#121212] overflow-y-auto">
      {/* Custom Scrollbar */}
      <style>{scrollbarStyles}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {i18n.t("dashboard.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {i18n.t("dashboard.subtitle")}
          </p>
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2c2c2c]"
          >
            {periodOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>

              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${stat.color} transition-all duration-500`}
                  style={{
                    width:
                      tickets.total > 0
                        ? `${(stat.value / tickets.total) * 100}%`
                        : "0%"
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 pb-3">
        <div className="xl:col-span-6 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 pt-6 pl-6 pr-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {i18n.t("dashboard.charts.ticketsByHour.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {i18n.t("dashboard.charts.ticketsByHour.subtitle")}
              </p>
            </div>
          </div>
          <div className="h-52">
            <Chart data={dashboardData.chartData} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="xl:col-span-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {i18n.t("dashboard.quickStats.title")}
            </h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i18n.t("dashboard.quickStats.resolutionRate")}
                </span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                {tickets.total > 0
                  ? Math.round((tickets.closed / tickets.total) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i18n.t("dashboard.quickStats.inService")}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {tickets.total > 0
                  ? Math.round((tickets.open / tickets.total) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {i18n.t("dashboard.quickStats.waiting")}
                </span>
              </div>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {tickets.total > 0
                  ? Math.round((tickets.pending / tickets.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="xl:col-span-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {i18n.t("dashboard.userStats.title")}
            </h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="space-y-1 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
            {userStats.length > 0 ? (
              userStats.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-0.5 px-2 rounded-md bg-gray-50 dark:bg-[#2c2c2c] hover:bg-gray-100 dark:hover:bg-[#3d3d3d] transition-colors duration-150"
                >
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.openTickets}{" "}
                        {i18n.t("dashboard.userStats.opened")} /{" "}
                        {user.closedTickets}{" "}
                        {i18n.t("dashboard.userStats.closed")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {user.ticketsCount}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {i18n.t("dashboard.userStats.tickets")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {i18n.t("dashboard.userStats.noData")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
