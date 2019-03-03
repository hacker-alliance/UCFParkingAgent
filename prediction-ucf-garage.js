const request = require("request");

module.exports = function(day,hour,min){
  //This is where Terrell's Collected Data and prediction lives
    const base_link = "https://www.3pointlabs.org/prediction/";
  return new Promise((resolve,reject)=>{
    console.log(hour, min);
    //If the inputs are Not a number then reject the promise.
    if(isNaN(hour) || isNaN(min)){
        reject(404, {error: "One of the input is not a number"});
    }
    //Capitalizes the first letter of the string, day
    dayUpper = day.charAt(0).toUpperCase() + day.slice(1);

    //forms the complete link to lead toward the prediction
    var link = base_link + dayUpper +"/" + hour +"/" +min + "/";

    //CURL the link so that it can take the results
    request(link, (function (error, response, body) {
      //Converts the body in to JSON for easy parsing
      console.log(response.statusCode);
      if(response.statusCode != 200)
        reject(response.statusCode,{error:"The CuRl has been malformed or the website is down"});
      garage = JSON.parse(body);
      jsontest = {};
      //Loop through each garage that exists
      garage.forEach((obj,index)=>{
        //The data structure will be {parkinggarage0: 1, ... parkinggarageN:5}

        jsontest[obj.garage] = obj.available;
        //if it's the last item, then resolve it.
        if(index==garage.length-1)
          resolve(jsontest);
      });

    }));

  });
}
