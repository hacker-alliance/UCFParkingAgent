module.exports = async function(conv,lib){

  console.log("Running: " + conv.intent);

  const {Suggestions,helper} = lib;
  const {addSuggestions} = helper;

  conv.ask('Hi, what garage would you like to check?');
  addSuggestions(conv,Suggestions);
}
