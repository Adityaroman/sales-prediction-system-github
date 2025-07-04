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

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!edaData) return <div className="p-4">Loading...</div>;

  const genderPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_gender), y: Object.values(edaData.sales_by_gender) }],
    layout: { title: 'Sales by Gender', xaxis: { title: 'Gender' }, yaxis: { title: 'Amount' } }
  };
  const statePlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_state), y: Object.values(edaData.sales_by_state) }],
    layout: { title: 'Sales by State', xaxis: { title: 'State' }, yaxis: { title: 'Amount' } }
  };
  const categoryPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_category), y: Object.values(edaData.sales_by_category) }],
    layout: { title: 'Sales by Category', xaxis: { title: 'Category' }, yaxis: { title: 'Amount' } }
  };
  const ageGroupPlot = {
    data: [{ type: 'bar', x: Object.keys(edaData.sales_by_age_group), y: Object.values(edaData.sales_by_age_group) }],
    layout: { title: 'Sales by Age Group', xaxis: { title: 'Age Group' }, yaxis: { title: 'Amount' } }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Plot data={genderPlot.data} layout={genderPlot.layout} />
        <Plot data={statePlot.data} layout={statePlot.layout} />
        <Plot data={categoryPlot.data} layout={categoryPlot.layout} />
        <Plot data={ageGroupPlot.data} layout={ageGroupPlot.layout} />
      </div>
    </div>
  );
};

export default Dashboard;