import { Outlet } from 'react-router';
import { Header } from './components/header/Header';
import { Toaster } from 'sonner';
import { useSelector } from 'react-redux';
import { SettingsModal } from './components/settingsModal/SettingsModal';
import { RootState } from './store/store';
import { Spinner } from './components/spinner/Spinner';

function App() {
  const openSettings = useSelector(
    (state: RootState) => state.general.openSettings
  );

  const showSpinner = useSelector(
    (state: RootState) => state.general.showSpinner
  );

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-[url(/images/background-light.jpg)] dark:bg-[url(/images/background-dark.jpg)] bg-no-repeat bg-fixed bg-center bg-cover font-rub select-none text-text-light dark:text-text-dark relative">
        <Header />
        <Outlet />
        <Toaster position="top-center" richColors duration={2000} />
        {openSettings && <SettingsModal />}
        {showSpinner && <Spinner />}
      </div>
    </>
  );
}

export default App;
