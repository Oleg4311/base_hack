import React from "react";
import { Pagination as MuiPagination } from "@mui/material";

interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	page,
	totalPages,
	onPageChange,
}) => (
	<MuiPagination
		count={totalPages}
		page={page}
		onChange={(_, value) => onPageChange(value)}
	/>
);

export default Pagination;
