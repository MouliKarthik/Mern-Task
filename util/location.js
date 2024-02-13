// const axios = require('axios');
//const HttpError = require('../models/HttpError');

// const API_KEY = "api_key";


// async function getCoordsForAddress(address){
//     return {
//         lat: 40.7884474,
//         lng: -73.9871516
//     };
//     // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedURIComponent(address)}&key=${API_KEY}`);
//     //const data = response.data();
//     // if(!data || data.status ==='ZERO_RESULTS'){
//     // const error = new HttpError('Could not find location for the specified address',422);
//     // throw error;
//     // }
//     //const coordinates = data.results[0].geometry.location;
//     //return coordinates;
// }
const axios = require("axios");
const HttpError = require("../models/http-error");

const API_URL = "https://nominatim.openstreetmap.org/search";

const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `${API_URL}?format=json&q=${encodeURIComponent(address)}`
  );

  const data = response.data;

  if (!data || data.length === 0) {
    throw new HttpError(
      "Could not find location for the specified address.",
      422
    );
  }

  const coordinates = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

  return coordinates;
};



module.exports = getCoordsForAddress;