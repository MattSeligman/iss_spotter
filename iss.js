// enables the request to fetch the url (url, callback(error, response, pageContents))
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API

  request('https://api.ipify.org/?format=json', (error, response, body) => {

    // if there is an error return the error to the callback to report.
    if (error) return callback(error,null);

    // let's check that statusCode response is accepted [200-299]
    const statusSuccess = (/2[0-9][0-9]/).test(response.statusCode);

    // lets check if the status isn't 200-299 and if so return it to the callback with the error message.
    if (!statusSuccess) {
      const msg = `Status Code ${response.statusCode} when fetching IP. \n --------------- Error Response --------------- \n${body}`;
      callback(Error(msg), null);
      return;
    }

    // lets check if the status is within 200-209 statusCode and if yes then lets send that data.
    if (statusSuccess) {
      // grab that data parsing it from the body object.
      let ipAddress = JSON.parse(body).ip;

      // sending the null so error isn't triggered, and pushing the value.
      callback(null, ipAddress);
      return;
    }
  });
};

const fetchCoordsByIP = function(ip, callback) {
  
  // search the api for Location
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {

    // if there is an error in that search let the callback know
    if (error) return callback(error, null);

    // if there's a response code that's not 200 throw a statusCode error.
    if (response.statusCode !== 200) return callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);

    // create a object using the JSON Parsed body data.
    const { latitude, longitude } = JSON.parse(body);

    // push the new object back into the callback to send to index.js
    callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  
  // search the api for Location
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    // if there is an error in that search let the callback know
    if (error) return callback(error, null);

    // if there's a response code that's not 200 throw a statusCode error.
    if (response.statusCode !== 200) return callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);

    // create a object using the JSON Parsed body data.
    let flyTimes = JSON.parse(body).response;

    callback(null,flyTimes);
  });

};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};




module.exports = { nextISSTimesForMyLocation };