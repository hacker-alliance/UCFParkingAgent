const suggestions = require("./suggestion");
const flavortext = require("./flavortext");
const scraper = require("./scrape-ucf-garage");
const predictor = require("./prediction-ucf-garage");

module.exports.garages = {
  "A": 0,
  "B": 1,
  "C": 2,
  "D": 3,
  "H": 4,
  "I": 5,
  "Libra": 6
}
module.exports.days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
]
module.exports.scraper = scraper;
module.exports.flavortext = flavortext;
module.exports.predictor = predictor;
module.exports.garage_capacity = {
  "A": 1623,
  "B": 1259,
  "C": 1852,
  "D": 1241,
  "H": 1284,
  "I": 1231,
  "Libra": 1007
}

module.exports.getRandomInt = function(max){
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports.addSuggestions = function(conv,Suggestions){
  for(i=0;i<suggestions.length;i++){
    conv.ask(new Suggestions(suggestions[i]));
  }
}
module.exports.percentage = function(num,total){
  return Math.round(Math.min(100, Math.max(0, (num/total)*100)));
}
