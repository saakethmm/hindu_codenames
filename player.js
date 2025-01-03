import { hinduWords } from './hinduwords.js';

// Seeded random number generator
function seededRandom(seed) {
    let m = 0x80000000; // 2**31
    let a = 1103515245;
    let c = 12345;
    seed = (seed * a + c) % m;
    return seed / (m - 1);
}

// Seeded shuffle function
function shuffle(array, seed) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
        // Generate a new seeded random index
        randomIndex = Math.floor(seededRandom(seed) * currentIndex);
        currentIndex--;

        // Swap with the current element
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

        // Update the seed for the next iteration
        seed++;
    }
    return array;
}

const seed = 3; // Shared seed for consistency

const boardWords = shuffle(hinduWords.slice(), seed).slice(0, 25); // Shuffle words
const colors = shuffle(Array(9).fill('rgba(255, 0, 0, 0.7)')
    .concat(Array(8).fill('rgba(0, 0, 255, 0.7)'))
    .concat(Array(7).fill('rgba(128, 128, 128, 0.7)'))
    .concat(['black']), seed); // Shuffle colors

// Initialize scores
let scores = {
    'rgba(255, 0, 0, 0.7)': 0, // Red
    'rgba(0, 0, 255, 0.7)': 0, // Blue
    'rgba(128, 128, 128, 0.7)': 0, // Neutral
    'black': 0 // Bomb
};

// Populate the board
const boardElement = document.getElementById('board');
boardWords.forEach((word, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = word;

    // Add click event to reveal color
    card.addEventListener('click', () => {
        if (!card.classList.contains('revealed')) { // Avoid re-clicking
            const color = colors[index];
            card.style.backgroundColor = color;
            card.classList.add('revealed');

            // Update score
            if (color !== 'rgba(128, 128, 128, 0.7)') { // Ignore neutral color
                scores[color]++;
                updateScoreboard();
            }

            // If the bomb (dark tile) is clicked, add special handling
            if (color === 'black') {
                card.style.color = 'white'; // Make text visible on dark background
                alert("Bomb tile! Game over.");
            }
        }
    });

    boardElement.appendChild(card);
});

function updateScoreboard() {
    const redScore = scores['rgba(255, 0, 0, 0.7)'];
    const blueScore = scores['rgba(0, 0, 255, 0.7)'];
    document.getElementById('score').innerText = `${redScore}-${blueScore}`;
}