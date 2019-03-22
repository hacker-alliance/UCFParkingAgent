const express = require('express');
const {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse,
  Image,
  Table,
} = require('actions-on-google');
const bodyParser = require("body-parser");
const converter = require("number-to-words");
const format = require("string-template");
const moment = require("moment");

const helper = require("./lib/helper");

const lib = {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse,
  Image,
  Table,
  bodyParser,
  converter,
  format,
  helper,
  moment,
}

//intents
const welcome = require("./intents/WelcomeIntent");
const spotsLeft = require("./intents/SpotsLeftIntent");
const spotsTaken = require("./intents/SpotsTakenIntent");
const garagePredict = require("./intents/GaragePredictionIntent");
const garageStatus = require("./intents/GarageStatusIntent");


const app = dialogflow();
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());


app.intent('Default Welcome Intent', conv => welcome(conv,lib));

app.intent('Spots Left Intent', conv => spotsLeft(conv,lib));

app.intent('Spots Taken Intent', conv => spotsTaken(conv,lib));

app.intent('Garage Prediction Intent',conv=>garagePredict(conv,lib));

app.intent("Garage Status Intent",conv=>garageStatus(conv,lib));

restService.post("/garage", app);

restService.listen(process.env.PORT || 8080, function() {
  console.log("Server up and listening v3.1");
});
