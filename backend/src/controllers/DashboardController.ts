import { Request, Response } from "express";

import GetDashboardMetricsService from "../services/DashboardServices/GetDashboardMetricsService";

interface IndexQuery {
  period?:
    | "today"
    | "yesterday"
    | "week"
    | "month"
    | "lastWeek"
    | "lastMonth"
    | "all";
  startDate?: string;
  endDate?: string;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    period = "today",
    startDate,
    endDate
  } = req.query as Partial<IndexQuery>;

  try {
    const metrics = await GetDashboardMetricsService({
      userId: req.user.id,
      period,
      startDate,
      endDate,
      showAllUsers: true
    });

    return res.json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
