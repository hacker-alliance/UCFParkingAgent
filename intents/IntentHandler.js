const GaragePredictionIntent = require("./GaragePredictionIntent");
const DefaultWelcomeIntent = require("./WelcomeIntent");
const SpotsLeftIntent = require("./SpotsLeftIntent");
const SpotsTakenIntent = require("./SpotsTakenIntent");
const GarageStatusIntent = require("./GarageStatusIntent");


module.exports = {
  "Garage Prediction Intent": GaragePredictionIntent,
  "Default Welcome Intent": DefaultWelcomeIntent,
  "Spots Left Intent": SpotsLeftIntent,
  "Spots Taken Intent": SpotsTakenIntent,
  "Garage Status Intent": GarageStatusIntent,
  "all_garage": [
    "Garage Prediction Intent",
    "Default Welcome Intent",
    "Spots Left Intent",
    "Spots Taken Intent",
    "Garage Status Intent",
  ]
}
