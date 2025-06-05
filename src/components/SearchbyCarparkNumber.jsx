import { useEffect, useState } from "react";
import axios from "axios";
import infoDetail from "../data/carparkDetailsWithLatLng.json";
import { Form, Button, Alert, Table } from "react-bootstrap";

const baseUrl = "https://api.data.gov.sg/v1/transport/carpark-availability";

function SearchbyCarparkNumber() {
  const [carparkinfo, setCarparkInfo] = useState(null);
  const [error, setError] = useState(null);
  const [cpnum, setCpNum] = useState(null);
  const [searchItem, setSearchItem] = useState(null);
  const [searchItemDetail, setSearchItemDetail] = useState(null);
  const [isDisplay, setIsDisplay] = useState(false);
  const [isCheck, setIsCheck] = useState(true);

  useEffect(() => {
    async function fetchCarparkData() {
      try {
        const response = await axios.get(baseUrl);
        const cpinfo = response.data.items?.[0]?.carpark_data || [];
        setCarparkInfo(cpinfo);
      } catch (error) {
        setError("Error fetching carpark data");
      }
    }

    fetchCarparkData();
  }, []);

  const handleChangeCheckbox = (event) => {
    setIsCheck(event.target.checked);
    setError(null);
  };

  const handlerSelect = (event) => {
    setCpNum(event.target.value);
  };

  const retrieveDateTime = () => {
    const [date, time] = searchItem.update_datetime.split("T");
    return { date, time };
  };

  function handlerSearch() {
    if (!cpnum) {
      setError("Please select a carpark number.");
    } else {
      const obj = carparkinfo.find((cp) => cp.carpark_number === cpnum);
      const objDetail = infoDetail.find((cp) => cp.car_park_no === cpnum);

      if (!obj || !objDetail) {
        setError("No parking lots data available for this carpark.");
        setIsDisplay(false);
      } else {
        setSearchItem(obj);
        setSearchItemDetail(objDetail);
        setIsDisplay(true);
        setError(null);
      }
    }
  }

  return (
    <div className="d-flex flex-column align-items-center text-center py-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mt-4 mb-3">🔍 Search by Carpark Number</h2>

      <Form.Check
        type="checkbox"
        label="Carpark Number"
        checked={isCheck}
        onChange={handleChangeCheckbox}
        className="mb-3"
      />

      {isCheck && (
        <Form className="d-flex align-items-center gap-3 mb-3 justify-content-center flex-wrap">
          <Form.Select onChange={handlerSelect} style={{ maxWidth: 250 }}>
            <option value="">-- Select carpark number --</option>
            {infoDetail.map((cpno, index) => (
              <option key={index} value={cpno.car_park_no}>
                {cpno.car_park_no}
              </option>
            ))}
          </Form.Select>
          <Button variant="primary" onClick={handlerSearch}>
            Search
          </Button>
        </Form>
      )}

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {isDisplay && searchItem && searchItemDetail && (
        <>
          <Table striped bordered hover className="w-100">
            <tbody>
              <tr>
                <td>Carpark Number</td>
                <td>{searchItem.carpark_number}</td>
              </tr>
              <tr>
                <td>Date</td>
                <td>{retrieveDateTime().date}</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>{retrieveDateTime().time}</td>
              </tr>
              <tr>
                <td>Total Lots</td>
                <td>{searchItem.carpark_info[0].total_lots}</td>
              </tr>
              <tr>
                <td>Available Lots</td>
                <td>{searchItem.carpark_info[0].lots_available}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{searchItemDetail.address}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{searchItemDetail.car_park_type}</td>
              </tr>
              <tr>
                <td>Short Term</td>
                <td>{searchItemDetail.short_term_parking}</td>
              </tr>
            </tbody>
          </Table>
          <Button variant="secondary" onClick={() => setIsDisplay(false)}>
            Close
          </Button>
        </>
      )}
    </div>
  );
}

export default SearchbyCarparkNumber;
