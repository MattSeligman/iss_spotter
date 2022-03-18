// index.js
// const { fetchCoordsByIP } = require('./iss');

// fetchCoordsByIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
//   fetchCoordsByIP(ip);
// });

const { fetchCoordsByIP, fetchMyIP, fetchISSFlyOverTimes } = require('./iss');

let ipAddress = '';
fetchMyIP((error, value)=> ipAddress = value);

fetchCoordsByIP(ipAddress, (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:' , coordinates);
  
  fetchISSFlyOverTimes(coordinates, (error, response)=>{
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }

    console.log(response);
    return response;

  });
});


