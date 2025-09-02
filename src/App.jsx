import { AppRouter } from './router/app-router';
import { AppTheme } from './theme';
import { MainLayout } from './shared/ui/layout/main-layout';
import { ExtraInformationModal } from "./modules/auth/components";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const App = () => {
  const { status, isExtraDataCompleted } = useSelector(state => state.auth);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && isExtraDataCompleted === false) {
      setOpenModal(true);
    } else {
      setOpenModal(false);
    }
  }, [status, isExtraDataCompleted]);

  return (
    <AppTheme>
      <MainLayout>
        {!openModal && <AppRouter />}
        <ExtraInformationModal 
          open={openModal} 
          onClose={() => {}}
        />
      </MainLayout>
    </AppTheme>
  );
};
