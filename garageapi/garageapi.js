/*/
 *
 * Garage REST API
 * REST API that responds with data from garage_db
 *
/*/ 
 
//InfluxDB Library
const Influx = require('influx');

//Environment Variable Import
const dotenv = require('dotenv');
dotenv.config({path:'/opt/www/garageapi/.env'});

const express = require('express');

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

const app = express();

/*
 * Garage API
 * @version 1
 * @deprecated Use v2 of API Instead
 */
app.get('/garages', function (req, res) {
	garageDB.query(`
		SELECT * FROM load
		ORDER BY time DESC
		LIMIT 7
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

/*
 * Basic Seasonal Prediction API
 * @version 1
 * @deprectated Use v2 of API Instead
 * Uses Most Recent Available Past Season
 */
app.get('/prediction/:weekday/:hour/:minute', function (req, res) {
	garageDB.query(`
		SELECT * FROM load
		WHERE weekday=${Influx.escape.stringLit(req.params.weekday)}
		AND hour=${Influx.escape.stringLit(req.params.hour)}
		AND minute=${Influx.escape.stringLit(req.params.minute)}
		ORDER BY time DESC
		LIMIT 7
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

/*
 * Garage Now API
 * @version 2
 * Gets Current Garage Load
 */
app.get('/api/v2/garage/:garage/now', function (req, res) {
	
	garageDB.query(`
		SELECT * FROM load
		WHERE garage=${Influx.escape.stringLit(req.params.garage)}
		ORDER BY time DESC
		LIMIT 1
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

/*
 * Garage Prediction API
 * @version 2
 * Gets Current Garage Load
 */
app.get('/api/v2/garage/:garage/prediction/:weekday/:hour/:minute', function (req, res) {
	
	garageDB.query(`
		SELECT MOVING_AVERAGE("available", 2) FROM load
		WHERE garage=${Influx.escape.stringLit(req.params.garage)}
		AND weekday=${Influx.escape.stringLit(req.params.weekday)}
		AND hour=${Influx.escape.stringLit(req.params.hour)}
		AND minute=${Influx.escape.stringLit(req.params.minute)}
		ORDER BY time DESC
	`).then(result => {
		res.json(result)
	}).catch(err => {
		res.status(500).send(err.stack)
	})
});

//Listen on Port
app.listen(8080, () => {
	console.log("Server Running on Port 8080");
});


