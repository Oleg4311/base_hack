import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Tender Hack App
				</Typography>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Button color="inherit" component={Link} to="/">
						External API
					</Button>
					<Button color="inherit" component={Link} to="/external-api">
						External Custom API
					</Button>
					<Button color="inherit" component={Link} to="/database">
						Database
					</Button>
					<Button color="inherit" component={Link} to="/chart">
						Chart
					</Button>
					<Button color="inherit" component={Link} to="/table">
						Table
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
