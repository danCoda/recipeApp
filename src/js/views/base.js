import Recipe from "../models/Recipe";

export const elements = {
    searchInput: document.querySelector(".search__field"),
    searchForm: document.querySelector(".search"),
    searchResList: document.querySelector(".results__list"),
    searchRes: document.querySelector(".results"),
    searchResPages: document.querySelector(".results__pages"),
    recipe: document.querySelector(".recipe")
};

export const elementStrings = { // Object with our selectors, for reusability / easy reference / easy change. 
    loader: "loader"
};

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML("afterbegin", loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`); // This must be here, instead of in elements, because it doesn't exist until renderLoader().
    if (loader) loader.parentElement.removeChild(loader); // To remove an element, you have to go to parent first. 
}