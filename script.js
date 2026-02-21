var flagsDone = [];
var data;
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

    myGuess.addEventListener("input", function(event) {
        if (canNextFlag) {
            event.preventDefault();
            return;
        }

        input = event.target.value;

        if (myGuess.value.toLowerCase() == data[cur].name.common.toLowerCase()) {
            myGuess.disabled = true;
            canNextFlag = true;
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

        if (input.toLowerCase() == data[cur].name.common.toLowerCase()) {
            myGuess.disabled = true;
            canNextFlag = true;
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
    return 143;
    // const randomNr = Math.floor(Math.random() * data.length);    
    // if (flagsDone.includes(randomNr)) {
    //     return getNextFlag();
    // }
    // return randomNr;
}

function nextFlag() {
    canNextFlag = false;
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

    showFunFact();
}

function hideFunFact() {
    info.classList.remove("show");

}

async function showFunFact() {
    const res = await fetch(`https://restcountries.com/v3.1/name/${data[cur].name.common}`);
    let countryData = await res.json();

    let allData = countryData[0];

    const countryName = document.getElementById("country-name");
    const countryName2 = document.getElementById("country-name-2");
    countryName.textContent = allData.name.common;
    countryName2.textContent = `${allData.name.common} (${allData.name.official})`;

    allData.tld = allData.tld || []
    const topLevelDomain = document.getElementById("top-level-domain");
    topLevelDomain.innerHTML = "";
    for (let index = 0; index < allData.tld.length; index++) {
        const tld = allData.tld[index];
        const p = document.createElement("p");
        p.textContent = tld;

        topLevelDomain.append(p);
    }
    

    allData.currencies = allData.currencies || {}
    const currencies = document.getElementById("currencies");
    currencies.innerHTML = "";
    for (const key in allData.currencies) {
        if (!Object.hasOwn(allData.currencies, key)) continue;
        const currency = allData.currencies[key];
        
        const p = document.createElement("p");
        p.textContent = `${currency.name} `;
        
        const span = document.createElement("span");
        span.textContent = `(${currency.symbol})`;

        p.append(span);
        currencies.append(p);
    }


    allData.idd = allData.idd || {}
    const telephoneSuffix = document.getElementById("telephone-suffix");
    telephoneSuffix.innerHTML = "";
    for (let index = 0; index < allData.idd.suffixes.length; index++) {
        const value = allData.idd.suffixes[index];
        const p = document.createElement("p");
        p.textContent = `${allData.idd.root} ${value}`;

        telephoneSuffix.append(p);
    }

    
    allData.capital = allData.capital || []
    const capital = document.getElementById("capital");
    capital.innerHTML = "";
    for (let index = 0; index < allData.capital.length; index++) {
        const value = allData.capital[index];
        const p = document.createElement("p");
        p.textContent = value;

        capital.append(p);
    }

    const region = document.getElementById("region");
    region.textContent = `${allData.region} (${allData.subregion})`;


    allData.languages = allData.languages || {}
    const languages = document.getElementById("languages");
    languages.innerHTML = "";
     for (const key in allData.languages) {
        if (!Object.hasOwn(allData.languages, key)) continue;
        const value = allData.languages[key];
        
        const p = document.createElement("p");
        p.textContent = `${value}`;

        languages.append(p);
    }

    const population = document.getElementById("population");
    population.textContent = Intl.NumberFormat("sv-SE").format(allData.population);
    

    const coatOfArmsFlag = document.getElementById("coat-of-arms-flag");
    coatOfArmsFlag.src = allData.coatOfArms.png;

    info.classList.add("show");
}