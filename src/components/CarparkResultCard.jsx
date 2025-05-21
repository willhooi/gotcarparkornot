import { Card } from 'react-bootstrap';
import CarparkMap from './CarparkMap';

function CarparkResultCard({ availability, carpark }) {
  const cardVariant = availability > 0 ? 'bg-success' : 'bg-danger';

  return (
    <Card className={`mb-4 text-white ${cardVariant}`}>
      <Card.Body>
        <Card.Title>{availability > 0 ? <h1>GOT!</h1> : <h1>NOPE!</h1>}</Card.Title>
        <Card.Text>
          <strong>{carpark.address}</strong> <br />
          <strong>Lots Available:</strong> {availability}<br />
          <strong>Type:</strong> {carpark.car_park_type}
        </Card.Text>

        <CarparkMap lat={carpark.lat} lng={carpark.lng} address={carpark.address} availability={availability} />
      </Card.Body>
    </Card>
  );
}

export default CarparkResultCard;
