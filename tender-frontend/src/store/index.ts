import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./cardsSlice";
import apiReducer from "./apiSlice";

export const store = configureStore({
	reducer: {
		card: cardReducer,
		api: apiReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
