import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface ApiCard {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
}

const TablePage: React.FC = () => {
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
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {cards.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell align="right">Width</TableCell>
              <TableCell align="right">Height</TableCell>
              <TableCell align="right">Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell>{card.author}</TableCell>
                <TableCell align="right">{card.width}</TableCell>
                <TableCell align="right">{card.height}</TableCell>
                <TableCell align="right">
                  <img
                    src={card.download_url}
                    alt={card.author}
                    style={{ width: 50, height: 50 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No data available for the table.</p>
      )}
    </TableContainer>
  );
};

export default TablePage;
