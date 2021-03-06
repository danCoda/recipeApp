import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import {
    elements,
    renderLoader,
    clearLoader
} from "./views/base";
/** GLobal state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes.
 */

// Our global state variable:
const state = {};

/**
 * 
 * SEARCH CONTROLLER
 * 
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
 * 
 * RECIPE CONTROLLER
 * 
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (e) {
            alert("Error processing recipe :( ");
            console.warn("Error: ", e);
        }
    }
};

/* window.addEventListener("hashchange", controlRecipe); // the hash is... the stuff after the query in the url. "...www.google.com?#123"; 123.
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
    const id = e.target.closest(".shopping__item").dataset.itemid; // Gets the itemid based on the closest .shopping__item. itemid must not be in camalCase.

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

    if (!state.likes.isLiked(currentId)) {
        // User has not yet liked current recipe.
        // Add like to the stake.
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        // Toggle like button.
        likesView.toggleLikeBtn(true);
        // Add like to the UI list.
        likesView.renderLike(newLike);
    } else {
        // User has liked current recipe.
        // Remove like from the stake.
        state.likes.deleteLike(currentId);
        // Toggle the like button.
        likesView.toggleLikeBtn(false);
        // Remove like from UI list.
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load. 
window.addEventListener("load", () => {
    state.likes = new Likes();
    state.likes.readStorage(); // Update state.likes with stored likes.
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes.
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


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
    } else if (e.target.matches(".recipe__btn, .recipe__btn *")) {
        // Add ingredients to shopping list. 
        controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")) {
        // Add ingredients to like list. 
        controlLike();
    };
});