import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Joi from 'joi';

function GetPostalCode() {
  const [inputValue, setInputValue] = useState('');
  const [postalData, setPostalData] = useState(null);
  const [error, setError] = useState(null);

  const schema = Joi.number().integer().min(100000).max(999999).required();

  const handleSearch = async () => {
    const { error: validationError } = schema.validate(inputValue);
    if (validationError) {
        setError('Invalid postal code. Please enter a 6-digit postal code.');
        setPostalData(null);
        return;
        }

    const baseUrl = 'https://www.onemap.gov.sg/api/common/elastic/search';
    const authToken = import.meta.env.VITE_ONEMAP_API_KEY;

    try {
      const response = await axios.get(baseUrl, {
        params: {
          searchVal: inputValue,
          returnGeom: 'Y',
          getAddrDetails: 'Y',
          pageNum: 1,
        },
        headers: {
          Authorization: authToken,
        },
      });

      if (response.data.found > 0) {
        setPostalData(response.data.results[0]);
        console.log(response.data.results[0]);
        setError(null);
      } else {
        setPostalData(null);
        setError('No results found.');
      }
    } catch (err) {
      setPostalData(null);
      setError(`Error: ${err.message}`);
    }
  };

  return (
     <div className="container mt-4">
      <h1>Get Postal Code</h1>
      <Form>
        <Form.Group controlId="postalCode">
          <Form.Label>Enter a postal code to search:</Form.Label>
          <Form.Control
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 560702"
            maxLength={6}
          />
        </Form.Group>
        <Button variant="primary" className="mt-2" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {error && <p className="text-danger mt-3">{error}</p>}

      {postalData && (
        <div className="mt-4">
          <p><strong>Address:</strong> {postalData.BLK_NO} {postalData.ROAD_NAME}</p>
          <p><strong>Postal Code:</strong> {postalData.POSTAL}</p>
        </div>
      )}
    </div>
  );
}

export default GetPostalCode;
