import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Optional: user and carpark custom icons
const userIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const carparkIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Component to auto-zoom map to bounds when origin/destination changes
function FitBounds({ origin, destination }) {
  const map = useMap();

  useEffect(() => {
    if (origin && destination) {
      const bounds = [origin, destination];
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [origin, destination, map]);

  return null;
}

///////////////////////////////////////

function CarparkMap({
  lat,
  lng,
  address,
  availability,
  origin = null,
  routeCoords = [],
}) {
  const destination = [lat, lng];

  return (
    <MapContainer
      center={destination}
      zoom={18}
      style={{ height: '400px', width: '100%' }}
      className="rounded"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Carpark marker */}
      <Marker position={destination} icon={carparkIcon}>
        <Popup>
          {address}
          <br />
          Lots available: {availability}
        </Popup>
      </Marker>

      {/* User origin marker */}
      {origin && (
        <Marker position={origin} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>
      )}

      {/* Route polyline */}
      {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}

      {/* Auto fit to bounds */}
      {origin && <FitBounds origin={origin} destination={destination} />}
    </MapContainer>
  );
}

export default CarparkMap;
