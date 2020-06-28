// Import one thing. 
import someString from "./models/Search"; // .js isn't required. 
console.log(`Imported default: ${someString}`);

// Import multiple things.
import { add as addIt, multiply } from "./views/searchView";
console.log(`Imported multiple things... Add 3, 5: ${addIt(3, 5)}`);
console.log(`Imported multiple things... Multiply 3, 5: ${multiply(3, 5)}`);

// Import everything. 
import * as importedFunctions from "./views/searchView";
console.log(`Imported everything... Add 3, 5: ${importedFunctions.add(3, 5)}`);

//--------------------------

// API calls.
async function getRecipe(query) {
    // const result = axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`); // axios is an npm module, but not required
    // anymore as Chrome now supports fetch().
    
    try {
        // First approach.
        fetch(`https://forkify-api.herokuapp.com/api/search?&q=${query}`)
        .then(result => result.json())
        .then(data => { console.log("Result with .then:", data); });

        // Second approach.
        let result = await fetch(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
        let data = await result.json();
        console.log("Result without .then: ", data);
    } catch (e) {
        alert("Error: ", e);
    }
    
}

getRecipe("kiwifruit");