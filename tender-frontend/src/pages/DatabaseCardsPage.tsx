import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCards, deleteCard, updateCard, ICard } from "../store/cardsSlice";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
	Box,
	Pagination,
} from "@mui/material";
import CardModal from "../components/CardModal";

const DatabaseCardsPage: React.FC = () => {
	const { cards, loading, error, totalPages } = useSelector(
		(state: RootState) => state.card
	);
	const dispatch = useDispatch<AppDispatch>();
	const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		dispatch(fetchCards(page));
	}, [dispatch, page]);

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const handleDelete = (id: number) => {
		dispatch(deleteCard(id));
		setSelectedCard(null);
	};

	const handleUpdateCard = async (card: ICard) => {
		const updatedCard = await dispatch(updateCard(card)).unwrap();
		setSelectedCard(updatedCard); // Обновляем выбранную карточку в модальном окне после редактирования
		return updatedCard;
	};

	const handleCloseModal = () => setSelectedCard(null);

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
					cards.map(card => (
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
								<Button
									color="error"
									onClick={e => {
										e.stopPropagation();
										handleDelete(card.id!);
									}}
								>
									Удалить
								</Button>
							</CardContent>
						</Card>
					))
				) : (
					<Typography>No cards available in the database.</Typography>
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
					onUpdate={handleUpdateCard} // Передаем handleUpdateCard для обновления карточек из БД
				/>
			)}
		</Box>
	);
};

export default DatabaseCardsPage;
