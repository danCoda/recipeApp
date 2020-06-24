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