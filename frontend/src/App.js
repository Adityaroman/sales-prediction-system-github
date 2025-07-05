import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import PredictionForm from './PredictionForm';

function App() {
  return (
    <BrowserRouter basename="/sales-prediction-system-github">
      <div className="container mx-auto">
        <nav className="bg-blue-500 p-4">
          <a href="/sales-prediction-system-github/" className="text-white mr-4">Dashboard</a>
          <a href="/sales-prediction-system-github/predict" className="text-white">Predict</a>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<PredictionForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;