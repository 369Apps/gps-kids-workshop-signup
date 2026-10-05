/* GPS Kids Daily - the 7 dinner-table games.
   Monday = game 0, Tuesday = game 1, ... Sunday = game 6.
   Week of 2026-10-05. */
const GAMES = [
{
    title: "The Sports Call",
    cues: [
      "You go first: call the play like a sports announcer.",
      "Your kid calls the next play. Louder.",
      "Final round: everyone calls it at once.",
    ],
    tagline: "Dinner is the big game. Your kid calls the play, loud and proud.",
    time: "3 min",
    steps: [
      "You go first. Pick up the potatoes and call it like a sports announcer: And the dad passes the potatoes... he shoots... HE SCORES! Big voice, big arms, full drama.",
      "Your kid picks the next play and calls it louder than you did. Passing the bread. Serving the salad. Full announcer voice, no whispering.",
      "Final round: everyone at the table calls the same play at the same time. Dessert is served! Loudest call wins the table."
    ],
    win: "Your kid's announcer voice is bigger than their regular voice. A kid who can fill a kitchen with their voice can fill a classroom too."
  },
{
    title: "One Slow Sentence",
    cues: [
      "You go first: one sentence, slow, eyes on them.",
      "Your kid says one back. Eyes the whole time.",
      "Go slow. Slow is brave.",
    ],
    tagline: "One slow sentence, eyes up. The bravest three minutes of the week.",
    time: "3 min",
    steps: [
      "You go first. Look your kid right in the eyes and say one full sentence about your day, very slowly. Like: Today... I fixed something hard... and I was proud. Slow on purpose.",
      "Your kid says one sentence back to you, just as slow, eyes on you the whole time. If their eyes drop, wait. Say nothing. Let them find you again.",
      "Go around the table. Each person speaks one slow sentence to the person next to them, eyes up. Slow wins tonight."
    ],
    win: "Your kid finishes one sentence without rushing or looking away. Slow eye contact is the hardest kind, and they just did it at dinner."
  },
{
    title: "My Family Rule",
    cues: [
      "You go first: announce a silly new family rule.",
      "Your kid announces theirs and defends it.",
      "The table votes. The rule sticks tonight.",
    ],
    tagline: "Tonight your kid makes the rules. And defends them like a lawmaker.",
    time: "5 min",
    steps: [
      "You go first. Announce one silly new family rule and defend it for 30 seconds. Like: From now on, dessert comes before dinner on Wednesdays, because happy people digest better.",
      "Your kid announces their own family rule and defends it for 30 seconds. It can be real: no phones at dinner, homework before TV. Reasons required, no whining.",
      "The table votes. The winning rule sticks for tonight only. The real win is not the rule. It is that they stood behind their words."
    ],
    win: "Your kid gives one real reason for their rule and does not back down when the table pushes back. Standing firm at the table is practice for standing firm everywhere."
  },
{
    title: "The Sandwich Order",
    cues: [
      "You go first: order a dream sandwich with 3 parts.",
      "Your kid repeats the order back, word for word.",
      "Switch: they order, you repeat.",
    ],
    tagline: "Listen once. Repeat it back. Your kid practices the part of speaking nobody sees.",
    time: "3 min",
    steps: [
      "You go first. Order a dream sandwich with three parts, like: I want chicken, extra cheese, and pickles. Your kid listens, then repeats the order back, word for word.",
      "Your kid orders their own dream sandwich with three parts. You listen, then repeat it back to them, word for word. No writing it down. Your ears are the notepad.",
      "Hard round: order a sandwich with five parts. The listener has to get all five. Celebrate the repeats, not just the orders."
    ],
    win: "Your kid repeats your order back without asking you to say it again. Listening once and getting it right is a skill most adults never practice."
  },
{
    title: "The Six Word Story",
    cues: [
      "You go first: tell your whole day in 6 words.",
      "Your kid writes theirs: six words only.",
      "Read them aloud. Vote for the most mysterious.",
    ],
    tagline: "Six words. Your whole day. Your kid tells it like a poet.",
    time: "3 min",
    steps: [
      "You go first. Tell your whole day in exactly six words. Like: Meeting ran long. Soup fixed everything. Count on your fingers if you need to.",
      "Your kid tells their day in six words. If they stall, start them off: think of one good thing and one hard thing, then squash it all down.",
      "Everyone reads theirs aloud. The table votes on the most mysterious story, the one that makes everyone want to know more. Mystery is the prize."
    ],
    win: "Your kid lands on six words that are not just a list. The moment they pick words to make the table curious, they are learning what stories do."
  },
{
    title: "The Lucky Break",
    cues: [
      "You go first: one bad thing, one lucky part.",
      "Your kid finds their lucky part.",
      "The harder the bad thing, the better the find.",
    ],
    tagline: "One annoying thing from today. Then find the lucky part hiding inside it.",
    time: "3 min",
    steps: [
      "You go first. Name one annoying thing from your day, then find the lucky part hiding inside it. Like: I got stuck in traffic, but the lucky part is I finished a whole podcast episode.",
      "Your kid names their annoying thing and finds their lucky part. If they stall, ask: what did that annoying thing give you that you did not expect?",
      "Go around the table. Each person gets one turn. The harder the bad thing, the bigger the cheer for the lucky part."
    ],
    win: "Your kid finds a real lucky part, not a fake one. Kids who can find the good inside the bad speak about life differently. Tonight they practiced."
  },
{
    title: "Ask the Expert",
    cues: [
      "You go first: become an expert on something silly.",
      "The table asks. You answer without thinking.",
      "Your kid becomes the expert. Ten seconds to prepare.",
    ],
    tagline: "Your kid is the world expert on something absurd. The table asks. They answer.",
    time: "5 min",
    steps: [
      "You go first. Pick something absurd and declare yourself the world expert. Like: I am the world's top expert on why socks disappear. The table fires three questions. You answer fast, no thinking. Confidence beats accuracy.",
      "Your kid picks their expert topic and gets ten seconds to prepare. Then the table fires three questions and they answer on the spot.",
      "Lightning round: anyone at the table can shout a new expert topic and someone answers in five seconds. Keep it moving. Speed is the whole game."
    ],
    win: "Your kid answers all three questions without freezing or saying I don't know. Answering fast with a straight face builds the trust that their brain shows up under pressure."
  }
];
