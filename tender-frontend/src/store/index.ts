import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./cardsSlice";
import apiReducer from "./apiSlice";
import customApiReducer from "./customApiSlice"; // Импортируем новый редьюсер

export const store = configureStore({
	reducer: {
		card: cardReducer,
		api: apiReducer,
		customApi: customApiReducer, // Используем новый редьюсер
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
