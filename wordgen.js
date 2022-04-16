const form = document.querySelector('form');
const lengthMax = document.getElementById('length-max');
const lenghtMin = document.getElementById('length-min');
const numberOfItems = document.getElementById('number-of-items');
const resultList = document.getElementById('result-list'); // <ul></ul>
const maxConsonantsInRow = document.getElementById('consonants-in-row');
const maxVowelsInRow = document.getElementById('vowels-in-row');

form.addEventListener('submit', event => {
    event.preventDefault();
    resultList.innerHTML = '';
    console.log(length);
    const wordList = getArrayWithRandomWords(
        numberOfItems.value, lenghtMin.value, lengthMax.value,
        maxConsonantsInRow.value, maxVowelsInRow.value
    );
    for (let i = 0; i < wordList.length; i++) {
        resultList.insertAdjacentHTML('afterbegin', `<li>${wordList[i]}</li>`);
    }
});

const consonantsWithWeights = {
    'b': 1.54,
    'c': 2.73,
    'd': 4.14,
    'f': 2.03,
    'g': 1.92,
    'h': 6.11,
    'j': 0.23,
    'k': 0.87,
    'l': 4.24,
    'm': 2.53,
    'n': 6.80,
    'p': 1.66,
    'q': 0.09,
    'r': 5.68,
    's': 6.11,
    't': 9.37,
    'v': 1.06,
    'w': 2.34,
    'x': 0.20,
    'y': 2.04,
    'z': 0.06,
    'th': 3.99,
};

const vowelsWithWeights = {
    'a': 8.34,
    'e': 12.60,
    'i': 6.71,
    'o': 7.70,
    'u': 2.85,
    'y': 2.04,
    'ae': 1.4
};

/**
 * Picks the random item (a letter in our case) based on its weight.
 * The items with higher weight will be picked more often (with a higher probability).
 *
 * @param {any[]} items
 * @param {number[]} weights
 * @returns {{item: any, index: number}}
 */

for (let i = 0; i < 10; i++) {
    console.log(Math.random() * 11);
}


function weightedRandom(items, weights) {
    if (items.length !== weights.length) {
        throw new Error('Items and weights must be of the same size');
    }

    if (!items.length) {
        throw new Error('Items must not be empty');
    }
    const cumulativeWeights = [];
    for (let i = 0; i < weights.length; i += 1) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
    }

    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];

    const randomNumber = maxCumulativeWeight * Math.random();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
            return items[itemIndex];
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addConsonant() {
    const letters = Object.keys(consonantsWithWeights);
    const weights = Object.values(consonantsWithWeights);
    return weightedRandom(letters, weights);
}

function addVowel() {
    const letters = Object.keys(vowelsWithWeights);
    const weights = Object.values(vowelsWithWeights);
    return weightedRandom(letters, weights);
}

function getRandomWord(len = 5, consonantsInWord = 0.5, maxConsonantsInRow = 2, maxVowelsInRow = 2) {
    let wordGen = '';
    let skipConsotant = cons => Math.random() > cons ? true : false;
    let isDigram = letter => letter.length == 2 ? true : false;

    let vowelCounter = 0,
        consonantCounter = 0;

    for (let i = 0; i < len; i++) {
        if (skipConsotant(consonantsInWord)) {
            const vowel = addVowel();
            // skipping a vowel if we already have 2 vowels in row 
            if (vowelCounter >= maxVowelsInRow) {
                i -= 1;
                continue;
            } else {
                if (isDigram(vowel)) {
                    i += 1;
                    vowelCounter += 1;
                }
                wordGen += vowel;
                vowelCounter += 1;
                consonantCounter = 0;
            }
        } else {
            const consonant = addConsonant();
            if (consonantCounter >= 1 && i == 1) {
                i -= 1;
                continue;
            }
            // skipping a consonant if we already have 2 consonants in row 
            if (consonantCounter >= maxConsonantsInRow) {
                i -= 1;
                continue;
            } else {
                // for digram letters like 'sh', 'th' etc.
                if (isDigram(consonant)) {
                    i += 1;
                    consonantCounter += 1;
                }
                wordGen += consonant;
                consonantCounter += 1;
                vowelCounter = 0;
            }
        }
    }
    return wordGen;
}
/**
 * @param  {number} n       number of words to generate
 * @param  {number} min     minimum length of a word
 * @param  {number} max     maximum length of a word
 * @param  {number} maxConsonantsInRow
 * @param  {number} maxVowelsInRow
 */
function getArrayWithRandomWords(n = 10, min = 3, max = 7,
    maxConsonantsInRow = 2, maxVowelsInRow = 2) {
    let words = [];
    for (let i = 0; i < n; i++) {
        words.push(getRandomWord(getRandomInt(min, max), 0.6, maxConsonantsInRow, maxVowelsInRow));
    }
    return words;
}