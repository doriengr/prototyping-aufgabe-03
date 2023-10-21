export function isSet(card1, card2, card3) {
    for (const attribute of ['color', 'rotation', 'form']) {
        if (!(card1[attribute] === card2[attribute] && card2[attribute] === card3[attribute]) &&
            !(card1[attribute] !== card2[attribute] && card2[attribute] !== card3[attribute] && card1[attribute] !== card3[attribute])) {
            return false;
        }
    }
    return true;
}
