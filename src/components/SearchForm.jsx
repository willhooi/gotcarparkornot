import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

function SearchForm({ location, setLocation, onCheck, loading, onSearchChange }) {

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
    </Form>
  );
}

export default SearchForm;
