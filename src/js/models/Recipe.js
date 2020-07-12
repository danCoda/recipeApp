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
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
        const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];

        const newIngredients = this.ingredients.map(el => {
            // Uniform units. 
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => { // Replace unitsLong with unitsShort.
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            // Remove parenthesis.
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ""); // regex; regular expression

            // Parse ingredients into count, unit and ingredients.

            return ingredient; // map must return something.
        });
        this.ingredients = newIngredients;
    }
}