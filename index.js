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
var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/garage", function(req, res) {
  var intent = intents[req.body.queryResult.intent.displayName];

  if(intent != intentGaragePredict){
    scrape_garage().then(function(garageJSON){
        if (intent)
          return intent(req, res, garageJSON);
        return res.json({});
    });
  }else{
    // console.log(req.body.queryResult.parameters.time)
    if(req.body.queryResult.parameters.timeuntil){
      var date = new Date(req.body.queryResult.parameters.timeuntil);
      console.log(days[date.getDay()],date.getHours(),date.getMinutes());
      predict_garage(days[date.getDay()],date.getHours(),date.getMinutes()).then(function(garageJSON){
        // console.log(garageJSON);
        if(intent)
          return intent(req,res,garageJSON);
        return res.json({});
      })
    }else{
      res.json({});
    }

    // console.log(days[date.getDay()] + "   " + date.getHours());


  }
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}





var intents={
"SpotsLeft": intentSpotsLeft,
"SpotsTaken": intentSpotsTaken,
"Garage Prediction Intent": intentGaragePredict,
"Temp":intentTemp
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
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": responseText
              }
            }
          ],
          "suggestions": [
            {
              "title": "help me"
            },
            {
              "title": "garage B?"
            },
            {
              "title": "garage A in 20 minutes"
            }
          ],
          "linkOutSuggestion": {
            "destinationName": "Github",
            "url": "https://github.com/parking-assist/UCFParkingAssistant"
          }
        }
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
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": responseText
              }
            }
          ],
          "suggestions": [
            {
              "title": "help me"
            },
            {
              "title": "garage B?"
            },
            {
              "title": "garage A in 20 minutes"
            }
          ],
          "linkOutSuggestion": {
            "destinationName": "Github",
            "url": "https://github.com/parking-assist/UCFParkingAssistant"
          }
        }
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
                "textToSpeech": "fkflasjdfldks j;dkfjad lfkjkfas"
              }
            },
            {
              "basicCard": {
                "formattedText": "hello how are you",
                "image": {
                  "url": "https://i.imgur.com/S9jjqRr.jpg",
                  "accessibilityText": "CHICK FIL A",
                }
              }
            }
          ],
          "suggestions": [
            {
              "title": "help me"
            },
            {
              "title": "garage B?"
            },
            {
              "title": "garage A in 20 minutes"
            }
          ],
          "linkOutSuggestion": {
            "destinationName": "Github",
            "url": "https://github.com/parking-assist/UCFParkingAssistant"
          }
        }
      }
    }
  });
}
var flavortextGaragePredict = {
  0: function(name,max,number,minute){
    return minute +" minutes from now, garage "+ name +" has "+number +" out of "+max+" available spots!";
  },
  1: function(name,max,number,minute){
    return "Garage "+ name +" in " + minute + " minutes, has "+number+" out of "+max+" open parking";
  },
  2: function(name,max,number,minute){
    return "Garage " + name +" will have " + number +" out of " + max + " open spots in " + minute + " minutes!";
  },
  3: function(name,max,number,minute){
    return "Garage " + name +" is predicted to have a " + Math.ceil(((number/max)*100)) +" percent chance of open spots in " + minute + " minutes!";
  }
}
function intentGaragePredict(req,res,garageJSON){
 var garage_name = req.body.queryResult.parameters.garage;
 var time = new Date();
 var delaytime = new Date(req.body.queryResult.parameters.timeuntil);
 console.log(Math.abs(time.getTime()-delaytime.getTime()))
 var second = Math.abs(time.getTime()-delaytime.getTime())/1000;
 var minute = Math.ceil(second/60);

 var responseText;
 var flavorCounter3 = getRandomInt(4);
 if(garage_name!="Libra"){
   garage_name = garage_name.charAt(0).toUpperCase();
 }
 console.log(garageJSON);
 if(garageJSON[garage_name])
  responseText = flavortextGaragePredict[flavorCounter3](garage_name,garage_capacity[garage_name],garageJSON[garage_name],minute);
 console.log(responseText);
 return res.json({
   "payload": {
     "google": {
       "expectUserResponse": true,
       "richResponse": {
         "items": [
           {
             "simpleResponse": {
               "textToSpeech": responseText
             }
           }
         ],
         "suggestions": [
           {
             "title": "help me"
           },
           {
             "title": "garage B?"
           },
           {
             "title": "garage A in 20 minutes"
           }
         ],
         "linkOutSuggestion": {
           "destinationName": "Github",
           "url": "https://github.com/parking-assist/UCFParkingAssistant"
         }
       }
     }
   }
 });
}
