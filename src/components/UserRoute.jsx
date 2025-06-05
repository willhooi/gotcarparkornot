import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';

function UserRoute({ 
  userAddress, 
  setUserAddress, 
  handleRouteClick, 
  selectedCarpark, 
  loading 
}) {
  return (
    <>
    
    <Form className="mb-3 border p-3 bg-light">
      <Form.Group as={Row} controlId="userAddress">
        <Form.Label column sm={2} style={{ color: 'black' }}>
            I am at:
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            value={userAddress}
            placeholder="Leave blank to use your current location."
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </Col>
        <Col sm={2}>
          <Button
            variant="info"
            onClick={handleRouteClick}
            disabled={!selectedCarpark || loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Route'}
          </Button>
        </Col>
      </Form.Group>
    </Form>
    </>
  );
}

export default UserRoute;
