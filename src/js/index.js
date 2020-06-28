import Search from "./models/Search";

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
    const query = "pizza"; // Todo later. 

    if (query) {
        // 2. New search object, and add to state. 
        state.search = new Search(query);
        // 3. Prepare UI for results. 

        // 4. Search for recipes. 
        await state.search.getRecipe(); // Since we have 'await', this function must be async.
        // 5. Render results on UI. 
        console.log(state.search.result); // getRecipe() defines .result. 
    }
}

// Even listeners. 
document. querySelector(".search").addEventListener("submit", e => {
    e.preventDefault(); // as it reloads the page by default. 
    controlSearch();
});