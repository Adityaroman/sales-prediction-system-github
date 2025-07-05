import React, { useState, useEffect } from 'react';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    maritalStatus: 'Married',
    state: 'Delhi',
    productCategory: 'Electronics',
    ageGroup: '18-25',
    orders: '',
    festival: 'Diwali'
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      const response = await fetch('https://sales-prediction-backend.onrender.com/predict', {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 tracking-tight animate-pulse">Sales Prediction</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter age"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="Married">Married</option>
              <option value="Single">Single</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="Delhi">Delhi</option>
              <option value="Haryana">Haryana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Product Category</label>
            <select
              name="productCategory"
              value={formData.productCategory}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Food">Food</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Age Group</label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46-55">46-55</option>
              <option value="56-70">56-70</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Number of Orders</label>
            <input
              type="number"
              name="orders"
              value={formData.orders}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
              placeholder="Enter number of orders"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">Festival</label>
            <select
              name="festival"
              value={formData.festival}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 p-3 text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 ease-in-out"
            >
              <option value="Diwali">Diwali</option>
              <option value="Holi">Holi</option>
              <option value="Christmas">Christmas</option>
              <option value="Eid">Eid</option>
              <option value="None">None</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </span>
            ) : (
              'Predict Sales'
            )}
          </button>
        </form>
        <div className="mt-6 text-center space-y-3">
          {error && (
            <p className="text-red-500 font-medium bg-red-50 p-3 rounded-lg">{error}</p>
          )}
          {prediction ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
              <p className="text-lg font-semibold text-gray-800">Predicted Sales</p>
              <p className="text-3xl font-bold text-green-600">${prediction.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-lg text-gray-600 animate-pulse">Enter details to predict sales</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;