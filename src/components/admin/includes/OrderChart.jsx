import React, { useState } from "react";
import { format, parseISO } from "date-fns";

// Example data
const ordersData = [
  { date: "2025-01-01", orders: 100 },
  { date: "2025-01-05", orders: 120 },
  { date: "2025-01-10", orders: 190 },
  { date: "2025-01-15", orders: 130 },
  { date: "2025-01-20", orders: 110 },
  { date: "2025-01-25", orders: 150 },
];

const months = [
  { label: "January 2025", value: "01" },
  { label: "February 2025", value: "02" },
  { label: "March 2025", value: "03" },
];

const OrderChart = () => {
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [hoveredBar, setHoveredBar] = useState(null); // Stores hovered bar data

  // Filter orders for selected month
  const filteredOrders = ordersData.filter((data) =>
    data.date.startsWith(`2025-${selectedMonth}`)
  );

  const maxOrders = Math.max(...filteredOrders.map((data) => data.orders), 1);

  return (
    <div className="bg-ictext p-6 rounded-lg shadow-sm shadow-ictheme w-full overflow-x-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-icbackgroundcard text-lg font-semibold">Orders Delivered</h3>
        <select
          className="bg-icbackgroundcard p-2 rounded-md text-icbackgroundlight"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Total Order Count */}
      <p className="text-3xl font-bold text-icgray mt-2">850</p>
      <p className="text-sm text-ictheme font-semibold">▲ +5.6%</p>

      {/* Bar Chart */}
      <div className="flex items-end h-48 mt-4 space-x-4 overflow-x-auto">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((data) => {
            const barHeight = (data.orders / maxOrders) * 100; // Calculate percentage height
            return (
              <div
                key={data.date}
                className="flex flex-col items-center relative"
                onMouseEnter={() => setHoveredBar(data)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip (shown above bar) */}
                {hoveredBar?.date === data.date && (
                  <div className="absolute -top-10 bg-icbackgroundcard text-icbackgroundlight text-xs px-2 py-1 rounded-md">
                    {format(parseISO(data.date), "EEE dd/MM")}: {data.orders} orders
                  </div>
                )}

                {/* Bar */}
                <div
                  className="bg-ictheme w-10 mb-1 rounded-lg transition-all duration-300"
                  style={{ height: `${barHeight}px` }}
                ></div>

                {/* Date Labels */}
                <span className="text-xs text-icgray mt-2">
                  {format(parseISO(data.date), "EEE dd/MM")}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-icgray text-sm">No data available</p>
        )}
      </div>
    </div>
  );
};

export default OrderChart;
