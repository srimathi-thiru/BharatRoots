// Mock API for user orders (temporary)

export const getUserOrders = async (userId) => {
  // You can use userId later for real backend filtering

  return [
    {
      id: 101,
      status: "Delivered",
      amount: 1200,
      date: "2026-03-10",
    },
    {
      id: 102,
      status: "Pending",
      amount: 800,
      date: "2026-03-15",
    },
    {
      id: 103,
      status: "Shipped",
      amount: 500,
      date: "2026-03-18",
    },
  ];
};