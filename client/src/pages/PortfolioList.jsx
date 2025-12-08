import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getPortfolios, getClients } from '../services/api';
import { formatCurrency, formatPercent, getChangeColorClass } from '../utils/formatters';

function PortfolioList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [portfoliosRes, clientsRes] = await Promise.all([
        getPortfolios(),
        getClients()
      ]);
      
      setPortfolios(portfoliosRes.data.data);
      setClients(clientsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const getClientName = (clientId) => {
    const client = clients.find(c => c.clientId === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
  };
  
  const filteredPortfolios = filterType === 'ALL' 
    ? portfolios 
    : portfolios.filter(p => p.portfolioType === filterType);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolios</h1>
          <p className="text-gray-600 mt-1">{portfolios.length} total portfolios</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
          {['ALL', 'MANAGED', 'SELF_DIRECTED'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      
      {/* Portfolios Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Portfolio Name</th>
                <th>Client</th>
                <th>Type</th>
                <th>Model</th>
                <th>Benchmark</th>
                <th>Inception Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPortfolios.map((portfolio) => (
                <tr 
                  key={portfolio.portfolioId}
                  onClick={() => navigate(`/portfolios/${portfolio.portfolioId}`)}
                >
                  <td className="font-medium">{portfolio.portfolioName}</td>
                  <td className="text-gray-600">{getClientName(portfolio.clientId)}</td>
                  <td>
                    <span className={`badge-${
                      portfolio.portfolioType === 'MANAGED' ? 'blue' : 'green'
                    }`}>
                      {portfolio.portfolioType}
                    </span>
                  </td>
                  <td className="text-gray-600">{portfolio.modelPortfolio}</td>
                  <td className="text-gray-600">{portfolio.benchmarkIndex}</td>
                  <td className="text-gray-600">{portfolio.inceptionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PortfolioList;






