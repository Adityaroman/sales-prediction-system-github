import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
const Dashboard = lazy(() => import('./Dashboard'));
const PredictionForm = lazy(() => import('./PredictionForm'));

function App() {
  return (
    <BrowserRouter basename="/sales-prediction-system-github">
      <div style={{
        fontFamily: "'Inter', sans-serif",
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4B0082, #FF69B4, #FFD700)'
      }}>
        <nav style={{
          background: 'linear-gradient(90deg, #4B0082, #6A0DAD)',
          padding: '1rem',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <Link to="/" style={{
            color: 'white',
            fontWeight: '600',
            fontSize: '1.125rem',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'background 0.3s ease',
            ':hover': { background: 'rgba(255,255,255,0.1)' }
          }}>
            Dashboard
          </Link>
          <Link to="/predict" style={{
            color: 'white',
            fontWeight: '600',
            fontSize: '1.125rem',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'background 0.3s ease',
            ':hover': { background: 'rgba(255,255,255,0.1)' }
          }}>
            Predict
          </Link>
        </nav>
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            color: 'white',
            fontSize: '1.5rem'
          }}>
            Loading...
          </div>
        }>
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