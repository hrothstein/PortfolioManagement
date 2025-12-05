import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import AllocationChart from '../components/charts/AllocationChart';
import StatCard from '../components/common/StatCard';
import { getPortfolioPerformance, getPortfolioTransactions } from '../services/api';
import { formatCurrency, formatPercent, formatDate, formatDateTime, getChangeColorClass } from '../utils/formatters';

function PortfolioDetail() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [performanceRes, transactionsRes] = await Promise.all([
        getPortfolioPerformance(portfolioId),
        getPortfolioTransactions(portfolioId)
      ]);
      
      setPortfolioData(performanceRes.data.data);
      setTransactions(transactionsRes.data.data.slice(0, 10)); // Show last 10
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [portfolioId]);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!portfolioData) return null;
  
  const { portfolio, performance } = portfolioData;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/portfolios')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Portfolios
        </button>
      </div>
      
      {/* Portfolio Info Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{portfolio.portfolioName}</h1>
            <p className="text-gray-600 mt-1">Portfolio ID: {portfolio.portfolioId}</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <span className={`badge-${portfolio.portfolioType === 'MANAGED' ? 'blue' : 'green'}`}>
                {portfolio.portfolioType}
              </span>
            </div>
            <p className="text-sm text-gray-600">Model: {portfolio.modelPortfolio}</p>
            <p className="text-sm text-gray-600">Benchmark: {portfolio.benchmarkIndex}</p>
          </div>
        </div>
      </div>
      
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Market Value"
          value={performance.totalMarketValue}
          isCurrency={true}
        />
        <StatCard
          label="Cost Basis"
          value={performance.totalCostBasis}
          isCurrency={true}
        />
        <StatCard
          label="Unrealized Gain"
          value={performance.totalUnrealizedGain}
          isCurrency={true}
        />
        <StatCard
          label="Gain %"
          value={performance.totalUnrealizedGainPercent}
          change={performance.dayChangePercent}
          isPercent={true}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <AllocationChart 
            data={performance.assetAllocation} 
            title="Asset Allocation"
          />
        </div>
        
        {Object.keys(performance.sectorAllocation).length > 0 && (
          <div className="card">
            <AllocationChart 
              data={performance.sectorAllocation} 
              title="Sector Allocation"
            />
          </div>
        )}
      </div>
      
      {/* Holdings Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Holdings ({performance.holdings.length})</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Security Name</th>
                <th>Quantity</th>
                <th>Cost Basis</th>
                <th>Market Value</th>
                <th>Gain/Loss</th>
                <th>Gain %</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {performance.holdings.map((holding) => (
                <tr key={holding.holdingId}>
                  <td className="font-medium">{holding.symbol}</td>
                  <td className="text-gray-600">{holding.securityName}</td>
                  <td className="text-gray-900">{holding.quantity}</td>
                  <td>{formatCurrency(holding.totalCostBasis)}</td>
                  <td>{formatCurrency(holding.marketValue)}</td>
                  <td className={getChangeColorClass(holding.unrealizedGain)}>
                    {formatCurrency(holding.unrealizedGain)}
                  </td>
                  <td className={getChangeColorClass(holding.unrealizedGainPercent)}>
                    {formatPercent(holding.unrealizedGainPercent)}
                  </td>
                  <td>{formatPercent(holding.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.transactionId}>
                  <td className="text-gray-600">{formatDateTime(txn.transactionDate)}</td>
                  <td>
                    <span className={`badge-${
                      txn.transactionType === 'BUY' ? 'green' :
                      txn.transactionType === 'SELL' ? 'red' :
                      'blue'
                    }`}>
                      {txn.transactionType}
                    </span>
                  </td>
                  <td className="font-medium">{txn.symbol}</td>
                  <td>{txn.quantity}</td>
                  <td>{formatCurrency(txn.pricePerUnit)}</td>
                  <td>{formatCurrency(txn.totalAmount)}</td>
                  <td>
                    <span className={`badge-${
                      txn.status === 'SETTLED' ? 'green' :
                      txn.status === 'PENDING' ? 'blue' :
                      'gray'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PortfolioDetail;




