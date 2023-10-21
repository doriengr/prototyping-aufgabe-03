import { Deck } from './components/Deck.js';
import { isSet } from "./components/isSet.js";

let deck = new Deck();
let selectedCards = [];

init();

function eventListener(htmlCards) {
    htmlCards.forEach((htmlCard, index) => {
        htmlCard.addEventListener('click', () =>  handleSelectedCards(htmlCard, index));
    })
}

function handleSelectedCards(htmlCard, index) {
    if (selectedCards.length >= 3) return;

    selectedCards.includes(index)
        ? deleteIndex(index, htmlCard)
        : addIndex(index, htmlCard);

    if (selectedCards.length === 3) {
        if (checkIfSet()) {
            const newCards = deck.redrawRevealedCards();
            // eventListener(newCards);
            selectedCards = [];
        } else {
            // TODO Statement for lost
        }
    }
}

function checkIfSet() {
    const matchingCards = [
        deck.revealedCards[selectedCards[0]],
        deck.revealedCards[selectedCards[1]],
        deck.revealedCards[selectedCards[2]],
    ];

    if (isSet(matchingCards[0], matchingCards[1], matchingCards[2])) {
        deck.htmlCards.forEach((htmlCard, index) => {
            if (selectedCards.includes(index)) {
                htmlCard.remove();
            }
        })
        deck.htmlCards = document.querySelectorAll('.card');
        deleteSetFromRevealedCards();

        return true;
    }
    return false;
}

function deleteSetFromRevealedCards() {
    selectedCards.forEach(selectedCard => {
        delete deck.revealedCards[selectedCard];
    })
    deck.revealedCards = Array(deck.revealedCards.length - 1)
        .fill(null)
        .map((_, i) => { return deck.revealedCards[i + 1] })
        .filter(Boolean);
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

function init() {
    deck.init();
    eventListener(Array.from(deck.htmlCards));
}