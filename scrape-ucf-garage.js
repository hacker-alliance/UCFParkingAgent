const request = require('request');
const cheerio = require('cheerio');

var garages =["A","B","C","D","H","I","Libra"];

var garage_capacity = {
  "A": 1623,
  "B": 1259,
  "C": 1852,
  "D": 1241,
  "H": 1284,
  "I": 1231,
  "Libra": 1007
}
module.exports = function(){
   var garageAvail = {
     letter:{},
     index:{}
   };
  //The link for UCF garage statuses
  const url = 'http://secure.parking.ucf.edu/GarageCount/iframe.aspx';
  return new Promise((resolve,reject)=>{
    //Begin web scraping
    request(url, (function (error, response, body) {
      //converts body in to cheerio to allow easier use
      const $ = cheerio.load(body);

      // Parse and save garage parking spaces number

      $('strong').each(function(i, elem) {
        //Get Garage Load
        garageAvail.letter[garages[i]] = {
          "name": garages[i],
          "available": $(this).text(),
          "capacity": garage_capacity[garages[i]]
        };
        garageAvail.index[i] ={
          "name": garages[i],
          "available": $(this).text(),
          "capacity": garage_capacity[garages[i]]
        }

      });

      //Resolves and everything is fine
      resolve(garageAvail);
    }));
  })
};
