import {
    elements
} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ""; // We aren't returning anything, so must be in curly braces.
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ""; // Clear it. 
    elements.searchResPages.innerHTML = ""; // Clear it. 
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll(".results__link"));
    resultsArr.forEach(el => {
        el.classList.remove("results__link--active");
    });
    document.querySelector(`a[href="#${id}"]`).classList.add("results__link--active");
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

// Type can be 'prev' or 'next'.
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1}>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => { // This is a private function; we aren't exporting it. 
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1) {
        button = createButton(page, "next");
    } else if (page === pages) {
        // We're on the last page. 
        button = createButton(page, "prev");
    } else {
        // Page < pages.
        button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
    }
    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // We get an array of recipes. 
    //recipes.forEach(el => renderRecipe(el))
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    // Render buttons. 
    renderButtons(page, recipes.length, resPerPage);
};