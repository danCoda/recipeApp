export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage.
        this.persistData();

        return like; // GOod practise to return the newly created object.
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage.
        this.persistData();
    }

    isLiked(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return index > -1; // It exists, therefore is liked. 
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem("likes", JSON.stringify(this.likes)); // localStorage only stores items as strings. 
    }

    readStorage() {
        // Retreive likes from localStorage.
        const storage = JSON.parse(localStorage.getItem("likes")); // from string to object again.
        if (storage) this.likes = storage;
    }
}