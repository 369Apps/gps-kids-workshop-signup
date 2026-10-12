/* GPS Kids Daily - the 7 dinner-table games.
   Monday = game 0, Tuesday = game 1, ... Sunday = game 6.
   Week of 2026-10-12. */
const GAMES = [
{
    title: "The Drumroll Name",
    cues: [
      "You go first: drumroll your name.",
      "Your kid drumrolls louder.",
      "Everyone drumrolls at once.",
    ],
    tagline: "A drumroll on the table, then say your name like it matters. Because it does.",
    time: "3 min",
    steps: [
      "You go first. Drum your hands on the table and say your own name out loud, like a star being announced. Loud, proud, all of it. Big voice, big smile.",
      "Your kid drumrolls the table and announces their name even louder than you did. A title is allowed. The loudest kid in the world is a fine title.",
      "Final round: everyone drumrolls together and shouts the family name at the same time. The table should shake a little. That is the win."
    ],
    win: "Your kid says their name louder than their normal talking voice. Kids who can say their own name big can introduce themselves anywhere."
  },
{
    title: "The Quiet Truth",
    cues: [
      "You go first: eyes on them, one true thing.",
      "Your kid says one true thing back.",
      "Go around the table.",
    ],
    tagline: "Look them in the eyes and tell them one true thing you noticed today.",
    time: "3 min",
    steps: [
      "You go first. Look your kid right in the eyes and tell them one true thing you noticed about them today. Something kind and real. Like: you helped your sister without being asked.",
      "Your kid looks you in the eyes and tells you one true thing they noticed about you today. Eyes the whole time. If their eyes drop, wait quietly until they find you again.",
      "Go around the table. Everyone trades one quiet truth with the person next to them. Eyes up, voice soft. Soft and steady wins tonight."
    ],
    win: "Your kid holds your eyes while saying something kind and true. Saying real things while looking at someone is a grown up skill. They just practiced it at dinner."
  },
{
    title: "Pick a Side",
    cues: [
      "You go first: pick a side, plant your flag.",
      "Your kid must take the other side.",
      "No fence sitting. Defend it.",
    ],
    tagline: "Pancakes or waffles. Someone has to pick a side. Tonight it is your kid.",
    time: "5 min",
    steps: [
      "You go first. Pick a silly side and plant your flag for 30 seconds. Like: pancakes beat waffles because they hold more syrup and syrup is the whole point.",
      "Your kid must take the other side and argue it for 30 seconds. No fence sitting, no I do not care. One real reason minimum, louder than a whisper.",
      "New round, new topic: pizza or tacos, summer or winter, reading or drawing. Three rounds total. The table cheers for the best reason, not the loudest voice."
    ],
    win: "Your kid defends the other side with at least one real reason and does not fold. Kids who can argue for waffles at dinner can stand up for themselves anywhere."
  },
{
    title: "The Detail Detective",
    cues: [
      "You go first: a 20 second true story.",
      "Your kid catches all three details.",
      "Switch. They tell, you catch.",
    ],
    tagline: "Tell a 20 second story from your day. Your kid catches every detail like a detective.",
    time: "3 min",
    steps: [
      "You go first. Tell a 20 second true story from your day with three little details in it. Like: I spilled coffee on my blue shirt and laughed in the parking lot.",
      "Your kid plays detective and names all three details back to you. Shirt, coffee, parking lot. If they miss one, they get one hint from the table.",
      "Switch. Your kid tells a 20 second true story with three details, and you catch them all. No writing anything down. Your ears are the notepad."
    ],
    win: "Your kid catches all three details without you repeating the story. Listening for the small stuff is how good friends are made. Tonight they practiced."
  },
{
    title: "What Happened Next",
    cues: [
      "You go first: start a tiny story.",
      "Your kid finishes it. Any ending goes.",
      "Chain it around the table.",
    ],
    tagline: "You start a story, your kid finishes it. Every wild ending counts.",
    time: "5 min",
    steps: [
      "You go first. Start a tiny story and stop right before the fun part. Like: the dog was barking at the mailbox and then the mailbox started barking back, and then...",
      "Your kid finishes the story. Any ending counts. Wild is welcome. The only rule is they have to end it, not shrug and say I do not know.",
      "Go around the table. Each person starts a story, the next person finishes it. Keep each story under a minute. Short stories, big imaginations."
    ],
    win: "Your kid finishes a story with a real ending instead of trailing off. Endings are the hardest part of telling anything. They just nailed one."
  },
{
    title: "The Because Thanks",
    cues: [
      "You go first: thank them, and say why.",
      "Your kid thanks someone with a because.",
      "Thank the table, one by one.",
    ],
    tagline: "Thank someone at the table and say exactly why. The because is the whole game.",
    time: "3 min",
    steps: [
      "You go first. Thank your kid for one real thing and say exactly why. Like: thank you for setting the table, because it meant I got to sit down two minutes earlier.",
      "Your kid thanks someone at the table with a because. Not just thanks, but thanks plus the reason. The because is the whole game.",
      "Go around the table. Everyone thanks one person, with a because. Keep it real. The table that thanks each other stays close."
    ],
    win: "Your kid gives a thank you with a real because behind it. Specific gratitude lands harder than a fast thanks. They just made someone's night."
  },
{
    title: "The Two-Word Answer",
    cues: [
      "You go first: answer in two words.",
      "Your kid answers fast, two words only.",
      "Lightning round. Keep it moving.",
    ],
    tagline: "Silly questions, two word answers, zero thinking time. Your kid answers fast.",
    time: "3 min",
    steps: [
      "You go first. Your kid asks you three silly questions and you answer each in exactly two words, fast. Like: favorite food? Cold pizza. No thinking, no fixing it.",
      "Switch. You ask your kid three silly questions and they answer in two words, fast. If they freeze, count to three out loud and the answer has to be out.",
      "Lightning round: anyone at the table shouts a question, anyone answers in two words. Keep it moving. Speed is the whole game."
    ],
    win: "Your kid answers all three questions without freezing. Fast answers teach their brain that it can show up under pressure. That trust sticks."
  }
];
