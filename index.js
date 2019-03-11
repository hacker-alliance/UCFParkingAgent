const express = require('express');
const {WebhookClient} = require('dialogflow-fulfillment');
const converter = require('number-to-words');
const {Text, Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const predictor = require("./prediction-ucf-garage");
const restService = express();
const scraper = require("./scrape-ucf-garage");
const suggestions = require("./suggestion");
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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

function subAlias(number){
  return "<sub alias=\""+converter.toWords(number)+"\">"+number+"</sub>";
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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

var flavortextSpotsTaken = {
  0: function(garage, count, total){
    return "<speak>In " + garage + ", there are " + subAlias(count) + " cars parked out of " + subAlias(total)+"</speak>";
  },
  1: function(garage, count, total){
    return "<speak>There are " + count.toString() + " cars out of " + subAlias(total) + " in garage " + garage+"</speak>" ;
  },
  2: function(garage, count, total){
    return "<speak>Garage " + garage + " is " + Math.round(Math.min(100, Math.max(0, (count/total)*100))).toString() + "% full</speak>";
  }
}
 // const anotherCard = new Card({
 //     title: 'card title',
 //     text: 'card text',
 //     imageUrl: "https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png",
 //     buttonText: 'This is a button',
 //     buttonUrl: 'https://assistant.google.com/',
 //     platform: 'ACTIONS_ON_GOOGLE'
 // });



function addSuggestions(agent){
  for(i =0;i<suggestions.length;i++){
    // console.log(suggestions[i]);
    agent.add(new Suggestion(suggestions[i]));
  }
}

async function spotsTaken(agent){
  const garageLetter = agent.parameters.garage;

  let scrapedata = await(async ()=>{
    let jsondata = await scraper();
    let response = flavortextSpotsTaken[getRandomInt(3)](garageLetter,Math.max(0, garage_capacity[garageLetter]-parseInt(jsondata[garages[garageLetter]])),garage_capacity[garageLetter]);

    console.log("TEST" + garageLetter);
    return new Text({
      text: response,
      platform: "ACTIONS_ON_GOOGLE"
    });
  });
  agent.add(scrapedata);
  addSuggestions(agent);

  return agent;
}

async function spotsLeft(agent){
  const garageLetter = agent.parameters.garage;

  let scrapeddata = await (async ()=>{
    let jsondata = await scraper();
    let response = flavortextSpotsLeft[getRandomInt(5)](garageLetter,jsondata[garages[garageLetter]]);
    // console.log(response);
    return new Text({
      text: response,
      platform: "ACTIONS_ON_GOOGLE"
    });

  })();
  agent.add(scrapeddata);

  addSuggestions(agent);
  return agent;
}

// * let suggestion = new Suggestion('suggestion');
// * const anotherSuggestion = new Suggestion({
// *     title: 'suggestion',
// *     platform: 'ACTIONS_ON_GOOGLE'
// * });
async function welcome(agent){
  addSuggestions(agent);
  return agent;
}

restService.use(bodyParser.json());

restService.post("/garage", function(req, res) {
  const agent = new WebhookClient({request:req,response: res});

  let intentMap = new Map();

  intentMap.set("Spots Left Intent",spotsLeft);
  intentMap.set("Spots Taken Intent",spotsTaken);
  intentMap.set("Default Welcome Intent", welcome);

  agent.handleRequest(intentMap);
  console.log(agent.intent);

});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v2");
});
