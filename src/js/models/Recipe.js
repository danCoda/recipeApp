import {key, proxy } from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            let result = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            result = (await result.json()).recipe;

            this.title = result.title;
            this.author = result.publisher;
            this.img = result.image_url;
            this.url = result.source_url;
            this.ingredients = result.ingredients;
        } catch (e) {
            console.log(e);
            alert("Something went wrong!");
        }
    }

    calcTime() {
        // Assumption: We need 15 minutes to cook with 3 ingredients.
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}