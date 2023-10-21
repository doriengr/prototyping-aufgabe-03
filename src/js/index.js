import { Deck } from './components/Deck.js';
import { isSet } from "./components/isSet.js";

let deck = new Deck();
let selectedCards = [];
let livesWrapper = document.querySelector('.cards__count');

let count = 3;
let gameEnd = false;

init();

function eventListener(cards) {
    if (! cards || gameEnd) return;

    cards.forEach(card => {
        card.addEventListener('click', function() {
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
                gameEnd = true;
                const win = document.querySelector('.win');
                document.querySelector('main').classList.add('main--full-game-won');
                if (win) win.classList.add('win--show');
                new Audio('/assets/game-won.mp3').play();
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

    if (livesWrapper.children.length === 0) {
        document.querySelector('main').classList.add('main--full-game-lost');
        gameEnd = true;
        const lost = document.querySelector('.lost');
        if (lost) lost.classList.add('lost--show');
        new Audio('/assets/game-over.wav').play();
    } else {
        new Audio('/assets/wrong.wav').play();
    }
}


function init() {
    deck.init();
    eventListener(Array.from(deck.cards));
}
