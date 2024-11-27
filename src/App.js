import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Customer from './components/Customer';
import SalesPerson from './components/SalesPerson';
import Order from './components/Order';
import Car from './components/Car';
import Invoice from './components/Invoice';
import './style/app.css';
import './style/sidebar.css';
import Login from './components/Login';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated() ? 
              <Navigate to="/customers" /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? 
              <Navigate to="/customers" /> : 
              <Login />
            } 
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div>
                  <Sidebar />
                  <div className="content">
                    <Routes>
                      <Route path="/customers" element={<Customer />} />
                      <Route path="/salespersons" element={<SalesPerson />} />
                      <Route path="/orders" element={<Order />} />
                      <Route path="/cars" element={<Car />} />
                      <Route path="/invoices" element={<Invoice />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
