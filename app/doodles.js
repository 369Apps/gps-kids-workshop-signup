/* GPS Kids Daily - hand-drawn doodles, app colors (navy bg: yellow + coral).
   One doodle per game (index 0-6 = Mon-Sun) plus tab doodles. */
var DOODLES = (function () {
  var Y = "#ffd166", C = "#ff8a7a";
  function svg(inner) {
    return '<svg viewBox="0 0 96 96" fill="none" stroke-width="4" stroke-linecap="round">' + inner + "</svg>";
  }
  return {
    game: [
      /* 0 Louder Than the Fridge - megaphone */
      svg('<path d="M18 42 h22 l16 -12 v40 l-16 -12 h-22 z" stroke="' + Y + '" stroke-linejoin="round"/><path d="M30 58 v14" stroke="' + C + '"/><path d="M64 38 q10 10 0 20 M76 32 q15 16 0 32" stroke="' + C + '"/>'),
      /* 1 The Lighthouse Look - eye */
      svg('<path d="M14 48 q17 -20 34 -20 q17 0 34 20 q-17 20 -34 20 q-17 0 -34 -20 z" stroke="' + Y + '" stroke-linejoin="round"/><circle cx="48" cy="48" r="8" stroke="' + C + '"/>'),
      /* 2 The Backwards Rule - opposing arrows */
      svg('<path d="M20 34 h42 M52 24 l12 10 -12 10" stroke="' + Y + '" stroke-linejoin="round"/><path d="M76 62 h-42 M44 52 l-12 10 12 10" stroke="' + C + '" stroke-linejoin="round"/>'),
      /* 3 Echo It Back - echo bubbles */
      svg('<path d="M16 20 h34 v22 h-22 l-8 8 v-8 h-4 z" stroke="' + Y + '" stroke-linejoin="round"/><path d="M46 54 h34 v22 h-22 l-8 8 v-8 h-4 z" stroke="' + C + '" stroke-linejoin="round"/>'),
      /* 4 The Worst Day Award - medal */
      svg('<circle cx="48" cy="60" r="15" stroke="' + Y + '"/><path d="M48 52 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" stroke="' + C + '" stroke-linejoin="round"/><path d="M38 34 L44 46 M58 34 L52 46" stroke="' + Y + '"/>'),
      /* 5 Thank the Invisible - heart */
      svg('<path d="M48 78 C22 62 16 36 31 28 C41 23 48 31 48 38 C48 31 55 23 65 28 C80 36 74 62 48 78 Z" stroke="' + C + '" stroke-linejoin="round"/>'),
      /* 6 The Last-Minute Toast - raised glass */
      svg('<path d="M34 18 h28 l-4 34 h-20 z" stroke="' + Y + '" stroke-linejoin="round"/><path d="M38 30 h20" stroke="' + C + '"/><path d="M48 52 v22 M38 82 h20" stroke="' + C + '"/>')
    ],
    streak: svg('<path d="M48 10 l8 21 22 1 -17 14 6 21 -19 -12 -19 12 6 -21 -17 -14 22 -1 z" stroke="' + Y + '" stroke-linejoin="round"/>'),
    leaders: svg('<path d="M34 16 h28 v22 q0 16 -14 16 q-14 0 -14 -16 z" stroke="' + Y + '" stroke-linejoin="round"/><path d="M34 22 h-10 q0 12 10 14 M62 22 h10 q0 12 -10 14 M48 54 v10 M38 80 h20" stroke="' + C + '"/>'),
    draw: svg('<path d="M52 20 L76 44 L40 80 L22 84 L26 66 Z" stroke="' + Y + '" stroke-linejoin="round"/><path d="M22 84 L34 72" stroke="' + C + '"/><path d="M60 32 L68 40" stroke="' + C + '"/>'),
    mic: svg('<rect x="38" y="12" width="20" height="34" rx="10" stroke="' + Y + '"/><path d="M43 22 h10 M43 30 h10" stroke="' + Y + '" stroke-width="2.5"/><path d="M30 40 q0 22 18 22 q18 0 18 -22" stroke="' + Y + '"/><path d="M48 62 v12 M38 80 h20" stroke="' + C + '"/>')
  };
})();
