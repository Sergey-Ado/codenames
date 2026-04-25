import { Header } from './components/header/Header';
import { Welcome } from './components/pages/welcome/Welcome';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[url(../public/images/background-light.jpg)] bg-no-repeat bg-fixed bg-center bg-cover font-rub select-none">
      <Header />
      <Welcome />
    </div>
  );
}

export default App;
