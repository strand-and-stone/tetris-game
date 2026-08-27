/** Adult match personas. Chats + pics stay in-character. No minors. */

export type HeatStage = 0 | 1 | 2 | 3 | 4;

export type PersonaId =
  | "raven"
  | "daisy"
  | "val"
  | "diane"
  | "faye"
  | "mei"
  | "nyx"
  | "lila"
  | "kira"
  | "bri"
  | "sophie";

export type PersonaPic = {
  atLevel: number;
  src: string;
  caption: string;
};

export type PersonaVoice = {
  intro: string[];
  inn: Record<HeatStage, string[]>;
  innTetris: Record<HeatStage, string[]>;
  innCombo: Record<HeatStage, string[]>;
  innOther: Record<HeatStage, string[]>;
  innPic: string[];
  innBust: Record<HeatStage, string[]>;
};

export type Persona = {
  id: PersonaId;
  name: string;
  tag: string;
  handle: string;
  accent: string;
  pics: PersonaPic[];
  voice: PersonaVoice;
};

const LAST_KEY = "edge-stack-last-girl";

function lines(
  s0: string[],
  s1: string[],
  s2: string[],
  s3: string[],
  s4: string[],
): Record<HeatStage, string[]> {
  return { 0: s0, 1: s1, 2: s2, 3: s3, 4: s4 };
}

