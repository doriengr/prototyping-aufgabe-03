import { Card } from "./Card.js";
import { isSet } from "./isSet.js";
export class Deck {
    constructor() {
        this.htmlList = document.querySelector('.cards__list');
        this.htmlCards = document.querySelectorAll('.card');
        this.revealedCards = [];
        this.deck = [];

        this.colors = ['red', 'yellow', 'green', 'blue'];
        this.rotations = ['0', '90', '180', '-90'];
        this.forms = ['heart', 'spades', 'diamonds', 'clubs'];
    }

    init() {
        this.initDeck();
        this.initRevealCards();

        while (! this.hasMatchingSet()) {
            this.revealedCards = [];
            this.initRevealCards();
        }

        this.filterDeck();
        this.printCards(this.htmlCards);
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

    initRevealCards() {
        let startIndexes = [];

        this.htmlCards.forEach(htmlCard => {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * this.deck.length);
            } while (startIndexes.includes(randomIndex));

            startIndexes.push(randomIndex);
            this.revealedCards.push(this.deck[randomIndex]);
            htmlCard.setAttribute('data-is-set', 'false');
        });
    }

    filterDeck() {
        this.deck = this.deck.filter((newCard) =>
            ! this.revealedCards.some((usedCard) =>
                newCard.color === usedCard.color && newCard.rotation === usedCard.rotation && newCard.form === usedCard.form)
        );
    }

    hasMatchingSet() {
        for (let i = 0; i < this.revealedCards.length - 2; i++) {
            for (let j = i + 1; j < this.revealedCards.length - 1; j++) {
                for (let k = j + 1; k < this.revealedCards.length; k++) {
                    if (isSet(this.revealedCards[i], this.revealedCards[j], this.revealedCards[k])) {
                        this.htmlCards[i].setAttribute('data-is-set', 'true');
                        this.htmlCards[j].setAttribute('data-is-set', 'true');
                        this.htmlCards[k].setAttribute('data-is-set', 'true');

                        this.revealedCards[i].isSet = true;
                        this.revealedCards[j].isSet = true;
                        this.revealedCards[k].isSet = true;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    redrawRevealedCards() {
        const missingCardsCount = 9 - this.htmlCards.length;
        if (missingCardsCount === 0) return [];

        const newRevealedCards = this.generateNewRevealedCards(missingCardsCount);
        this.displayNewHtmlCards(newRevealedCards);

        return newRevealedCards;
    }

    generateNewRevealedCards(missingCardsCount) {
        const newRevealedCards = [];
        const combinations = this.findCombinations(this.revealedCards.slice(), 2);

        for (const combination of combinations) {
            const matchingCard = this.findMatchingCardInDeck(combination);

            if (matchingCard) {
                newRevealedCards.push(matchingCard);
                matchingCard.isSet = true;
                this.highlightSet(combination);
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

    printCards(cards) {
        cards.forEach((htmlCard, index) => {
            const text = document.createElement("p");
            text.innerHTML = `Color: ${this.revealedCards[index].color}<br>
                Rotation: ${this.revealedCards[index].rotation}<br>
                Form: ${this.revealedCards[index].form}}`;

            if (this.revealedCards[index].isSet) {
                htmlCard.classList.add('card--isSet');
            }
            htmlCard.appendChild(text);
        });
    }
}