// Exporting a class.

export default class Search {
    constructor (query) {
        this.query = query;
        this.result = ""; // I added this here so we know Search's properties. 
    }

    async getRecipe() {
        try {
            // First approach.
            fetch(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`)
            .then(result => result.json())
            .then(data => { console.log("Result with .then:", data); });
    
            // Second approach.
            let result = await fetch(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result = (await result.json()).recipes;
            console.log("Result without .then: ", this.result);
        } catch (e) {
            alert("Error: ", e);
        }
    }
}