import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base";
/** GLobal state of the app
 * - Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes.
 */

// Our global state variable:
const state = {};
window.state = state;
/**
 * Search controller
 */
const controlSearch = async () => {
    // 1. Get query from view. 
    const query = searchView.getInput();

    if (query) {
        // 2. New search object, and add to state. 
        state.search = new Search(query);
        // 3. Prepare UI for results. 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)

        try {
            // 4. Search for recipes. 
            await state.search.getRecipe(); // Since we have 'await', this function must be async.
            // 5. Render results on UI. 
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            alert("Something went wrong with the search!");
            clearLoader();
        }

    }
}

// Even listeners. 
elements.searchForm.addEventListener("submit", e => {
    e.preventDefault(); // as it reloads the page by default. 
    controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline"); // Ensures that we select the common parent, instead of the variable sub elements (e.g. text, or svg arrow image). 
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // get the goto attribute. The 10 means 'base 10'; if 'base 2', is binary.
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * Search controller
 */
const recipe = new Recipe(35477); // Recipe for "Pizza dip".
recipe.getRecipe();
console.log(recipe);


/**
 * Search controller
 */
const controlRecipe = async () => {
    // Get the ID from the URL.
    const id = window.location.hash.replace("#", "");
    if (id) {
        // Prepare UI for changes.
        recipeView.clearRecipe(); // Clear recipe loading area of any previously selected recipe.
        renderLoader(elements.recipe); // Render loader in elements.recipe.

        // Highlight selected search item.
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object.
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients.
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time.
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe.
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            alert("Error processing recipe :( ");
            console.warn("Error: ", e);
        }
    }
};

/* window.addEventListener("hashchange", controlRecipe); // the hash is... the has after the query in the url. "...www.google.com?#123"; 123.
window.addEventListener("load", controlRecipe);  */
["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * 
 * LIST CONTROLLER
 * 
 */
const controlList = () => {
    // Create new list if there is none yet.
    if (!state.list) state.list = new List();

    // Add each ingredient to the List and the UI.
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events.
elements.shopping.addEventListener("click", e => {
    const id = e.target.closest(".shopping__item").dataset.itemId; // Gets the itemId based on the closest .shopping__item.

    // Handle delete button.
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        // Delete from state.
        state.list.deleteItem(id);
        // Delete from UI.
       listView.deleteItem(id);
    } else if (e.target.matches(".shopping__count-value")) {
        // Update ingredient value (amount).
        const value = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
    };
});

/**
 * 
 * LIKE CONTROLLER
 * 
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    // User has not yet liked current recipe.
    if (!state.likes.isLiked(currentId)) {
        // Add like to the stake.
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        
        // Toggle like button.
        // Add like to the UI list.
        console.log(state.likes);

    // User has liked current recipe.
    } else {
        // Remove like from the stake.
        state.likes.deleteLike(currentId); 
        // Toggle the like button.
        // Remove like from UI list.
        console.log(state.likes);
    }
}


// Handling recipe button clicks.
elements.recipe.addEventListener("click", e => {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) { // .btn-decrease, or any child element of it. 
        // Decrease button's clicked.
        if (state.recipe.servings > 1) {
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *")) { // .btn-increase or any of its child elements.
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
        // Add ingredients to shopping list. 
        controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        // Add ingredients to like list. 
        controlLike();
    };
});