import { Card } from 'react-bootstrap';
import CarparkMap from './CarparkMap';

function CarparkResultCard({ availability, carpark, origin, routeCoords }) {
  const cardVariant = availability > 0 ? 'bg-success' : 'bg-danger';

  // Generate a dynamic key to force remount of the map on origin/route change
  const mapKey = `${carpark.car_park_no}-${origin?.[0] ?? 'no-origin'}-${origin?.[1] ?? 'no-origin'}`;

  return (
    <Card className={`mb-4 text-white ${cardVariant}`}>
      <Card.Body>
        <Card.Title>
          {availability > 0 ? <h1>GOT!</h1> : <h1>NOT!</h1>}
        </Card.Title>
        <br />
        <Card.Text>
          <span>{carpark.address}</span> <br />
          <strong>Lots Available:</strong> {availability}<br />
          <strong>Type:</strong> {carpark.car_park_type}
        </Card.Text>

        <CarparkMap
          key={mapKey}  
          lat={carpark.lat}
          lng={carpark.lng}
          address={carpark.address}
          availability={availability}
          origin={origin}
          routeCoords={routeCoords}
        />
      </Card.Body>
    </Card>
  );
}

export default CarparkResultCard;
