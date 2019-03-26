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

const IntentHandler = require("./intents/IntentHandler");

const app = dialogflow();
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());


app.intent(IntentHandler["all_garage"][0],conv=>IntentHandler[IntentHandler["all_garage"][0]](conv,lib));

app.intent(IntentHandler["all_garage"][1],conv=>IntentHandler[IntentHandler["all_garage"][1]](conv,lib));

app.intent(IntentHandler["all_garage"][2],conv=>IntentHandler[IntentHandler["all_garage"][2]](conv,lib));

app.intent(IntentHandler["all_garage"][3],conv=>IntentHandler[IntentHandler["all_garage"][3]](conv,lib));

app.intent(IntentHandler["all_garage"][4],conv=>IntentHandler[IntentHandler["all_garage"][4]](conv,lib));
const actionMap = new Map();
actionMap.set()
// for(i = 0;i<IntentHandler["all_garage"].length;i++){
//   app.intent(IntentHandler["all_garage"][i],conv => IntentHandler[IntentHandler["all_garage"][i]](conv,lib));
// }

restService.post("/garage", app);

restService.listen(process.env.PORT || 8080, function() {
  console.log("Server up and listening v3.1");
});
