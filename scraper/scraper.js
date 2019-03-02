/*/
 *
 * Scraper
 * Scrapes UCF garage page and stores it in influx
 *
/*/

//Request Library
const request = require('request');

//Scraping Library
const cheerio = require('cheerio');

//InfluxDB Library
const Influx = require('influx');

const dotenv = require('dotenv');

//Environment Variable Import
dotenv.config({path:'/opt/www/scraper/.env'});

//Influx Connection
const garageDB = new Influx.InfluxDB({
	host: 'localhost',
	port: 8086,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: 'garage_db',
	schema: [
		{
			measurement: 'load',
			tags: [
				'garage',
				'weekday',
				'hour',
				'minute'
			],
			fields: {
				available: Influx.FieldType.INTEGER
			}
		}
	]
});

//Scraping URL
const URL = 'https://secure.parking.ucf.edu/GarageCount/iframe.aspx';

//UCF Garages Names
const garageNames = ['A', 'B', 'C', 'D', 'H', 'I', 'Libra'];

//Number of Garage Spots Available
var garageAvail = {};

//Weekdays
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//Timestamp of Current Time to allow insert of correct time even if database insert is delayed
const timeStamp = new Date();

//Timezone Debug
/*
console.log(timeStamp.getTimezoneOffset());
console.log(timeStamp.getHours());
*/
//NOTE: Javascript will use system time zone

//Request and Scrape
request(URL, (function (error, response, body) {
	const $ = cheerio.load(body);
	//Garages Are Stored in Strong Elements
	//For Each Strong Element
	$('strong').each(function(i, elem) {
		//Get Garage Load
		garageAvail[i] = parseInt($(this).text());

		//DEBUG: Output garageLoad and timeStamp
		/*
		console.log(garageAvail[i], timeStamp.toDateString(), timeStamp.toTimeString());
		*/

		//Write Data to Database
		garageDB.writePoints([
			{
				measurement: 'load',
				tags: {garage: garageNames[i],
					weekday: weekdays[timeStamp.getDay()],
					hour: timeStamp.getHours(),
					minute: timeStamp.getMinutes()
				},
				fields: {available: garageAvail[i]}
			}
		]).catch(err => {
			console.error(err.stack);
		});
	});
}));

