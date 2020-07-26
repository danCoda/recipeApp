import {
    elements
} from "./base";

export const renderItem = item => {
    // Note: data-itemid, is not in camalCase (itemId); doesn't work if camalcase. 
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}> 
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML("beforeend", markup);
};

export const deleteItem = id => {
    // Note: data-itemid, is not in camalCase (itemId); doesn't work if camalcase. 
    const item = document.querySelector(`[data-itemid="${id}"]`);
    // Delete item from the view. 
    if (item) item.parentElement.removeChild(item);
};