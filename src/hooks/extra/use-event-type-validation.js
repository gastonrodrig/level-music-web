import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../store';

export const useEventTypeValidation = (onValidationChange) => {
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  useEffect(() => {
    const isValid = selected !== null;
    onValidationChange?.(isValid);
    if (isValid) {
      setShowError(false);
    }
  }, [selected, onValidationChange]);

  // Exponer el método para validación externa
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.validateEventTypeForm = () => {
        if (selected === null) {
          showValidationError();
          return false;
        }
        return true;
      };
    }
  }, [selected]);

  // Método para mostrar error cuando se intenta avanzar sin selección
  const showValidationError = () => {
    setShowError(true);
    openSnackbar('Por favor, selecciona un tipo de evento para continuar.');
  };

  // Método para manejar la selección
  const handleSelection = (key, onSelect) => {
    setSelected(key);
    onSelect?.(key);
  };

  return {
    selected,
    showError,
    showValidationError,
    handleSelection,
  };
};
