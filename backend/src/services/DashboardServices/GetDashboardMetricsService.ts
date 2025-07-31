import { Op } from "sequelize";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  subDays,
  parseISO,
  startOfHour,
  format
} from "date-fns";

import Ticket from "../../models/Ticket";
import User from "../../models/User";

interface Request {
  userId: string;
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
  showAllUsers?: boolean;
}

interface DashboardMetrics {
  tickets: {
    open: number;
    pending: number;
    closed: number;
    total: number;
  };
  userStats: Array<{
    id: number;
    name: string;
    ticketsCount: number;
    openTickets: number;
    closedTickets: number;
  }>;
  chartData: Array<{
    time: string;
    amount: number;
  }>;
  periodInfo: {
    period: string;
    startDate: string;
    endDate: string;
  };
}

const GetDashboardMetricsService = async ({
  userId,
  period = "today",
  startDate,
  endDate,
  showAllUsers = false
}: Request): Promise<DashboardMetrics> => {
  const user = await User.findByPk(userId, {
    include: ["queues"]
  });

  if (!user) {
    throw new Error("User not found");
  }

  const userQueueIds = user.queues?.map(queue => queue.id) || [];

  let dateStart: Date;
  let dateEnd: Date;
  const now = new Date();

  if (startDate && endDate) {
    dateStart = parseISO(startDate);
    dateEnd = parseISO(endDate);
  } else {
    switch (period) {
      case "yesterday": {
        const yesterday = subDays(now, 1);
        dateStart = startOfDay(yesterday);
        dateEnd = endOfDay(yesterday);
        break;
      }
      case "week":
        dateStart = startOfWeek(now);
        dateEnd = endOfWeek(now);
        break;
      case "lastWeek": {
        const lastWeek = subWeeks(now, 1);
        dateStart = startOfWeek(lastWeek);
        dateEnd = endOfWeek(lastWeek);
        break;
      }
      case "month":
        dateStart = startOfMonth(now);
        dateEnd = endOfMonth(now);
        break;
      case "lastMonth": {
        const lastMonth = subMonths(now, 1);
        dateStart = startOfMonth(lastMonth);
        dateEnd = endOfMonth(lastMonth);
        break;
      }
      case "all":
        dateStart = new Date(2020, 0, 1);
        dateEnd = now;
        break;
      case "today":
      default:
        dateStart = startOfDay(now);
        dateEnd = endOfDay(now);
        break;
    }
  }

  const whereCondition: {
    createdAt: {
      [Op.between]: [Date, Date];
    };
    queueId?: {
      [Op.in]: number[];
    };
  } = {
    createdAt: {
      [Op.between]: [dateStart, dateEnd]
    }
  };

  if (!showAllUsers && userQueueIds.length > 0 && user.profile !== "admin") {
    whereCondition.queueId = {
      [Op.in]: userQueueIds
    };
  }

  // Get ticket counts by status
  const [openCount, pendingCount, closedCount] = await Promise.all([
    Ticket.count({
      where: {
        ...whereCondition,
        status: "open"
      }
    }),
    Ticket.count({
      where: {
        ...whereCondition,
        status: "pending"
      }
    }),
    Ticket.count({
      where: {
        ...whereCondition,
        status: "closed"
      }
    })
  ]);

  const totalCount = openCount + pendingCount + closedCount;

  // Get user statistics
  const userStats = await Ticket.findAll({
    where: whereCondition,
    attributes: ["userId", "status"],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"]
      }
    ]
  });

  // Process user statistics
  const userStatsMap = new Map();

  userStats.forEach(ticket => {
    if (ticket.user) {
      const userTicketId = ticket.user.id;
      const userName = ticket.user.name;

      if (!userStatsMap.has(userTicketId)) {
        userStatsMap.set(userTicketId, {
          id: userTicketId,
          name: userName,
          ticketsCount: 0,
          openTickets: 0,
          closedTickets: 0
        });
      }

      const userStat = userStatsMap.get(userTicketId);
      userStat.ticketsCount += 1;

      if (ticket.status === "open") {
        userStat.openTickets += 1;
      } else if (ticket.status === "closed") {
        userStat.closedTickets += 1;
      }
    }
  });

  const processedUserStats = Array.from(userStatsMap.values())
    .sort((a, b) => b.ticketsCount - a.ticketsCount)
    .slice(0, 10);

  // Get tickets for chart data
  const tickets = await Ticket.findAll({
    where: whereCondition,
    attributes: ["createdAt"],
    order: [["createdAt", "ASC"]]
  });

  // Generate chart data (hourly distribution)
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: `${(i + 8).toString().padStart(2, "0")}:00`,
    amount: 0
  }));

  // Count tickets by hour
  tickets.forEach(ticket => {
    const hourFormatted = format(startOfHour(ticket.createdAt), "HH:mm");
    const chartItem = chartData.find(item => item.time === hourFormatted);
    if (chartItem) {
      chartItem.amount += 1;
    }
  });

  return {
    tickets: {
      open: openCount,
      pending: pendingCount,
      closed: closedCount,
      total: totalCount
    },
    userStats: processedUserStats,
    chartData,
    periodInfo: {
      period: period || "today",
      startDate: dateStart.toISOString(),
      endDate: dateEnd.toISOString()
    }
  };
};

export default GetDashboardMetricsService;
