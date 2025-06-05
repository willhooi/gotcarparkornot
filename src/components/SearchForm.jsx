import { Form, Button, Row, Col, Spinner } from "react-bootstrap";

function SearchForm({
  location,
  setLocation,
  onCheck,
  loading,
  onSearchChange,
  userAddress,
  setUserAddress,
  onRoute,
}) {
  return (
    <Form
      className="mb-3"
      onSubmit={(e) => {
        e.preventDefault();
        onCheck();
      }}
    >
      <Form.Group
        as={Row}
        controlId="carparkSearch"
        className="justify-content-center"
      >
        <Form.Label column sm="auto" className="pt-2">
          I want to park at:
        </Form.Label>

        <Col sm={6}>
          <Form.Control
            type="text"
            value={location}
            placeholder="e.g. 2A Dover Road"
            onChange={onSearchChange}
            size="sm"
          />
        </Col>

        <Col sm="auto">
          <Button
            variant="primary"
            onClick={onCheck}
            disabled={loading}
            size="sm"
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Check"}
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
