"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const scrape_garage = require("./scrape-ucf-garage");
const predict_garage = require("./prediction-ucf-garage");

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
  "SpotsTaken": intentSpotsTaken,
  "Temp": intentTemp
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

function intentTemp(req, res, garageJSON){
  console.log("testestestestes");

  return res.json({
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": "This is a browse carousel example."
              }
            },
            {
              "carouselBrowse": {
                "items": [
                  {
                    "title": "Title of item 1",
                    "openUrlAction": {
                      "url": "google.com"
                    },
                    "description": "Description of item 1",
                    "footer": "Item 1 footer",
                    "image": {
                      "url": "google.com",
                      "accessibilityText": "Image alternate text"
                    }
                  },
                  {
                    "title": "Google Assistant",
                    "openUrlAction": {
                      "url": "google.com"
                    },
                    "description": "Google Assistant on Android and iOS",
                    "footer": "More information about the Google Assistant",
                    "image": {
                      "url": "google.com",
                      "accessibilityText": "Image alternate text"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  });
}
