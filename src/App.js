import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Customer from './components/Customer';
import SalesPerson from './components/SalesPerson';
import Order from './components/Order';
import Car from './components/Car';
import Invoice from './components/Invoice';
import './style/app.css';
import './style/sidebar.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Customer />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/salespersons" element={<SalesPerson />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/cars" element={<Car />} />
            <Route path="/invoices" element={<Invoice />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
