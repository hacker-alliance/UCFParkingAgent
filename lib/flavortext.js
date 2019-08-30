module.exports = {
  "Spots Left Intent":[
    {
      "text":"There's {spots} spots left in Garage {garage}!",
      "speech":"There's {spots} spots left in Garage {garage}!"
    },
    {
      "text":"There's {spots} parking spots in Garage {garage}.",
      "speech":"There's {spots} parking spots in Garage {garage}."
    },
    {
      "text":"{spots} spots in Garage {garage}.",
      "speech":"{spots} spots in Garage {garage}."
    },
    {
      "text":"Garage {garage} currently has {spots} spots left.",
      "speech":"Garage {garage} currently has {spots} spots left"
    },
    {
      "text":"There are {spots} spots left in Garage {garage}.",
      "speech":"There are {spots} spots left in Garage {garage}"
    }
  ],
  "Spots Taken Intent":[
    {
      "text":"In Garage {garage}, there are {spots} cars parked out of {max}.",
      "speech":"In Garage {garage}, there are {spots} cars parked out of {max}. About {percent}% full."
    },
    {
      "text":"There are {spots} cars out of {max} in Garage {garage}",
      "speech":"There are {spots} cars out of {max} in garage {garage}. About {percent}% full."
    },
    {
      "text":"Garage {garage} is {percent}% full.",
      "speech":"Garage {garage} is {percent}% full"
    }
  ],
  "Garage Prediction Intent":[
    {
      "text":"{time} from now, Garage {garage} will have {spots} out of {max} available spots.",
      "speech":"{time} from now, Garage {garage} will have {spots} out of {max} available spots. About {percent}% open spots."
    },
    {
      "text":"Garage {garage} in {time} will have {spots} out of {max} open parking",
      "speech":"Garage {garage} in {time} will have {spots} out of {max} open parking. About {percent}% open spots."
    },
    {
      "text":"Garage {garage} will have {spots} out of {max} open spots in {time}.",
      "speech":"Garage {garage} will have {spots} out of {max} open spots in {time}. About {percent}% open spots."
    },
    {
      "text":"Garage {garage} is predicted to have {percent}% chance of open spots in {time}!",
      "speech":"Garage {garage} is predicted to have {percent}% chance of open spots in {time}! "
    }
  ],
  "Default Welcome Intent":[
    {
      "text":"Good {time}, I'm the UCF Parking Agent. What can I help you with today?",
      "speech": "Good {time}, I'm the UCF Parking Agent. What can I help you with today?"
    },
    {
      "text":"Good {time}, I'm the UCF Parking Agent, and I'm here to help! Ask me about a garage.",
      "speech": "Good {time}, I'm the UCF Parking Agent, and I'm here to help! Ask me about a garage."
    },
    {
      "text":"UCF Parking Agent reporting for duty, let me know how I can help.",
      "speech": "UCF Parking Agent reporting for duty, let me know how I can help."
    },
    {
      "text":"Good {time}, Welcome to UCF Parking Agent. What garage would you like to know about?",
      "speech": "Good {time}, Welcome to UCF Parking Agent. What garage would you like to know about?"
    },
    {
      "text":"Good {time}, what garage are you heading to?",
      "speech": "Good {time}, what garage are you heading to?"
    },
  ],
  "Time Cycle":[
    "morning",
    "noon",
    "afternoon",
    "evening"
  ]
}
