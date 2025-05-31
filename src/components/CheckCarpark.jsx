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
  
  ////////////////////////////////////////////
  // Add search function
   const [results, setResults] = useState([]);
 // filter mapping address realtime
const handleSearch = (e) => {
  const input = e.target.value;
  setLocation(input); // support checkAvailability

  if (input.trim() === '') {
    setResults([]);
    return;
  }

  const filtered = mapping.filter(cp =>
    cp.address.toLowerCase().includes(input.toLowerCase())
  );
  setResults(filtered);
};

// when user clicks on one result
const handleSelectSuggestion = (cp) => {
  setLocation(cp.address);
  setResults([]);
  checkAvailability(cp.address); // 自动查询可用车位
};
///////////////////////////////////////////
  const checkAvailability = async (manualAddress) => {
    const searchLocation = manualAddress || location;
    
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
        <span className="display-1">🚗</span> <br />
      <h1 className="mb-4">GOT CARPARK OR NOT?</h1>

      <SearchForm
        location={location}
        setLocation={setLocation}
        onCheck={checkAvailability}
        loading={loading}
        onSearchChange={handleSearch}
      />
      
      {/* ✅ show suggest list */}
      {results.length > 0 && (
        <div className="border rounded p-2 mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <strong>possible address：</strong>
          <ul className="list-unstyled mb-0">
            {results.map(cp => (
              <li
                key={cp.car_park_no}
                onClick={() => handleSelectSuggestion(cp)}
                style={{ cursor: 'pointer', padding: '4px 0', borderBottom: '1px solid #eee' }}
              >
                {cp.address}
              </li>
            ))}
          </ul>
        </div>
      )}

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
