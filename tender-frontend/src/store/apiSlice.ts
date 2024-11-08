// src/store/apiSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ExternalData {
	id: number;
	title: string;
	description: string;
	author: string;
	createdAt: string;
}

interface ApiState {
	data: ExternalData[];
	loading: boolean;
	error: string | null;
	rawResponse?: unknown; // тип для необработанного ответа
}

const initialState: ApiState = {
	data: [],
	loading: false,
	error: null,
	rawResponse: null,
};

// Thunk для получения данных с внешнего API
// export const fetchApiData = createAsyncThunk("api/fetchApiData", async () => {
// 	const response = await axios.get("/api/");
// 	return response.data;
// });

export const fetchApiData = createAsyncThunk("api/fetchApiData", async () => {
	const response = await axios.get("http://127.0.0.1:5300/api/"); // Полный URL для проверки
	return response.data;
});

const apiSlice = createSlice({
	name: "api",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchApiData.pending, state => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchApiData.fulfilled,
				(state, action: PayloadAction<ExternalData[] | unknown>) => {
					// Проверяем, является ли ответ массивом объектов ExternalData
					if (
						Array.isArray(action.payload) &&
						action.payload.every(
							item =>
								typeof item === "object" && "id" in item && "title" in item
						)
					) {
						state.data = action.payload as ExternalData[];
						state.rawResponse = null;
					} else {
						// Если ответ некорректный, сохраняем его в rawResponse
						state.rawResponse = action.payload;
						state.error = "Пришел некорректный ответ из API";
						state.data = []; // Очищаем данные
					}
					state.loading = false;
				}
			)
			.addCase(fetchApiData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || "Failed to fetch data";
				state.rawResponse = null;
			});
	},
});

export default apiSlice.reducer;
