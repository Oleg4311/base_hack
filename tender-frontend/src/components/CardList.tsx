// src/components/CardList.tsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Pagination,
} from "@mui/material";
import CardModal from "./CardModal";
import { fetchCards, ICard, setPage, deleteCard } from "../store/cardsSlice";

const CardList: React.FC = () => {
  const { cards, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.card
  );
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

  useEffect(() => {
    dispatch(fetchCards(page));
  }, [dispatch, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteCard(id));
    setSelectedCard(null);
  };

  const handleCloseModal = () => setSelectedCard(null);

  const renderCard = (card: ICard) => (
    <Card
      key={card.id}
      sx={{
        maxWidth: 345,
        m: 2,
        border: "1px solid #ddd",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
      onClick={() => setSelectedCard(card)}
    >
      <CardMedia
        component="img"
        height="140"
        image={card.url || "https://via.placeholder.com/150"}
        alt={card.author || "Unknown"}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {card.author || "Unknown Author"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.description || "No description available."}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(card.id!);
          }}
        >
          Удалить
        </Button>
      </CardActions>
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
          <Card
            sx={{
              maxWidth: 345,
              m: 2,
              border: "1px solid #ddd",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography>No cards available in the database.</Typography>
            </CardContent>
          </Card>
        )}
      </Box>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2 }}
      />
      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={handleCloseModal}
          onDelete={() => handleDelete(selectedCard.id!)}
        />
      )}
    </Box>
  );
};

export default CardList;
