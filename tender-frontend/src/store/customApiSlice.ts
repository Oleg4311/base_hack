// src/store/customApiSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Интерфейс для данных, получаемых от внешнего API через ваш бэкенд
interface CustomExternalData {
	id: number;
	title: string;
	description: string;
	author: string;
	createdAt: string;
}

interface CustomApiState {
	data: CustomExternalData[];
	loading: boolean;
	error: string | null;
	rawResponse?: unknown; // Для сохранения некорректного ответа
}

const initialState: CustomApiState = {
	data: [],
	loading: false,
	error: null,
	rawResponse: null,
};

// Thunk для получения данных через ваш бэкенд
export const fetchCustomApiData = createAsyncThunk(
	"customApi/fetchCustomApiData",
	async () => {
		const response = await axios.get("http://localhost:3001/external-api"); // Эндпоинт вашего бэкенда
		return response.data;
	}
);

const customApiSlice = createSlice({
	name: "customApi",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCustomApiData.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchCustomApiData.fulfilled,
				(state, action: PayloadAction<CustomExternalData[] | unknown>) => {
					// Проверяем структуру данных
					if (
						Array.isArray(action.payload) &&
						action.payload.every(
							item =>
								typeof item === "object" && "id" in item && "title" in item
						)
					) {
						state.data = action.payload as CustomExternalData[];
						state.rawResponse = null;
					} else {
						state.rawResponse = action.payload;
						state.error = "Пришел некорректный ответ из API";
						state.data = [];
					}
					state.loading = false;
				}
			)
			.addCase(fetchCustomApiData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch data";
				state.rawResponse = null;
			});
	},
});

export default customApiSlice.reducer;
