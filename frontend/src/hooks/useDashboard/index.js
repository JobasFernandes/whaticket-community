import { useState, useEffect } from "react";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useDashboard = ({ period = "today", startDate, endDate } = {}) => {
  const [dashboardData, setDashboardData] = useState({
    tickets: {
      open: 0,
      pending: 0,
      closed: 0,
      total: 0
    },
    userStats: [],
    chartData: [],
    periodInfo: {
      period: "today",
      startDate: "",
      endDate: ""
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        params.append("period", period);

        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const { data } = await api.get(`/dashboard?${params.toString()}`);
        setDashboardData(data);
      } catch (err) {
        toastError(err);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [period, startDate, endDate]);

  return {
    dashboardData,
    loading,
    refetch: () => {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);

          const params = new URLSearchParams();
          params.append("period", period);

          if (startDate) params.append("startDate", startDate);
          if (endDate) params.append("endDate", endDate);

          const { data } = await api.get(`/dashboard?${params.toString()}`);
          setDashboardData(data);
        } catch (err) {
          toastError(err);
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  };
};

export default useDashboard;
