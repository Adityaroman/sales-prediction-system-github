import React, { useEffect, useState } from 'react';

const PredictionForm = () => {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching predict.json from:', `${process.env.PUBLIC_URL}/predict.json`);
    fetch(`${process.env.PUBLIC_URL}/predict.json`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}, url: ${res.url}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setPrediction(data.prediction);
      })
      .catch(err => {
        console.error('Fetch error for predict.json:', err);
        setError(`Failed to load prediction data: ${err.message}`);
      });
  }, []);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sample Prediction</h1>
      <p className="mb-2">Sample Input: Age=30, Gender=Male, Marital Status=Married, State=Uttar Pradesh, Product Category=Food, Age Group=26-35, Orders=5</p>
      {prediction ? (
        <p className="text-lg">Predicted Sales: ${prediction.toFixed(2)}</p>
      ) : (
        <p className="text-lg">Loading prediction...</p>
      )}
    </div>
  );
};

export default PredictionForm;