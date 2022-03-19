const { nextISSTimesForMyLocation } = require('./iss');

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

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // calls the parrent function imported from iss using each value passed in.
  printPassTimes(passTimes);
});