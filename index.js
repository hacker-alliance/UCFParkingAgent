"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const cheerio = require('cheerio');
const url = 'http://secure.parking.ucf.edu/GarageCount/iframe.aspx';

const restService = express();

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
  "A": "1623",
  "B": "1259",
  "C": "1852",
  "D": "1241",
  "H": "1284",
  "I": "1231",
  "Libra": "1007"
}

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

// restService.post("/garage", function(req, res) {
//   var garageAvail = [];
//
//   return request(url, (function (error, response, body) {
//   	const $ = cheerio.load(body);
//
//     // Parse and save garage parking spaces number
//   	$('strong').each(function(i, elem) {
//   		//Get Garage Load
//   		garageAvail[i] = $(this).text();
//   	});
//
//     var garage_name = req.body.queryResult.parameters.garage;
//
//     return res.json({
//       "fulfillmentText": garageAvail[garages[garage_name]] + "/" + garage_capacity[garage_name],
//       "payload": {
//         "google": {
//           "expectUserResponse": true
//         }
//       }
//     });
//   }));
// });
restService.post("/garage", function(req, res) {
  var garageAvail = [];
  scrape_garage().then(function(garageJSON){
    console.log(garageJSON);
  })


    return res.json({
      "fulfillmentText": garageAvail[garages[garage_name]] + "/" + garage_capacity[garage_name],
      "payload": {
        "google": {
          "expectUserResponse": true
        }
      }
    });
  }));
});
function scrape_garage(){
  var garageAvail = [];
  return new Promise((resolve,reject)=>{
    request(url, (function (error, response, body) {
    	const $ = cheerio.load(body);

      // Parse and save garage parking spaces number
      	$('strong').each(function(i, elem) {
      		//Get Garage Load
      		garageAvail[i] = $(this).text();
        });
        resolve(garageAvail);
    	});



    })
}
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
