import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddVehicle = () => {
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddVehicle = async () => {
    if (!vehicleName || !vehicleStatus) {
      setError('Both Vehicle Name and Status are required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/routes/vehicles', {
        name: vehicleName,
        status: vehicleStatus,
      });
      setVehicleName('');
      setVehicleStatus('');
      setError('');
    } catch {
      setError('Error adding vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Vehicle</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Form>
        <Form.Group controlId="vehicleName">
          <Form.Label>Vehicle Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter vehicle name"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="vehicleStatus">
          <Form.Label>Vehicle Status</Form.Label>
          <Form.Control
            as="select"
            value={vehicleStatus}
            onChange={(e) => setVehicleStatus(e.target.value)}
          >
            <option>Available</option>
            <option>In Use</option>
            <option>Under Maintenance</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" onClick={handleAddVehicle} disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </Button>
      </Form>
    </div>
  );
};

export default AddVehicle;
