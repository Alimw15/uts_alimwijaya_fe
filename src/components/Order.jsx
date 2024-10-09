import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Order() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [newOrder, setNewOrder] = useState({ orderDate: '', CustomerId: '', SalesPersonId: '' });
  const [editingOrder, setEditingOrder] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersResponse, customersResponse, salespersonsResponse] = await Promise.all([
        axios.get('http://localhost:5000/order'),
        axios.get('http://localhost:5000/customer'),
        axios.get('http://localhost:5000/salesperson')
      ]);
      setOrders(ordersResponse.data);
      setCustomers(customersResponse.data);
      setSalespersons(salespersonsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    }
  };

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!newOrder.orderDate || !newOrder.CustomerId || !newOrder.SalesPersonId) {
      setError('Please fill in all the fields before adding an order.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/createOrder', newOrder);
      setOrders(prevOrders => [...prevOrders, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Failed to add order. Please try again.');
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({ orderDate: order.orderDate, CustomerId: order.CustomerId, SalesPersonId: order.SalesPersonId });
    setShowPopup(true);
    setIsAdding(false);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!newOrder.orderDate || !newOrder.CustomerId || !newOrder.SalesPersonId) {
      setError('Please fill in all the fields before updating the order.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/updateOrder/${editingOrder.id}`, newOrder);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order. Please try again.');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteOrder/${id}`);
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order. Please try again.');
    }
  };

  const resetForm = () => {
    setNewOrder({ orderDate: '', CustomerId: '', SalesPersonId: '' });
    setEditingOrder(null);
    setShowPopup(false);
    setIsAdding(false);
    setError('');
  };

  return (
    <div>
      <h2>Orders</h2>
      <button className='add-button' onClick={() => {
        setShowPopup(true);
        setIsAdding(true);
        setNewOrder({ orderDate: '', CustomerId: '', SalesPersonId: '' });
      }}>Add Order</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order Date</th>
            <th>Customer</th>
            <th>Salesperson</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderDate}</td>
              <td>{customers.find(c => c.id === order.CustomerId)?.name || 'Unknown'}</td>
              <td>{salespersons.find(s => s.id === order.SalesPersonId)?.name || 'Unknown'}</td>
              <td>
                <button onClick={() => handleEditOrder(order)}>Edit</button>
                <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isAdding ? 'Add Order' : 'Edit Order'}</h3>
            <form onSubmit={isAdding ? handleAddOrder : handleUpdateOrder}>
              <input
                type="date"
                value={newOrder.orderDate}
                onChange={e => setNewOrder({ ...newOrder, orderDate: e.target.value })}
                required
              />
              <select
                value={newOrder.CustomerId}
                onChange={e => setNewOrder({ ...newOrder, CustomerId: e.target.value })}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <select
                value={newOrder.SalesPersonId}
                onChange={e => setNewOrder({ ...newOrder, SalesPersonId: e.target.value })}
                required
              >
                <option value="">Select Salesperson</option>
                {salespersons.map(salesperson => (
                  <option key={salesperson.id} value={salesperson.id}>{salesperson.name}</option>
                ))}
              </select>
              <button type="submit">{isAdding ? 'Add Order' : 'Update Order'}</button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
