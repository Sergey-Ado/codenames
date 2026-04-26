import { Header } from '../app/components/header/Header';
import { Welcome } from '../app/pages/welcome/Welcome';
function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[url(/images/background-light.jpg)] dark:bg-[url(/images/background-dark.jpg)] bg-no-repeat bg-fixed bg-center bg-cover font-rub select-none text-black dark:text-white">
      <Header />
      <Welcome />
    </div>
  );
}

export default App;
