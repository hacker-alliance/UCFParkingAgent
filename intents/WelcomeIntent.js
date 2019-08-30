module.exports = async function(conv,lib){
  let intent = conv.intent;
  console.log("Running: " + conv.intent);

  const {format,Suggestions,helper,SimpleResponse,moment} = lib;
  const {addSuggestions,flavortext,getRandomInt,getTimeCycle} = helper;

  let flavorNumber = getRandomInt(flavortext[intent].length);
  let time = moment().tz("America/New_York");
  let timeCycle = await getTimeCycle(time);
  // console.log(time.tz("America/New_York").format("MMMM Do YYYY, h:mm:ss a"));

  let text_response = format(flavortext[intent][flavorNumber].text,{
    time: timeCycle
  });
  let speech_response = format(flavortext[intent][flavorNumber].speech,{
    time: timeCycle
  });
  conv.ask(new SimpleResponse({
    text:text_response,
    speech:speech_response
  }));

  addSuggestions(conv,Suggestions);
  return conv;
}
