//Convert standard carpark JSON that uses x-y coordinates to lat-lng

import fs from 'fs';
import proj4 from 'proj4';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define SVY21 projection
const SVY21 = '+proj=tmerc +lat_0=1.366666 +lon_0=103.833333 ' +
              '+k=1.0 +x_0=28001.642 +y_0=38744.572 ' +
              '+ellps=WGS84 +units=m +no_defs';

const WGS84 = proj4.WGS84;

// Load carpark data
const inputPath = path.join(__dirname, '../data/carparkDetails.json');
const outputPath = path.join(__dirname, '../data/carparkDetailsWithLatLng.json');

const rawData = fs.readFileSync(inputPath);
const carparks = JSON.parse(rawData);

// Convert coordinates
const enhancedCarparks = carparks.map(cp => {
  try {
    const { x_coord, y_coord } = cp;
    if (x_coord && y_coord) {
      const [lng, lat] = proj4(SVY21, WGS84, [x_coord, y_coord]);
      return { ...cp, lat, lng };
    }
    return cp;
  } catch (err) {
    console.error(`Error converting ${cp.car_park_no}:`, err);
    return cp;
  }
});

fs.writeFileSync(outputPath, JSON.stringify(enhancedCarparks, null, 2));
console.log(`✅ Saved to ${outputPath}`);
