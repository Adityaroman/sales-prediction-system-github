import React from 'react';
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import PredictionForm from './PredictionForm';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-festivalRed p-4 shadow-lg">
          <ul className="flex space-x-6 text-white max-w-7xl mx-auto">
            <li><Link to="/" className="hover:underline text-lg font-semibold">Dashboard</Link></li>
            <li><Link to="/predict" className="hover:underline text-lg font-semibold">Predict</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/predict" component={PredictionForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;