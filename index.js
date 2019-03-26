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
const moment = require("moment-timezone");

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

const IntentHandler = require("./intents/IntentHandler");

const app = dialogflow();
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

//Garage Prediction Intent Handler
app.intent(IntentHandler["all_garage"][0],conv=>IntentHandler[IntentHandler["all_garage"][0]](conv,lib));

//Default Welcome Intent Handler
app.intent(IntentHandler["all_garage"][1],conv=>IntentHandler[IntentHandler["all_garage"][1]](conv,lib));

//Spots Left Intent Handler
app.intent(IntentHandler["all_garage"][2],conv=>IntentHandler[IntentHandler["all_garage"][2]](conv,lib));

//Spots Taken Intent Handler
app.intent(IntentHandler["all_garage"][3],conv=>IntentHandler[IntentHandler["all_garage"][3]](conv,lib));

//Garage Status Intent Handler
app.intent(IntentHandler["all_garage"][4],conv=>IntentHandler[IntentHandler["all_garage"][4]](conv,lib));

restService.post("/garage", app);

restService.listen(process.env.PORT || 8080, function() {
  console.log("Server up and listening v3.1");
});
