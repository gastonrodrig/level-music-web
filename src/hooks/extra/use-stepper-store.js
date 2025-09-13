import { useDispatch, useSelector } from 'react-redux';
import { nextPage, previousPage, goToPage, initStepper } from '../../store';
import { useEffect } from 'react';

export const useStepperStore = (id, totalSteps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initStepper({ id }));
  }, [id, dispatch]);

  const currentPage = useSelector((state) => state.stepper.flows[id]?.currentPage ?? 0);

  const goNext = () => {
    if (currentPage < totalSteps - 1) {
      dispatch(nextPage({ id }));
    }
  };

  const goBack = () => {
    if (currentPage > 0) {
      dispatch(previousPage({ id }));
    }
  };

  const goTo = (page) => {
    if (page >= 0 && page < totalSteps) {
      dispatch(goToPage({ id, page }));
    }
  };

  return {
    currentPage,
    goNext,
    goBack,
    goTo,
    isFirst: currentPage === 0,
    isLast: currentPage === totalSteps - 1
  };
};
