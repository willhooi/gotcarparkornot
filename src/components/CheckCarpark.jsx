import { useState } from 'react';
import axios from 'axios';
import mapping from '../data/carparkDetailsWithLatLng.json';
import { Container, Alert, Spinner } from 'react-bootstrap';
import SearchForm from './SearchForm';
import CarparkResultCard from './CarparkResultCard';

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

      <SearchForm
        location={location}
        setLocation={setLocation}
        onCheck={checkAvailability}
        loading={loading}
      />

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

      {availability !== null && selectedCarpark && (
        <CarparkResultCard
          availability={availability}
          carpark={selectedCarpark}
        />
      )}
    </Container>
  );
}

export default CheckCarpark;
