module.exports = async function(conv,lib){
  const {format,converter,Suggestions,helper,SimpleResponse} = lib;
  const {scraper,flavortext,getRandomInt,addSuggestions} = helper;
  const intent = conv.intent;
  console.log("Running: " + intent);
  const garageLetter = conv.parameters.garage;

  let response = await (async ()=>{
    let resp = await scraper();

    let noSpots = resp.letter[garageLetter].available;
    let flavorNumber = getRandomInt(flavortext[intent].length);

    let text_response = format(flavortext[intent][flavorNumber].text,{
      spots: noSpots,
      garage: garageLetter
    });

    let speech_response = format(flavortext[intent][flavorNumber].speech,{
      spots: converter.toWords(noSpots),
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
