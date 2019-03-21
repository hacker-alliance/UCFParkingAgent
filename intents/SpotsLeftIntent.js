module.exports = async function(conv){
  console.log("Running: " + conv.intent);
  const garageLetter = conv.parameters.garage;

  let response = await (async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let flavorNumber = getRandomInt(flavortextJSON["Spots Left Intent"].length);

    let text_response = format(flavortextJSON["Spots Left Intent"][flavorNumber].text,{
      spots: noSpots,
      garage: garageLetter
    });

    let speech_response = format(flavortextJSON["Spots Left Intent"][flavorNumber].speech,{
      spots: converter.toWords(noSpots),
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
