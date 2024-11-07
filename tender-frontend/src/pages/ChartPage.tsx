import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface ApiCard {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
}

const ChartPage: React.FC = () => {
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExternalCards = async () => {
      try {
        const response = await axios.get<ApiCard[]>(
          "https://picsum.photos/v2/list"
        );
        setCards(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load data from external API.");
      } finally {
        setLoading(false);
      }
    };

    fetchExternalCards();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {cards.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={cards}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="width"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="height" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for the chart.</p>
      )}
    </div>
  );
};

export default ChartPage;
