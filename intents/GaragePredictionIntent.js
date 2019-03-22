module.exports = async function(conv,lib){
  let intent = conv.intent;
  console.log("Running: " + intent);
  // console.log(conv);
  const {helper,format,converter,moment,SimpleResponse,Suggestions} = lib;
  const {days,predictor,garage_capacity,
    percentage,
    getRandomInt,
    addSuggestions,
    flavortext
  } = helper;
  const garageLetter = conv.parameters.garage;

  let targetTime = moment(conv.parameters.timeuntil);
  let day = days[targetTime.day()];
  let hour = targetTime.hour();
  let min = targetTime.minute();


  let flavorTime = targetTime.fromNow(true);

  let response = await(async()=>{
    let resp = await predictor.prediction_v2(garageLetter,day,hour,min);
    let noSpots = resp.available;
    let totalSpots = garage_capacity[garageLetter];
    let percentSpot = percentage(noSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortext[intent].length);
    let time = flavorTime;
    let text_response = format(flavortext[intent][flavorNumber].text,{
      time: time,
      spots: noSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortext[intent][flavorNumber].speech,{
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
  addSuggestions(conv,Suggestions);
  return conv;
}
