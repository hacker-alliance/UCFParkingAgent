module.exports = async function(conv){
  let intent = conv.intent;
  console.log("Running: " + intent);
  // console.log(conv);
  const garageLetter = conv.parameters.garage;
  let time = new Date(Date.now());
  let targetTime = new Date(conv.parameters.timeuntil);
  let day = days[targetTime.getDay()];
  let hour = targetTime.getHours();
  let min = targetTime.getMinutes();

  var second = Math.abs(time.getTime()-targetTime.getTime())/1000;
  var minsFromNow = Math.ceil(second/60);

  let response = await(async()=>{
    let resp = await predictor.prediction_v2(garageLetter,day,hour,min);
    let noSpots = resp.available;
    let totalSpots = garage_capacity[garageLetter];
    let percentSpot = percentage(noSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortextJSON[intent].length);
    let time = flavortextTime(minsFromNow);
    let text_response = format(flavortextJSON[intent][flavorNumber].text,{
      time: time,
      spots: noSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON[intent][flavorNumber].speech,{
      time: time,
      spots: converter.toWords(noSpots),
      max: converter.toWords(totalSpots),
      percent: percentSpot,
      garage: garageLetter
    })

    return new SimpleResponse({
      text: text_response,
      speech: speech_response
    });

  })();
  conv.add(response);
  addsuggestions(conv);
  return conv;
}
