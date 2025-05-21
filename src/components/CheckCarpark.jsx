import {useState} from 'react';
import axios from 'axios';
import mapping from '../data/carparkDetails.json';

const baseURL = 'https://api.data.gov.sg/v1/transport/carpark-availability'

function CheckCarpark(){

    const [location, setLocation] = useState('');
    const [availability, setAvailability] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

  
    const checkAvailability = async () => {

    //find carpark from address
    const findCarpark = mapping.find(cp =>
        cp.address.toLowerCase().includes(location.toLowerCase())
    );
    if (!findCarpark){
        console.log('location not found');
        setErrorMsg('location not found');
        setAvailability(null);
        return;
    }

        try {
            const response = await axios.get(baseURL);
            const carparkData = response.data.items[0].carpark_data;
            console.log(carparkData);

            const carpark = carparkData.find(cp => cp.carpark_number === findCarpark.car_park_no);

            if (carpark) {
                setAvailability({
                    lots: carpark.carpark_info[0].lots_available,
                    type: carpark.carpark_info[0].lot_type,
                    address: findCarpark.address
                });
                setErrorMsg('');
                console.log(`Carpark available at ${findCarpark.car_park_no}:`,carpark.carpark_info[0].lots_available)
            } else {
                setErrorMsg('no data found');
                setAvailability(null);
            }


        } catch (err) {
            setErrorMsg('cannot fetch data');
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
            
            {availability && (
                <p>
                    <strong>{availability.address}</strong> <br />
                    Available lots: {availability.lots} <br />
                    Lot type: {availability.type}
                </p>
            )}

            {errorMsg && <p>{errorMsg}</p>}
        </div>
    )

}

export default CheckCarpark