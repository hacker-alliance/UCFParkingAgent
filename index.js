"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const scrape_garage = require("./scrape-ucf-garage");
const predict_garage = require("./prediction-ucf-garage");

const restService = express();

const {
  dialogflow,
  actionssdk,
  Image,
  Table,
  Carousel,
  Permission,
} = require('actions-on-google');

const app = dialogflow();


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
  "A": 1623,
  "B": 1259,
  "C": 1852,
  "D": 1241,
  "H": 1284,
  "I": 1231,
  "Libra": 1007
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

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}






var intents = {
  "SpotsLeft": intentSpotsLeft,
  "SpotsTaken": intentSpotsTaken
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
  var flavorCounter1 = getRandomInt(5);
  var garage_name = req.body.queryResult.parameters.garage;
  var responseText;

  if (garageJSON[garages[garage_name]])
    responseText = flavortextSpotsLeft[flavorCounter1](garage_name, parseInt(garageJSON[garages[garage_name]]));

  return res.json({
    "fulfillmentText": responseText,
    "payload": {
      "google": {
        "expectUserResponse": true
      }
    }
  });
}

var flavortextSpotsTaken = {
  0: function(garage, count, total){
    return "In " + garage + ", there are " + count.toString() + " cars parked out of " + total.toString();
  },
  1: function(garage, count, total){
    return "There are " + count.toString() + " cars out of " + total.toString() + " in garage " + garage;
  },
  2: function(garage, count, total){
    return "Garage " + garage + " is "+ ((count/total)*100).toString() + "% full";
  }
}

function intentSpotsTaken(req,res,garageJSON){
  var flavorCounter2 = getRandomInt(3);
  var garage_name = req.body.queryResult.parameters.garage;
  var responseText;

  if(garageJSON[garages[garage_name]])
    responseText = flavortextSpotsTaken[flavorCounter2](garage_name, garage_capacity[garage_name]-parseInt(garageJSON[garages[garage_name]]), garage_capacity[garage_name]);

  return res.json({
    "fulfillmentText": responseText,
    "payload": {
      "google": {
        "expectUserResponse": true
      }
    }
  });
}

app.intent('GaragePrediction', (conv) => {
  // Choose one or more supported permissions to request:
  // NAME, DEVICE_PRECISE_LOCATION, DEVICE_COARSE_LOCATION
  const options = {
    context: 'To address you by name and know your location',
    // Ask for more than one permission. User can authorize all or none.
    permissions: ['DEVICE_PRECISE_LOCATION'],
  };

  conv.ask(new Permission(options));
});
