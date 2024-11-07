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
  onUpdate?: (card: ICard) => void;
}

const CardModal: React.FC<CardModalProps> = ({
  card,
  onClose,
  onSaveToDatabase,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<ICard>({ ...card });

  const handleSaveToDatabase = () => {
    if (onSaveToDatabase) {
      onSaveToDatabase(editedCard);
    }
    onClose();
  };

  const handleSaveChanges = () => {
    if (onUpdate) {
      onUpdate(editedCard);
    }
    setIsEditing(false);
  };

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
              value={editedCard.url}
              onChange={(e) =>
                setEditedCard({ ...editedCard, url: e.target.value })
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
                card.url ||
                "https://via.placeholder.com/150"
              }
              alt={card.author || "No image"}
              style={{ width: "100%", marginTop: "16px" }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {/* Показываем кнопку "Сохранить в БД" только для карточек без id */}
        {!card.id && (
          <Button color="primary" onClick={handleSaveToDatabase}>
            Сохранить в БД
          </Button>
        )}
        {/* Показываем кнопки редактирования только для карточек с id */}
        {card.id && (
          <>
            {isEditing ? (
              <Button color="primary" onClick={handleSaveChanges}>
                Сохранить изменения
              </Button>
            ) : (
              <Button color="secondary" onClick={() => setIsEditing(true)}>
                Редактировать
              </Button>
            )}
          </>
        )}
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
