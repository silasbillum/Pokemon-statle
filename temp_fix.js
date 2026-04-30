const fs = require('fs');

const filePath = 'c:/Users/Silas/Documents/GitHub/Pokemon-statle/statle/public/pokemon-details.json';
const rawData = fs.readFileSync(filePath);
const pokemons = JSON.parse(rawData).pokemon;

const placeholder = "https://static.pokemon.com/images/pokemon/flib/0.png";

const filteredPokemons = pokemons.filter(pokemon => {
    const imageUrl = pokemon.image_url;
    return imageUrl !== placeholder;
});

fs.writeFileSync(filePath, JSON.stringify(filteredPokemons, null, 2));

console.log(`Removed ${pokemons.length - filteredPokemons.length} Pokémon with placeholder images.`);
