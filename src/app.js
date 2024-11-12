// URL zur Pokemon API
const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

let currentPokemonData = null; // Variable zur Speicherung der aktuellen Pokemon-Daten

// Laden und Rendern der Pokémon beim Start der Anwendung
async function init() {
    const storedPokemonData = localStorage.getItem('pokemonData');
    if (storedPokemonData) {
        allPokemonData = JSON.parse(storedPokemonData);
    } else {
        await loadPokemons();
        localStorage.setItem('pokemonData', JSON.stringify(allPokemonData));
    }
    renderPokemons();

    // Event-Listener für die Suchfunktion hinzufügen
    addSearchEventListener();
}


/*************  ✨ Codeium Command ⭐  *************/
/**
 * Loads a batch of Pokémon data from the API and renders the Pokémon cards.
 * 
 * This function fetches Pokémon data from the API using the specified offset and limit.
 * After fetching, it updates the local storage with the new data, updates the global
 * Pokémon data array, and renders the Pokémon cards using the newly fetched data.
 * 
 * @param {number} offset - The starting index for fetching Pokémon data.
 * @param {number} limit - The number of Pokémon to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of newly loaded Pokémon data.
 * @throws Will handle any errors that occur during the data fetching process.
 */

/******  b8564ab4-dfc3-4b42-95f2-10791f180a3f  *******/
async function loadPokemons(offset = 0, limit = 40) {
    try {
        const response = await fetch(`${apiUrl}?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        const results = data.results;

        // Laden und Rendern der neuen Pokemon-Daten
        const newPokemonData = await fetchPokemonData(results);
        savePokemonDataToLocalStorage();
        updateAllPokemonData(newPokemonData);
        renderPokemonCards(allPokemonData); // Rendern der bereits vorhandenen Karten mit neuen Daten
        renderPokemonCards(newPokemonData); // Rendern der neu geladenen Karten

        return newPokemonData; // Rückgabe der geladenen Pokémon-Daten
    } catch (error) {
        handleLoadPokemonError(error);
    }
}

async function fetchPokemonData(results) {
    const newPokemonData = [];
    for (let i = 0; i < results.length; i++) {
        const pokemonData = await getPokemonData(results[i].url);
        newPokemonData.push(pokemonData);
        // Nach dem Abrufen der Daten für jedes Pokémon, rendern Sie die Karte
        renderPokemonCards([pokemonData]); // Hier wurde der Funktionsname korrigiert
    }
    return newPokemonData;
}

function renderPokemonCards(pokemonDataArray) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    const fragment = document.createDocumentFragment(); // Erstelle ein Dokumentfragment für effiziente DOM-Manipulation

    // Rendern der Pokemon-Karten
    for (const pokemonData of pokemonDataArray) {
        if (!document.getElementById(`pokemon-${pokemonData.id}`)) {
            const card = createPokemonCard(pokemonData);
            fragment.appendChild(card);
        }
    }

    pokemonContainer.appendChild(fragment); // Hinzufügen der erstellten Karten zum Container
}

function updateAllPokemonData(newPokemonData) {
    allPokemonData.push(...newPokemonData);
}

function savePokemonDataToLocalStorage() {
    localStorage.setItem('pokemonData', JSON.stringify(allPokemonData));
}

function handleLoadPokemonError(error) {
    console.error('Error loading pokemons:', error);
    return []; // Rückgabe eines leeren Arrays im Fehlerfall
}

// Funktion zum Abrufen der deutschen Übersetzung eines Pokémon-Typs
function getGermanType(type) {
    return germanTypeTranslations[type] || type; // Rückgabe der deutschen Übersetzung oder des englischen Typs, falls keine Übersetzung vorhanden ist
}

// Funktion zum Laden und Rendern der Pokémon-Karten
async function renderPokemons(newPokemons) {
    const pokemonContainer = document.getElementById('pokemonContainer');

    if (!newPokemons) {
        // Clear previous content if all Pokémon are to be rendered
        pokemonContainer.innerHTML = '';
        newPokemons = allPokemonData; // Use allPokemonData if newPokemons is not provided
    }

    try {
        const fragment = document.createDocumentFragment(); // Create a document fragment for efficient DOM manipulation

        for (const pokemonData of newPokemons) {
            const card = createPokemonCard(pokemonData);
            fragment.appendChild(card); // Append cards to the fragment
        }

        // Append the fragment to the container once, improving rendering performance
        pokemonContainer.appendChild(fragment);
    } catch (error) {
        console.error('Error rendering pokemons:', error);
    }
}

// Funktion zum Abrufen von Detaildaten eines Pokemons
async function getPokemonData(url) {
    try {
        const data = await fetchData(url);
        const speciesData = await fetchSpeciesData(data.species.url);
        const germanName = await getGermanName(speciesData);
        const germanTypes = getGermanTypes(data.types);

        const pokemon = createPokemonObject(data, germanName, germanTypes);

        return pokemon;
    } catch (error) {
        console.error('Error getting pokemon data:', error);
    }
}

// Hilfsfunktion zum Abrufen von Daten
async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

// Hilfsfunktion zum Abrufen von Speziesdaten
async function fetchSpeciesData(speciesUrl) {
    const response = await fetch(speciesUrl);
    return await response.json();
}

// Hilfsfunktion zum Erstellen eines deutschen Namens für das Pokemon
async function getGermanName(speciesData) {
    const germanNameEntry = speciesData.names.find(name => name.language.name === 'de');
    if (!germanNameEntry) {
        console.error('Error: German language data not found');
        return null;
    }
    return germanNameEntry.name;
}

// Hilfsfunktion zum Abrufen der deutschen Typen
function getGermanTypes(types) {
    return types.map(type => getGermanType(type.type.name));
}

// Hilfsfunktion zum Erstellen des Pokemon-Objekts
function createPokemonObject(data, germanName, germanTypes) {
    return {
        name: data.name,
        id: data.id,
        types: germanTypes,
        image: data.sprites.front_default,
        germanName: germanName ? germanName : null,
        stats: data.stats.map(stat => ({ name: stat.stat.name, value: stat.base_stat }))
    };
}
// Funktion zum Abrufen des deutschen Namens eines Pokemons
async function getGermanName(data) {
    try {
        const germanNameEntry = data.names.find(name => name.language.name === 'de');
        if (!germanNameEntry) {
            console.error('Error: German language data not found');
            return null;
        }
        return germanNameEntry.name;
    } catch (error) {
        console.error('Error getting German name:', error);
        return null;
    }
}

// Funktion zum Erstellen einer Pokémon-Karte mit dynamischer Hintergrundfarbe basierend auf dem Typ
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = `pokemon-${pokemon.id}`; // Setzen der ID des Container-Elements
    card.style.backgroundColor = getCardBackgroundColor(pokemon.types[0]); // Verwende die Hintergrundfarbe des ersten Typs
    card.innerHTML = createPokemonCardHTML(pokemon);
    card.addEventListener('click', () => openPokemonDetail(pokemon));
    return card;
}



// Funktion zum Öffnen der Detailansicht eines Pokemons
function openPokemonDetail(pokemon) {
    const modal = document.querySelector('.modal');

    if (!modal) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = createModalHTML(pokemon);
        document.body.appendChild(modal);
    } else {
        modal.innerHTML = createModalHTML(pokemon);
        setisModalOpen = true; // Setze den Modalzustand auf geöffnet
    }
    currentPokemonData = pokemon; // Aktuelle Pokemon-Daten speichern

}



// Funktion zum Erstellen von Pokemon-Statistiken als Balkendiagramm
function createPokemonStatsChart(pokemon) {
    const maxStat = Math.max(...pokemon.stats.map(stat => stat.value)); // Maximale Statistikwert
    const statsChartHTML = pokemon.stats.map(stat => {
        const percentage = (stat.value / maxStat) * 100; // Prozentualer Anteil des aktuellen Werts
        return `
            <div class="stat-bar">
                <div class="stat-name">${stat.name.toUpperCase()}:</div>
                <div class="stat-value" style="width: ${percentage}%"></div>
            </div>
        `;
    }).join('');

    return `
        <h3>Stats:</h3>
        <br>
        <div class="stats-chart">
            ${statsChartHTML}
        </div>
    `;
}

// Funktion zum Zurückkehren zur Detailansicht
function returnToDetailView() {
    const pokemonDetail = document.getElementById('pokemonDetail');
    const infoHTML = createPokemonInfo(currentPokemonData);
    pokemonDetail.innerHTML = `
        ${infoHTML}
        <button id="toggleBtn" onclick="toggleView()">Stats anzeigen</button>
    `;
}


// Funktion zum Erstellen von Pokemon-Informationen
function createPokemonInfo(pokemon) {
    return `
        <h4>ID: ${pokemon.id}</h4>
        <h4>Types: ${pokemon.types.join(', ')}</h4> 
    `;
}

// Funktion zum Erstellen von Pokemon-Statistiken
function createPokemonStats(pokemon) {
    const statsHTML = pokemon.stats.map(stat => `<p>${stat.name}: ${stat.value}</p>`).join('');
    return `
        <h3>Stats</h3>
        ${statsHTML}
    `;
}

// Funktion zum Schließen des Modals
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.remove();
}




//load20more
async function load20More() {
    if (isLoading) return;
    isLoading = true;

    try {
        const offset = document.querySelectorAll('.card').length;
        const limit = 20;
        const newPokemons = await loadPokemons(offset, limit);
        renderNewPokemons(newPokemons);
        addSearchEventListener();
    } catch (error) {
        console.error('Error loading more pokemons:', error);
    } finally {
        isLoading = false;
    }
}

// Neue Funktion zum Rendern der neu geladenen Pokemon
function renderNewPokemons(newPokemons) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    for (const pokemon of newPokemons) {
        if (!document.getElementById(`pokemon-${pokemon.id}`)) {
            const card = createPokemonCard(pokemon);
            pokemonContainer.appendChild(card);
        }
    }
}


document.getElementById('searchInput').addEventListener('input', async (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();

    if (searchQuery.length >= 3) {
        const filteredPokemons = allPokemonData.filter(pokemon => {
            return pokemon.germanName.toLowerCase().includes(searchQuery);
        });

        renderFilteredPokemons(filteredPokemons);
    } else {
        renderPokemons();
    }
});

// Funktion zum Rendern von gefilterten Pokemon
async function renderFilteredPokemons(filteredPokemons) {
    const pokemonContainer = document.getElementById('pokemonContainer');

    try {
        const fragment = document.createDocumentFragment(); // Create a document fragment for efficient DOM manipulation

        // Durchlaufen der gefilterten Pokémon mit einer for-Schleife
        for (let i = 0; i < filteredPokemons.length; i++) {
            const pokemon = filteredPokemons[i];

            // Überprüfen, ob das Pokémon bereits gerendert wurde, um Duplikate zu vermeiden
            if (!document.getElementById(`pokemon-${pokemon.id}`)) {
                const card = createPokemonCard(pokemon);
                fragment.appendChild(card); // Füge die Karte dem Fragment hinzu
            }
        }

        // Vor dem Anhängen des Fragments den vorherigen Inhalt löschen
        pokemonContainer.innerHTML = '';
        // Füge das Fragment einmal dem Container hinzu, um die Leistung zu verbessern
        pokemonContainer.appendChild(fragment);
    } catch (error) {
        console.error('Error rendering filtered pokemons:', error);
    }
}

// // Event-Listener für die Suchfunktion
function addSearchEventListener() {
    document.getElementById('searchInput').addEventListener('input', async (event) => {
        const searchQuery = event.target.value.trim().toLowerCase();

        if (searchQuery.length >= 3) { // Suche startet bereits ab dem dritten Zeichen
            // Durchsuchen der Pokemon-Daten und Filtern
            const filteredPokemons = [];
            for (const pokemon of allPokemonData) {
                if (pokemon.germanName.toLowerCase().includes(searchQuery)) {
                    filteredPokemons.push(pokemon);
                }
            }
            renderFilteredPokemons(filteredPokemons);
        } else if (searchQuery.length === 0) { // Wenn die Suche leer ist, alle Pokémon anzeigen
            renderPokemons();
        }
    });
}

// Funktion zum Navigieren zu vorherigem oder nächstem Pokemon
function navigatePokemon(direction) {
    const currentIndex = allPokemonData.findIndex(pokemon => pokemon === currentPokemonData);
    let newIndex;
    closeModal();

    if (direction === 'previous') {
        newIndex = (currentIndex === 0) ? allPokemonData.length - 1 : currentIndex - 1;
    } else if (direction === 'next') {
        newIndex = (currentIndex === allPokemonData.length - 1) ? 0 : currentIndex + 1;
    }

    if (newIndex !== undefined) {
        const newPokemon = allPokemonData[newIndex];
        openPokemonDetail(newPokemon);
    }
}

// Event-Listener für Klicks auf das gesamte Dokument hinzufügen
document.addEventListener('click', (event) => {
    // Überprüfen, ob das Modal geöffnet ist und ob der Klick außerhalb des Modals erfolgt ist
    if (isModalOpen && !document.querySelector('.modal').contains(event.target)) {
        closeModal(); // Schließen Sie das Modal
    }
});