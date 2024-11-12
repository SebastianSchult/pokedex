/**
 * Generates HTML for a Pokémon card.
 *
 * This function constructs a Pokémon card with details such as the Pokémon's
 * name, ID, image, and types. The card's background color is set based on
 * the Pokémon's first type.
 *
 * @param {Object} pokemon - The Pokémon object containing the attributes 
 *                           necessary for generating the card. 
 *                           Expected properties include:
 *                           - id: The unique identifier for the Pokémon.
 *                           - name: The English name of the Pokémon.
 *                           - germanName: The German name of the Pokémon, if available.
 *                           - image: The URL of the Pokémon's image.
 *                           - types: An array of the Pokémon's types.
 * @returns {string} The HTML string representing the Pokémon card.
 */

function createPokemonCardHTML(pokemon) {
    const cardHTML = `
        <div class="card" id="pokemon-${pokemon.id}" style="background-color: ${getCardBackgroundColor(pokemon.types[0])};">
            <div class="pokemon-info">
                <div class="pokemon-name">${pokemon.germanName ? pokemon.germanName.toUpperCase() : pokemon.name.toUpperCase()}</div>
                <div class="pokemon-id">#${pokemon.id}</div>
                <div class="pokemon-image"><img src="${pokemon.image}" alt="${pokemon.name}" /></div>
                <div class="pokemon-details">
                    <p><span class="type-label">Typen:</span> ${pokemon.types.map(type => `<span class="type">${type}</span>`).join('')}</p>
                </div>
            </div>
        </div>`;
    return cardHTML;
}


/**
 * Generates HTML for a Pokémon card.
 *
 * This function constructs a Pokémon card with the Pokémon's name, ID, image,
 * and types. It formats the card's appearance by applying styles to each component.
 * The card's background color is determined by the Pokémon's first type.
 *
 * @param {Object} pokemon - The Pokémon object containing necessary attributes.
 *                           Expected properties:
 *                           - id: The unique identifier for the Pokémon.
 *                           - name: The English name of the Pokémon.
 *                           - germanName: The German name of the Pokémon, if available.
 *                           - image: The URL of the Pokémon's image.
 *                           - types: An array of the Pokémon's types.
 * @returns {string} The HTML string representing the Pokémon card.
 */

function createPokemonCardHTML(pokemon) {
    return `
        <div class="pokemon-info">
            <div class="pokemon-name">${pokemon.germanName ? pokemon.germanName.toUpperCase() : pokemon.name.toUpperCase()}</div> <!-- Pokemon Name -->
            <div class="pokemon-id">#${pokemon.id}</div> <!-- Pokemon ID oben rechts -->
            <div class="pokemon-image"><img src="${pokemon.image}" alt="${pokemon.name}" /></div> <!-- Pokemon Bild -->
            <div class="pokemon-details"> <!-- Pokemon Informationen -->
                <p><span class="type-label">Typen:</span> 
                ${pokemon.types.map(type => `<span class="type">${type}</span>`).join('')}</p>
            </div>
        </div>
    `;
}



/**
 * Generates HTML for a Pokémon detail modal.
 *
 * This function constructs the HTML structure for a modal that displays a Pokémon's details,
 * including its name, types, image, and stats chart. The modal has an upper section with a 
 * background color based on the Pokémon's first type and a lower section with navigation buttons.
 *
 * @param {Object} pokemon - The Pokémon object containing details such as name, types, and image.
 *                           Expected properties:
 *                           - germanName: The German name of the Pokémon, if available.
 *                           - name: The English name of the Pokémon.
 *                           - types: An array of the Pokémon's types.
 *                           - image: The URL of the Pokémon's image.
 * @returns {string} The HTML string representing the Pokémon detail modal.
 */

function createModalHTML(pokemon) {
const infoHTML = createPokemonInfo(pokemon);
    const statsChartHTML = createPokemonStatsChart(pokemon);

    // Hintergrundfarbe basierend auf dem Typ des Pokemons für den oberen Bereich festlegen
    const upperSectionBackgroundColor = getCardBackgroundColor(pokemon.types[0]);

    return `
        <div class="modalContent">
            <div class="upperSection" style="background-color: ${upperSectionBackgroundColor}; padding: 20px; position: relative; text-align: center;">
                <span id="closeBtn" onclick="closeModal()" style="position: absolute; top: 5px; right: 5px; font-size: 24px; cursor: pointer;">&times;</span>
                <h2 style="margin: 0; gap8px;">${pokemon.germanName ? pokemon.germanName.toUpperCase() : pokemon.name}</h2> <!-- Hier wird der deutsche Name verwendet -->
                <span class="type">${pokemon.types.join(', ')}</span>
                <img src="${pokemon.image}" alt="${pokemon.name}" />
            </div>
            <div class="lowerSection" style="padding-top: 20px;">
                <div id="pokemonDetail">
                    ${statsChartHTML}
                </div>
                <div class="button-container" style="margin-top: 20px;">
                    <button onclick="navigatePokemon('previous')">Zurück</button>
                    <button onclick="navigatePokemon('next')">Weiter</button>
                </div>
            </div>
        </div>
    `;
}