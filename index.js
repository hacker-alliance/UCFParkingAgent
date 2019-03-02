"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const cheerio = require('cheerio');
const url = 'http://secure.parking.ucf.edu/GarageCount/iframe.aspx';

const restService = express();

var garages = {
  "A": 0,
  "B": 1,
  "C": 2,
  "D": 3,
  "H": 4,
  "I": 5,
  "Libra": 6
}

var garage_capacity = {
  "A": "1623",
  "B": "1259",
  "C": "1852",
  "D": "1241",
  "H": "1284",
  "I": "1231",
  "Libra": "1007"
}

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/garage", function(req, res) {
  scrape_garage().then(function(garageJSON){
    var intent = intents[req.body.queryResult.intent.displayName];

    if (intent)
      return intent(req, res, garageJSON);

    return res.json({});
  })
});

function scrape_garage(){
  var garageAvail = [];

  return new Promise((resolve,reject)=>{
    request(url, (function (error, response, body) {
    	const $ = cheerio.load(body);

      // Parse and save garage parking spaces number
    	$('strong').each(function(i, elem) {
    		//Get Garage Load
    		garageAvail[i] = $(this).text();
      });

      resolve(garageAvail);
    }));
  })
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});






var intents = {
  "SpotsLeft": intentSpotsLeft,
  "SpotsTotal": intentSpotsTotal
}





var flavorCounter = 0;
var flavortextSpotsLeft = {
  0: function(garage, count,total){
    return "In "+garage +", there are "+ count+" cars parked out of "+total;
  },
  1: function(garage, count,total){
    return "There are "+count +" cars out of " + total + " in garage " + garage;
  },
  2: function(garage,count,total){
    return "Garage "+ garage +" is "+ parseInt((count/total)*100)+ "% full";
  }

}
var flavortextSpotsLeft = {
  0: function(garage, count) {
    return (count < 50) ? "Only " + count.toString() + " spots left!" : "There's " + count.toString() + " spots left!";
  },
  1: function(garage, count) {
    return "There's " + count.toString() + " parking spots";
  },
  2: function(garage, count) {
    return count.toString() + " spots";
  },
  3: function(garage, count) {
    return "Garage " + garage + " currently has " + count.toString() + " spots left";
  },
  4: function(garage, count) {
    return "There are " + count.toString() + " spots left in garage " + garage;
  }
}

function intentSpotsLeft(req, res, garageJSON){
  var garage_name = req.body.queryResult.parameters.garage;
  var responseText;

  if (flavorCounter >= flavortextSpotsLeft.length)
    flavorCounter = 0;
  else
    flavorCounter++;

  if (garageJSON[garages[garage_name]])
    responseText = flavortextSpotsLeft[flavorCounter](garage_name, parseInt(garageJSON[garages[garage_name]]));



  return res.json({
    "fulfillmentText": responseText,
    "payload": {
      "google": {
        "expectUserResponse": true
      }
    }
  });
}
function intentSpotsTotal(req,res,garageJSON){
  var garage_name = req.body.queryResult.parameters.garage;
  var responseText;

  if (flavorCounter >= flavortextSpotsTotal.length)
    flavorCounter = 0;
  else
    flavorCounter++;

  if(garageJSON[garages[garage_name]])
    responseText = flavortextSpotsTotal[flavorCounter](garage_name,parseInt(garages[garage_name],garage_capacity[garage_name]))
}
