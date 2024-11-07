// src/components/CardModal.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { ICard } from "../store/cardsSlice";

interface CardModalProps {
  card: ICard;
  onClose: () => void;
  onSaveToDatabase?: (card: ICard) => void;
  onDelete?: () => void;
}

const CardModal: React.FC<CardModalProps> = ({
  card,
  onClose,
  onSaveToDatabase,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<ICard>({ ...card });

  const handleSave = () => {
    if (onSaveToDatabase) {
      onSaveToDatabase(editedCard);
    }
    onClose();
  };

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing
          ? "Редактирование карточки"
          : card.author || "Автор неизвестен"}
      </DialogTitle>
      <DialogContent>
        {isEditing ? (
          <>
            <TextField
              label="Автор"
              fullWidth
              margin="normal"
              value={editedCard.author}
              onChange={(e) =>
                setEditedCard({ ...editedCard, author: e.target.value })
              }
            />
            <TextField
              label="Описание"
              fullWidth
              margin="normal"
              multiline
              value={editedCard.description}
              onChange={(e) =>
                setEditedCard({ ...editedCard, description: e.target.value })
              }
            />
            <TextField
              label="URL изображения"
              fullWidth
              margin="normal"
              value={editedCard.imageUrl}
              onChange={(e) =>
                setEditedCard({ ...editedCard, imageUrl: e.target.value })
              }
            />
          </>
        ) : (
          <>
            <Typography variant="body1">
              Ширина: {card.width || "N/A"}
            </Typography>
            <Typography variant="body1">
              Высота: {card.height || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.description || "Описание отсутствует"}
            </Typography>
            <img
              src={
                card.downloadUrl ||
                card.imageUrl ||
                "https://via.placeholder.com/150"
              }
              alt={card.author || "No image"}
              style={{ width: "100%", marginTop: "16px" }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleSave}>
          Сохранить в БД
        </Button>
        <Button color="secondary" onClick={toggleEditMode}>
          {isEditing ? "Сохранить изменения" : "Редактировать"}
        </Button>
        {onDelete && (
          <Button color="error" onClick={onDelete}>
            Удалить
          </Button>
        )}
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CardModal;
