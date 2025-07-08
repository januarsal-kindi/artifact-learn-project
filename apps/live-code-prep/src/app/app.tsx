import { JobBoard , TicTacToe } from 'interview-prep';
import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<JobBoard />} />
      </Routes>
        <Routes>
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
      </Routes>
    </div>
  );
}

export default App;
