let points, xp, level, streak;

var pointsSpan;
var levelSpan;
var xpSpan, xpNextSpan;
// var streakSpan;

const levels = {}
for (let index = 1; index < 100; index++) {
    const value = (50 * index);
    levels[index] = value;
}

function addPoints(value) {
    points += value;
}
function addXP(value) {
    value = Number.parseInt(value);

    xp += value;
    if (xp > levels[level]) {
        let leftOverXP = xp - levels[level + 1];
        while (leftOverXP > 0) {
            level += 1;
            xp = leftOverXP;
            leftOverXP -= levels[level];
        }
    }
    addPoints(value / 2);
    // if (rightAnswer == true) {
    //     streak += 1;
    // }

    updateValues();
}

function updateValues() {
    pointsSpan.textContent = points;
    levelSpan.textContent = level;
    
    xpSpan.textContent = xp;
    xpNextSpan.textContent = levels[level + 1];

    // streakSpan.textContent = streak;

    saveValues();
}

function saveValues() {
    localStorage.setItem("points", points)
    localStorage.setItem("level", level)
    localStorage.setItem("xp", xp)
    // localStorage.setItem("streak", streak)
}

function refreshValues() {
    const loadValues = [
        // "points", "xp", "level", "streak"
        "points", "xp", "level"
    ]
    const loadedValues = {}

    for (let index = 0; index < loadValues.length; index++) {
        const valueToLoad = loadValues[index];
        let value = localStorage.getItem(valueToLoad) || "0";
        if (value) {
            value = Number.parseInt(value);
        }
        if (valueToLoad == "level" && value == 0) {
            value = 1;
        }
        loadedValues[valueToLoad] = value;
    }

    points = loadedValues["points"];
    xp = loadedValues["xp"];
    level = loadedValues["level"];
    // streak = loadedValues["streak"];

    updateValues();
    addXP(1700, rightAnswer = true);
}

document.addEventListener("DOMContentLoaded", function() {
    pointsSpan = document.getElementById("points-value");
    levelSpan = document.getElementById("level-value");
    xpSpan = document.getElementById("xp-value");
    xpNextSpan = document.getElementById("xp-next-value");
    // streakSpan = document.getElementById("streak-value");

    refreshValues();
})


localStorage.clear();