import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addCard, ICard, updateCard } from "../store/cardsSlice";
import { AppDispatch } from "../store";
import { Button, TextField, Box } from "@mui/material";

interface CardFormProps {
  initialCard?: ICard;
  onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ initialCard, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialCard?.title || "");
  const [description, setDescription] = useState(
    initialCard?.description || ""
  );
  const [url, seturl] = useState(initialCard?.url || "");
  const [author, setAuthor] = useState(initialCard?.author || "");
  const [width, setWidth] = useState(initialCard?.width || 0);
  const [height, setHeight] = useState(initialCard?.height || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cardData: ICard = {
      id: initialCard?.id,
      title,
      description,
      url,
      downloadUrl: url,
      author,
      width,
      height,
      createdAt: initialCard?.createdAt || new Date().toISOString(),
    };

    if (initialCard && initialCard.id) {
      // Обновление существующей карточки
      dispatch(updateCard({ id: initialCard.id, card: cardData }));
    } else {
      // Добавление новой карточки
      dispatch(addCard(cardData));
    }
    onClose();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "auto",
        p: 3,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
      />
      <TextField
        label="Image URL"
        value={url}
        onChange={(e) => seturl(e.target.value)}
        fullWidth
      />
      <TextField
        label="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
      />
      <TextField
        label="Width"
        type="number"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        fullWidth
      />
      <TextField
        label="Height"
        type="number"
        value={height}
        onChange={(e) => setHeight(Number(e.target.value))}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        {initialCard ? "Update Card" : "Add Card"}
      </Button>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Cancel
      </Button>
    </Box>
  );
};

export default CardForm;
