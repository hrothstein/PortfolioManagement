import React, { useState, useEffect } from 'react';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getTransactions } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/formatters';

function TransactionList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('ALL');
  const [searchSymbol, setSearchSymbol] = useState('');
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTransactions();
      setTransactions(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  let filteredTransactions = transactions;
  
  if (filterType !== 'ALL') {
    filteredTransactions = filteredTransactions.filter(t => t.transactionType === filterType);
  }
  
  if (searchSymbol) {
    filteredTransactions = filteredTransactions.filter(t => 
      t.symbol.toLowerCase().includes(searchSymbol.toLowerCase())
    );
  }
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTransactions} />;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">{transactions.length} total transactions</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by Type:</span>
          {['ALL', 'BUY', 'SELL', 'DIVIDEND'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search by symbol..."
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          className="input-field"
        />
      </div>
      
      {/* Transactions Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price per Unit</th>
                <th>Total Amount</th>
                <th>Fees</th>
                <th>Net Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 100).map((txn) => (
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
                  <td>{formatCurrency(txn.fees)}</td>
                  <td className="font-medium">{formatCurrency(txn.netAmount)}</td>
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
        {filteredTransactions.length > 100 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Showing first 100 transactions of {filteredTransactions.length} total
          </p>
        )}
      </div>
    </div>
  );
}

export default TransactionList;






