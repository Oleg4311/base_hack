import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface ICard {
	id?: number;
	title: string;
	description: string;
	url: string;
	downloadUrl?: string;
	author?: string;
	width?: number;
	height?: number;
	createdAt: string;
}

interface CardState {
	cards: ICard[];
	loading: boolean;
	error: string | null;
	page: number;
	totalPages: number;
}

const initialState: CardState = {
	cards: [],
	loading: false,
	error: null,
	page: 1,
	totalPages: 1,
};

// Получение карточек с бэкенда с учетом пагинации
export const fetchCards = createAsyncThunk(
	"cards/fetchCards",
	async ({ page, limit }: { page: number; limit: number }) => {
		const response = await axios.get(
			`http://localhost:3001/images?page=${page}&limit=${limit}`
		);
		return response.data;
	}
);

// Удаление карточки
export const deleteCard = createAsyncThunk(
	"cards/deleteCard",
	async (id: number) => {
		await axios.delete(`http://localhost:3001/images/${id}`);
		return id;
	}
);

// Добавление карточки
export const addCard = createAsyncThunk(
	"cards/addCard",
	async (cardData: Omit<ICard, "id">) => {
		const response = await axios.post("http://localhost:3001/images", cardData);
		return response.data;
	}
);

// Обновление карточки
export const updateCard = createAsyncThunk(
	"cards/updateCard",
	async (card: ICard) => {
		const response = await axios.put(
			`http://localhost:3001/images/${card.id}`,
			card
		);
		return response.data;
	}
);

const cardsSlice = createSlice({
	name: "card",
	initialState,
	reducers: {
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchCards.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchCards.fulfilled, (state, action) => {
				state.cards = action.payload.data;
				state.totalPages = Math.ceil(action.payload.total / 10); // Рассчитываем totalPages на основе total
				state.loading = false;
			})
			.addCase(fetchCards.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch cards";
			})
			.addCase(deleteCard.fulfilled, (state, action: PayloadAction<number>) => {
				state.cards = state.cards.filter(card => card.id !== action.payload);
				// Перезагружаем данные страницы после удаления
				if (state.cards.length === 0 && state.page > 1) {
					state.page -= 1; // Если последняя карточка на странице удалена, переходим на предыдущую страницу
				}
			})
			.addCase(addCard.fulfilled, (state, action) => {
				state.cards.unshift(action.payload); // Добавляем новую карточку в начало списка
				// Обновляем totalPages если добавление карточки увеличило общее количество страниц
				if (state.cards.length > 10) {
					state.totalPages = Math.ceil((state.cards.length + 1) / 10);
				}
			})
			.addCase(updateCard.fulfilled, (state, action) => {
				const index = state.cards.findIndex(
					card => card.id === action.payload.id
				);
				if (index !== -1) {
					state.cards[index] = action.payload;
				}
			});
	},
});

export const { setPage } = cardsSlice.actions;
export default cardsSlice.reducer;
