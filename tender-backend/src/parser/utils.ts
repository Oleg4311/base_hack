export const lz = (n: number | string) => `0${n}`.slice(-2);

export const toIsoDate = (date: string) => {
	const [day, month, year] = date.split(".");
	return `${year}-${lz(month)}-${lz(day)}`;
};
