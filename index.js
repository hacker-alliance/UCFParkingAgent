const express = require('express');
const {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse,
} = require('actions-on-google');
const restService = express();

const app = dialogflow();


app.intent('Default Welcome Intent', conv => {
  conv.ask('Hi, how is it going?')
  conv.ask(`Here's a picture of a cat`)
  conv.ask(new Image({
    url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
    alt: 'A cat',
  }))
})



restService.post("/garage", app);
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening v2");
});
