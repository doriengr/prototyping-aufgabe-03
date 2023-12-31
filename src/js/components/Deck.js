import { Card } from "./Card.js";
import { isSet } from "./isSet.js";
export class Deck {
    constructor() {
        this.htmlList = document.querySelector('.cards__list');
        this.cards = document.querySelectorAll('.card');
        this.deck = [];

        this.colors = ['red', 'yellow', 'green', 'blue'];
        this.rotations = ['0', '90', '180', '-90'];
        this.forms = ['hearts', 'spades', 'diamonds', 'clubs'];
    }

    init() {
        this.initDeck();
        this.initCards();
        while (! this.hasMatchingSet()) this.initCards();
        this.filterDeck();

        this.cards.forEach(card => {
            card.appendChild(this.createImage(card.dataset.color, card.dataset.form, card.dataset.rotation));
        });
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
            card.setAttribute('data-isset', 'false');
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
                        this.cards[i].setAttribute('data-isset', 'true');
                        this.cards[j].setAttribute('data-isset', 'true');
                        this.cards[k].setAttribute('data-isset', 'true');

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

        if (this.deck.length <= 3) {
            return [];
        }

        return this.generateNewCards(missingCardsCount);
    }

    generateNewCards(missingCardsCount){
        let newRevealedCards = [];
        const combinations = this.findCombinations(Array.from(this.cards).slice(), 2);

        for (const combination of combinations) {
            const matchingCard = this.findMatchingCardInDeck(combination);

            if (matchingCard) {
                this.highlightedSet(combination);
                this.deck = this.deck.filter(card => card !== matchingCard);
                newRevealedCards.push(this.displayNewHtmlCard(matchingCard, 'true'));
                break;
            } else {
                return [];
            }
        }

        while (newRevealedCards.length < missingCardsCount) {
            const randomIndex = Math.floor(Math.random() * this.deck.length);
            const randomCard = this.deck[randomIndex];
            this.deck.splice(randomIndex, 1);
            newRevealedCards.push(this.displayNewHtmlCard(randomCard, 'false'));
        }

        newRevealedCards = this.shuffleOptions(newRevealedCards).map(card => {
            return this.htmlList.appendChild(card);
        })

        this.cards = document.querySelectorAll('.card');
        return newRevealedCards;
    }

    highlightedSet(combination) {
        this.cards.forEach(card => {
            combination.forEach(node => {
                if (card.isEqualNode(node)) {
                    card.dataset.isset = 'true';
                }
            })
        });
    }

    displayNewHtmlCard(card, isCardASet) {
        const newHtmlCard = document.createElement("li");
        newHtmlCard.appendChild(this.createImage(card.color, card.form, card.rotation));
        newHtmlCard.classList.add('card');

        newHtmlCard.setAttribute('data-isset', isCardASet);
        newHtmlCard.setAttribute('data-color', card.color);
        newHtmlCard.setAttribute('data-form', card.form);
        newHtmlCard.setAttribute('data-rotation', card.rotation);

        return newHtmlCard;
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

        return this.shuffleOptions(combinations);
    }

    createImage(color, form, rotation) {
        const image = document.createElement('img');
        image.src = `/assets/${form}-${color}.svg`;
        image.classList.add('card__image');

        switch (rotation) {
            case '-90':
                image.classList.add('card__image--rotate-left');
                break;
            case '90':
                image.classList.add('card__image--rotate-right');
                break;
            case '180':
                image.classList.add('card__image--rotate-full');
                break;
        }

        return image;
    }

    shuffleOptions(combinations) {
        for (let i = combinations.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combinations[i], combinations[j]] = [combinations[j], combinations[i]];
        }

        return combinations;
    }
}