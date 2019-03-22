module.exports = async function(conv,lib){
  let intent = conv.intent;
  let {helper,format,converter,SimpleResponse,Suggestions} = lib;
  let {scraper,percentage,getRandomInt,addSuggestions,flavortext} = helper;
  console.log("Running: " + intent);
  const garageLetter = conv.parameters.garage;
  let response = await(async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let totalSpots = resp.letter[garageLetter].capacity;
    let takenSpots = totalSpots - noSpots;
    let percentSpot = percentage(takenSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortext[intent].length);

    let text_response = format(flavortext[intent][flavorNumber].text,{
      spots: takenSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortext[intent][flavorNumber].speech,{
      spots: converter.toWords(takenSpots),
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
