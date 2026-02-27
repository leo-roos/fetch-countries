var flagsDone = [];
var data;
var funFactData;
var cur = -1;

var flag;
var template;
var myGuess;
var nextFlagBtn;
var info;

let canNextFlag;
let input = "";
const invalidKeys = [
    "Dead",
    "Alt",
    "AltGraph",
    "Control",
    "Shift",
    "Meta",      // Windows / Command key
    "CapsLock",
    "Tab", "Enter", "Backspace",
    "Escape",
    "Delete", "Insert",
    "Home", "End", "PageUp", "PageDown",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"
];


document.addEventListener("DOMContentLoaded", function() {
    flag = document.getElementById("flag");
    template = document.getElementById("flag-template");
    myGuess = document.getElementById("my-guess");
    nextFlagBtn = document.getElementById("next-flag");
    info = document.getElementById("info");

    nextFlagBtn.disabled = true;

    function checkRightAnswer(guess) {
        if (guess.toLowerCase() == data[cur].name.common.toLowerCase() || guess.toLowerCase() == data[cur].name.official.toLowerCase()) {
            return true;
        }

        return false;
    }


    myGuess.addEventListener("input", function(event) {
        if (canNextFlag) {
            event.preventDefault();
            return;
        }

        input = event.target.value;

        console.log(myGuess.value)
        if (checkRightAnswer(myGuess.value)) {
            myGuess.disabled = true;
            canNextFlag = true;
            nextFlagBtn.disabled = false;
            showFunFact();
        }
    })
    
    document.body.addEventListener("keydown", function(event) {
        if (event.key == "Enter") {
            if (canNextFlag) {
                nextFlag();
                return;
            }
        }

        if (canNextFlag) {
            return;
        }

        if (event.target == myGuess) {
            return;
        }
        else if (event.key === " ") {
            event.preventDefault();
        }

        if (event.key == "Backspace") {
            input = input.slice(0, -1);
        }
        else if (!invalidKeys.includes(event.key)) {
            input += event.key;
        }

        myGuess.value = input;

        if (checkRightAnswer(input)) {
            myGuess.disabled = true;
            canNextFlag = true;
            nextFlagBtn.disabled = false;
            showFunFact();
        }
    })

    nextFlagBtn.addEventListener("click", function() {
        if (canNextFlag) {
            nextFlag();
        }
    })

    fetchData();
})

async function fetchData() {
    let res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags")
    data = await res.json();
    nextFlag();
}

function getNextFlag() {
    // return 143;
    const randomNr = Math.floor(Math.random() * data.length);    
    if (flagsDone.includes(randomNr)) {
        return getNextFlag();
    }
    return randomNr;
}

async function nextFlag() {
    canNextFlag = false;
    nextFlagBtn.disabled = true;
    hideFunFact();

    const nextFlagNr = getNextFlag();
    cur = nextFlagNr;
    flagsDone.push(nextFlagNr);
    const obj = data[nextFlagNr];

    console.log(obj.name.common);
    
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector("img");
    img.src = obj.flags.png;

    flag.innerHTML = "";
    flag.appendChild(clone);

    input = "";
    myGuess.disabled = false;
    myGuess.value = "";

    
    const res = await fetch(`https://restcountries.com/v3.1/name/${data[cur].name.common}`);
    let countryData = await res.json();
    funFactData = countryData[0];

    // showFunFact();
}

function hideFunFact() {
    info.classList.remove("show");

}

async function showFunFact() {
    addXP(10);


    const countryName = document.getElementById("country-name");
    const countryName2 = document.getElementById("country-name-2");
    countryName.textContent = funFactData.name.common;
    countryName2.textContent = `${funFactData.name.common} (${funFactData.name.official})`;

    funFactData.tld = funFactData.tld || []
    const topLevelDomain = document.getElementById("top-level-domain");
    topLevelDomain.innerHTML = "";
    for (let index = 0; index < funFactData.tld.length; index++) {
        const tld = funFactData.tld[index];
        const p = document.createElement("p");
        p.textContent = tld;

        topLevelDomain.append(p);
    }
    

    funFactData.currencies = funFactData.currencies || {}
    const currencies = document.getElementById("currencies");
    currencies.innerHTML = "";
    for (const key in funFactData.currencies) {
        if (!Object.hasOwn(funFactData.currencies, key)) continue;
        const currency = funFactData.currencies[key];
        
        const p = document.createElement("p");
        p.textContent = `${currency.name} `;
        
        const span = document.createElement("span");
        span.textContent = `(${currency.symbol})`;

        p.append(span);
        currencies.append(p);
    }


    funFactData.idd = funFactData.idd || {}
    funFactData.idd.suffixes = funFactData.idd.suffixes || []
    const telephoneSuffix = document.getElementById("telephone-suffix");
    telephoneSuffix.innerHTML = "";
    for (let index = 0; index < funFactData.idd.suffixes.length; index++) {
        const value = funFactData.idd.suffixes[index];
        const p = document.createElement("p");
        p.textContent = `${funFactData.idd.root}${value}`;

        telephoneSuffix.append(p);
    }

    
    funFactData.capital = funFactData.capital || []
    const capital = document.getElementById("capital");
    capital.innerHTML = "";
    for (let index = 0; index < funFactData.capital.length; index++) {
        const value = funFactData.capital[index];
        const p = document.createElement("p");
        p.textContent = value;

        capital.append(p);
    }

    const region = document.getElementById("region");
    region.textContent = `${funFactData.region} (${funFactData.subregion})`;


    funFactData.languages = funFactData.languages || {}
    const languages = document.getElementById("languages");
    languages.innerHTML = "";
     for (const key in funFactData.languages) {
        if (!Object.hasOwn(funFactData.languages, key)) continue;
        const value = funFactData.languages[key];
        
        const p = document.createElement("p");
        p.textContent = `${value}`;

        languages.append(p);
    }

    const population = document.getElementById("population");
    population.textContent = Intl.NumberFormat("sv-SE").format(funFactData.population);
    

    const coatOfArmsFlag = document.getElementById("coat-of-arms-flag");
    coatOfArmsFlag.src = funFactData.coatOfArms.png;

    info.classList.add("show");
}