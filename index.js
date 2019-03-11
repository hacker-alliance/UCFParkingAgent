const express = require('express');
const {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse,
  Image,
} = require('actions-on-google');
const bodyParser = require("body-parser");
const restService = express();
const suggestions = require("./suggestion");
const app = dialogflow();
const scraper = require("./scrape-ucf-garage");

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());
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

function addsuggestions(conv){
  for(i=0;i<suggestions.length;i++){
    conv.ask(new Suggestions(suggestions[i]));
  }
}
app.intent('Default Welcome Intent', conv => {
  conv.ask('Hi, how is it going?');
  addsuggestions(conv);
})
async function spotsTaken(conv){
  const garageLetter = conv.parameters.garage;
  let scrapedata = await (async ()=>{
    let jsondata = await scraper();
    console.log(jsondata);
    let response = flavortextSpotsTaken[getRandomInt(3)](garageLetter,Math.max(0, garage_capacity[garageLetter]-jsondata[garages[garageLetter]]),garage_capacity[garageLetter]);
    return new SimpleResponse({
        // <speak></speak> is needed here since factPrefix is a SSML string
        // and contains audio.
        speech: response,
        text: "TESTTTTT",
      }));

  })();
  return scrapedata;
}
app.intent('Spots Taken Intent',conv =>{
  console.log(conv);


  conv.ask(spotsTaken(conv));
  addSuggestions(conv);
})
// function spotsTaken(agent){
//   const garageLetter = agent.parameters.garage;
//   let scrapedata = await(async ()=>{
//     let jsondata = await scraper();
//     console.log(jsondata);
//     let response = flavortextSpotsTaken[getRandomInt(3)](garageLetter,Math.max(0, garage_capacity[garageLetter]-jsondata[garages[garageLetter]]),garage_capacity[garageLetter]);
//
//      agent.add(new Text({
//       text: response,
//       platform: "ACTIONS_ON_GOOGLE"
//     }));
//   })();
//
//   addSuggestions(agent);
//
//   return agent;
// }



restService.post("/garage", app);
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v3");
});
