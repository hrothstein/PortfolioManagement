import React, { useState, useEffect } from 'react';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getSecurities } from '../services/api';
import { formatCurrency, formatPercent, getChangeColorClass, getChangeIcon } from '../utils/formatters';

function SecurityList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [securities, setSecurities] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  
  const fetchSecurities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSecurities();
      setSecurities(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSecurities();
  }, []);
  
  const filteredSecurities = filterType === 'ALL' 
    ? securities 
    : securities.filter(s => s.securityType === filterType);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSecurities} />;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Securities</h1>
          <p className="text-gray-600 mt-1">{securities.length} total securities</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
          {['ALL', 'STOCK', 'BOND', 'MUTUAL_FUND', 'ETF'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'ALL' ? 'ALL' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Securities Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Type</th>
                <th>Current Price</th>
                <th>Day Change</th>
                <th>Day Change %</th>
                <th>52W High</th>
                <th>52W Low</th>
              </tr>
            </thead>
            <tbody>
              {filteredSecurities.map((security) => (
                <tr key={security.securityId}>
                  <td className="font-medium">{security.symbol}</td>
                  <td className="text-gray-900">{security.securityName}</td>
                  <td>
                    <span className="badge-blue">
                      {security.securityType.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="font-medium">{formatCurrency(security.currentPrice)}</td>
                  <td className={getChangeColorClass(security.dayChange)}>
                    {getChangeIcon(security.dayChange)} {formatCurrency(Math.abs(security.dayChange))}
                  </td>
                  <td className={getChangeColorClass(security.dayChangePercent)}>
                    {formatPercent(security.dayChangePercent)}
                  </td>
                  <td className="text-gray-600">{formatCurrency(security.fiftyTwoWeekHigh)}</td>
                  <td className="text-gray-600">{formatCurrency(security.fiftyTwoWeekLow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SecurityList;




