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
            const newCards = deck.redrawCards();
            // eventListener(newCards);
            selectedCards = [];
        } else {
            // TODO Statement for lost
        }
    }
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

function init() {
    deck.init();
    eventListener(Array.from(deck.cards));
}