const request = require('request');
const cheerio = require('cheerio');


module.exports = function(){
  var garageAvail = [];

  //The link for UCF garage statuses
  const url = 'http://secure.parking.ucf.edu/GarageCount/iframe.aspx';
  return new Promise((resolve,reject)=>{
    //Begin web scraping
    request(url, (function (error, response, body) {
      //converts body in to cheerio to allow easier use
      const $ = cheerio.load(body);

      // Parse and save garage parking spaces number

      // TODO: Changed from index (0-6) to actual names of garages
    	$('strong').each(function(i, elem) {
    		//Get Garage Load
    		garageAvail[i] = $(this).text();
      });

      //Resolves and everything is fine
      resolve(garageAvail);
    }));
  })
}
