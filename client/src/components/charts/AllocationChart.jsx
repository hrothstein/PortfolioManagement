import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = {
  STOCK: '#3b82f6',      // blue
  BOND: '#10b981',       // green
  MUTUAL_FUND: '#f59e0b', // amber
  ETF: '#8b5cf6',        // purple
  CASH: '#6b7280',       // gray
  TECHNOLOGY: '#3b82f6',
  HEALTHCARE: '#10b981',
  FINANCIAL: '#f59e0b',
  CONSUMER: '#8b5cf6',
  ENERGY: '#ef4444',
  OTHER: '#6b7280'
};

function AllocationChart({ data, title = 'Asset Allocation' }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No data available
      </div>
    );
  }
  
  const labels = Object.keys(data);
  const values = Object.values(data);
  
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map(label => colors[label] || '#94a3b8'),
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}

export default AllocationChart;

