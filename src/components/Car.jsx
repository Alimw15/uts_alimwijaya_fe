import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Car() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({ brand: '', model: '', price: '' });
  const [editingCar, setEditingCar] = useState(null);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const getCars = async () => {
    try {
      const response = await axios.get('http://localhost:5000/car');
      setCars(response.data);
    } catch (error) {
      console.error('Error getting cars:', error);
      setError('Failed to fetch cars. Please try again.');
    }
  };

  useEffect(() => {
    getCars();
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    setError('');

    if (!newCar.brand || !newCar.model || !newCar.price) {
      setError('Please fill in all the fields before adding a car.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/createCar', newCar);
      setNewCar({ brand: '', model: '', price: '' });
      getCars(); 
      setShowPopup(false);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding car:', error);
      setError('Failed to add car. Please try again.');
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setNewCar({ brand: car.brand, model: car.model, price: car.price });
    setShowPopup(true);
    setIsAdding(false);
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    setError('');

    if (!newCar.brand || !newCar.model || !newCar.price) {
      setError('Please fill in all the fields before updating the car.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/updateCar/${editingCar.id}`, newCar);
      setNewCar({ brand: '', model: '', price: '' });
      setEditingCar(null);
      setShowPopup(false);
      getCars();
    } catch (error) {
      console.error('Error updating car:', error);
      setError('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
      await axios.delete(`http://localhost:5000/deleteCar/${carId}`);
      getCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Failed to delete car. Please try again.');
    }
  };

  return (
    <div>
      <h2>Cars</h2>
      <button className='add-button' onClick={() => {
        setShowPopup(true);
        setIsAdding(true);
        setNewCar({ brand: '', model: '', price: '' });
      }}>Add Car</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={car.id || index}>
              <td>{index + 1}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.price}</td>
              <td>
                <button onClick={() => handleEditCar(car)}>Edit</button>
                <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>{isAdding ? 'Add Car' : 'Edit Car'}</h3>
            <form onSubmit={isAdding ? handleAddCar : handleUpdateCar}>
              <input
                type="text"
                placeholder="Brand"
                value={newCar.brand}
                onChange={e => setNewCar({ ...newCar, brand: e.target.value })}
              />
              <input
                type="text"
                placeholder="Model"
                value={newCar.model}
                onChange={e => setNewCar({ ...newCar, model: e.target.value })}
              />
              <input
                type="text"
                placeholder="Price"
                value={newCar.price}
                onChange={e => setNewCar({ ...newCar, price: e.target.value })}
              />
              <button type="submit">{isAdding ? 'Add Car' : 'Update Car'}</button>
              <button type="button" onClick={() => {
                setShowPopup(false);
                setEditingCar(null);
                setNewCar({ brand: '', model: '', price: '' });
              }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Car;
