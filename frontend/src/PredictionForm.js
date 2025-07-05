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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'age' || name === 'orders' ? parseInt(value) || '' : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://sales-prediction-backend.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age) || 0,
          orders: parseInt(formData.orders) || 0
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4B0082, #FF69B4, #FFD700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '32rem',
        width: '100%',
        background: 'white',
        borderRadius: '1.5rem',
        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
        padding: '2.5rem',
        transition: 'transform 0.3s ease-in-out',
        transform: loading ? 'scale(0.98)' : 'scale(1)',
        margin: '1rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          textAlign: 'center',
          color: '#4B0082',
          marginBottom: '2rem',
          animation: 'pulse 2s infinite',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          Sales Prediction
        </h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter age' },
            { label: 'Gender', name: 'gender', type: 'select', options: ['M', 'F'], optionLabels: ['Male', 'Female'] },
            { label: 'Marital Status', name: 'maritalStatus', type: 'select', options: ['Married', 'Single'] },
            { label: 'State', name: 'state', type: 'select', options: ['Delhi', 'Haryana', 'Karnataka', 'Uttar Pradesh', 'Maharashtra'] },
            { label: 'Product Category', name: 'productCategory', type: 'select', options: ['Electronics', 'Clothing', 'Home', 'Food'] },
            { label: 'Age Group', name: 'ageGroup', type: 'select', options: ['18-25', '26-35', '36-45', '46-55', '56-70'] },
            { label: 'Number of Orders', name: 'orders', type: 'number', placeholder: 'Enter number of orders' },
            { label: 'Festival', name: 'festival', type: 'select', options: ['Diwali', 'Holi', 'Christmas', 'Eid', 'None'] }
          ].map(field => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', letterSpacing: '0.02em' }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #D1D5DB',
                    background: '#F3F4F6',
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                    backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)'
                  }}
                  onFocus={e => e.target.style.border = '1px solid #4B0082'}
                  onBlur={e => e.target.style.border = '1px solid #D1D5DB'}
                >
                  {field.options.map((option, idx) => (
                    <option key={option} value={option}>
                      {field.optionLabels ? field.optionLabels[idx] : option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #D1D5DB',
                    background: '#F3F4F6',
                    fontSize: '0.875rem',
                    color: '#1F2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                    backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #F3F4F6)'
                  }}
                  onFocus={e => e.target.style.border = '1px solid #4B0082'}
                  onBlur={e => e.target.style.border = '1px solid #D1D5DB'}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#6B7280' : 'linear-gradient(90deg, #4B0082, #6A0DAD)',
              color: 'white',
              fontWeight: '600',
              padding: '0.875rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: loading ? 'scale(1)' : 'scale(1)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              ':hover': loading ? {} : { transform: 'scale(1.05)', background: 'linear-gradient(90deg, #6A0DAD, #8B008B)' }
            }}
            onMouseEnter={e => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={e => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Predicting...
              </span>
            ) : (
              'Predict Sales'
            )}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <p style={{
              color: '#DC2626',
              fontWeight: '500',
              background: '#FEE2E2',
              padding: '1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {error}
            </p>
          )}
          {prediction ? (
            <div style={{
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              border: '1px solid #6EE7B7',
              borderRadius: '0.75rem',
              animation: 'fadeIn 0.5s ease-out',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1F2937' }}>Predicted Sales</p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>${prediction.toFixed(2)}</p>
            </div>
          ) : (
            <p style={{ fontSize: '1.125rem', color: '#4B5563', animation: 'pulse 2s infinite' }}>
              Enter details to predict sales
            </p>
          )}
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PredictionForm;