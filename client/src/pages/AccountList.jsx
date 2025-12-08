import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getAccounts, getClients } from '../services/api';
import { formatCurrency } from '../utils/formatters';

function AccountList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [accountsRes, clientsRes] = await Promise.all([
        getAccounts(),
        getClients()
      ]);
      
      setAccounts(accountsRes.data.data);
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
  
  const filteredAccounts = filterType === 'ALL' 
    ? accounts 
    : accounts.filter(a => a.accountType === filterType);
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600 mt-1">{accounts.length} total accounts</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
          {['ALL', 'BROKERAGE', 'IRA', 'ROTH_IRA', '401K'].map(type => (
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
      
      {/* Accounts Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Cash Balance</th>
                <th>Open Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr 
                  key={account.accountId}
                  onClick={() => navigate(`/clients/${account.clientId}`)}
                >
                  <td className="font-medium">{account.accountNumber}</td>
                  <td className="text-gray-900">{account.accountName}</td>
                  <td className="text-gray-600">{getClientName(account.clientId)}</td>
                  <td>
                    <span className="badge-blue">
                      {account.accountType.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-${
                      account.accountStatus === 'ACTIVE' ? 'green' : 'gray'
                    }`}>
                      {account.accountStatus}
                    </span>
                  </td>
                  <td className="font-medium">{formatCurrency(account.cashBalance)}</td>
                  <td className="text-gray-600">{account.openDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AccountList;





