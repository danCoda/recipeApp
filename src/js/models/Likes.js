export default class Likes {
    constructor () {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        return like; // GOod practise to return the newly created object.
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return index > -1; // It exists, therefore is liked. 
    }

    getNumLikes() {
        return this.likes.length;
    }
}