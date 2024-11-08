import React from "react";
import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
	return (
		<Box
			component="footer"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				p: 2,
				backgroundColor: "#f1f1f1",
				mt: 4,
			}}
		>
			<Typography variant="body2" color="textSecondary">
				© {new Date().getFullYear()} Tender Hack App. All rights reserved.
			</Typography>
		</Box>
	);
};

export default Footer;
