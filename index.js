const express = require('express');
const {WebhookClient} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const restService = express();
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

var test = {
  "A":5,
  "B":6,
  "C":7,
  "D":2,
  "H":3,
  "I":5,
  "Libra": 5
}
function availSpace(agent){
  const garageLetter = agent.parameters.garage;
  agent.add("Parking "+garageLetter+" has "+ test[garageLetter] +" available");
}

restService.use(bodyParser.json());

restService.post("/garage", function(req, res) {
  const agent = new WebhookClient({request:req,response: res});

  let intentMap = new Map();
  intentMap.set("Spots Left Intent",availSpace);
  agent.handleRequest(intentMap);
  console.log(agent.requestSource);

});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v2");
});
