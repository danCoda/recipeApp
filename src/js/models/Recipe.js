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
            (e);
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
        const units = [...unitsShort, "kg", "g"]; // Includes unitShort as well as others.

        const newIngredients = this.ingredients.map(el => {
            // Uniform units. 
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => { // Replace unitsLong (e.g. tablespoons) with unitsShort (e.g. tbsp).
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parenthesis.
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " "); // regex; regular expression

            // Parse ingredients into count, unit and ingredients.
            const arrIng = ingredient.split(" ");
            const indexOfUnit = arrIng.findIndex(el2 => units.includes(el2)); // FInd index if the callback returns true.
            let objIngredient;
            if (indexOfUnit > -1) {
                // There's a unit.
                // E.g. 4 1/2 cups? arrCount is [4, 1/2] --> eval() --> 4 + 1/2 --> 4.5.
                // E.g. 4 cups? arrCount is [4].
                const arrCount = arrIng.slice(0, indexOfUnit); 
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace("-", "+")); // An ingredient unit may be "4-1/2 cups".
                } else {
                    count = eval(arrIng.slice(0, indexOfUnit).join("+"));
                }

                objIngredient = {
                    count,
                    unit: arrIng[indexOfUnit],
                    ingredient: arrIng.slice(indexOfUnit + 1).join(" ")
                }
            } else if (parseInt(indexOfUnit[0], 10)) {
                // There's no unit, but the first element is a number.
                objIngredient = {
                    count: parseInt(indexOfUnit[0], 10),
                    unit: "",
                    ingredient: arrIng.slice(1).join(" ") // Everything except the first element.
                }
            } else if (indexOfUnit === -1) {
                // There's no unit for this ingredient, and no number in the first position.
                objIngredient = {
                    count: 1,
                    unit: "",
                    ingredient
                }
            }
            return objIngredient; // map must return something.
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) { // Type can be 'dec' for 'decrease'.
        // Servings
        const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *=  (newServings / this.servings); // ing.count = ing.count / this.servings * newServings;
        })

        this.servings = newServings;
    }
}