import { AppRouter } from './router/app-router';
import { AppTheme } from './theme';
import { MainLayout } from './shared/ui/layout/main-layout';
import { ExtraInformationModal } from "./modules/auth/components";
import { SessionTimeoutModal } from "./shared/ui/components";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSessionTimeout } from './hooks';

export const App = () => {
    const [openModal, setOpenModal] = useState(false);
  const { status, isExtraDataCompleted } = useSelector(state => state.auth);
  const { showModal, modalCountdown, forceLogout } = useSessionTimeout();

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
        <SessionTimeoutModal 
          open={showModal}
          countdown={modalCountdown}
          onLogout={forceLogout}
        />
      </MainLayout>
    </AppTheme>
  );
};
