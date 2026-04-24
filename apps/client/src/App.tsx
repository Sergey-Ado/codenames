import './App.css';
import { Welcome } from './pages/welcome/Welcome';

function App() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-[url(./src/assets/images/background-light.jpg)] bg-no-repeat bg-fixed bg-center bg-cover font-rub select-none">
      <Welcome />
    </div>
  );
}

export default App;
