// /src/config.js — ALL editable content lives here

const config = {
  friendName: "Cindi",
  homeName: "Vanshi",
  logo: "/assets/bdaylogo.png",
  cardUrl: "/card.html",

  stages: [
    {
      word: "HAPPY",
      hints: [],
      winBanner: "Okay that was the warm-up. Don't get cocky.",
      sticker: "/assets/stickers/sticker1.png",
    },
    {
      word: "BDAYY",
      hints: [
        "Think birthday but Pari wrote it with a 5 letter cap",
        "There are two Y's in there",
      ],
      winBanner: "I can see you making that cone face from right here",
      sticker: "/assets/stickers/sticker2.png",
    },
    {
      word: "CINDI",
      hints: [
        "The clock has struck 12, vanshi has been replaced with ______",
      ],
      winBanner: "You literally guessed your own name. Incredible.",
      sticker: "/assets/stickers/sticker3.png",
    },
  ],

  // Sarcastic / Bullying 21st birthday lines for ducks when tapped (no emojis)
  duckQuotes: [
    "Quack Quack",
    "Don’t You Sleep",
    "Uncle Status: Unlocked",
    "Such An Oldie",
    "One Braincell Left",
    "Stop Being Mean",
    "Big Bitch Energy",
    "Do You Have Heart?",
    "Only 5% Nice",
    "Happiest Birthdayyy!",
    "UR SO OLD NOW",
    "Cone-Faced Baddie",
    "The Best Duck",
  ],

  banter: {
    start: [
      "3 words. 1 duck. Do not disappoint.",
      "The ducks are watching. No pressure.",
      "If you lose to a 5-letter word, that's on you.",
      "A duck believes in you. Don't let it down.",
      "Welcome. The vibes are immaculate. The words are not.",
    ],
    wrongGuess: [
      "Quack. That was embarrassing.",
      "Bold guess. Wrong, but bold.",
      "The duck is judging you silently.",
      "That word doesn't even go here.",
      "Bro. Read the tiles.",
      "Even the duck got it faster.",
      "You're built different. Not better. Just different.",
      "The mirror ball is spinning but you're not winning.",
    ],
    notEnoughLetters: [
      "That's not 5 letters. Count again.",
      "Did you forget how numbers work?",
      "5 letters. FIVE. como cinco.",
      "More letters. The duck demands it.",
    ],
    win: [
      "Ok you're kinda cracked at this.",
      "The duck approves. Barely.",
      "That was almost impressive. Almost.",
      "Fine. You got it. Don't let it go to your head.",
      "W. Massive W.",
    ],
    reset: [
      "Skill issue. Try again.",
      "The duck gave you 6 tries and you used them all wrong.",
      "Resetting. Pretend that didn't happen.",
      "Round 2. The duck forgets nothing though.",
    ],
    hintNudge: "Just press the button, hero.",
  },

  finaleText: "HAPPY BDAYY CINDI",

  // Auto-generated from /public/assets/elements/
  elements: {
    ducks: [
      "/assets/elements/duck1.png",
      "/assets/elements/duck2.png",
      "/assets/elements/duck4.png",
      "/assets/elements/duck5.png",
      "/assets/elements/duck6.png",
      "/assets/elements/duck7.png",
    ],
    stars: ["/assets/elements/star.png"],
    disco: ["/assets/elements/mirrorball.png"],
    balloons: [],
    candles: [],
    cake: [],
    cameos: [],
    misc: ["/assets/elements/banana.png"],
  },

  // Ransom note letter styles (deterministic per character index)
  ransomFonts: [
    "'Playfair Display', serif",
    "'Roboto Slab', serif",
    "'Space Mono', monospace",
    "'Nunito', sans-serif",
    "'Poppins', sans-serif",
    "'Permanent Marker', cursive",
    "'Caveat Brush', cursive",
  ],

  ransomColors: [
    "#FFF8E7", // cream
    "#111",    // ink
    "#C0392B", // red
    "#FFD93B", // duck yellow
    "#3B6FB6", // denim
    "#A9D6F5", // sky
    "#14213D", // navy
    "#27AE60", // green
    "#E67E22", // orange
  ],
};

export default config;
