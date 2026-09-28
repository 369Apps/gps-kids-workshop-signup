/* GPS Kids Daily - the 7 dinner-table games.
   Monday = game 0, Tuesday = game 1, ... Sunday = game 6.
   Week of 2026-09-28. */
const GAMES = [
  {
    title: "Shout the Headline",
    cues: [
      "You go first: read a silly headline, loud.",
      "Your kid reads theirs. Louder than yours.",
      "Final round: everyone shouts at full blast.",
    ],
    tagline: "Your kid reads the family news like it is breaking, louder every round.",
    time: "3 min",
    steps: [
      "You go first. Make up a silly news headline about your family and read it loud, like breaking news: LOCAL DAD EATS THREE PIECES OF GARLIC BREAD.",
      "Your kid makes up their own headline and reads it even louder than yours. Coach them up if they hold back. The loud one wins.",
      "Final round: everyone at the table shouts a headline at full blast at the same time. Total news chaos. Nobody wins. Everybody does."
    ],
    win: "Your kid's headline is louder than yours and they are laughing while they say it. Loud plus laughing is the whole point."
  },
  {
    title: "The Love Sentence",
    cues: [
      "You go first: one kind sentence, eyes on them.",
      "Your kid says one back. Eyes the whole time.",
      "Around the table: everyone gets a turn.",
    ],
    tagline: "One full sentence of kindness, eyes locked the whole time.",
    time: "3 min",
    steps: [
      "You go first. Look your kid right in the eyes and say one full kind sentence about them. Like: I love how you helped your sister with her homework.",
      "Your kid does the same to you: eyes on you, one kind sentence. If their eyes drop, pause and wait. No rush. Waiting is part of the game.",
      "Go around the table until everyone has spoken one sentence to someone else, eyes up the whole time."
    ],
    win: "Your kid keeps their eyes on you through the whole sentence. Kind words with eye contact land deeper than any sentence said to the floor."
  },
  {
    title: "Convince the Judge",
    cues: [
      "You go first: argue a tiny want, 30 seconds.",
      "Your kid argues theirs. The table is the judge.",
      "Losing is fine. Arguing well is the win.",
    ],
    tagline: "Your kid argues for something real tonight. Dessert is on the table.",
    time: "5 min",
    steps: [
      "You go first. Pick a tiny silly want and argue for it for 30 seconds like you mean it. Example: I deserve the biggest piece of garlic bread, because I cooked the dinner.",
      "Your kid picks their own want and argues it for 30 seconds. It can be real: dessert tonight, five more minutes of TV. Reasons, not begging.",
      "The rest of the table plays judge and picks a winner. The rule: losing is fine. Arguing well is the win."
    ],
    win: "Your kid gives a real reason, not just please. The first time a kid argues with a reason instead of whining, the skill is showing up."
  },
  {
    title: "The News Report",
    cues: [
      "You go first as anchor: ask, then recap the table.",
      "Your kid anchors next. You answer, they recap.",
      "Score it together: one detail right is a win.",
    ],
    tagline: "Your kid interviews the table, then reports back like a news anchor.",
    time: "5 min",
    steps: [
      "You go first as the anchor. Ask everyone one question: What happened in your day? Then recap the whole table's news in 20 seconds, like a TV anchor.",
      "Your kid takes the anchor job. They ask the questions, the family answers, and then they recap it all back in their own words.",
      "Score it together: what did the anchor get right? One remembered detail is a win."
    ],
    win: "Your kid's recap holds one real detail from someone else's day. A kid who can report back what they heard is a kid people trust."
  },
  {
    title: "The Secret Life of Objects",
    cues: [
      "You go first: pick an object, invent its secret life.",
      "Your kid picks theirs. Thirty seconds of story.",
      "Bonus: connect your two stories together.",
    ],
    tagline: "That spoon has a past. Tonight your kid tells it.",
    time: "5 min",
    steps: [
      "You go first. Pick any object on the table and invent its secret life. Example: This spoon once crossed the ocean inside a pirate's boot.",
      "Your kid picks their own object and tells its story for 30 seconds. Silly is good. Details are better.",
      "Bonus round: connect the two stories. How did the spoon and their object meet? The wilder the link, the better."
    ],
    win: "Your kid's story has one detail that surprises the table. Details are what make a story feel real, and tonight they practiced inventing them."
  },
  {
    title: "Three Good Things",
    cues: [
      "You go first: three small good things, slowly.",
      "Your kid names theirs. Small counts: warm socks.",
      "Last round: one good thing about each other.",
    ],
    tagline: "Three tiny good things about today, said out loud and slow.",
    time: "3 min",
    steps: [
      "You go first. Name three small good things about today, said slow and out loud. Small counts: warm socks, the dog's head on my knee, this soup.",
      "Your kid names their three. If they stall, start tiny: the bread was warm. That counts.",
      "Last round: each person names one good thing about the person next to them."
    ],
    win: "Your kid names all three without rushing through them. Saying good things slowly, out loud, is gratitude you can hear."
  },
  {
    title: "The Yes Machine",
    cues: [
      "You go first: answer a weird question in 3 seconds.",
      "Your kid answers the next ones. Fast, no thinking.",
      "Level up: answer as a pirate, then as a robot.",
    ],
    tagline: "No thinking allowed. The table throws weird, and your kid answers fast.",
    time: "3 min",
    steps: [
      "You go first. Someone asks you a weird question and you answer in 3 seconds, no thinking. Example: What if the table turned into a swimming pool? Then I would race my soup.",
      "Your kid's turn. The table fires three weird questions and your kid answers fast, no prep. Speed beats sense tonight.",
      "Level up round: answer the next one as a pirate, then as a robot. Silly voices required."
    ],
    win: "Your kid answers all three without freezing. Fast answers build the trust that their brain will show up when it matters."
  }
];
