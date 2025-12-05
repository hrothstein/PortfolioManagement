import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import AllocationChart from '../components/charts/AllocationChart';
import StatCard from '../components/common/StatCard';
import { getClientSummary, getClientAccounts } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

function ClientDetail() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summaryRes, accountsRes] = await Promise.all([
        getClientSummary(clientId),
        getClientAccounts(clientId)
      ]);
      
      setClientData(summaryRes.data.data);
      setAccounts(accountsRes.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [clientId]);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!clientData) return null;
  
  const { client, summary } = clientData;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/clients')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Clients
        </button>
      </div>
      
      {/* Client Info Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.firstName} {client.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{client.email}</p>
            <p className="text-gray-600">{client.phone}</p>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Risk Tolerance: </span>
                <span className={`badge-${
                  client.riskTolerance === 'CONSERVATIVE' ? 'blue' :
                  client.riskTolerance === 'MODERATE' ? 'green' :
                  'red'
                }`}>
                  {client.riskTolerance}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Objective: </span>
                <span className="badge-gray">{client.investmentObjective}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date of Birth:</span>
              <span className="ml-2 font-medium">{formatDate(client.dateOfBirth)}</span>
            </div>
            <div>
              <span className="text-gray-500">Address:</span>
              <span className="ml-2 font-medium">
                {client.address.street}, {client.address.city}, {client.address.state} {client.address.zipCode}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Market Value"
          value={summary.totalMarketValue}
          isCurrency={true}
        />
        <StatCard
          label="Total Cost Basis"
          value={summary.totalCostBasis}
          isCurrency={true}
        />
        <StatCard
          label="Unrealized Gain"
          value={summary.totalUnrealizedGain}
          isCurrency={true}
        />
        <StatCard
          label="Gain %"
          value={summary.totalUnrealizedGainPercent}
          isPercent={true}
        />
      </div>
      
      {/* Asset Allocation and Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <AllocationChart 
            data={summary.assetAllocation} 
            title="Asset Allocation"
          />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Accounts ({accounts.length})</h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div 
                key={account.accountId}
                onClick={() => navigate(`/accounts/${account.accountId}`)}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{account.accountName}</p>
                    <p className="text-sm text-gray-600">{account.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-blue">{account.accountType}</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Cash: {formatCurrency(account.cashBalance)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;




