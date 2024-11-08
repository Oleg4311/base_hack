import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchApiData } from "../store/apiSlice";
import { Card, CardContent, Typography, Box } from "@mui/material";

const ExternalCustomApiPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { data, loading, error, rawResponse } = useSelector(
		(state: RootState) => state.api
	);

	useEffect(() => {
		dispatch(fetchApiData());
	}, [dispatch]);

	if (loading) return <Typography>Loading...</Typography>;
	if (error && rawResponse)
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography color="error">
					{error}: {JSON.stringify(rawResponse)}
				</Typography>
			</Box>
		);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				mt: 4,
			}}
		>
			<Typography variant="h4">External Custom API Page</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
				{data.length > 0 ? (
					data.map(item => (
						<Card
							key={item.id}
							sx={{
								maxWidth: 345,
								m: 2,
								border: "1px solid #ddd",
								boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
							}}
						>
							<CardContent>
								<Typography gutterBottom variant="h5">
									{item.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{item.description}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Автор: {item.author}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Дата: {item.createdAt}
								</Typography>
							</CardContent>
						</Card>
					))
				) : (
					<Typography>No data available</Typography>
				)}
			</Box>
		</Box>
	);
};

export default ExternalCustomApiPage;
