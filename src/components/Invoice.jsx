import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newInvoice, setNewInvoice] = useState({ invoiceNumber: '', OrderId: '' });
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesResponse, ordersResponse] = await Promise.all([
        axios.get('http://localhost:5000/invoice'),
        axios.get('http://localhost:5000/order')
      ]);
      setInvoices(invoicesResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    }
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    setError('');

    if (!newInvoice.invoiceNumber || !newInvoice.OrderId) {
      setError('Please fill in all the fields before adding an invoice.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/createInvoice', newInvoice);
      setInvoices(prevInvoices => [...prevInvoices, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding invoice:', error);
      setError('Failed to add invoice. Please try again.');
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice({ invoiceNumber: invoice.invoiceNumber, OrderId: invoice.OrderId });
    setShowPopup(true);
    setIsAdding(false);
  };

  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    setError('');

    if (!newInvoice.invoiceNumber || !newInvoice.OrderId) {
      setError('Please fill in all the fields before updating the invoice.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/updateInvoice/${editingInvoice.id}`, newInvoice);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error updating invoice:', error);
      setError('Failed to update invoice. Please try again.');
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteInvoice/${id}`);
      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setError('Failed to delete invoice. Please try again.');
    }
  };

  const resetForm = () => {
    setNewInvoice({ invoiceNumber: '', OrderId: '' });
    setEditingInvoice(null);
    setShowPopup(false);
    setIsAdding(false);
    setError('');
  };

  return (
    <div>
      <h2>Invoices</h2>
      <button className='add-button' onClick={() => {
        setShowPopup(true);
        setIsAdding(true);
        setNewInvoice({ invoiceNumber: '', OrderId: '' });
      }}>Add Invoice</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Invoice Number</th>
            <th>Order ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.OrderId}</td>
              <td>
                <button onClick={() => handleEditInvoice(invoice)}>Edit</button>
                <button onClick={() => handleDeleteInvoice(invoice.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isAdding ? 'Add Invoice' : 'Edit Invoice'}</h3>
            <form onSubmit={isAdding ? handleAddInvoice : handleUpdateInvoice}>
              <input
                type="text"
                placeholder="Invoice Number"
                value={newInvoice.invoiceNumber}
                onChange={e => setNewInvoice({ ...newInvoice, invoiceNumber: e.target.value })}
                required
              />
              <select
                value={newInvoice.OrderId}
                onChange={e => setNewInvoice({ ...newInvoice, OrderId: e.target.value })}
                required
              >
                <option value="">Select Order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>{order.id}</option>
                ))}
              </select>
              <button type="submit">{isAdding ? 'Add Invoice' : 'Update Invoice'}</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
