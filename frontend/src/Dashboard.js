import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Dashboard = () => {
  const [edaData, setEdaData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching eda.json from:', `${process.env.PUBLIC_URL}/eda.json`);
    fetch(`${process.env.PUBLIC_URL}/eda.json`, { cache: 'no-store' })
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
        setEdaData(data);
      })
      .catch(err => {
        console.error('Fetch error for eda.json:', err);
        setError(`Failed to load EDA data: ${err.message}`);
      });
  }, []);

  if (error) return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  if (!edaData) return <div className="p-4 text-center text-gray-600">Loading...</div>;

  const genderPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_gender), y: Object.values(edaData.sales_by_gender), marker: { color: '#3B82F6' } }],
    layout: { title: 'Sales by Gender', xaxis: { title: 'Gender' }, yaxis: { title: 'Amount' }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  };
  const statePlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_state), y: Object.values(edaData.sales_by_state), marker: { color: '#10B981' } }],
    layout: { title: 'Sales by State', xaxis: { title: 'State' }, yaxis: { title: 'Amount' }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  };
  const categoryPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_category), y: Object.values(edaData.sales_by_category), marker: { color: '#F59E0B' } }],
    layout: { title: 'Sales by Category', xaxis: { title: 'Category' }, yaxis: { title: 'Amount' }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  };
  const ageGroupPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_age_group), y: Object.values(edaData.sales_by_age_group), marker: { color: '#EF4444' } }],
    layout: { title: 'Sales by Age Group', xaxis: { title: 'Age Group' }, yaxis: { title: 'Amount' }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Sales Analysis Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Plot data={genderPlot.data} layout={genderPlot.layout} className="w-full h-[400px]" />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Plot data={statePlot.data} layout={statePlot.layout} className="w-full h-[400px]" />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Plot data={categoryPlot.data} layout={categoryPlot.layout} className="w-full h-[400px]" />
        </div>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Plot data={ageGroupPlot.data} layout={ageGroupPlot.layout} className="w-full h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;