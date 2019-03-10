const express = require("express");
const bodyParser = require("body-parser");
const scrape_garage = require("./scrape-ucf-garage");
const predict_garage = require("./prediction-ucf-garage");
const https = require("https");
const converter = require("number-to-words");
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

  console.log("Running intent: " + req.body.queryResult.intent.displayName);

  if(intent != intentGaragePredict){
    scrape_garage().then(function(garageJSON){
        if (intent)
          return intent(req, res, garageJSON);

        return res.json({});
    });
  }else{
    if(req.body.queryResult.parameters.timeuntil){
      var date = new Date(req.body.queryResult.parameters.timeuntil);

      predict_garage(days[date.getDay()],date.getHours(),date.getMinutes()).then(function(garageJSON){
        if(intent)
          return intent(req,res,garageJSON);

        return res.json({});
      })
    }else{
      res.json({});
    }
  }
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
