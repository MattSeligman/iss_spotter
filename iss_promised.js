const request = require('request-promise-native');

const fetchMyIP = () => {
  return request("https://api.ipify.org/?format=json");
};

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ip}`);
};

const fetchISSFlyOverTimes = (coordinatesObject)=>{
  const {latitude, longitude} = JSON.parse(coordinatesObject);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return printPassTimes(response);
    });
};

const printPassTimes = (passTimes)=>{
  passTimes.forEach((value)=>{
    //Fri Jun 01 2021 13:01:35 GMT-0700 (Pacific Daylight Time)
    const time = new Date(0);
    time.setUTCSeconds(value.risetime);
    const duration = value.duration;
  
    const response = `Next pass at ${time} for ${duration} seconds!`;
    console.log(response);
    
  });
};

module.exports = { nextISSTimesForMyLocation };