import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";
/** GLobal state of the app
* - Search object
* Current recipe object
* Shopping list object
* Liked recipes.
*/

// Our global state variable:
const state = {};

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
        // 4. Search for recipes. 
        await state.search.getRecipe(); // Since we have 'await', this function must be async.
        // 5. Render results on UI. 
        clearLoader();
        searchView.renderResults(state.search.result);
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