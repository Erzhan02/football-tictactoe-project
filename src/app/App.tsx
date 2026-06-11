import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamePage from '@/pages/GamePage';
import DatabasePage from '@/pages/DatabasePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/database" element={<DatabasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
