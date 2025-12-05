import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import AllocationChart from '../components/charts/AllocationChart';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getDashboardOverview, getTopPerformers, getRecentTransactions } from '../services/api';
import { formatCurrency, formatPercent, getChangeColorClass, formatDateTime } from '../utils/formatters';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overviewRes, performersRes, transactionsRes] = await Promise.all([
        getDashboardOverview(),
        getTopPerformers(5),
        getRecentTransactions(10)
      ]);
      
      setOverview(overviewRes.data.data);
      setTopPerformers(performersRes.data.data);
      setRecentTransactions(transactionsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!overview) return null;
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your Portfolio Management System</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total AUM"
          value={overview.totalAUM}
          isCurrency={true}
        />
        <StatCard
          label="Total Clients"
          value={overview.totalClients}
        />
        <StatCard
          label="Total Portfolios"
          value={overview.totalPortfolios}
        />
        <StatCard
          label="Unrealized Gain"
          value={overview.totalUnrealizedGain}
          isCurrency={true}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <AllocationChart 
            data={overview.assetAllocation} 
            title="Asset Allocation"
          />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Clients by Risk Tolerance</h3>
          <div className="space-y-3">
            {Object.entries(overview.clientsByRiskTolerance).map(([risk, count]) => (
              <div key={risk} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    risk === 'CONSERVATIVE' ? 'bg-blue-500' :
                    risk === 'MODERATE' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{risk}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Performers and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Top 5 Performers</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Client</th>
                  <th>Gain</th>
                  <th>Gain %</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((holding) => (
                  <tr key={holding.holdingId}>
                    <td className="font-medium">{holding.symbol}</td>
                    <td className="text-gray-600">{holding.clientName}</td>
                    <td className={getChangeColorClass(holding.unrealizedGain)}>
                      {formatCurrency(holding.unrealizedGain)}
                    </td>
                    <td className={getChangeColorClass(holding.unrealizedGainPercent)}>
                      {formatPercent(holding.unrealizedGainPercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentTransactions.map((txn) => (
              <div key={txn.transactionId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`badge-${
                      txn.transactionType === 'BUY' ? 'green' :
                      txn.transactionType === 'SELL' ? 'red' :
                      'blue'
                    }`}>
                      {txn.transactionType}
                    </span>
                    <span className="font-medium text-sm">{txn.symbol}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{txn.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(txn.totalAmount)}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(txn.transactionDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;




