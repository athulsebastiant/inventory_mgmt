import React, { useState, useEffect } from "react";
import axios from "axios";
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
const ClientEngagement = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/analytics/client-engagement`
        );
        const labels = data.map((entry) => entry.clientName);
        const values = data.map((entry) => entry.quotationCount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Quotations per Client",
              data: values,
              backgroundColor: "rgba(54,162,235,0.6)",
            },
          ],
        });
      } catch (error) {
        console.log("Failed to fetch client engagement data:", error);
      }
    };
    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2>Client Engagement - Quotations per Client</h2>
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
              text: "Client Engagement - Quotations per Client",
            },
          },
        }}
      />
    </div>
  );
};

export default ClientEngagement;
