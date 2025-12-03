const vocabList = [
    { word: "lucid", definition: "expressed clearly; easy to understand." },
    { word: "ephemeral", definition: "lasting for a very short time." },
    { word: "cogent", definition: "clear, logical, and convincing." },
    { word: "sumptuous", definition: "luxurious, rich, or extravagant." },
    { word: "polemic", definition: "a strong verbal or written argument against something." },
    { word: "prodding", definition: "encouraging or urging someone to take action." },
    { word: "beatified", definition: "declared holy or blessed." },
    { word: "pertinent", definition: "relevant or related to the matter at hand." },
    { word: "pernicious", definition: "harmful, causing serious injury or damage." },
    { word: "scrupulous", definition: "very careful and honest; morally precise." },
    { word: "austere", definition: "severe, simple, or strict in style or behavior." },
    { word: "onerous", definition: "burdensome or difficult to endure." },
    { word: "subterfuge", definition: "trickery or deception used to achieve a goal." },
    { word: "credulity", definition: "tendency to believe things too easily." },
    { word: "plodding", definition: "slow, heavy, and steady movement." },
    { word: "zeitgeist", definition: "the spirit or mood of a particular period in history." },
    { word: "busstressed", definition: "likely a typo, needs clarification." },
    { word: "moorings", definition: "ropes or anchors used to secure a boat." },
    { word: "unmoor", definition: "to release a boat from its moorings; figuratively, to detach." },
    { word: "eyeball", definition: "the round part of the eye; or to look at closely." },
    { word: "nonagenarian", definition: "a person aged 90–99." },
    { word: "ponderous", definition: "heavy, slow, or labored in movement or style." },
    { word: "unequivocal", definition: "clear, leaving no doubt." },
    { word: "stooge", definition: "a person who is used or controlled by someone else." },
    { word: "windfall", definition: "an unexpected gain, usually money." },
    { word: "exacting", definition: "requiring great effort, attention, or precision." },
    { word: "credulous", definition: "too ready to believe things; gullible." },
    { word: "salubrious", definition: "healthy or health-giving." },
    { word: "hard-line", definition: "firm and uncompromising in beliefs or policies." },
    { word: "gall", definition: "bold behavior; also bitterness or resentment." },
    { word: "niggard", definition: "an extremely stingy person." },
    { word: "parsimonious", definition: "very unwilling to spend money; frugal to excess." },
    { word: "fowl", definition: "a bird, especially one used for food." },
    { word: "giblets", definition: "edible internal organs of poultry." },
    { word: "appropriate", definition: "to take something for one’s own use, often without permission." },
    { word: "retire", definition: "to stop working; also to withdraw to a quiet place." },
    { word: "banister", definition: "the handrail along a staircase." },
    { word: "retake", definition: "to take again; to redo." },
    { word: "adulterate", definition: "to make something weaker or impure by adding inferior materials." },
    { word: "abreast", definition: "side by side or up to date with something." },
    { word: "rapturous", definition: "showing great joy or enthusiasm." },
    { word: "ignominy", definition: "deep shame or disgrace." },
    { word: "haw", definition: "to hesitate in speech." },
    { word: "hem", definition: "to hesitate or pause in speech." },
    { word: "haver", definition: "to talk foolishly or at length; to dither." },
    { word: "tenacious", definition: "holding firmly to something; persistent." },
    { word: "decorum", definition: "proper and polite behavior." },
    { word: "poise", definition: "graceful and calm self-control." },
    { word: "sire", definition: "to father or produce offspring." },
    { word: "hunker down", definition: "to settle firmly or prepare for a difficult situation." },
    { word: "watershed", definition: "a turning point or important moment." },
    { word: "remnant", definition: "a small remaining piece of something." },
    { word: "drunken", definition: "affected by alcohol." },
    { word: "spurned", definition: "rejected with contempt or disdain." },
    { word: "toil", definition: "hard and continuous work." },
    { word: "groundswell", definition: "a rapid increase in public support." },
    { word: "acquiesce", definition: "to accept something without protest." },
    { word: "eviscerating", definition: "removing internal parts; figuratively, harshly weakening." },
    { word: "sparring", definition: "practice fighting; verbal arguing." },
    { word: "truant", definition: "a student who stays away from school without permission." },
    { word: "bane", definition: "a cause of great distress or annoyance." },
    { word: "connive", definition: "to secretly cooperate or plot wrongdoing." },
    { word: "pewter", definition: "a gray alloy of tin and other metals." },
    { word: "commotion", definition: "noisy disturbance or confusion." },
    { word: "magnanimous", definition: "generous and forgiving, especially toward a rival." },
    { word: "nitpick", definition: "to find small, trivial faults." },
    { word: "lasagna", definition: "a layered pasta dish with sauce and cheese." },
    { word: "urbane", definition: "polished, courteous, and sophisticated in manner." },
    { word: "tractable", definition: "easy to control or manage." },
    { word: "suave", definition: "smooth, charming, and confident." },
    { word: "debonair", definition: "stylish, confident, and charming." },
    { word: "inundated", definition: "overwhelmed or flooded with things to deal with." },
    { word: "iota", definition: "a very small amount." },
    { word: "bust", definition: "to break or smash; also to fail." },
    { word: "callus", definition: "thickened skin caused by repeated friction." },
    { word: "dillydally", definition: "to waste time through indecision or delay." },
    { word: "cutthroat", definition: "mercilessly competitive or ruthless." },
    { word: "peen", definition: "the rounded end of a hammerhead." },
    { word: "preen", definition: "to groom oneself with care; to show self-satisfaction." },
    { word: "dawdle", definition: "to waste time by moving slowly." },
    { word: "sickly", definition: "unhealthy or weak in appearance." },
    { word: "relegated", definition: "assigned to a lower position or status." },
    { word: "gloat", definition: "to show smug satisfaction about one’s success." },
    { word: "chalice", definition: "a large cup or goblet, often used in ceremonies." },
    { word: "gulp", definition: "to swallow quickly or in large amounts." },
    { word: "gobsmacked", definition: "utterly astonished or amazed." },
    { word: "didactic", definition: "intended to teach, often in a moralizing way." },
    { word: "charade", definition: "a false display meant to deceive; also a guessing game." },
    { word: "dibs", definition: "a claim to something before others." },
    { word: "scribble", definition: "to write quickly and carelessly." },
    { word: "unadorned", definition: "plain and without decoration." },
    { word: "sham", definition: "something false that pretends to be real." },
    { word: "scuffle", definition: "a short, confused physical fight." },
    { word: "bastion", definition: "a stronghold or defender of particular principles." },
    { word: "privy", definition: "aware of private or secret information." },
    { word: "inkling", definition: "a slight idea or hint." },
    { word: "loggerhead", definition: "a stubborn person; also a type of turtle." },
    { word: "straitlaced", definition: "very strict in moral or social conduct." },
    { word: "besmirch", definition: "to damage a person's reputation or honor." },
    { word: "luster", definition: "a soft, shiny glow or brightness." },
    { word: "windbag", definition: "a person who talks excessively and tediously." },
    { word: "frivolous", definition: "not serious or sensible; trivial." },
    { word: "fastidious", definition: "very attentive to detail; hard to please." }
];

function getWordOfTheDay() {
    // Deterministic “daily” pick using the date
    const today = new Date().toDateString();
    const index = Math.abs([...today].reduce((a, c) => a + c.charCodeAt(0), 0)) % vocabList.length;
    return vocabList[index];
}

function getRandomWord() {
    const index = Math.floor(Math.random() * vocabList.length);
    return vocabList[index];
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {

    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    // Non-critical background tasks
    ric(() => {
        const wotd = getRandomWord();
        document.getElementById("wotd-word").textContent = wotd.word;
        document.getElementById("wotd-definition").textContent = wotd.definition;
    });
});