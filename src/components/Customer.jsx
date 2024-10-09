import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const getCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/customer');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error getting customers:', error);
      setError('Failed to fetch customers. Please try again.');
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError('Please fill in all the fields before adding a customer.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/createCustomer', newCustomer);
      setNewCustomer({ name: '', email: '', phone: '' });
      getCustomers(); 
      setShowPopup(false);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Failed to add customer. Please try again.');
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone });
    setShowPopup(true);
    setIsAdding(false);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError('Please fill in all the fields before updating the customer.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/updateCustomer/${editingCustomer.id}`, newCustomer);
      setNewCustomer({ name: '', email: '', phone: '' });
      setEditingCustomer(null);
      setShowPopup(false);
      getCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer. Please try again.');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`http://localhost:5000/deleteCustomer/${customerId}`);
      getCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer. Please try again.');
    }
  };
  
  return (
    <div>
      <h2>Customers</h2>
      <button className='add-button' onClick={() => {
        setShowPopup(true);
        setIsAdding(true);
        setNewCustomer({ name: '', email: '', phone: '' });
      }}>Add Customer</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id || index}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>
                <button onClick={() => handleEditCustomer(customer)}>Edit</button>
                <button onClick={() => handleDeleteCustomer(customer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isAdding ? 'Add Customer' : 'Edit Customer'}</h3>
            <form onSubmit={isAdding ? handleAddCustomer : handleUpdateCustomer}>
              <input
                type="text"
                placeholder="Name"
                value={newCustomer.name}
                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
              <button type="submit">{isAdding ? 'Add Customer' : 'Update Customer'}</button>
              <button type="button" onClick={() => {
                setShowPopup(false);
                setEditingCustomer(null);
                setNewCustomer({ name: '', email: '', phone: '' });
              }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;
