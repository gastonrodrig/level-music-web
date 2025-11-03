export const formatDatePrice = (dateInput) => {
	if (dateInput == null) return '';

	const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
	if (Number.isNaN(d.getTime())) return '';

	const day = d.getDate();
	const year = d.getFullYear();
	const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
	const month = months[d.getMonth()] || '';

	return `${day} ${month}. ${year}`;
}

