import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/StockOverview.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const categoryColors = {
  "Power Tools": ["#4CAF50", "#81C784"],
  "Nailers & Staplers": ["#2196F3", "#64B5F6"],
  "Measuring Tools": ["#FF9800", "#FFB74D"],
  "Clamps & Vises": ["#9C27B0", "#BA68C8"],
};

const categories = [
  "Power Tools",
  "Nailers & Staplers",
  "Measuring Tools",
  "Clamps & Vises",
];
const StockOverview = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = async (category) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/analytics/stock-overview`,
        { category }
      );
      const data = res.data;
      const [availableColor, reorderColor] = categoryColors[category] || [
        "#333",
        "#999",
      ];

      setChartData({
        labels: data.map((item) =>
          item.availableStock === 0
            ? `${item.productName} ⚠️`
            : item.productName
        ),
        datasets: [
          {
            label: "Available Stock",
            data: data.map((item) => item.availableStock),
            backgroundColor: availableColor,
          },
          {
            label: "Reorder Level",
            data: data.map((item) => item.reorderLevel),
            backgroundColor: reorderColor,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchData(category);
  };
  return (
    <div className="stock-chart-container">
      <h2 className="chart-title">Stock Level Overview</h2>

      <div className="category-button-group">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Top Products in ${selectedCategory}`,
              },
            },
          }}
        />
      ) : (
        <p className="chart-placeholder">
          Please select a category to view stock data.
        </p>
      )}
    </div>
  );
};

export default StockOverview;
