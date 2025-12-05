import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getClients } from '../services/api';

function ClientList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getClients();
      setClients(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  });
  
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchClients} />;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">{clients.length} total clients</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="card">
        <input
          type="text"
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>
      
      {/* Clients Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Risk Tolerance</th>
                <th>Investment Objective</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr 
                  key={client.clientId}
                  onClick={() => navigate(`/clients/${client.clientId}`)}
                >
                  <td className="font-medium">
                    {client.firstName} {client.lastName}
                  </td>
                  <td className="text-gray-600">{client.email}</td>
                  <td className="text-gray-600">{client.phone}</td>
                  <td>
                    <span className={`badge-${
                      client.riskTolerance === 'CONSERVATIVE' ? 'blue' :
                      client.riskTolerance === 'MODERATE' ? 'green' :
                      'red'
                    }`}>
                      {client.riskTolerance}
                    </span>
                  </td>
                  <td>
                    <span className="badge-gray">{client.investmentObjective}</span>
                  </td>
                  <td className="text-gray-600">{client.address.city}, {client.address.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ClientList;




