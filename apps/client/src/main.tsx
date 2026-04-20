import { createRoot } from 'react-dom/client';
import './style.css';

const App = () => <div>Codenames project</div>;

createRoot(document.getElementById('app')!).render(<App />);
