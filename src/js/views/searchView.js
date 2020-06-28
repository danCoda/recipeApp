import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
   elements.searchInput.value = ""; // We aren't returning anything, so must be in curly braces.
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ""; // CLear it. 
}

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []; // Adding stuff to an array isn't actually mutating it, so it can be a const. 
    if (title.length > limit) {
        title.split(" ").reduce((accumulator, current) => {
            // Populate newTitle with words from the title, so that the number of letters don't exceed limit.
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length; // Updated value of the accumulator.
        }, 0);
        return `${newTitle.join(" ")} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

export const renderResults = recipes => {
    // We get an array of recipes. 
    //recipes.forEach(el => renderRecipe(el))
    console.warn(recipes);
    recipes.forEach(renderRecipe); 
};