module.exports = async function(conv,lib){
  let intent = conv.intent;
  const {helper,SimpleResponse,Suggestions,Table} = lib;
  const {scraper,addSuggestions,percentage,} = helper;
  console.log("Running: " + intent);
  let table = {
     title: "Garage Status",
     columns: [
      {
        header: "Garage Name",
      },
      {
        header: "Spaces Available"
      }
    ],
    rows:[
    ]
  };
  let response = await(async ()=>{
    let resp = await scraper();
    return resp;
  })();

  let speech_res = "Here are the garages. ";
  for(i=0;i<7;i++){
    table.rows.push({
      cells: [response.index[i].name,response.index[i].available + "/" + response.index[i].capacity + " ("+percentage(response.index[i].available,response.index[i].capacity)+"%)"],
      dividerAfter: true
    });
    speech_res += "Garage " + response.index[i].name + " has "+ percentage(response.index[i].available,response.index[i].capacity) + "% available spots. "
  }
  let text_res = {
    text:"Here are the garages",
    speech: speech_res
  }
  conv.add(new SimpleResponse(text_res));
  conv.add(new Table(table));
  addSuggestions(conv,Suggestions);

  return conv;
}
