'use strict';
/*
 * index.js
 * firebase serverless application to handle the intent from google actions
*/
const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

test = {
  "A":5,
  "B":6,
  "C":7,
  "D":2,
  "H":3,
  "I":5,
  "Libra": 5
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  function availSpace(agent){
    const garageLetter = agent.parameters.garage;
    agent.add("Parking "+garageLetter+" has "+ test[garageLetter] +" available");
  }
  let intentMap = new Map();
  intentMap.set("Garage Availability",availSpace);
  agent.handleRequest(intentMap);
});
