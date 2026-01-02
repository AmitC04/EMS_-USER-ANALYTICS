const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get overview analytics (today's metrics)
 * Updated to match Word document schema (v1.1)
 */
async function getOverview(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Visitors today (unique sessions)
    const visitorsToday = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Logged-in users today
    const loggedInUsersToday = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: today,
          lt: tomorrow,
        },
        is_guest: false,
      },
    });

    // Active users now (sessions active in last 5 minutes, not logged out)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeUsersNow = await prisma.user_sessions.count({
      where: {
        logout_time: null, // Not logged out
        last_seen_at: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Revenue today (from payment_success events - use amount column)
    const revenueEvents = await prisma.user_activity.findMany({
      where: {
        event_type: 'payment_success',
        event_time: {
          gte: today,
          lt: tomorrow,
        },
        amount: {
          not: null,
        },
      },
      select: {
        amount: true,
        currency: true,
      },
    });

    let revenueToday = 0;
    revenueEvents.forEach((event) => {
      if (event.amount) {
        // Convert to number (Prisma Decimal type)
        const amount = typeof event.amount === 'object' ? parseFloat(event.amount.toString()) : parseFloat(event.amount);
        revenueToday += amount || 0;
      }
    });

    // Orders today (payment_success events)
    const ordersToday = await prisma.user_activity.count({
      where: {
        event_type: 'payment_success',
        event_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Refunds today (payment_failed events - adjust if you have a refund event type)
    const refundsToday = await prisma.user_activity.count({
      where: {
        event_type: 'payment_failed',
        event_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    res.json({
      success: true,
      data: {
        visitors_today: visitorsToday,
        logged_in_users_today: loggedInUsersToday,
        active_users_now: activeUsersNow,
        revenue_today: revenueToday,
        orders_today: ordersToday,
        refunds_today: refundsToday,
      },
    });
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview analytics',
      message: error.message,
    });
  }
}

/**
 * Get conversion funnel data
 * Updated to match Word document schema (v1.1)
 */
async function getFunnel(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Visitors (all sessions)
    const visitors = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Registered users (sessions with user_id)
    const registered = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: start,
          lte: end,
        },
        is_guest: false,
      },
    });

    // Added to cart
    const addedToCart = await prisma.user_activity.count({
      where: {
        event_type: 'add_to_cart',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Checkout started
    const checkoutStarted = await prisma.user_activity.count({
      where: {
        event_type: 'checkout_started',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Payment success
    const paymentSuccess = await prisma.user_activity.count({
      where: {
        event_type: 'payment_success',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Calculate drop-off rates
    const calculateDropOff = (current, previous) => {
      if (previous === 0) return 0;
      return Math.round(((previous - current) / previous) * 100);
    };

    const funnel = [
      {
        step: 'Visitors',
        count: visitors,
        dropOff: 0,
      },
      {
        step: 'Registered Users',
        count: registered,
        dropOff: calculateDropOff(registered, visitors),
      },
      {
        step: 'Added to Cart',
        count: addedToCart,
        dropOff: calculateDropOff(addedToCart, registered),
      },
      {
        step: 'Checkout Started',
        count: checkoutStarted,
        dropOff: calculateDropOff(checkoutStarted, addedToCart),
      },
      {
        step: 'Payment Success',
        count: paymentSuccess,
        dropOff: calculateDropOff(paymentSuccess, checkoutStarted),
      },
    ];

    // Overall conversion rate
    const overallConversion = visitors > 0 ? ((paymentSuccess / visitors) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        funnel,
        overall_conversion: parseFloat(overallConversion),
        period: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch funnel data',
      message: error.message,
    });
  }
}

/**
 * Get user analytics
 * Updated to match Word document schema (v1.1)
 */
async function getUserAnalytics(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Default: last 7 days
    const end = endDate ? new Date(endDate) : new Date();

    // Group by date
    const dateMap = new Map();

    // Logins per day
    const logins = await prisma.user_activity.findMany({
      where: {
        event_type: 'login_success',
        event_time: {
          gte: start,
          lte: end,
        },
      },
      select: {
        event_time: true,
      },
    });

    logins.forEach((login) => {
      const date = login.event_time.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).logins++;
    });

    // Registrations per day
    const registrations = await prisma.user_activity.findMany({
      where: {
        event_type: {
          in: ['register_email', 'register_google'],
        },
        event_time: {
          gte: start,
          lte: end,
        },
      },
      select: {
        event_time: true,
        event_type: true,
      },
    });

    registrations.forEach((reg) => {
      const date = reg.event_time.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).registrations++;
    });

    // Password changes per day (from user_audit_log)
    const passwordChanges = await prisma.user_audit_log.findMany({
      where: {
        action_type: 'password_changed',
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        created_at: true,
      },
    });

    passwordChanges.forEach((change) => {
      const date = change.created_at.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).password_changes++;
    });

    // Convert to array and sort by date
    const dailyStats = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Guest vs Registered split
    const guestCount = await prisma.user_activity.count({
      where: {
        event_time: {
          gte: start,
          lte: end,
        },
        is_guest: true,
      },
    });

    const registeredCount = await prisma.user_activity.count({
      where: {
        event_time: {
          gte: start,
          lte: end,
        },
        is_guest: false,
      },
    });

    res.json({
      success: true,
      data: {
        daily_stats: dailyStats,
        guest_vs_registered: {
          guest: guestCount,
          registered: registeredCount,
          total: guestCount + registeredCount,
        },
        period: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
      message: error.message,
    });
  }
}

/**
 * Get revenue trend (last N months)
 * Updated to match Word document schema (v1.1)
 */
async function getRevenueTrend(req, res) {
  try {
    const { months = 5 } = req.query;
    const monthsArray = [];
    const now = new Date();

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArray.push({
        month: date.toLocaleString('default', { month: 'short' }),
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    const revenueData = await Promise.all(
      monthsArray.map(async ({ month, start, end }) => {
        const events = await prisma.user_activity.findMany({
          where: {
            event_type: 'payment_success',
            event_time: {
              gte: start,
              lte: end,
            },
            amount: {
              not: null,
            },
          },
          select: {
            amount: true,
          },
        });

        let revenue = 0;
        events.forEach((event) => {
          if (event.amount) {
            const amount = typeof event.amount === 'object' ? parseFloat(event.amount.toString()) : parseFloat(event.amount);
            revenue += amount || 0;
          }
        });

        return { month, revenue };
      })
    );

    res.json({
      success: true,
      data: revenueData,
    });
  } catch (error) {
    console.error('Error fetching revenue trend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue trend',
      message: error.message,
    });
  }
}

module.exports = {
  getOverview,
  getFunnel,
  getUserAnalytics,
  getRevenueTrend,
};
