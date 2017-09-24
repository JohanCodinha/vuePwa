import axios from 'axios';

import token from './token.json';

const mapboxToken = token.mapbox;
const apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export default {
  reverseGeocoding: (longitude, latitude) => {
    console.log(`reverse geocoding for ${longitude}, ${latitude}`);
    const qs = `${longitude}%2C${latitude}.json?access_token=${mapboxToken}`;
    return axios.get(`${apiUrl}/${qs}`)
      .then(response => response.data);
  },
};

