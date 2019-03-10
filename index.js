const express = require('express');
const {WebhookClient} = require('dialogflow-fulfillment');
const converter = require('number-to-words');
const {Text, Card, Suggestion} = require('dialogflow-fulfillment');
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
function subAlias(number){
  return "<sub alias=\""+converter.toWords(number)+"\">"+number+"</sub>";
}
var flavortextSpotsLeft = {
  0: function(garage, count) {
    return (count < 50) ? "<speak>Only " + subAlias(count) + " spots left!</speak>" : "<speak>There's " + subAlias(count) + " spots left!</speak>";
  },
  1: function(garage, count) {
    return "<speak>There's " + subAlias(count) + " parking spots</speak>";
  },
  2: function(garage, count) {
    return "<speak>"+subAlias(count)+ " spots</speak>";
  },
  3: function(garage, count) {
    return "<speak>Garage " + garage + " currently has " + subAlias(count) + " spots left</speak>";
  },
  4: function(garage, count) {
    return "<speak>There are " + subAlias(count) + " spots left in garage " + garage+"</speak>";
  }
}
 const anotherCard = new Card({
     title: 'card title',
     text: 'card text',
     imageUrl: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
     buttonText: 'This is a button',
     buttonUrl: 'https://assistant.google.com/',
     platform: 'ACTIONS_ON_GOOGLE'
 });
function spotsLeft(agent){
  const garageLetter = agent.parameters.garage;
  agent.add(new Text({
    text:flavortextSpotsLeft[0]("B",5520),
    platform: "ACTIONS_ON_GOOGLE"
  }));
  agent.add(new Suggestion({
    title: 'garage status',
    platform: 'ACTIONS_ON_GOOGLE'
  }));
  agent.add(anotherCard);
}

restService.use(bodyParser.json());

restService.post("/garage", function(req, res) {
  const agent = new WebhookClient({request:req,response: res});

  let intentMap = new Map();
  intentMap.set("Spots Left Intent",spotsLeft);
  agent.handleRequest(intentMap);
  console.log(agent.requestSource);

});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v2");
});
