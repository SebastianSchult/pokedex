// Array mit deutschen Übersetzungen der Pokémon-Typen
const germanTypeTranslations = {
    normal: 'Normal',
    fighting: 'Kampf',
    flying: 'Flug',
    poison: 'Gift',
    ground: 'Boden',
    rock: 'Gestein',
    bug: 'Käfer',
    ghost: 'Geist',
    steel: 'Stahl',
    fire: 'Feuer',
    water: 'Wasser',
    grass: 'Pflanze',
    electric: 'Elektro',
    psychic: 'Psycho',
    ice: 'Eis',
    dragon: 'Drache',
    dark: 'Unlicht',
    fairy: 'Fee'
};


/**
 * Gibt die Hintergrundfarbe einer Pokémon-Karte basierend auf dem Typ zurück.
 * @param {string} type - Der Typ des Pokémon
 * @returns {string} Die Farbe als Hex-Code
 */
function getCardBackgroundColor(type) {
    const colorMap = {
        'Normal': '#A8A878',
        'Kampf': '#C03028',
        'Gift': '#A040A0',
        'Boden': '#E0C068',
        'Gestein': '#B8A038',
        'Käfer': '#A8B820',
        'Geist': '#705898',
        'Stahl': '#B8B8D0',
        'Feuer': '#F08030',
        'Wasser': '#6890F0',
        'Pflanze': '#78C850',
        'Elektro': '#F8D030',
        'Psycho': '#F85888',
        'Eis': '#98D8D8',
        'Drache': '#7038F8',
        'Unlicht': '#705848',
        'Fee': '#EE99AC'
    };
    // Rückgabe der entsprechenden Farbe basierend auf dem Typ, falls vorhanden
    return colorMap[type] || '#FFFFFF'; // Standardfarbe weiß, falls kein passender Typ gefunden wurde
}

// Array zur Speicherung aller geladenen Pokémon-Daten
let allPokemonData = [];
let isModalOpen = false; // Variable zur Verfolgung des Modalzustands
let isLoading = false; // Variable zur Verfolgung des Ladezustands