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

// Funktion zum Generieren des HTML-Codes für eine Pokémon-Karte
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

// Funktion zum Generieren des HTML-Codes für die Detailansicht eines Pokemons
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