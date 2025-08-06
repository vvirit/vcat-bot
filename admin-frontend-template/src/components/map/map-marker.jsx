import { Marker } from 'react-map-gl/mapbox';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export function MapMarker({ ...other }) {
  return (
    <Marker {...other}>
      <Iconify icon="custom:location-fill" sx={[{ color: 'error.main' }]} />
    </Marker>
  );
}
