import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createManualPaymentModel } from '../../shared/models/payment-manual';
import { paymentApi } from '../../api';
import { getAuthConfig } from '../../shared/utils';
import {
	setLoadingPayment,
	selectedPayment,
	refreshPayment,
	showSnackbar,
	setPagePayment,
} from '../../store';

export const useManualPayment = () => {
	const dispatch = useDispatch();

	const {
		payments,
		selected,
		total,
		loading,
		currentPage,
		rowsPerPage,
	} = useSelector((state) => state.payment || {});

	const { token } = useSelector((state) => state.auth || {});

	// local UI state similar pattern
	const [searchTerm, setSearchTerm] = useState('');
	const [orderBy, setOrderBy] = useState('created_at');
	const [order, setOrder] = useState('desc');
	const [error, setError] = useState(null);

	const openSnackbar = (message) => dispatch(showSnackbar({ message }));

	const startCreateManualPayment = async (payment = {}, endpoint = '/') => {
		dispatch(setLoadingPayment(true));
		try {
			const payload = createManualPaymentModel(payment);
			const { data } = await paymentApi.post(endpoint, payload, getAuthConfig(token));
			openSnackbar('El pago fue registrado correctamente.');

			// opcional: actualizar lista local si el backend retorna nuevo item
			// if (data) {
			//   dispatch(refreshPayment({ items: [...payments, data], total: total + 1, page: currentPage }));
			// }

			return data;
		} catch (err) {
			const message = err?.response?.data?.message || err.message || 'Ocurrió un error al registrar el pago.';
			openSnackbar(message);
			setError(message);
			return false;
		} finally {
			dispatch(setLoadingPayment(false));
		}
	};

	const setSelectedPaymentLocal = (p) => dispatch(selectedPayment(p));

		const setPageGlobal = (page) => dispatch(setPagePayment(page));

	return {
		// redux state
		payments,
		selected,
		total,
		loading,
		currentPage,
		rowsPerPage,

		// local
		searchTerm,
		setSearchTerm,
		orderBy,
		setOrderBy,
		order,
		setOrder,
		error,

		// actions
		startCreateManualPayment,
		setSelectedPaymentLocal,
		setPageGlobal,
	};
};

export default useManualPayment;