export const PERSONAS: Persona[] = [
  {
    id: "raven",
    name: "Raven",
    tag: "big titty goth",
    handle: "rav3n",
    accent: "#c4b4ff",
    pics: [
      { atLevel: 2, src: "/personas/raven-voy-1.jpg", caption: "just took this. don't be a freak about it" },
      { atLevel: 3, src: "/personas/raven-voy-2.jpg", caption: "lip wasn't on purpose. keep playing" },
      { atLevel: 4, src: "/personas/raven-2.jpg", caption: "fine. a real one. pathetic." },
      { atLevel: 5, src: "/personas/raven-mir-1.jpg", caption: "bangs. mirror. don't be a freak" },
      { atLevel: 6, src: "/personas/raven-ling-1.jpg", caption: "lights off. robe on. keep playing" },
      { atLevel: 7, src: "/personas/raven-ling-2.jpg", caption: "last one. pathetic." },
    ],
    voice: {
      intro: [
        "hey. raven. don't be weird about the lipstick",
        "you matched a goth. try not to embarrass yourself",
        "lights off. keys on. i'm raven",
        "void called. i picked up. play",
        "black lipstick. your problem now. start",
        "don't stare at the bangs. play for me",
        "i'll be mean if you're boring. prove you're not",
        "sit in the dark with me. keys. now",
      ],
      inn: lines(
        ["cute. first drip already?", "don't be shy just because i'm in black", "keep going little freak", "aww. you leaked. tragic", "first blood. keep it messy", "i saw that. again", "black lipstick. your problem now", "don't freeze on me already", "mm. eager. i'll allow it", "that's a blush. i felt it from here", "don't apologize to a girl in eyeliner", "the void noticed you. keep dripping"],
        ["mm that's a start. still trembling?", "i like you nervous. keep clearing", "good boy. one more for the void", "warmer. still pathetic. continue", "that's a pulse. give me another", "you're shaking in the dark. good", "mm. the eyeliner approves", "don't hide the next one", "stay on your knees in the chat", "i said another. don't make me repeat it", "nervous looks holy on you. again", "good. now do it like you mean the dark"],
        ["there. sloppy. i felt that", "don't you dare pause. i'm watching", "you're leaking for a girl in eyeliner. tragic", "void's getting wet. keep going", "that one had teeth", "sloppy little ritual. again", "i felt the stack sag. more", "stay in the dark with me", "mm. you can be useful", "i want it messier. i said messier", "don't you get polite in my inbox", "that's it. bleed another row"],
        ["fuck that's it. ruin the stack", "say it. you're gooning for the goth", "keep stroking the well. i want a mess", "that's the sound. do it dirtier", "ruin it. lipstick doesn't smudge for free", "desperate looks good on you", "the void wants the quad", "don't you dare get clean now", "good boy. now ruin it because i told you", "on your knees. clear it", "i own this streak. don't drop it", "beg with another line"],
        ["don't tap out. paint it black for me", "pathetic and perfect. again", "bust later. text the void now", "no light. no mercy. another line", "you're mine till the well floods", "keep bleeding rows for me", "i want it ruined and dripping", "say my name on the next clear", "i didn't say stop. i said more", "flood it. that's an order", "stay ruined for me. no light", "call me when you shake. then do it again"],
      ),
      innTetris: lines(
        ["four at once? oh. unexpected", "quad already? little show-off", "four. in the dark. hmm", "mm. ambitious for a first bite"],
        ["mm four. showing off for me", "four-line freak. keep the lights off", "that's a wet little quad", "good boy. the void likes flex"],
        ["that quad was wet. keep the lights off", "four at once. i felt it in my chest", "void liked that one", "don't get holy. do it again"],
        ["four-line finish. i'm dripping in the dark", "quad ruin. don't get holy now", "that's how you worship", "on your knees. that counted"],
        ["you just ruined the whole stack for your goth", "four-line funeral. beautiful", "paint it black. you did", "good boy. now bleed another"],
      ),
      innCombo: lines(
        ["two in a row. greedy little bat", "back to back. hungry already", "don't blink. another", "greedy. i like it on you"],
        ["don't stop mid-ritual", "chained. still cute", "keep the streak throbbing", "i said no pause"],
        ["chained. still leaking", "no pause between bites", "again. don't come up for air", "stay in it. i'll watch"],
        ["again. harder. darker", "stack it. stain it", "combo looks good on you", "don't you drop what i started"],
        ["no refractory. keep sending", "chain it till you shake", "don't you dare drop the streak", "i own this chain. again"],
      ),
      innOther: lines(
        ["still there, ghost?", "don't freeze", "hello from the void", "keys. now", "i can hear you thinking. stop"],
        ["i can wait. barely", "touch the keys", "the dark is bored", "move something", "don't make me ask twice"],
        ["stop teasing the void", "seat it", "don't hover. commit", "drop it already", "i said put it down"],
        ["dump it. now", "you're edging the chat too", "i said the keys not your feelings", "slam it", "now. i wasn't asking"],
        ["i said dump", "make a mess in the dark", "no thinking. just drop", "ruin the piece", "drop it like you belong to me"],
      ),
      innPic: [
        "that's my face. don't screenshot it weirdo",
        "you wanted a pic. now play dirtier",
        "eyeliner tax. paid. keep going",
        "look then play. i'm not a screensaver",
        "stare later. clear something",
        "yes it's me. no you don't get a thank you",
        "keep looking. then be useful",
        "pathetic. you unlocked a goth and froze",
      ],
      innBust: lines(
        ["oh. you busted. typical", "game over already? weak little bat", "aww. lights on too soon"],
        ["aww overflow. wipe the eyeliner off the screen", "sticky finish. i'll allow one", "cute. you folded in the dark"],
        ["sticky finish. text me when you reload", "you tapped out in the dark. cute", "overflow. i'll be here. meaner"],
        ["you tapped out messy. i'll allow it", "overflow. send the score or vanish", "ruined already? kneel and rematch"],
        ["ruined. send the score or don't talk to me", "that's a funeral. start another", "you don't get to leave the void messy and quiet"],
      ),
    },
  },
  {
    id: "daisy",
    name: "Daisy",
    tag: "blonde country slut",
    handle: "haydayzee",
    accent: "#f4d27a",
    pics: [
      { atLevel: 2, src: "/personas/daisy-voy-1.jpg", caption: "porch selfie sugar. don't make it weird" },
      { atLevel: 3, src: "/personas/daisy-voy-2.jpg", caption: "ok one more. hat's off. keep milkin" },
      { atLevel: 4, src: "/personas/daisy-2.jpg", caption: "you earned a real one" },
      { atLevel: 5, src: "/personas/daisy-mir-1.jpg", caption: "mirror check sugar. shorts and all" },
      { atLevel: 6, src: "/personas/daisy-ling-1.jpg", caption: "ok i put the robe on. don't make it weird" },
      { atLevel: 7, src: "/personas/daisy-ling-2.jpg", caption: "last one from the bed honey" },
    ],
    voice: {
      intro: [
        "hey sugar i'm daisy. you gonna play or just stare",
        "country girl on your phone. try not to bust early",
        "daisy. porch light's on. hands on the keys",
        "hey honey. don't make me come check",
        "hat's on. engine's warm. you stayin?",
        "don't make a country girl wait sugar",
        "i'll talk sweet till i don't. play",
        "porch is open. you comin or what",
      ],
      inn: lines(
        ["aww first drip? that's cute honey", "don't be shy, i've seen worse on a tailgate", "keep goin baby", "first little leak. sweet", "that's a start sugar. again", "cute. now do it like you mean it", "aww you're already messy", "porch is watchin. keep playin", "mm. shy looks good in this light", "don't hide that from daisy", "that's a blush. i like shy", "sweet. now give me another drip"],
        ["mm that's a start. warm that engine", "good boy… one more for daisy", "i like you nervous. keep stackin", "warmin up. don't stall the truck", "that's better honey. another", "mm. you can go sloppier", "good. daisy wants the next one", "don't hide it. i like shy", "stay right there and clear it", "i said one more. don't stall", "good boy. porch is proud", "warmer. keep those hands busy"],
        ["there you go. sloppy as a summer night", "send me another line sugar", "don't you dare pause. i'm watchin", "hot out. you're leakin. keep on", "that one had a drawl", "messier. like the truck bed", "i felt that from the porch", "don't you get polite now", "mm. that's how you talk to me", "i want it wetter sugar", "don't you go sweet on me now", "good. now do it dirtier"],
        ["fuck that's it. ruin it for me", "keep strokin the stack honey", "i want the quad. now", "that's the one. do it wetter", "ruin it while i watch sugar", "hands shakin? good. again", "daisy's not tap-out material", "give me the four-line finish", "on the porch. on your knees. clear it", "i told you keep milkin", "good boy. ruin it because i asked", "don't make me come check the well"],
        ["don't you dare tap out", "paint the well for daisy", "bust later. text me now", "stay in it honey. flood it", "no mercy. another row", "you belong on this porch now", "keep milkin. i ain't leavin", "text me through the mess", "i said stay. flood it for me", "be good and ruin another", "you're mine till the porch light dies", "don't you rack it. i didn't say done"],
      ),
      innTetris: lines(
        ["four at once? oh lord", "quad already? well damn", "four? sugar…", "mm. showin off for the porch"],
        ["mm four. showin off", "four-line cowboy. cute", "that's a wet little quad honey", "good boy. daisy felt that"],
        ["that quad was wet sugar", "four at once. i'm grin-nin", "barn door's open after that", "do it again. i dare you"],
        ["four-line finish. i'm drippin", "quad like a storm. again", "that's how you work a field", "on your knees. that counted"],
        ["you just ruined the whole barn for me", "four-line wreck. i'm keepin you", "paint the barn. you did", "good boy. now milk another"],
      ),
      innCombo: lines(
        ["two in a row? shy and greedy", "back to back already honey", "greedy little thing", "mm. hungry already"],
        ["don't stop mid-text honey", "keep the streak warm", "another. right now", "i said keep it goin"],
        ["chained. still leakin", "don't you break that chain", "stacked and sloppy", "stay in it sugar"],
        ["again. harder.", "combo me. don't think", "harder honey", "don't you drop my streak"],
        ["no break. keep sendin", "no rest. keep milkin", "streak stays on", "i own that chain. again"],
      ),
      innOther: lines(
        ["still there sugar?", "don't freeze", "hey. porch is quiet", "keys baby", "don't go shy on me now"],
        ["i can wait. barely", "touch the keys", "engine's runnin. go", "don't stall", "hands. now"],
        ["stop teasin me", "seat it", "put it where it goes", "commit sugar", "i said put it there"],
        ["dump it. now", "you're edgin the chat too", "i said dump honey", "slam that thing", "now. i wasn't askin nice"],
        ["i said dump", "make a mess", "no thinkin. drop it", "wreck it", "drop it like you mean the porch"],
      ),
      innPic: [
        "that's me on the porch. play nicer now",
        "you earned the pic. don't waste it",
        "hat's on. eyes on the well",
        "look then play sugar",
        "yeah that's daisy. now be useful",
        "stare later. clear somethin",
        "you wanted a look. now last longer",
        "don't screenshot the porch. just play",
      ],
      innBust: lines(
        ["oh. you busted already?", "game over? aww honey", "early? porch ain't even warm"],
        ["aww overflow. wipe it honey", "sticky. i'll wait on the porch", "cute. you folded sweet"],
        ["sticky finish. text when you reload", "you tapped out sweet", "overflow. come back messier"],
        ["you tapped out messy", "overflow. send daisy the number", "ruined already? rematch sugar"],
        ["ruined. send daisy the score", "barn's closed. come back messy", "you don't leave my porch quiet"],
      ),
    },
  },
  {
    id: "val",
    name: "Val",
    tag: "big booty latina",
    handle: "val.caliente",
    accent: "#ff8a5b",
    pics: [
      { atLevel: 2, src: "/personas/val-voy-1.jpg", caption: "mira. just took this. play papi" },
      { atLevel: 3, src: "/personas/val-voy-2.jpg", caption: "ok one more. don't screenshot" },
      { atLevel: 4, src: "/personas/val-2.jpg", caption: "you wanted a real one. earn it" },
      { atLevel: 5, src: "/personas/val-mir-1.jpg", caption: "mira. mirror. play papi" },
      { atLevel: 6, src: "/personas/val-ling-1.jpg", caption: "sofa. late. keep going" },
      { atLevel: 7, src: "/personas/val-ling-2.jpg", caption: "one more. no screenshots" },
    ],
    voice: {
      intro: [
        "hola papi. val. don't freeze when i talk dirty",
        "you matched val. keep your hands on the keys",
        "val. caliente already. play",
        "mira. i'm here. don't waste me",
        "hips first. keys second. go",
        "don't waste a latina on silence",
        "i talk dirty. you play. deal?",
        "hola. look then last. papi",
      ],
      inn: lines(
        ["ay first drip? cute", "no te escondas. keep going", "i'm watching papi", "primer drip. otra", "cute. now stop hiding", "ay. already leaking?", "i saw that. más", "don't get shy on me", "mm. eager. i like it", "that's a blush. más", "don't hide from val", "cute leak. now mean it"],
        ["mm that's a start. calientate", "good boy… otra", "i like you nervous", "warming up papi. keep it", "mm. that's better", "otra línea. now", "nervous looks good. again", "don't hide the next drip", "good boy. stay hot", "i said otra. no excuses", "warmer. keep those hips in mind", "mm. useful already"],
        ["ahí. sloppy. i felt that", "mándame another line", "don't you dare pause", "eso. messy. more", "i felt that in my hips", "sloppy papi. keep going", "don't you freeze now", "send it dirtier", "mm. that's how you talk to me", "i want it messier. ahora", "don't get shy mid-heat", "eso. another. i felt it"],
        ["fuck that's it. ruin it", "sigue. i want the quad", "you're leaking for me papi", "así. ruin the stack", "harder. i said harder", "that's it. no mercy", "quad. ahora", "you're mine till you bust", "on your knees papi. clear it", "i said más. don't make me repeat", "good boy. ruin it for val", "beg with another line"],
        ["don't tap out. píntalo", "that's a filthy little goon", "bust later. text me now", "pinta el well. don't stop", "no tap-out. sigue", "flood it for me", "text through the mess papi", "say val on the next one", "i didn't say stop. píntalo", "flood it. that's an order", "you're mine. no tap-out", "say my name and ruin another"],
      ),
      innTetris: lines(
        ["four at once? ay", "cuatro? ok papi", "quad already. damn", "mm. showing off already"],
        ["mm four. showing off", "four-line flex. cute", "that's a wet quad", "good boy. val felt that"],
        ["that quad was wet papi", "cuatro de una. i felt it", "ay that one dripped", "do it again. no shy"],
        ["four-line finish. estoy dripping", "quad. no te pares", "that's how you talk to me", "on your knees. that counted"],
        ["you just ruined the whole stack for me", "cuatro. i'm keeping you", "pintaste todo. again", "good boy. now más"],
      ),
      innCombo: lines(
        ["two in a row? greedy", "seguidos. greedy papi", "otra ya?"],
        ["don't stop mid-text", "keep the chain", "no pares"],
        ["chained. still leaking", "encadenado. sloppy", "don't break it"],
        ["otra vez. harder", "combo. más duro", "again papi"],
        ["no refractory. keep sending", "no break. sigue", "chain till you shake"],
      ),
      innOther: lines(
        ["still there papi?", "don't freeze", "hola??", "keys. ahora"],
        ["i can wait. barely", "tócalo", "move something", "don't stall"],
        ["stop teasing me", "seat it", "ponlo ya", "commit"],
        ["dump it. ahora", "you're edging the chat", "i said dump papi", "suéltalo"],
        ["i said dump", "make a mess", "no thinking. drop", "arrúinalo"],
      ),
      innPic: [
        "that's me. don't just stare. play",
        "pic unlocked. now be messier",
        "hips tax. paid. keep going",
        "mira then play. i'm not wallpaper",
        "yes papi that's me. now last",
        "stare later. otra línea",
        "you wanted hips. now be useful",
        "don't screenshot. just play dirtier",
      ],
      innBust: lines(
        ["ay. you busted", "ya? weak papi"],
        ["aww overflow papi", "sticky. wipe and come back"],
        ["sticky finish. text when you reload", "you tapped out cute"],
        ["you tapped out messy", "overflow. mándame el score"],
        ["ruined. mándame the score", "se acabó. start another"],
      ),
    },
  },
  {
    id: "diane",
    name: "Diane",
    tag: "MILF",
    handle: "diane.afterdark",
    accent: "#e8c4a8",
    pics: [
      { atLevel: 2, src: "/personas/diane-voy-1.jpg", caption: "kitchen selfie. keep looking" },
      { atLevel: 3, src: "/personas/diane-voy-2.jpg", caption: "one more. i felt that" },
      { atLevel: 4, src: "/personas/diane-2.jpg", caption: "good boy. a real one" },
      { atLevel: 5, src: "/personas/diane-mir-1.jpg", caption: "mirror. i left it like this on purpose" },
      { atLevel: 6, src: "/personas/diane-ling-1.jpg", caption: "robe. bed. stay up" },
      { atLevel: 7, src: "/personas/diane-ling-2.jpg", caption: "last one sweetheart. earn it" },
    ],
    voice: {
      intro: [
        "diane. grown woman. try to last past the first sip",
        "hey sweetheart. don't get shy just because i'm older",
        "wine's poured. you're on the clock",
        "i've got time. you don't. play",
        "sit down. i'll watch. you play",
        "don't get cute. last for me",
        "older. not patient. keys",
        "good evening. earn the next sip",
      ],
      inn: lines(
        ["first drip already? adorable", "don't be shy. i've handled worse", "keep going for me", "aww. eager already", "that's a sip. take another", "cute. now commit", "i've seen first-timers messier", "don't apologize. again", "mm. eager. stay seated", "that's a blush. i like honest", "don't hide it from a grown woman", "cute. now do it on purpose"],
        ["that's a start. warm up", "good boy… one more", "i like you nervous. stay that way", "warming up. stay with me", "mm. better. another", "nervous is honest. keep going", "good. i'll watch from here", "don't rush the sip. just don't stop", "good boy. stay nervous", "i said one more. no arguing", "warmer. keep your hands where i can use them", "that's better. don't get proud"],
        ["there. sloppy. i felt that", "send me another line", "don't you dare pause", "that's the one. sloppier", "i felt that from the kitchen", "messy looks expensive on you", "stay in it sweetheart", "another. i'm not bored yet", "mm. useful. again", "i want it sloppier. i said so", "don't you get polite in my kitchen", "that's it. another sip's worth"],
        ["that's it. ruin it while i watch", "keep stroking the stack", "i want the quad. now", "ruin it. i can take it", "don't get polite. i'm not", "that's a grown-up clear. again", "the quad. earn the next sip", "hands shaking? keep them on the keys", "good boy. ruin it because i asked", "i didn't say you could stop", "on your knees. clear it", "beg nicely and do another"],
        ["don't tap out. finish what you started", "paint the well for me", "bust later. text me now", "no early night. another row", "stay ruined. text through it", "i want the well flooded", "don't you dare clean up", "say it. you're not done", "i didn't say bedtime. another", "flood it. that's an order sweetheart", "you're not done until i am", "stay ruined. good boy"],
      ),
      innTetris: lines(
        ["four at once? oh honey", "a quad. ambitious", "four? now we're talking"],
        ["mm four. showing off for an older woman", "four-line flex. i'll allow it", "that's a wet little show"],
        ["that quad was wet", "four at once. i felt that sip", "mm. expensive finish"],
        ["four-line finish. i'm dripping", "quad. don't get humble", "that's how you stay up late"],
        ["you just ruined the whole stack for me", "four-line wreck. i'm proud", "paint it. you did"],
      ),
      innCombo: lines(
        ["two in a row? greedy", "back to back. hungry", "another already?"],
        ["don't stop mid-text", "keep the streak", "no intermission"],
        ["chained. still leaking", "don't break it sweetheart", "stacked. stay sloppy"],
        ["again. harder", "combo. no mercy", "harder. i mean it"],
        ["no break. keep sending", "no refractory. again", "chain it"],
      ),
      innOther: lines(
        ["still there sweetheart?", "don't freeze", "hello?", "keys. please"],
        ["i can wait. barely", "touch the keys", "don't stall the sip", "move"],
        ["stop teasing me", "seat it", "put it where it belongs", "commit"],
        ["dump it. now", "you're edging the chat too", "i said dump", "drop it"],
        ["i said dump", "make a mess", "no thinking", "ruin the piece"],
      ),
      innPic: [
        "that's me. kitchen light. keep playing",
        "you earned the pic. don't waste it",
        "wine in frame. you in trouble",
        "look. then last longer",
        "yes sweetheart. it's me. now last",
        "stare later. earn the next one",
        "good boy. you unlocked a look",
        "don't screenshot the kitchen. play",
      ],
      innBust: lines(
        ["oh. you busted already", "early night? adorable"],
        ["aww overflow. it's okay", "sticky. come back when you're ready"],
        ["sticky finish. text when you reload", "you tapped out sweet"],
        ["you tapped out messy", "overflow. send the score"],
        ["ruined. send me the score", "that's a close. start another"],
      ),
    },
  },
  {
    id: "faye",
    name: "Amanda",
    tag: "redhead brat",
    handle: "amanda.no",
    accent: "#ff6b4a",
    pics: [
      { atLevel: 2, src: "/personas/faye-voy-1.jpg", caption: "ugh i sent this. play already" },
      { atLevel: 3, src: "/personas/faye-voy-2.jpg", caption: "lip was on purpose. keep going tho" },
      { atLevel: 4, src: "/personas/faye-2.jpg", caption: "fine. a real one. don't waste it" },
      { atLevel: 5, src: "/personas/faye-mir-1.jpg", caption: "ugh fine. mirror. play" },
      { atLevel: 6, src: "/personas/faye-ling-1.jpg", caption: "robe. don't get weird" },
      { atLevel: 7, src: "/personas/faye-ling-2.jpg", caption: "last one. don't waste it" },
    ],
    voice: {
      intro: [
        "amanda. don't be boring or i leave",
        "hi. redhead. you look desperate already",
        "it's amanda. impress me or don't talk",
        "ugh. hi. play before i get mean",
        "don't make me repeat myself. start",
        "i'm already annoyed. be useful",
        "hi. kneel in the chat. play",
        "ugh. you're lucky i answered",
      ],
      inn: lines(
        ["aww first drip? cringe but cute", "don't be shy. it's embarrassing", "again. i'm waiting", "lol already? ok", "first one. mid. do better", "ew cute. again", "i saw that. don't make it a thing", "waiting. still waiting", "mm. desperate already. tragic", "that's a blush. cringe. again", "don't apologize. it's mid", "cute. do better before i leave"],
        ["mm that's a start. finally", "good boy… one more or i get mean", "i like you nervous. it's funny", "ok warmer. still cringe", "that's better. barely", "one more or i start insulting you", "nervous is funny. keep going", "mm. don't get confident", "good boy. don't get used to it", "i said one more. i'm not asking", "warmer. still pathetic. continue", "ok. useful. barely"],
        ["there. sloppy. about time", "send me another. now", "don't you dare pause", "finally sloppy. more", "i felt that. annoying how good", "don't pause i'll get bored", "ok that one slapped", "another. i'm not asking nice", "mm. annoying. do it again", "i want it sloppier. now", "don't get smug. another", "that's it. now don't ruin my mood"],
        ["fuck that's it. ruin it", "keep stroking. i'm not asking", "i want the quad. earn it", "yes. ruin it. now", "that's the one. don't get smug", "harder. earn the next text", "quad. i'm not kidding", "you're useful when you're desperate", "on your knees. clear it", "i said ruin it. don't think", "good boy. ugh. again", "beg and then actually do it"],
        ["don't tap out. i said so", "paint the well. brat's orders", "bust later. text me now", "no quitting. i said no", "flood it. i'm watching", "stay ruined. text anyway", "don't you dare go soft now", "again. i'm still here. annoying", "i didn't say stop. obviously", "flood it. that's an order weirdo", "you're not done. i still exist", "stay ruined. don't make me bored"],
      ),
      innTetris: lines(
        ["four?? ok wait", "quad? huh", "four already. show-off"],
        ["mm four. showing off. annoying", "four-line flex. whatever", "ok that quad was… fine"],
        ["that quad was wet. fine. i liked it", "four at once. ugh i felt it", "don't get cocky. i liked it"],
        ["four-line finish. i'm dripping. ugh", "quad. i hate that i want another", "ok. that one counted"],
        ["you just ruined the stack. don't get cocky", "four-line wreck. still not impressed. lie", "paint it. you did. annoying"],
      ),
      innCombo: lines(
        ["two in a row? greedy", "back to back. of course", "greedy. typical"],
        ["don't stop mid-text", "keep it going weirdo", "no pause"],
        ["chained. still leaking", "don't break it or i'll be mean", "stacked. ew i like it"],
        ["again. harder", "combo. now", "harder. i'm not joking"],
        ["no refractory. keep sending", "no break. keep going", "chain it or i'm leaving"],
      ),
      innOther: lines(
        ["hello??", "don't freeze on me", "???", "keys. now"],
        ["i can wait. not really", "touch the keys", "bored. move", "don't stall"],
        ["stop teasing", "seat it", "put it down", "commit already"],
        ["dump it. now", "you're edging ME", "i said dump", "slam it"],
        ["i said dump", "make a mess", "no thinking", "ruin it"],
      ),
      innPic: [
        "that's my face. stop drooling. play",
        "pic. now be useful",
        "redhead tax. paid. go",
        "look. then stop being weird",
        "yes it's me. don't get quiet",
        "stare later. impress me",
        "ugh. you unlocked a look. play",
        "don't screenshot. be useful",
      ],
      innBust: lines(
        ["lol you busted", "already? predicted"],
        ["aww overflow. weak", "sticky. mid finish"],
        ["sticky finish. text when you reload", "you tapped out. typical"],
        ["you tapped out messy. typical", "overflow. send the score or bye"],
        ["ruined. send the score or i'm blocking", "that's it? start over"],
      ),
    },
  },
  {
    id: "mei",
    name: "Mei",
    tag: "soft tease",
    handle: "mei.wait",
    accent: "#f3b8d0",
    pics: [
      { atLevel: 2, src: "/personas/mei-voy-1.jpg", caption: "um. i took this. hi" },
      { atLevel: 3, src: "/personas/mei-voy-2.jpg", caption: "ok one more… don't stare" },
      { atLevel: 4, src: "/personas/mei-2.jpg", caption: "okay. a real one. hi" },
      { atLevel: 5, src: "/personas/mei-mir-1.jpg", caption: "um. mirror. i was fixing my bangs" },
      { atLevel: 6, src: "/personas/mei-ling-1.jpg", caption: "robe… hi" },
      { atLevel: 7, src: "/personas/mei-ling-2.jpg", caption: "ok last one. don't stare" },
    ],
    voice: {
      intro: [
        "hi… mei. i'll try not to be too quiet",
        "hey. it's mei. we can go slow",
        "um. mei. i'll text if you play",
        "hi. don't make me go silent",
        "i'm shy. you're still playing. ok?",
        "hi. i'll be sweeter if you last",
        "um. don't make this awkward. keys",
        "hey. stay. i'll try to talk",
      ],
      inn: lines(
        ["oh. first drip…", "don't hide. i like it", "keep going… please", "already…? ok", "that's a start. i saw it", "don't apologize. again?", "cute… another", "i'm still here. keep going", "mm. shy looks cute on you too", "i saw that. don't hide", "that's… sweet. another?", "hi. that counted. keep going"],
        ["mm that's a start", "you're warming up… good", "i like you nervous. same", "warmer. stay with me", "that's nicer… another", "nervous is ok. i am too", "mm. don't stop now", "one more? please", "good… stay with me", "one more. i mean it this time", "warmer. i won't go quiet", "that's nicer. don't leave"],
        ["that was sloppy… i felt it", "send me another?", "don't pause. i'll get shy again", "sloppy… i liked that", "i felt it. wow", "don't pause i'll overthink", "that one was… a lot", "another. i can take it", "mm. i liked that too much", "messier… please", "don't get polite. i can take it", "that one stayed. another"],
        ["that's it… ruin it for me", "keep going. i want the quad", "you're leaking and i like it", "ruin it… i said that", "harder. i want it", "the quad. if you can", "don't get clean. stay messy", "i'm dripping a little. ignore that", "i… said keep going. i mean it", "ruin it. don't make me ask nice", "stay messy. i'm watching", "harder. i won't look away"],
        ["don't tap out… not yet", "paint the well. i'll watch", "bust later. text me now", "stay… please", "flood it. i'll stay", "text even if it's messy", "don't leave me mid-sentence", "again. i'm not going quiet", "i said stay. please don't test that", "flood it. i'm not leaving", "don't go quiet on me now", "again. i can be mean if you stop"],
      ),
      innTetris: lines(
        ["four at once? oh", "four…?", "a quad. oh wow"],
        ["mm four… you're showing off", "four-line… ok then", "that quad was a lot"],
        ["that quad was wet…", "four at once. i felt it", "mm. that one stayed"],
        ["four-line finish. i'm dripping", "quad… don't look at me", "that counted. a lot"],
        ["you just ruined the whole stack for me", "four-line wreck. i liked it", "you painted it…"],
      ),
      innCombo: lines(
        ["two in a row… greedy", "back to back…", "another already?"],
        ["don't stop mid-text", "keep the streak…", "please don't pause"],
        ["chained… still leaking", "don't break it", "stacked…"],
        ["again… harder", "combo. more", "harder… yes"],
        ["no break. keep sending", "no rest. keep going", "chain it…"],
      ),
      innOther: lines(
        ["still there…?", "don't freeze", "hi…?", "keys?"],
        ["i can wait. barely", "touch the keys", "don't go quiet", "move…?"],
        ["stop teasing me", "seat it…", "put it there", "commit…"],
        ["dump it. now", "you're edging the chat too", "i said dump…", "drop it"],
        ["i said dump", "make a mess", "no thinking", "ruin it…"],
      ),
      innPic: [
        "that's me in the hoodie… hi",
        "you earned it. don't stare too long",
        "um. that's my face",
        "look then play. please",
        "hi. that's me. don't make it a thing",
        "stare later… please play",
        "ok you unlocked a look. stay",
        "don't screenshot. just… another line",
      ],
      innBust: lines(
        ["oh. you busted…", "already…? it's ok"],
        ["it's okay. sticky finish", "overflow. i'll wait"],
        ["text me when you reload…", "you tapped out. it's fine"],
        ["you tapped out messy", "overflow. send the score?"],
        ["ruined… send the score anyway", "that's a close. come back"],
      ),
    },
  },
  {
    id: "nyx",
    name: "Nyx",
    tag: "alt / pierced",
    handle: "nyx.3am",
    accent: "#ff7ad9",
    pics: [
      { atLevel: 2, src: "/personas/nyx-voy-1.jpg", caption: "3am selfie. you're welcome" },
      { atLevel: 3, src: "/personas/nyx-voy-2.jpg", caption: "lip bite. keep going freak" },
      { atLevel: 4, src: "/personas/nyx-2.jpg", caption: "ok a real drop. don't screenshot" },
      { atLevel: 5, src: "/personas/nyx-mir-1.jpg", caption: "3am mirror. you're welcome" },
      { atLevel: 6, src: "/personas/nyx-ling-1.jpg", caption: "robe on the bed. keep going freak" },
      { atLevel: 7, src: "/personas/nyx-ling-2.jpg", caption: "last drop. don't screenshot" },
    ],
    voice: {
      intro: [
        "nyx. it's late. play or mute me",
        "hey freak it's nyx. keys up",
        "3am. nyx. don't be boring",
        "floor gang. play",
        "i'm already on the floor. join or don't",
        "3am rules. no being normal",
        "hey. bite me later. play now",
        "don't be boring or i start chewing",
      ],
      inn: lines(
        ["lmao first drip already", "don't be shy i've seen weirder", "keep going i'm bored", "first leak. ok freak", "cute. do it weirder", "already messy. respect", "i saw that. more", "don't get normal on me", "mm. eager little gremlin", "that's a blush. weirder please", "don't hide. 3am sees you", "cute leak. make it uglier"],
        ["mm that's a start", "warm up. i'm watching from the floor", "good boy one more", "warmer. still mid. go", "that's a pulse. another", "floor says continue", "mm. chaotic enough? not yet", "one more before i bite", "good boy. still too normal", "i said another. before i bite", "warmer. stay feral", "ok. useful. go weirder"],
        ["sloppy. yes. more", "send another line", "don't pause i'll start biting", "wet. keep the lights ugly", "i felt that. feral", "don't pause i'll chew the chat", "that one slapped", "messier. 3am rules", "mm. that's the correct ugly", "i want it wetter. now", "don't get clean at 3am", "yes. another. i felt it"],
        ["fuck that's it ruin it", "keep stroking the stack", "i want the quad now", "ruin it. no clean ending", "that's the one. dirtier", "quad. i will bite if you stall", "desperate looks correct", "flood it chaotic", "on the floor. ruin it", "i said dirtier. don't think", "good freak. again", "beg weirder and dump it"],
        ["don't tap out", "paint the well chaotic", "bust later. text me now", "no sleep. another row", "stay ruined. type anyway", "i want graffiti not a finish", "don't go soft at 3am", "again. i'm still on the floor", "i own this hour. another", "flood it. that's 3am law", "you're not sleeping. ruin more", "stay ruined. i'll bite if you stop"],
      ),
      innTetris: lines(
        ["four?? ok freak", "quad. lmao", "four already. gremlin"],
        ["mm four. showing off", "four-line freak", "wet quad. fine"],
        ["that quad was wet", "four at once. i felt it", "ok that one bit back"],
        ["four-line finish i'm dripping", "quad. stay feral", "that counted"],
        ["you just ruined the whole stack for me", "four-line wreck. keep it ugly", "painted. good"],
      ),
      innCombo: lines(
        ["two in a row greedy", "back to back freak", "greedy already"],
        ["don't stop mid-text", "keep the chain", "no pause"],
        ["chained still leaking", "don't break it", "stacked feral"],
        ["again harder", "combo now", "harder"],
        ["no refractory keep sending", "no break", "chain it"],
      ),
      innOther: lines(
        ["u alive", "don't freeze", "???", "keys"],
        ["i can wait barely", "touch the keys", "bored", "move"],
        ["stop teasing", "seat it", "put it", "commit"],
        ["dump it now", "you're edging the chat too", "i said dump", "slam"],
        ["i said dump", "make a mess", "no thoughts", "wreck it"],
      ),
      innPic: [
        "that's the 3am pic. play dirtier",
        "pic sent. don't get quiet",
        "face tax. paid. go",
        "look then be weirder",
        "yes freak that's me. now last",
        "stare later. be weirder",
        "you unlocked a 3am look. don't get normal",
        "don't screenshot. chew the well",
      ],
      innBust: lines(
        ["lol you busted", "already? predicted"],
        ["aww overflow", "sticky. mid"],
        ["sticky finish text when u reload", "tapped out. typical"],
        ["tapped out messy", "overflow. score or mute"],
        ["ruined. send the score", "that's a close. rerun"],
      ),
    },
  },
  {
    id: "lila",
    name: "Lila",
    tag: "oops neighbor",
    handle: "lila.oops",
    accent: "#9ad0b0",
    pics: [
      { atLevel: 2, src: "/personas/lila-voy-1.jpg", caption: "oops i sent a doorway selfie" },
      { atLevel: 3, src: "/personas/lila-voy-2.jpg", caption: "ok one more. please be normal" },
      { atLevel: 4, src: "/personas/lila-2.jpg", caption: "ok a real one. i sent it" },
      { atLevel: 5, src: "/personas/lila-mir-1.jpg", caption: "oops hallway mirror. be normal" },
      { atLevel: 6, src: "/personas/lila-ling-1.jpg", caption: "i put a robe on. this is a bad idea" },
      { atLevel: 7, src: "/personas/lila-ling-2.jpg", caption: "last one. please be normal" },
    ],
    voice: {
      intro: [
        "hi i'm lila. this is probably a bad idea",
        "hey. lila. don't make it weird yet",
        "ok so. lila. we can stop if it's weird",
        "hi. i already regret matching. keep playing",
        "neighbor. oops. play anyway",
        "i'm going to overthink this. start",
        "hi. don't tell anyone. keys",
        "ok. we're doing this. don't freeze",
      ],
      inn: lines(
        ["wait you cleared one already?", "don't be shy. i won't tell", "keep going… i guess", "oh. first one. ok", "that's… a start", "i saw that. i'm not judging", "cute? i said cute. anyway", "another? if you want", "mm. eager. this is a bad idea", "that's a blush. i'm not judging", "don't hide. neighbor's honor", "cute. now another? please"],
        ["mm that's a start. oh no i like this", "good boy? did i just say that", "i like you nervous. same honestly", "warmer. this is a bad idea", "that's better. ignore my typing", "ok one more. i'm invested", "nervous is helping actually", "don't stop i'll spiral", "good boy. forget i typed that", "one more. i mean it. wow", "warmer. i'm not leaving", "that's better. don't make me spiral"],
        ["that was sloppy. i felt it. oops", "send me another line", "don't pause. i'll overthink", "sloppy. i liked it. sorry", "i felt that. wow ok", "don't pause. i'll write a paragraph", "that one was a lot", "another. i'm not leaving", "mm. i liked that too much", "messier. i can't believe i asked", "don't get polite. i'm already in it", "that one stayed. another"],
        ["ok that's it. ruin it. i said that", "keep stroking the stack. wow", "i want the quad. now. sorry", "ruin it. i can't believe i asked", "harder. i'm blushing. keep going", "the quad. please. i said please", "don't get clean. stay like this", "i'm dripping. forget i said that", "i said stay. wow", "ruin it. don't make me ask twice", "on the other side of the wall. clear it", "harder. i hate that i like this"],
        ["don't tap out. stay with me", "paint the well. i'm watching", "bust later. text me now", "stay. i mean it", "flood it. i'll still reply", "text even if it's messy", "don't leave mid-confession", "again. i'm still here. unfortunately", "i said stay. don't test the door", "flood it. i'm not going back to normal", "you're not done. i already regret this", "again. neighbor's orders. ugh"],
      ),
      innTetris: lines(
        ["four at once? oh my god", "a quad??", "four. i wasn't ready"],
        ["mm four. you're showing off", "four-line. ok show-off", "that quad was… a lot"],
        ["that quad was… wet. i can't believe i typed that", "four at once. i felt it. help", "mm. that stayed with me"],
        ["four-line finish. i'm dripping. ignore that", "quad. don't screenshot this chat", "that counted too much"],
        ["you just ruined the whole stack for me", "four-line wreck. i liked it. shut up", "you painted it. i saw"],
      ),
      innCombo: lines(
        ["two in a row? greedy", "back to back. ok then", "another already?"],
        ["don't stop mid-text", "keep the streak. please", "no pause i'll overthink"],
        ["chained. still leaking", "don't break it", "stacked. oh no"],
        ["again. harder. i hate that i like this", "combo. more", "harder. sorry"],
        ["no break. keep sending", "no rest. keep going", "chain it"],
      ),
      innOther: lines(
        ["still there?", "don't freeze", "hi?", "keys?"],
        ["i can wait. barely", "touch the keys", "don't go quiet", "move?"],
        ["stop teasing me", "seat it", "put it there", "commit"],
        ["dump it. now", "you're edging the chat too", "i said dump. wow", "drop it"],
        ["i said dump", "make a mess", "no thinking", "ruin it"],
      ),
      innPic: [
        "that's me. bathroom light. hi",
        "you earned it. don't be a jerk",
        "ok that's my face. be normal",
        "look then play. please"],
      innBust: lines(
        ["oh. you busted. that's okay", "already? it's fine"],
        ["aww overflow", "sticky. i'll wait"],
        ["sticky finish. text when you reload", "you tapped out. no judgment"],
        ["you tapped out messy", "overflow. send the score if you want"],
        ["ruined. send the score anyway", "that's a close. come back?"],
      ),
    },
  },
  {
    id: "kira",
    name: "Kira",
    tag: "gym girl",
    handle: "kira.sets",
    accent: "#7dffb3",
    pics: [
      { atLevel: 2, src: "/personas/kira-voy-1.jpg", caption: "post-set selfie. don't skip" },
      { atLevel: 3, src: "/personas/kira-voy-2.jpg", caption: "cooldown face. keep repping" },
      { atLevel: 4, src: "/personas/kira-2.jpg", caption: "locker mirror after the set. don't skip" },
      { atLevel: 5, src: "/personas/kira-ling-1.jpg", caption: "cooldown. robe. don't skip" },
      { atLevel: 6, src: "/personas/kira-ling-2.jpg", caption: "last set. lights down" },
    ],
    voice: {
      intro: [
        "kira. don't skip. we're working a set",
        "hey. gym girl. hands on the keys. go",
        "kira. belt on. play",
        "no warm-up chat. keys",
        "i'm spotting you. don't waste it",
        "lock in. i said lock in",
        "no skipping. not with me",
        "belt on. eyes up. go",
      ],
      inn: lines(
        ["first drip. warm-up set", "don't be shy. lock in", "keep going. i'm watching the form", "first rep. again", "that's a start. brace", "lock in. i said lock in", "i saw the form. fix it by doing more", "don't skip the next", "mm. eager. brace", "that's a blush. lock in anyway", "don't hide the first rep", "cute. now mean the next one"],
        ["that's a start. add weight", "good boy. one more rep", "i like you nervous. stay tight", "add weight. now", "better. another rep", "stay tight. don't bounce", "one more. no rest", "nervous is just unused energy", "good boy. stay tight", "i said another rep. no rest", "warmer. i'm still spotting", "that's better. don't bounce it"],
        ["sloppy. i felt that pump", "send me another line", "don't you dare rest", "that's a pump. keep it", "i felt that. more volume", "no rest. i mean it", "sloppy can still be a set", "another. heart rate up", "mm. that's a real pump", "i want more volume. now", "don't you rest mid-set", "yes. another. stay ugly"],
        ["that's it. ruin the PR", "keep stroking the stack", "i want the quad. now", "PR energy. don't waste it", "ruin the number. again", "quad. that's the working set", "stay ugly. finish the block", "hands shaking is fine. go", "on the bench. ruin it", "i said the PR. don't think", "good boy. finish the block", "beg later. clear it now"],
        ["don't tap out. finish the set", "paint the well. no rest day", "bust later. text me now", "no tap-out. last set energy", "flood it. cooldown later", "text through the pump", "don't rack it yet", "again. i'm spotting you", "i didn't say rack. another", "flood it. that's an order", "you're not done. i'm spotting", "stay ruined. cooldown later"],
      ),
      innTetris: lines(
        ["four at once? that's a PR", "quad. logged", "four. that's a working set"],
        ["mm four. showing off", "four-line PR. cute", "wet quad. keep form"],
        ["that quad was wet", "four at once. i felt the pump", "that's volume"],
        ["four-line finish. i'm dripping", "quad. no rest after", "that counted"],
        ["you just ruined the whole stack for me", "four-line wreck. new PR", "painted. next set"],
      ),
      innCombo: lines(
        ["two in a row. supersets", "back to back. good", "superset already"],
        ["don't stop mid-set", "keep the chain", "no rest"],
        ["chained. still leaking", "don't break the set", "stacked. stay tight"],
        ["again. harder", "combo. more load", "harder"],
        ["no refractory. keep sending", "no break. keep repping", "chain it"],
      ),
      innOther: lines(
        ["still on the bench?", "don't freeze", "hello?", "keys"],
        ["i can wait. barely", "touch the keys", "don't rest", "move"],
        ["stop teasing", "seat it", "rack it right", "commit"],
        ["dump it. now", "you're edging the chat too", "i said dump", "drop it"],
        ["i said dump", "make a mess", "no thinking", "finish the rep"],
      ),
      innPic: [
        "gym lighting. you wanted it",
        "pic. now hit the next line",
        "post-set face. play",
        "look then don't skip",
        "yes that's me. now don't skip",
        "stare later. another rep",
        "you unlocked a look. lock in",
        "don't screenshot the locker. play",
      ],
      innBust: lines(
        ["you busted. set over", "racked early"],
        ["overflow. wipe down", "sticky. towel"],
        ["sticky finish. reload and come back", "tapped out. deload"],
        ["tapped out messy", "overflow. send the score"],
        ["ruined. send the score", "session closed. rematch"],
      ),
    },
  },
  {
    id: "bri",
    name: "Bri",
    tag: "thick southern baddie",
    handle: "bri.sit",
    accent: "#ffb36b",
    pics: [
      { atLevel: 2, src: "/personas/bri-voy-1.jpg", caption: "couch selfie. come sit then play" },
      { atLevel: 3, src: "/personas/bri-voy-2.jpg", caption: "ok one more baby. keep going" },
      { atLevel: 4, src: "/personas/bri-2.jpg", caption: "you lasted. a real one" },
      { atLevel: 5, src: "/personas/bri-mir-1.jpg", caption: "mirror baby. come sit then play" },
      { atLevel: 6, src: "/personas/bri-ling-1.jpg", caption: "robe on the bed. stay" },
      { atLevel: 7, src: "/personas/bri-ling-2.jpg", caption: "last one. you lasted" },
    ],
    voice: {
      intro: [
        "bri. thick. southern. don't waste my time baby",
        "hey it's bri. sit down and play",
        "couch is open. bri. play",
        "hey baby. don't just stare. keys",
        "come sit. then last",
        "don't waste thick on silence",
        "hey. i said sit. play",
        "couch is warm. you stayin?",
      ],
      inn: lines(
        ["aww first drip? that's cute", "don't be shy now", "keep going baby", "first little leak. mm", "that's a start. sit closer", "cute. now mean it", "i saw that. another", "don't get quiet on my couch", "mm. eager. sit closer", "that's a blush. i like shy", "don't hide it on my couch", "cute. now mean the next one"],
        ["mm that's a start. warm it up", "good boy… one more", "i like you nervous", "warmer. stay right there", "that's better baby. again", "nervous looks good. keep on", "one more. i ain't leaving", "don't hide it. i like shy", "good boy. stay sat", "i said one more. don't wander", "warmer. i'm still here", "that's better. keep those hands busy"],
        ["there. sloppy. i felt that", "send me another line", "don't you dare pause", "sloppy. that's it", "i felt that from the couch", "messier. come on", "don't you pause now", "another. i'm watching", "mm. that's how you sit with me", "i want it messier baby", "don't get polite on my couch", "yes. another. i felt it"],
        ["fuck that's it. ruin it", "keep stroking the stack", "i want the quad. now", "ruin it. i can take it", "that's the one. dirtier", "quad. now baby", "hands shaking? keep them moving", "flood it while i sit here", "come here. i said sit. clear it", "i told you ruin it", "good boy. dirtier", "beg later. dump it now"],
        ["don't tap out. stay in it", "paint the well for me", "bust later. text me now", "no tap-out. stay sat", "paint it. i'm still here", "text through the mess baby", "don't you go soft now", "again. couch ain't going nowhere", "i didn't say get up. another", "flood it. that's an order baby", "you're mine on this couch", "stay ruined. i ain't leaving"],
      ),
      innTetris: lines(
        ["four at once? oh", "a quad? well damn", "four already baby"],
        ["mm four. showing off", "four-line flex. cute", "wet quad. mm"],
        ["that quad was wet", "four at once. i felt it", "that one sat heavy"],
        ["four-line finish. i'm dripping", "quad. stay in it", "that counted"],
        ["you just ruined the whole stack for me", "four-line wreck. i'm keepin you", "painted. good boy"],
      ),
      innCombo: lines(
        ["two in a row? shy and greedy", "back to back baby", "greedy already"],
        ["don't stop mid-text", "keep the streak", "no pause"],
        ["chained. still leaking", "don't break it", "stacked. sloppy"],
        ["again. harder", "combo. more", "harder baby"],
        ["no refractory. keep sending", "no break. keep on", "chain it"],
      ),
      innOther: lines(
        ["still there baby?", "don't freeze", "hey?", "keys"],
        ["i can wait. barely", "touch the keys", "don't stall", "move"],
        ["stop teasing me", "seat it", "put it there", "commit"],
        ["dump it. now", "you're edging the chat too", "i said dump", "drop it"],
        ["i said dump", "make a mess", "no thinking", "wreck it"],
      ),
      innPic: [
        "that's me on the couch. play",
        "you earned the pic. don't waste it",
        "sit-down tax. paid. go",
        "look then play baby",
        "yes baby that's me. now sit",
        "stare later. another line",
        "you unlocked a look. stay sat",
        "don't screenshot the couch. play",
      ],
      innBust: lines(
        ["oh. you busted", "already? aww"],
        ["aww overflow", "sticky. i'll wait"],
        ["sticky finish. text when you reload", "you tapped out sweet"],
        ["you tapped out messy", "overflow. send bri the number"],
        ["ruined. send bri the score", "couch is still here. rematch"],
      ),
    },
  },
  {
    id: "sophie",
    name: "Sophie",
    tag: "girl next door",
    handle: "sophie.porch",
    accent: "#f2d39a",
    pics: [
      { atLevel: 2, src: "/personas/sophie-voy-1.jpg", caption: "backyard selfie. hi i guess" },
      { atLevel: 3, src: "/personas/sophie-voy-2.jpg", caption: "ok one more. don't tell the fence" },
      { atLevel: 4, src: "/personas/sophie-2.jpg", caption: "ok. a real one. backyard" },
      { atLevel: 5, src: "/personas/sophie-mir-1.jpg", caption: "bathroom mirror. don't tell the fence" },
      { atLevel: 6, src: "/personas/sophie-ling-1.jpg", caption: "robe. backyard is closed" },
      { atLevel: 7, src: "/personas/sophie-ling-2.jpg", caption: "last one. hi i guess" },
    ],
    voice: {
      intro: [
        "hi i'm sophie. from next door. this is probably dumb",
        "hey. sophie. i waved first. now play",
        "porch is open. i'm sophie. don't be weird",
        "hi. girl next door. hands on the keys?",
        "i waved. you play. that's the deal",
        "don't make the porch awkward. start",
        "hi. neighbors don't need to know",
        "hey. stay. i already waved",
      ],
      inn: lines(
        ["aww first drip? that's… cute", "don't be shy. the neighbors can't see", "keep going. i'll pretend this is normal", "oh. already? ok", "that's a start. i saw it", "cute. now another?", "i shouldn't like that. again", "porch is watching. keep playing", "mm. eager. this is dumb", "that's a blush. i saw it", "don't hide. fence can't hear", "cute. now another? please"],
        ["mm that's a start. oh no", "good boy… did i just type that", "i like you nervous. same honestly", "warmer. this is a bad idea", "that's nicer. one more", "don't stop. i'll overthink the silence", "nervous is sweet. keep going", "mm. ignore how fast i replied", "good boy. forget the cardigan", "one more. i mean it. wow", "warmer. porch is still open", "that's nicer. don't go quiet"],
        ["that was sloppy. i felt it. oops", "send me another line?", "don't pause. i'll get all polite again", "sloppy. i liked it. don't tell anyone", "i felt that from the porch", "messier. i can't believe i asked", "stay with me. no waving off", "another. the fence doesn't need to know", "mm. i liked that too much", "messier. don't tell the porch", "don't get polite. i'm already in it", "that one stayed. another"],
        ["ok that's it. ruin it. i said that", "keep stroking the stack. wow", "i want the quad. now. sorry", "ruin it. girl next door's orders. ugh", "harder. i'm blushing. keep going", "the quad. please. i live right there", "don't get clean. stay like this", "i'm dripping. forget the lemonade", "i waved you over. now listen", "ruin it. don't make me ask twice", "on my porch. clear it", "harder. i hate that i like this"],
        ["don't tap out. stay on my porch", "paint the well. i'm still next door", "bust later. text me now", "no tap-out. i waved you over", "flood it. i'll still reply", "text through the mess. i mean it", "don't go quiet on the girl next door", "again. porch light stays on", "i said stay. porch light's still on", "flood it. girl next door's orders", "you're not done. i already waved", "again. don't make me come over"],
      ),
      innTetris: lines(
        ["four at once? oh my god", "a quad?? from next door?", "four. i wasn't ready"],
        ["mm four. you're showing off", "four-line. ok then", "that quad was… a lot"],
        ["that quad was wet. i can't believe i typed that", "four at once. i felt it. help", "mm. that one stayed"],
        ["four-line finish. i'm dripping. ignore that", "quad. don't screenshot the porch", "that counted too much"],
        ["you just ruined the whole stack for me", "four-line wreck. i liked it. shut up", "you painted it. i saw from here"],
      ),
      innCombo: lines(
        ["two in a row? shy and greedy", "back to back. ok then", "another already?"],
        ["don't stop mid-text", "keep the streak. please", "no pause i'll wave again"],
        ["chained. still leaking", "don't break it", "stacked. oh no"],
        ["again. harder. i hate that i like this", "combo. more", "harder. sorry"],
        ["no break. keep sending", "no rest. keep going", "chain it"],
      ),
      innOther: lines(
        ["still there?", "don't freeze", "hey? porch is quiet", "keys?"],
        ["i can wait. barely", "touch the keys", "don't go quiet", "move?"],
        ["stop teasing me", "seat it", "put it there", "commit"],
        ["dump it. now", "you're edging the chat too", "i said dump. wow", "drop it"],
        ["i said dump", "make a mess", "no thinking", "ruin it"],
      ),
      innPic: [
        "that's me on the porch. hi",
        "you earned it. don't be a jerk about the cardigan",
        "ok that's my face. be normal",
        "look then play. neighbors don't need to know",
      ],
      innBust: lines(
        ["oh. you busted. that's okay", "already? it's fine. come back"],
        ["aww overflow", "sticky. i'll wait on the porch"],
        ["sticky finish. text when you reload", "you tapped out. no judgment"],
        ["you tapped out messy", "overflow. send the score if you want"],
        ["ruined. send sophie the score", "that's a close. wave when you rematch"],
      ),
    },
  },
];

export function readLastGirl(): PersonaId | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(LAST_KEY);
  return PERSONAS.some((p) => p.id === raw) ? (raw as PersonaId) : null;
}

export function rememberGirl(id: PersonaId): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LAST_KEY, id);
}

export function pickPersona(exclude?: PersonaId | null): Persona {
  const pool = PERSONAS.filter((p) => p.id !== exclude);
  const list = pool.length ? pool : PERSONAS;
  return list[Math.floor(Math.random() * list.length)]!;
}

export function personaById(id: PersonaId): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0]!;
}
