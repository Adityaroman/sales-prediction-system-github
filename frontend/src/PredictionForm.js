import React, { useState, useEffect } from 'react';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    maritalStatus: 'Married',
    state: 'Delhi',
    productCategory: 'Electronics',
    ageGroup: '18-25',
    orders: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fallback to static predict.json for GitHub Pages
  useEffect(() => {
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
        console.error('Static prediction error:', err);
        setError(`Failed to load static prediction: ${err.message}`);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setPrediction(data.prediction);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(`Failed to get prediction: ${err.message}. Using static prediction.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Sales Prediction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter age"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="Married">Married</option>
              <option value="Single">Single</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Category</label>
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age Group</label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56-70">56-70</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Orders</label>
            <input
              type="number"
              name="orders"
              value={formData.orders}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter number of orders"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Predicting...' : 'Predict Sales'}
          </button>
        </form>
        <div className="mt-6 text-center">
          {error && <p className="text-red-500">{error}</p>}
          {prediction ? (
            <>
              <p className="text-lg font-semibold text-gray-800">Predicted Sales</p>
              <p className="text-xl text-green-600">${prediction.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-lg text-gray-600">Enter details to predict sales</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;