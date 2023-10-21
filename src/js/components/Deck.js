import { Card } from "./Card.js";
import { isSet } from "./isSet.js";
export class Deck {
    constructor() {
        this.htmlList = document.querySelector('.cards__list');
        this.cards = document.querySelectorAll('.card');
        this.deck = [];

        this.colors = ['red', 'yellow', 'green', 'blue'];
        this.rotations = ['0', '90', '180', '-90'];
        this.forms = ['heart', 'spades', 'diamonds', 'clubs'];
    }

    init() {
        this.initDeck();
        this.initCards();
        while (! this.hasMatchingSet()) this.initCards();
        this.filterDeck();
        this.printCards();
    }

    initDeck() {
        for (const color of this.colors) {
            for (const rotation of this.rotations) {
                for (const form of this.forms) {
                    this.deck.push(new Card(color, rotation, form));
                }
            }
        }
    }

    initCards() {
        let startIndexes = [];

        this.cards.forEach(card => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.deck.length);
            } while (startIndexes.includes(randomIndex));

            startIndexes.push(randomIndex);

            card.setAttribute('data-color', this.deck[randomIndex].color);
            card.setAttribute('data-form', this.deck[randomIndex].form);
            card.setAttribute('data-rotation', this.deck[randomIndex].rotation);
            card.setAttribute('data-is-set', 'false');
        });
    }

    filterDeck() {
        this.deck = this.deck.filter((newCard) =>
            ! Array.from(this.cards).some((usedCard) =>
                newCard.color === usedCard.getAttribute('color')
                && newCard.rotation === usedCard.getAttribute('rotation')
                && newCard.form === usedCard.getAttribute('from'))
        );
    }

    hasMatchingSet() {
        for (let i = 0; i < this.cards.length - 2; i++) {
            for (let j = i + 1; j < this.cards.length - 1; j++) {
                for (let k = j + 1; k < this.cards.length; k++) {
                    if (isSet(this.cards[i], this.cards[j], this.cards[k])) {
                        this.cards[i].setAttribute('data-is-set', 'true');
                        this.cards[j].setAttribute('data-is-set', 'true');
                        this.cards[k].setAttribute('data-is-set', 'true');
                        return true;
                    }
                }
            }
        }
        return false;
    }

    redrawCards() {
        const missingCardsCount = 9 - this.cards.length;
        if (missingCardsCount === 0) return [];

        const newRevealedCards = this.generateNewCards(missingCardsCount);
        this.displayNewHtmlCards(newRevealedCards);

        return newRevealedCards;
    }

    generateNewCards(missingCardsCount){
        const newRevealedCards = [];
        const combinations = this.findCombinations(Array.from(this.cards).slice(), 2);

        for (const combination of combinations) {
            const matchingCard = this.findMatchingCardInDeck(combination);

            if (matchingCard) {
                newRevealedCards.push(matchingCard);
                matchingCard.isSet = true;
                this.deck = this.deck.filter(card => card !== matchingCard);
            } else {
                // TODO No matching cards in deck anymore
            }

            if (newRevealedCards.length >= missingCardsCount) break;
        }
        return newRevealedCards;
    }

    displayNewHtmlCards(newRevealedCards) {
        for (const newCard of newRevealedCards) {
            const newHtmlCard = document.createElement("li");
            const text = document.createElement("p");
            text.innerHTML = `Color: ${newCard.color}<br>
                Rotation: ${newCard.rotation}<br>
                Form: ${newCard.form}}`;

            newHtmlCard.appendChild(text);
            newHtmlCard.classList.add('card');
            this.htmlList.appendChild(newHtmlCard);
        }
    }

    findMatchingCardInDeck(combination) {
        for (const card of this.deck) {
            if (isSet(combination[0], combination[1], card)) {
                return card;
            }
        }
        return null;
    }

    findCombinations(array, pairCount) {
        const combinations = [];
        const combine = (start, selected) => {
            if (selected.length === pairCount) {
                combinations.push([...selected]);
                return;
            }

            for (let i = start; i < array.length; i++) {
                selected.push(array[i]);
                combine(i + 1, selected);
                selected.pop();
            }
        };
        combine(0, []);
        return combinations;
    }

    printCards() {
        this.cards.forEach((card, index) => {
            const text = document.createElement("p");
            text.innerHTML = `Color: ${card.dataset.color}<br>
                Rotation: ${card.dataset.rotation}<br>
                Form: ${card.dataset.rotation}}`;

            card.appendChild(text);
        });
    }
}