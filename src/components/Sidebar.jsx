import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Car Sales Management</h1>
      <nav>
        <ul className="sidebar-links">
          <li><Link to="/customers">Customers</Link></li>
          <li><Link to="/salespersons">Salespersons</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/cars">Cars</Link></li>
          <li><Link to="/invoices">Invoices</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
