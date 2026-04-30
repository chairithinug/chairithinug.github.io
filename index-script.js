const vocabList = [
    { word: "lucid", definition: "expressed clearly; easy to understand." },
    { word: "cogent", definition: "clear, logical, and convincing." },
    { word: "sumptuous", definition: "luxurious, rich, or extravagant." },
    { word: "pertinent", definition: "relevant or related to the matter at hand." },
    { word: "scrupulous", definition: "very careful and honest; morally precise." },
    { word: "magnanimous", definition: "generous and forgiving, especially toward a rival." },
    { word: "tenacious", definition: "holding firmly to something; persistent." },
    { word: "decorum", definition: "proper and polite behavior." },
    { word: "poise", definition: "graceful and calm self-control." },
    { word: "urbane", definition: "polished, courteous, and sophisticated in manner." },
    { word: "tractable", definition: "easy to control or manage." },
    { word: "suave", definition: "smooth, charming, and confident." },
    { word: "debonair", definition: "stylish, confident, and charming." },
    { word: "rapturous", definition: "showing great joy or enthusiasm." },
    { word: "unequivocal", definition: "clear, leaving no doubt." },
    { word: "salubrious", definition: "healthy or health-giving." },
    { word: "beatified", definition: "declared holy or blessed." },
    { word: "gobsmacked", definition: "utterly astonished or amazed." },
    { word: "windfall", definition: "an unexpected gain, usually money." },
    { word: "luster", definition: "a soft, shiny glow or brightness." },
    { word: "fastidious", definition: "very attentive to detail; hard to please." },
    { word: "bastion", definition: "a stronghold or defender of particular principles." },
    { word: "watershed", definition: "a turning point or important moment." },
    { word: "groundswell", definition: "a rapid increase in public support." }
];

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
