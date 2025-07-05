import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Dashboard = lazy(() => import('./Dashboard'));
const PredictionForm = lazy(() => import('./PredictionForm'));

function App() {
  return (
    <BrowserRouter basename="/sales-prediction-system-github">
      <div className="container mx-auto">
        <nav className="bg-primary p-4">
          <a href="/sales-prediction-system-github/" className="text-white mr-4">Dashboard</a>
          <a href="/sales-prediction-system-github/predict" className="text-white">Predict</a>
        </nav>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<PredictionForm />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;