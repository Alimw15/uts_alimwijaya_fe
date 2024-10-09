import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Salesperson() {
  const [salespersons, setSalespersons] = useState([]);
  const [newSalesperson, setNewSalesperson] = useState({ name: '', email: '', phone: '' });
  const [editingSalesperson, setEditingSalesperson] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const getSalespersons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/salesperson');
      setSalespersons(response.data);
    } catch (error) {
      console.error('Error getting salespersons:', error);
      setError('Failed to fetch salespersons. Please try again.');
    }
  };

  useEffect(() => {
    getSalespersons();
  }, []);

  const handleAddSalesperson = async (e) => {
    e.preventDefault();
    setError('');

    if (!newSalesperson.name || !newSalesperson.email || !newSalesperson.phone) {
      setError('Please fill in all the fields before adding a salesperson.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/createSalesPerson', newSalesperson);
      setNewSalesperson({ name: '', email: '', phone: '' });
      getSalespersons();
      setShowPopup(false);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding salesperson:', error);
      setError('Failed to add salesperson. Please try again.');
    }
  };

  const handleEditSalesperson = (salesperson) => {
    setEditingSalesperson(salesperson);
    setNewSalesperson({ name: salesperson.name, email: salesperson.email, phone: salesperson.phone });
    setShowPopup(true);
    setIsAdding(false);
  };

  const handleUpdateSalesperson = async (e) => {
    e.preventDefault();
    setError('');

    if (!newSalesperson.name || !newSalesperson.email || !newSalesperson.phone) {
      setError('Please fill in all the fields before updating the salesperson.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/updateSalesperson/${editingSalesperson.id}`, newSalesperson);
      setNewSalesperson({ name: '', email: '', phone: '' });
      setEditingSalesperson(null);
      setShowPopup(false);
      getSalespersons();
    } catch (error) {
      console.error('Error updating salesperson:', error);
      setError('Failed to update salesperson. Please try again.');
    }
  };

  const handleDeleteSalesperson = async (salespersonId) => {
    try {
      await axios.delete(`http://localhost:5000/deleteSalesperson/${salespersonId}`);
      getSalespersons();
    } catch (error) {
      console.error('Error deleting salesperson:', error);
      setError('Failed to delete salesperson. Please try again.');
    }
  };

  return (
    <div>
      <h2>Salespersons</h2>
      <button className='add-button' onClick={() => {
        setShowPopup(true);
        setIsAdding(true);
        setNewSalesperson({ name: '', email: '', phone: '' });
      }}>Add Salesperson</button>
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
          {salespersons.map((salesperson, index) => (
            <tr key={salesperson.id || index}>
              <td>{salesperson.id}</td>
              <td>{salesperson.name}</td>
              <td>{salesperson.email}</td>
              <td>{salesperson.phone}</td>
              <td>
                <button onClick={() => handleEditSalesperson(salesperson)}>Edit</button>
                <button onClick={() => handleDeleteSalesperson(salesperson.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isAdding ? 'Add Salesperson' : 'Edit Salesperson'}</h3>
            <form onSubmit={isAdding ? handleAddSalesperson : handleUpdateSalesperson}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
              <input
                type="text"
                placeholder="Name"
                value={newSalesperson.name}
                onChange={e => setNewSalesperson({ ...newSalesperson, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newSalesperson.email}
                onChange={e => setNewSalesperson({ ...newSalesperson, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newSalesperson.phone}
                onChange={e => setNewSalesperson({ ...newSalesperson, phone: e.target.value })}
                required
              />
              <button type="submit">{isAdding ? 'Add Salesperson' : 'Update Salesperson'}</button>
              <button type="button" onClick={() => {
                setShowPopup(false);
                setEditingSalesperson(null);
                setNewSalesperson({ name: '', email: '', phone: '' });
                setError('');
              }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salesperson;
