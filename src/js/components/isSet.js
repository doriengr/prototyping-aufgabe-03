export function isSet(card1, card2, card3) {
    for (const attribute of ['color', 'rotation', 'form']) {
        const dataAttribute1 = card1.dataset[attribute];
        const dataAttribute2 = card2.dataset[attribute];
        let dataAttribute3 = card3.color ? card3[attribute] : card3.dataset[attribute];

        if (
            !(dataAttribute1 === dataAttribute2 && dataAttribute2 === dataAttribute3) &&
            !(dataAttribute1 !== dataAttribute2 && dataAttribute2 !== dataAttribute3 && dataAttribute1 !== dataAttribute3)
        ) {
            return false;
        }
    }
    return true;
}