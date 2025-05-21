import {useState} from 'react';
import axios from 'axios';
import mapping from '../data/carparkDetailsWithLatLng.json';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon (default URLs are broken in many setups)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const baseURL = 'https://api.data.gov.sg/v1/transport/carpark-availability'

function CheckCarpark(){

    const [location, setLocation] = useState('');
    const [availability, setAvailability] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedCarpark, setSelectedCarpark] = useState(null);

  
    const checkAvailability = async () => {

    //find carpark from address
    const findCarpark = mapping.find(cp =>
        cp.address.toLowerCase().includes(location.toLowerCase())
    );
    if (!findCarpark || !findCarpark.lat || !findCarpark.lng){
        console.log('stuck here');
        setErrorMsg('location not found');
        setAvailability(null);
        setSelectedCarpark(null);
        return;
    }

        try {
            const response = await axios.get(baseURL);
            const carparkData = response.data.items[0].carpark_data;
            console.log(carparkData);

            const carpark = carparkData.find(cp => cp.carpark_number === findCarpark.car_park_no);

            if (carpark) {
                setAvailability(carpark.carpark_info[0].lots_available);
                setSelectedCarpark(findCarpark);
                setErrorMsg('');
                //console.log(`Carpark available at ${findCarpark.car_park_no}:`,carpark.carpark_info[0].lots_available)
            } else {
                setErrorMsg('no data found');
                setAvailability(null);
                setSelectedCarpark(null);
            }


        } catch (err) {
            setErrorMsg('cannot fetch data');
            setAvailability(null);
            setSelectedCarpark(null);
            console.log(err.message); 
        }
    };


    return (
        <div>
            <h2>Got carpark or not?</h2>
            <input 
                type= "text"
                value= {location}
                placeholder= "Enter address (e.g. 2A Dover Road)"
                onChange={(e)=> setLocation(e.target.value)}
            />
            <button onClick={checkAvailability}>check carpark</button>
            
          {availability !== null && selectedCarpark && (
        <div>
          <p>
            <strong>{selectedCarpark.address}</strong><br />
            Lots available: {availability}<br />
            Type: {selectedCarpark.car_park_type}
          </p>

          <MapContainer
            center={[selectedCarpark.lat, selectedCarpark.lng]}
            zoom={18}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedCarpark.lat, selectedCarpark.lng]}>
              <Popup>
                {selectedCarpark.address}<br />
                Lots available: {availability}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
    )

}

export default CheckCarpark