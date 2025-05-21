import { useState } from 'react';
import axios from 'axios';
import mapping from '../data/carparkDetailsWithLatLng.json';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Container, Form, Button, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const baseURL = 'https://api.data.gov.sg/v1/transport/carpark-availability';

function CheckCarpark() {
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedCarpark, setSelectedCarpark] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async () => {
    const findCarpark = mapping.find(cp =>
      cp.address.toLowerCase().includes(location.toLowerCase())
    );

    if (!findCarpark || !findCarpark.lat || !findCarpark.lng) {
      setErrorMsg('Location not found in mapping.');
      setAvailability(null);
      setSelectedCarpark(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(baseURL);
      const carparkData = response.data.items[0].carpark_data;

      const carpark = carparkData.find(cp => cp.carpark_number === findCarpark.car_park_no);

      if (carpark && carpark.carpark_info.length > 0) {
        setAvailability(carpark.carpark_info[0].lots_available);
        setSelectedCarpark(findCarpark);
        setErrorMsg('');
      } else {
        setErrorMsg('No availability data for this carpark.');
        setAvailability(null);
        setSelectedCarpark(null);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch data.');
      setAvailability(null);
      setSelectedCarpark(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">🚗 GOT CARPARK OR NOT?</h1>

      <Form className="mb-3">
        <Form.Group as={Row} controlId="carparkSearch">
          <Form.Label column sm={2}>Enter Address:</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              value={location}
              placeholder="e.g. 2A Dover Road"
              onChange={(e) => setLocation(e.target.value)}
            />
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={checkAvailability} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Check'}
            </Button>
          </Col>
        </Form.Group>
      </Form>

      {errorMsg && (
        <Alert variant="danger">{errorMsg}</Alert>
      )}

      {availability !== null && selectedCarpark && (
        <Card className={`mb-4 text-white ${availability > 0 ? 'bg-success' : 'bg-danger'}`}>
          <Card.Body>
            <Card.Title>{availability > 0 ? <h1>GOT!</h1>: <h1>NOPE!</h1>}</Card.Title>
            <Card.Text>
                <strong>{selectedCarpark.address}</strong> <br />
                <strong>Lots Available:</strong> {availability}<br />
                <strong>Type:</strong> {selectedCarpark.car_park_type}
            </Card.Text>

            <MapContainer
              center={[selectedCarpark.lat, selectedCarpark.lng]}
              zoom={18}
              style={{ height: '400px', width: '100%' }}
              className="rounded"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[selectedCarpark.lat, selectedCarpark.lng]}>
                <Popup>
                  {selectedCarpark.address}<br />
                  Lots available: {availability}
                </Popup>
              </Marker>
            </MapContainer>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default CheckCarpark;
