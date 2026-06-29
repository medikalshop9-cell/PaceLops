const API_BASE_URL = 'http://localhost:5000/api/customer/dashboard';

export const dashboardService = {
  getStats: async (userId) => {
    // We send userId or a token, but here we just pass it to the hypothetical backend
    const response = await fetch(`${API_BASE_URL}/stats?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  },

  getRecentActivities: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/activities?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent activities');
    }

    return response.json();
  }
};
