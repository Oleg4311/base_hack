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
  onSaveToDatabase?: (card: ICard) => Promise<ICard>;
  onDelete?: () => void;
  onUpdate?: (card: ICard) => Promise<ICard>;
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

  const handleSaveToDatabase = async () => {
    if (onSaveToDatabase) {
      const savedCard = await onSaveToDatabase(editedCard);
      setEditedCard(savedCard);
    }
    onClose();
  };

  const handleSaveChanges = async () => {
    if (!editedCard.id && onSaveToDatabase) {
      const savedCard = await onSaveToDatabase(editedCard);
      setEditedCard(savedCard);
      if (onUpdate) {
        const updatedCard = await onUpdate(savedCard);
        setEditedCard(updatedCard);
      }
    } else if (onUpdate) {
      const updatedCard = await onUpdate(editedCard);
      setEditedCard(updatedCard);
    }
    setIsEditing(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    setEditedCard((prevCard) => ({
      ...prevCard,
      [key]: isNaN(Number(value)) ? value : Number(value), // Учитываем числовые значения
    }));
  };

  const renderCardFields = () => {
    return Object.entries(editedCard).map(([key, value]) => {
      if (key === "id" || key === "createdAt") return null; // Исключаем неизменяемые поля

      return isEditing ? (
        <TextField
          key={key}
          label={key}
          fullWidth
          margin="normal"
          value={value || ""}
          onChange={(e) => handleFieldChange(key, e.target.value)}
        />
      ) : (
        <Typography key={key} variant="body1">
          <strong>{key}:</strong> {value || "N/A"}
        </Typography>
      );
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing
          ? "Редактирование карточки"
          : card.author || "Детали карточки"}
      </DialogTitle>
      <DialogContent>{renderCardFields()}</DialogContent>
      <DialogActions>
        {!card.id && !isEditing && (
          <Button color="primary" onClick={handleSaveToDatabase}>
            Сохранить в БД
          </Button>
        )}
        {!isEditing && (
          <Button color="secondary" onClick={() => setIsEditing(true)}>
            Редактировать
          </Button>
        )}
        {isEditing && (
          <Button color="primary" onClick={handleSaveChanges}>
            Сохранить изменения
          </Button>
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
