module.exports = async function(conv){
  let intent = conv.intent;
  console.log("Running: " + intent);
  const garageLetter = conv.parameters.garage;
  let response = await(async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let totalSpots = resp.letter[garageLetter].capacity;
    let takenSpots = totalSpots - noSpots;
    let percentSpot = percentage(takenSpots,totalSpots);
    let flavorNumber = getRandomInt(flavortextJSON[intent].length);

    let text_response = format(flavortextJSON[intent][flavorNumber].text,{
      spots: takenSpots,
      max: totalSpots,
      percent: percentSpot,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON[intent][flavorNumber].speech,{
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
  addsuggestions(conv);

  return conv;
}
