/* GPS Kids Daily - the 7 dinner-table games.
   Monday = game 0, Tuesday = game 1, ... Sunday = game 6.
   Week of 2026-09-21. */
const GAMES = [
  {
    title: "Louder Than the Fridge",
    tagline: "Tonight your kid practices being heard, not just talking.",
    time: "3 min",
    steps: [
      "You go first. Pick a favorite word and say it three times, each round a little louder. Whisper it, say it normal, then say it like you mean it. Dinner... dinner... DINNER!",
      "Your kid picks their word and does the same three rounds. Coach them up if round three is not really louder.",
      "Final round: the whole table shouts your kid's word at full volume together. Loud is fun tonight."
    ],
    win: "Your kid's third round is truly loud and they are grinning. That is a kid learning their voice can fill a room."
  },
  {
    title: "The Lighthouse Look",
    tagline: "One sentence, eyes up. The quietest brave thing they will do this week.",
    time: "3 min",
    steps: [
      "You go first. Look your kid right in the eyes and say one full sentence about your day. Like: I fixed a problem at work today and it felt good.",
      "Your kid does the same back to you: eyes on you, one sentence about their day. No staring contest, just friendly eyes.",
      "Go around the table. Each person speaks their sentence to the person on their left, eye contact the whole time."
    ],
    win: "Your kid holds your eyes through one whole sentence without looking away. Most kids rush this. The slow ones are the brave ones."
  },
  {
    title: "The Backwards Rule",
    tagline: "Your kid takes a stand nobody believes, and defends it anyway.",
    time: "5 min",
    steps: [
      "You go first. Take a silly stand nobody believes and defend it for 30 seconds. Example: Breakfast for dinner is better than dinner for dinner, because pancakes beat soup.",
      "Your kid picks their own stand and defends it for 30 seconds. The family can ask one tough question each, but no mocking.",
      "The rule: your kid cannot fold. No never mind, no fine you win. They own their stand to the end."
    ],
    win: "Your kid finishes their 30 seconds still on their side after a tough question. That is backbone, and it transfers to real life."
  },
  {
    title: "Echo It Back",
    tagline: "Listening is half of speaking. Tonight they practice the half nobody sees.",
    time: "3 min",
    steps: [
      "You go first as the storyteller. Tell a 30 second story from your day with one real detail in it, like the line at the store was so long.",
      "Your kid's job: echo back the one detail that mattered, in their own words. Not the whole story, just the heart of it.",
      "Switch. Your kid tells a short story and you echo back their detail."
    ],
    win: "Your kid echoes your detail without being asked twice. A kid who can repeat what matters is a kid people want to talk to."
  },
  {
    title: "The Worst Day Award",
    tagline: "The funniest disaster story wins. Your kid has one, I promise.",
    time: "5 min",
    steps: [
      "You go first. Tell the funniest small disaster story from your life. Keep it under a minute: what happened, what went wrong, how you survived.",
      "Your kid tells theirs. If they stall, prompt them: what is the worst thing that ever happened to you at school, in one minute?",
      "The table votes. The best told disaster, not the worst disaster, wins the Worst Day Award."
    ],
    win: "Your kid's story has a beginning, a middle, and an ending. If they got lost in the middle, that is normal. The win is they got to the end."
  },
  {
    title: "Thank the Invisible",
    tagline: "Say thank you out loud to someone who is not at the table.",
    time: "3 min",
    steps: [
      "You go first. Thank someone out loud who helped you but is not at this table. Say it like they can hear you: Thank you, bus driver Sam, for waiting when I was running late.",
      "Your kid does the same. If they stall, offer choices: a teacher, a coach, a friend's parent, the lunch lady.",
      "Everyone's thank you must name one specific thing that person did. No vague thank you for everything."
    ],
    win: "Your kid names a real person and one specific thing they did. Specific gratitude said out loud is a speaking skill and a life skill."
  },
  {
    title: "The Last-Minute Toast",
    tagline: "Ten seconds to think, then stand up and toast the family.",
    time: "3 min",
    steps: [
      "You go first. Stand up and give a 30 second toast to the family, made up on the spot. Example: To this family, for surviving Monday and for the best spaghetti in town.",
      "Your kid gets 10 seconds to think, then stands and gives their own toast. Short is fine. Cheesy is encouraged.",
      "After each toast, everyone raises their glass and takes a sip. This is a ceremony now."
    ],
    win: "Your kid raises their glass and toasts without stalling past the 10 seconds. Thinking on their feet is a muscle, and tonight they flexed it."
  }
];
