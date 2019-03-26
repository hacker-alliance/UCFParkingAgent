module.exports = async function(conv,lib){
  let intent = conv.intent;
  console.log("Running: " + conv.intent);

  const {Suggestions,helper,SimpleResponse,moment} = lib;
  const {addSuggestions,flavortext,getRandomInt} = helper;

  let flavorNumber = getRandomInt(flavortext[intent].length);
  let time = moment();
  console.log(time.format("MMMM Do YYYY, h:mm:ss a"));
  conv.ask(new SimpleResponse({
    text:flavortext[intent][flavorNumber].text,
    speech:flavortext[intent][flavorNumber].speech
  }));

  addSuggestions(conv,Suggestions);
  return conv;
}
