import React from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const TopSellingProducts = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/analytics/top-selling-products`)
      .then((res) => {
        const products = res.data;
        const labels = products.map((item) => item.productName);
        const quantities = products.map((item) => item.totalQuantity);

        setChartData({
          labels,
          datasets: [
            {
              label: "Units Sold",
              data: quantities,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderRadius: 6,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching top selling products:", error);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading chart...</p>;
  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>Top Selling Products</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: { display: true, text: "Top Selling Products by Quantity" },
          },
        }}
      />
    </div>
  );
};

export default TopSellingProducts;
