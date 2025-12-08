import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import AccountList from './pages/AccountList';
import PortfolioList from './pages/PortfolioList';
import PortfolioDetail from './pages/PortfolioDetail';
import TransactionList from './pages/TransactionList';
import SecurityList from './pages/SecurityList';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/:clientId" element={<ClientDetail />} />
              <Route path="/accounts" element={<AccountList />} />
              <Route path="/portfolios" element={<PortfolioList />} />
              <Route path="/portfolios/:portfolioId" element={<PortfolioDetail />} />
              <Route path="/transactions" element={<TransactionList />} />
              <Route path="/securities" element={<SecurityList />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;





