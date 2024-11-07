// src/pages/ExternalApiPage.tsx

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Pagination,
} from "@mui/material";
import axios from "axios";
import CardModal from "../components/CardModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addCard, updateCard, ICard } from "../store/cardsSlice";

interface ApiCard {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
}

const ExternalApiPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchExternalCards = async () => {
      try {
        const response = await axios.get<ApiCard[]>(
          `https://picsum.photos/v2/list?page=${page}&limit=${itemsPerPage}`
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
  }, [page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSaveToDatabase = (card: ICard) => {
    if (card.id) {
      // Если у карточки есть ID, значит, она уже есть в базе и нужно выполнить обновление
      dispatch(updateCard(card));
    } else {
      // Если ID нет, значит, карточка новая и нужно выполнить добавление
      dispatch(addCard(card));
    }
  };

  const handleCloseModal = () => setSelectedCard(null);

  const renderCard = (card: ApiCard) => (
    <Card
      key={card.id}
      sx={{
        maxWidth: 345,
        m: 2,
        border: "1px solid #ddd",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
      onClick={() =>
        setSelectedCard({
          id: undefined,
          title: "",
          description: "",
          url: card.download_url,
          downloadUrl: card.download_url,
          author: card.author,
          width: card.width,
          height: card.height,
          createdAt: new Date().toISOString(),
        })
      }
    >
      <CardMedia
        component="img"
        height="140"
        image={card.download_url || "https://via.placeholder.com/150"}
        alt={card.author}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {card.author}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Width: {card.width} Height: {card.height}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {cards.length > 0 ? (
          cards.map(renderCard)
        ) : (
          <Typography>No data available from external API.</Typography>
        )}
      </Box>
      <Pagination
        count={10} // Замените на реальное количество страниц из внешнего API, если доступно
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={handleCloseModal}
          onSaveToDatabase={handleSaveToDatabase}
        />
      )}
    </Box>
  );
};

export default ExternalApiPage;
