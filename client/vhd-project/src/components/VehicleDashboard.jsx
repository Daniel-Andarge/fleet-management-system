import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';
import { Card, Modal, Button, Container, Row, Col } from 'react-bootstrap';

const VehicleDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/routes/vehicles');
      setVehicles(response.data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async () => {
    if (!vehicleName.trim() || !vehicleStatus.trim()) {
      setError('Both Vehicle Name and Status are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5000/routes/vehicles', {
        name: vehicleName,
        status: vehicleStatus,
      });
      setVehicleName('');
      setVehicleStatus('');
      fetchVehicles();
    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError('Failed to add vehicle. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (id, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:5000/routes/vehicles/${id}`, {
        status: newStatus,
      });
      fetchVehicles();
    } catch (err) {
      console.error('Error updating vehicle:', err);
      setError('Failed to update vehicle status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
  };

  const handleSaveChanges = async () => {
    if (editingVehicle) {
      try {
        await axios.put(
          `http://localhost:5000/routes/vehicles/${editingVehicle._id}`,
          {
            name: editingVehicle.name,
            status: editingVehicle.status,
          }
        );
        fetchVehicles();
        handleCloseModal();
      } catch (err) {
        console.error('Error saving changes:', err);
        setError('Failed to save changes. Please try again later.');
      }
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Vehicle Name',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: StatusCell,
      },
      {
        Header: 'Last Updated',
        accessor: 'lastUpdated',
        Cell: ({ value }) => (value ? new Date(value).toLocaleString() : 'N/A'),
      },
    ],
    []
  );

  const data = React.useMemo(() => vehicles, [vehicles]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  useEffect(() => {
    fetchVehicles();

    return () => {
      setVehicles([]);
      setError(null);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Container fluid>
        <Row>
          <Col xs={12} style={{ padding: '20px' }}>
            <h1>Vehicle Management Dashboard</h1>

            {loading && <div>Loading...</div>}
            {error && (
              <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
            )}

            <Card style={{ marginBottom: '20px' }}>
              <Card.Body>
                <Card.Title>Total Vehicles</Card.Title>
                <Card.Text>{vehicles.length}</Card.Text>
              </Card.Body>
            </Card>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Vehicle Name"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                style={{ marginRight: '10px', padding: '8px' }}
              />
              <select
                value={vehicleStatus}
                onChange={(e) => setVehicleStatus(e.target.value)}
                style={{ marginRight: '10px', padding: '8px' }}
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="On Job">On Job</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <button
                onClick={addVehicle}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                Add Vehicle
              </button>
            </div>

            {vehicles.length > 0 ? (
              <table
                {...getTableProps()}
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '20px',
                }}
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={headerGroup.id}
                    >
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          style={{
                            padding: '10px',
                            border: '1px solid black',
                            textAlign: 'left',
                            backgroundColor: '#f9f9f9',
                          }}
                          key={column.id}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id}>
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              padding: '8px',
                              border: '1px solid black',
                            }}
                            key={cell.column.id}
                          >
                            {cell.render('Cell')}
                          </td>
                        ))}
                        <td>
                          <button
                            onClick={() => handleShowModal(row.original)}
                            style={{
                              marginLeft: '8px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              !loading && <div>No vehicles available.</div>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Vehicle</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {editingVehicle && (
                  <div>
                    <div style={{ marginBottom: '10px' }}>
                      <label>Vehicle Name:</label>
                      <input
                        type="text"
                        value={editingVehicle.name}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            name: e.target.value,
                          })
                        }
                        style={{ width: '100%', padding: '8px' }}
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label>Status:</label>
                      <select
                        value={editingVehicle.status}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            status: e.target.value,
                          })
                        }
                        style={{ width: '100%', padding: '8px' }}
                      >
                        <option value="Available">Available</option>
                        <option value="On Job">On Job</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>

      <footer
        style={{
          backgroundColor: '#f1f1f1',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>© 2024 Vehicle Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const StatusCell = ({ row }) => {
  return <>{row.original.status}</>;
};

StatusCell.propTypes = {
  row: PropTypes.object.isRequired,
};

export default VehicleDashboard;
