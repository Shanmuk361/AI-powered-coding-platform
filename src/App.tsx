import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TestPage } from './pages/TestPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;