import { Outlet } from 'react-router';
import { Header } from './components/header/Header';
import { Toaster } from 'sonner';
import { SettingsButton } from './components/settingsButton/SettingsButton';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[url(/images/background-light.jpg)] dark:bg-[url(/images/background-dark.jpg)] bg-no-repeat bg-fixed bg-center bg-cover font-rub select-none text-text-light dark:text-text-dark relative">
      <Header />
      <Outlet />
      <Toaster position="top-center" richColors duration={2000} />
      <SettingsButton />
    </div>
  );
}

export default App;
