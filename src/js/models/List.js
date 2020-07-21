import uniqid from "uniqid";

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            count, 
            unit,
            ingredient,
            id: uniqid()
        }
        this.items.push(item);
        return item; // Return the new item; is "good practice".
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1); // Remove one element.
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }
}