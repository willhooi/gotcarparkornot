import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

function SearchForm({ 
  location, 
  setLocation, 
  onCheck, 
  loading, 
  onSearchChange,
  userAddress,
  setUserAddress,
  onRoute 

}) {

  return (
    <Form className="mb-3"
    onSubmit={(e) => {
        e.preventDefault();
        onCheck();
      }}
    >
      <Form.Group as={Row} controlId="carparkSearch">
        <Form.Label column sm={2}>Enter Address:</Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            value={location}
            placeholder="e.g. 2A Dover Road"
            
            // onChange={(e) => setLocation(e.target.value)}
            onChange={onSearchChange}
          />
        </Col>

        <Col sm={2}>
          <Button variant="primary" onClick={onCheck} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Check'}
          </Button>
        </Col>
      </Form.Group>

      {/* User address
      <Form.Group as={Row} controlId="userAddress" className="mt-3">
        <Form.Label column sm={2}>Your Address:</Form.Label>
        <Col sm={10}>
          <Form.Control
            type="text"
            value={userAddress}
            placeholder="e.g. 123 Clementi Road"
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </Col>
      </Form.Group> */}

      {/* Route button
      <Row className="mt-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button
            variant="success"
            onClick={onRoute}
            disabled={!userAddress}
          >
            Route to this Carpark
          </Button>
        </Col>
      </Row> */}
    </Form>
  );
}

export default SearchForm;
