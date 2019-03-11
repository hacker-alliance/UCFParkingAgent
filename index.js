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

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);
restService.use(bodyParser.json());

function addSuggestions(conv){
  for(i =0;i<suggestion.length;i++){
    // console.log(suggestions[i]);
    agent.add(new Suggestions(suggestions[i]));
  }
}

app.intent('Default Welcome Intent', conv => {
  conv.ask('Hi, how is it going?')
  conv.ask(`Here's a picture of a cat`)
  conv.ask(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
  conv.ask(new Suggestions(suggestions[1]));
})


restService.post("/garage", app);
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v3");
});
