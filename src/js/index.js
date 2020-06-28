import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements } from "./views/base";
/** GLobal state of the app
* - Search object
* Current recipe object
* Shopping list object
* Liked recipes.
*/

// Our global state variable:
const state = {};

const controlSearch = async () => {
    // 1. Get query from view. 
    const query = searchView.getInput();

    if (query) {
        // 2. New search object, and add to state. 
        state.search = new Search(query);
        // 3. Prepare UI for results. 
        searchView.clearInput();
        searchView.clearResults();
        // 4. Search for recipes. 
        await state.search.getRecipe(); // Since we have 'await', this function must be async.
        // 5. Render results on UI. 
        console.log("Hi", state.search.result); // getRecipe() defines .result. 
        searchView.renderResults(state.search.result);
    }
}

// Even listeners. 
elements.searchForm.addEventListener("submit", e => {
    e.preventDefault(); // as it reloads the page by default. 
    controlSearch();
});