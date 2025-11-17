const vocabList = [
    { word: "lucid", definition: "expressed clearly; easy to understand." },
    { word: "ephemeral", definition: "lasting for a very short time." },
    { word: "cogent", definition: "clear, logical, and convincing." }
]; // TODO

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