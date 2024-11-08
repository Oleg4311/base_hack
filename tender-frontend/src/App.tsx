import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExternalApiPage from "./pages/ExternalApiPage";
import DatabaseCardsPage from "./pages/DatabaseCardsPage";
import ChartPage from "./pages/ChartPage";
import TablePage from "./pages/TablePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ExternalCustomApiPage from "./pages/ExternalCustomApiPage";
import CustomApiPage from "./pages/CustomApiPage";

export const App: React.FC = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<ExternalApiPage />} />
				<Route path="/external-api" element={<ExternalCustomApiPage />} />
				<Route path="/custom-api" element={<CustomApiPage />} />
				<Route path="/database" element={<DatabaseCardsPage />} />
				<Route path="/chart" element={<ChartPage />} />
				<Route path="/table" element={<TablePage />} />
			</Routes>
			<Footer />
		</Router>
	);
};

export default App;
