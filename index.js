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


const suggestions = require("./suggestion");
const scraper = require("./scrape-ucf-garage");
const predictor = require("./prediction-ucf-garage");

let flavortextJSON = require("./flavortext.json");

const app = dialogflow();
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

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


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function addsuggestions(conv){
  for(i=0;i<suggestions.length;i++){
    conv.ask(new Suggestions(suggestions[i]));
  }
}

function percentage(num,total){
  return Math.round(Math.min(100, Math.max(0, (num/total)*100)));
}

function flavortextTime (minutes) {
  timetext = "";
  hours = minutes % 60;
  minutes -= hours * 60;

  //Hours
  if (hours == 1) {
    timetext += "1 hour";
  }
  else if (hours > 1) {
    timetext += hours + " hours";
  }

  //Add "and" if adding minutes
  if (hours > 0 && minutes > 0) {
    timetext += " and ";
  }
  //Minutes
  if (minutes == 1) {
    timetext += "1 minute";
  }
  else if (minutes > 1) {
    timetext += minutes + " minutes"
  }
  return timetext;
}

app.intent('Default Welcome Intent', conv => {
  console.log("Running: " + conv.intent);
  conv.ask('Hi, how is it going?');
  addsuggestions(conv);
})


app.intent('Spots Left Intent', conv => spotsLeft(conv));

async function spotsLeft(conv){
  console.log("Running: " + conv.intent);
  const garageLetter = conv.parameters.garage;

  let response = await (async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let flavorNumber = getRandomInt(flavortextJSON["Spots Left Intent"].length);

    let text_response = format(flavortextJSON["Spots Left Intent"][flavorNumber].text,{
      spots: noSpots,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON["Spots Left Intent"][flavorNumber].speech,{
      spots: converter.toWords(noSpots),
      garage: garageLetter
    })

    return new SimpleResponse({
      text: text_response,
      speech: speech_response
    });
  })();

  conv.add(response);
  addsuggestions(conv);

  return conv;
}

app.intent('Spots Taken Intent', conv => spotsTaken(conv));
//TODO change how jsondata comes out so we dont have to do `jsondata[garages[garageletter]]`
async function spotsTaken(conv){
  let intent = conv.intent;
  console.log("Running: " + intent);
  const garageLetter = conv.parameters.garage;
  let response = await(async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let totalSpots = resp.letter[garageLetter].capacity;
    let takenSpots = totalSpots - noSpots;
    let percentSpot = percentage(takenSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortextJSON[intent].length);

    let text_response = format(flavortextJSON[intent][flavorNumber].text,{
      spots: takenSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON[intent][flavorNumber].speech,{
      spots: converter.toWords(takenSpots),
      max: converter.toWords(totalSpots),
      percent: percentSpot,
      garage: garageLetter
    })

    return new SimpleResponse({
      text: text_response,
      speech: speech_response
    });
  })();
  conv.add(response);
  addsuggestions(conv);

  return conv;
}

app.intent('Garage Prediction Intent',conv=>garagePredict(conv));

async function garagePredict(conv){
  let intent = conv.intent;
  console.log("Running: " + intent);
  // console.log(conv);
  const garageLetter = conv.parameters.garage;
  let time = new Date(Date.now());
  let targetTime = new Date(conv.parameters.timeuntil);
  let day = days[targetTime.getDay()];
  let hour = targetTime.getHours();
  let min = targetTime.getMinutes();

  var second = Math.abs(time.getTime()-targetTime.getTime())/1000;
  var minsFromNow = Math.ceil(second/60);

  let response = await(async()=>{
    let resp = await predictor.prediction_v2(garageLetter,day,hour,min);
    let noSpots = resp.available;
    let totalSpots = garage_capacity[garageLetter];
    let percentSpot = percentage(noSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortextJSON[intent].length);
    let time = flavortextTime(minsFromNow);
    let text_response = format(flavortextJSON[intent][flavorNumber].text,{
      time: time,
      spots: noSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON[intent][flavorNumber].speech,{
      time: time,
      spots: converter.toWords(noSpots),
      max: converter.toWords(totalSpots),
      percent: percentSpot,
      garage: garageLetter
    })

    return new SimpleResponse({
      text: text_response,
      speech: speech_response
    });

  })();
  conv.add(response);
  addsuggestions(conv);
  return conv;
}

app.intent("Garage Status Intent",conv=>garageStatus(conv));

async function garageStatus(conv){
  let intent = conv.intent;
  console.log("Running: " + intent);
  let table = {
     title: "Garage Status",
     columns: [
      {
        header: "Garage Name",
      },
      {
        header: "Spaces Available"
      }
    ],
    rows:[
    ]
  };
  let response = await(async ()=>{
    let resp = await scraper();
    return resp;
  })();

  let speech_res = "Here are the garages. ";
  for(i=0;i<7;i++){
    table.rows.push({
      cells: [response.index[i].name,response.index[i].available + "/" + response.index[i].capacity + " ("+percentage(response.index[i].available,response.index[i].capacity)+"%)"],
      dividerAfter: true
    });
    speech_res += "Garage " + response.index[i].name + " has "+ percentage(response.index[i].available,response.index[i].capacity) + "% available spots. "
  }
  let text_res = {
    text:"Here are the garages",
    speech: speech_res
  }
  conv.add(new SimpleResponse(text_res));
  conv.add(new Table(table));
  addsuggestions(conv);

  return conv;
}
restService.post("/garage", app);

restService.listen(process.env.PORT || 8080, function() {
  console.log("Server up and listening v3");
});
