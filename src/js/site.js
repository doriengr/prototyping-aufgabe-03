import { Deck } from './components/Deck.js';
import { isSet } from "./components/isSet.js";

let deck = new Deck();
let selectedCards = [];
let livesWrapper = document.querySelector('.cards__count');
let startButton = document.querySelector('.start__button');
let clock = document.querySelector('.clock');

let count = 3;
const totalTime = 60000;
let gameEnd = true;
let startTime;
let timerId;
let clockSound = new Audio('/assets/clock.wav');

init();

function toggleGamePlay() {
    startButton.addEventListener('click', function() {
        let startScreen = document.querySelector('.start');
        startScreen.classList.remove('start--show');
        clock.classList.add('clock--animate-slow');
        gameEnd = false;

        startTimer();
    })
}

function eventListener(cards) {
    if (! cards) return;

    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (gameEnd) return;

            handleSelectedCards(card);
            new Audio('/assets/key.wav').play();
        });
    })
}

function handleSelectedCards(card) {
    const index = getIndex(card);
    if (index === -1) return;
    if (selectedCards.length >= 3 || gameEnd) return;

    selectedCards.includes(index)
        ? deleteIndex(index, card)
        : addIndex(index, card);

    if (selectedCards.length === 3) {
        if (checkIfSet()) {
            const newCards = deck.redrawCards();
            if (newCards.length === 0) {
                gameWon();
            }
            eventListener(newCards);
            selectedCards = [];
            addCount();
        } else {
            document.querySelector('section').classList.add('section--lost');
            selectedCards = [];
            setTimeout(() => { resetClasses() }, 1000);
            subtractCount();
        }
    }
}

function getIndex(element) {
    const elements = document.querySelectorAll('.card');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i] === element) {
            return i;
        }
    }
    return -1;
}

function checkIfSet() {
    const matchingCards = [
        deck.cards[selectedCards[0]],
        deck.cards[selectedCards[1]],
        deck.cards[selectedCards[2]],
    ];

    if (isSet(matchingCards[0], matchingCards[1], matchingCards[2])) {
        deck.cards.forEach((card, index) => {
            if (selectedCards.includes(index)) {
                card.remove();
            }
        })
        deck.cards = document.querySelectorAll('.card');
        return true;
    }
    return false;
}

function deleteIndex(index, htmlCard) {
    selectedCards = selectedCards.filter(function(item) {
        return item !== index;
    });
    htmlCard.classList.remove('card--isSelected');
}

function addIndex(index, htmlCard) {
    selectedCards.push(index);
    htmlCard.classList.add('card--isSelected');
}

function resetClasses() {
    document.querySelector('section').classList.remove('section--lost');
    deck.cards.forEach(card => {
        card.classList.remove('card--isSelected');
    })
}

function addCount() {
    count++
    new Audio('/assets/successful.wav').play();

    const newLive = document.createElement("img");
    newLive.src = "assets/hearts-red-normal.svg";
    newLive.classList.add('cards__count-item');
    livesWrapper.appendChild(newLive);
}

function subtractCount() {
    count--;

    if (livesWrapper.children.length >= 0) {
        livesWrapper.lastElementChild.remove();
    }

    livesWrapper.children.length === 0
        ? gameOver()
        : new Audio('/assets/wrong.wav').play();
}

function gameOver() {
    stopClock();
    document.querySelector('main').classList.add('main--full-game-lost');
    gameEnd = true;
    const lost = document.querySelector('.lost');
    if (lost) lost.classList.add('lost--show');
    new Audio('/assets/game-over.wav').play();
}

function gameWon() {
    stopClock();
    gameEnd = true;
    const win = document.querySelector('.win');
    document.querySelector('main').classList.add('main--full-game-won');
    if (win) win.classList.add('win--show');
    new Audio('/assets/game-won.mp3').play();
    clearInterval(timerId);
    clock.classList.remove('clock--animate-super-fast', 'clock--animate-fast', 'clock--animate-slow');
}

function startTimer() {
    startTime = Date.now();
    timerId = setInterval(checkTimer, 1000); // Check every second
    clockSound.play();
}

function checkTimer() {
    if (gameEnd) {
        clearInterval(timerId); // Stop the timer
        return; // Exit the function if the game is over
    }

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= totalTime / 2 && elapsedTime < (totalTime / 4) * 3) {
        clock.classList.remove('clock--animate-slow');
        clock.classList.add('clock--animate-fast');
    } else if (elapsedTime >= (totalTime / 4) * 3) {
        clock.classList.remove('clock--animate-fast');
        clock.classList.add('clock--animate-super-fast');
    }

    if (elapsedTime >= totalTime) {
        clock.classList.remove('clock--animate-super-fast');
        clearInterval(timerId); // Stop the timer
        gameOver();
    }
}

function stopClock() {
    clockSound.pause();
    clockSound.currentTime = 0;
}

function init() {
    toggleGamePlay();
    deck.init();
    eventListener(Array.from(deck.cards));
}
