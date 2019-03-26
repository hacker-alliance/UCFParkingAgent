const d = require("./intents/IntentHandler");

for(i = 0;i<d["all_garage"].length;i++){

  console.log(d[d["all_garage"][i]]());
}
