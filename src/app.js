// URL zur Pokemon API
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

let currentPokemonData = null; // Variable zur Speicherung der aktuellen Pokemon-Daten

/**
 * Initialisiert die Pokemon-Daten und f hrt die Anzeige aus.
 *
 * Wenn lokal gespeicherte Pokemon-Daten vorhanden sind, werden diese verwendet.
 * Andernfalls werden die Pokemon-Daten von der API geladen und lokal gespeichert.
 * Danach wird die Pokemon-Liste gerendert.
 *
 * Zudem wird ein Event-Listener f r die Suchfunktion hinzugef gt.
 */
async function init() {
  const storedPokemonData = localStorage.getItem("pokemonData");
  if (storedPokemonData) {
    allPokemonData = JSON.parse(storedPokemonData);
  } else {
    await loadPokemons();
    localStorage.setItem("pokemonData", JSON.stringify(allPokemonData));
  }
  renderPokemons();

  // Event-Listener für die Suchfunktion hinzufügen
  addSearchEventListener();
}

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

/**
 * Fetches the Pokémon data from the API and renders the Pokémon cards.
 *
 * This function takes an array of Pokémon objects with a `url` property, fetches the
 * data from the API for each Pokémon, and renders the Pokémon cards using the newly
 * fetched data.
 *
 * @param {Array<Object>} results - An array of Pokémon objects with a `url` property.
 * @returns {Promise<Array>} A promise that resolves to an array of newly loaded Pokémon data.
 * @throws Will handle any errors that occur during the data fetching process.
 */
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

/**
 * Renders Pokémon cards into the DOM.
 *
 * This function takes an array of Pokémon data objects, creates card elements for each Pokémon,
 * and appends them to the Pokémon container in the document. It ensures that duplicate cards
 * are not rendered by checking for existing elements with the corresponding Pokémon ID.
 *
 * @param {Array<Object>} pokemonDataArray - An array of Pokémon data objects to render.
 */

function renderPokemonCards(pokemonDataArray) {
  const pokemonContainer = document.getElementById("pokemonContainer");
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

/**
 * Updates the global allPokemonData array with new Pokémon data.
 *
 * This function takes an array of new Pokémon data objects and appends them to the global allPokemonData array.
 *
 * @param {Array<Object>} newPokemonData - An array of new Pokémon data objects to add to the global array.
 */
function updateAllPokemonData(newPokemonData) {
  allPokemonData.push(...newPokemonData);
}

/**
 * Saves the current allPokemonData array to local storage.
 *
 * This function takes the global allPokemonData array, stringifies it using JSON.stringify(),
 * and saves it to local storage using the 'pokemonData' key.
 */
function savePokemonDataToLocalStorage() {
  localStorage.setItem("pokemonData", JSON.stringify(allPokemonData));
}

/**
 * Handles errors that occur while loading pokemons.
 *
 * Logs the error to the console and returns an empty array.
 *
 * @param {Error} error - The error that occurred while loading pokemons.
 * @returns {Array} An empty array.
 */
function handleLoadPokemonError(error) {
  console.error("Error loading pokemons:", error);
  return []; // Rückgabe eines leeren Arrays im Fehlerfall
}

/**
 * Returns the German translation of the given type.
 *
 * If the type is not found in the germanTypeTranslations object, the English type is returned.
 *
 * @param {string} type - The type to translate.
 * @returns {string} The German translation, or the English type if no translation is found.
 */
function getGermanType(type) {
  return germanTypeTranslations[type] || type; // Rückgabe der deutschen Übersetzung oder des englischen Typs, falls keine Übersetzung vorhanden ist
}

/**
 * Renders a list of Pokémon cards into the DOM.
 *
 * This function takes an array of Pokémon data objects and generates card elements for each Pokémon.
 * If no specific data is provided, it renders all Pokémon from the global allPokemonData array.
 * Existing content in the container is cleared if rendering all Pokémon.
 * Utilizes a document fragment for efficient DOM manipulation.
 *
 * @param {Array<Object>} [newPokemons] - Optional array of Pokémon data objects to render.
 * If not provided, all Pokémon data is rendered.
 */

async function renderPokemons(newPokemons) {
  const pokemonContainer = document.getElementById("pokemonContainer");

  if (!newPokemons) {
    // Clear previous content if all Pokémon are to be rendered
    pokemonContainer.innerHTML = "";
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
    console.error("Error rendering pokemons:", error);
  }
}

/**
 * Retrieves Pokémon data from the PokéAPI by URL, fetches the respective species data,
 * extracts the German name and types, and creates a Pokémon data object.
 *
 * @param {String} url - URL of the Pokémon to be fetched from the PokéAPI.
 * @returns {Object} The Pokémon data object if successfully fetched, otherwise undefined.
 */
async function getPokemonData(url) {
  try {
    const data = await fetchData(url);
    const speciesData = await fetchSpeciesData(data.species.url);
    const germanName = await getGermanName(speciesData);
    const germanTypes = getGermanTypes(data.types);

    const pokemon = createPokemonObject(data, germanName, germanTypes);

    return pokemon;
  } catch (error) {
    console.error("Error getting pokemon data:", error);
  }
}

/**
 * Fetches data from the given URL and returns it as a JSON object.
 *
 * @param {String} url - URL to fetch data from
 * @returns {Promise<Object>} The fetched data as a JSON object
 */
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * Fetches species data from the given URL.
 *
 * This function sends a request to the specified species URL
 * and returns the data as a JSON object.
 *
 * @param {String} speciesUrl - The URL to fetch species data from.
 * @returns {Promise<Object>} A promise that resolves to the fetched species data as a JSON object.
 */

async function fetchSpeciesData(speciesUrl) {
  const response = await fetch(speciesUrl);
  return await response.json();
}

/**
 * Retrieves the German name of a Pokémon from its species data.
 *
 * @param {Object} speciesData - The species data of the Pokémon.
 * @returns {String|null} The German name of the Pokémon if found, otherwise null.
 */
async function getGermanName(speciesData) {
  const germanNameEntry = speciesData.names.find(
    (name) => name.language.name === "de"
  );
  if (!germanNameEntry) {
    console.error("Error: German language data not found");
    return null;
  }
  return germanNameEntry.name;
}

/**
 * Maps an array of types to their German names.
 *
 * @param {Object[]} types - Array of types with language data.
 * @returns {String[]} Array of German type names.
 */
function getGermanTypes(types) {
  return types.map((type) => getGermanType(type.type.name));
}

/**
 * Creates a Pokémon object with specified attributes.
 *
 * This function constructs a Pokémon object using provided data,
 * incorporating the German name and types if available. It extracts
 * key properties such as name, id, types, an image URL, and stats.
 *
 * @param {Object} data - The base data object containing Pokémon information.
 * @param {String|null} germanName - The German name of the Pokémon, or null if unavailable.
 * @param {String[]} germanTypes - An array of the Pokémon's types translated to German.
 * @returns {Object} A Pokémon object with name, id, types, image, germanName, and stats.
 */

function createPokemonObject(data, germanName, germanTypes) {
  return {
    name: data.name,
    id: data.id,
    types: germanTypes,
    image: data.sprites.front_default,
    germanName: germanName ? germanName : null,
    stats: data.stats.map((stat) => ({
      name: stat.stat.name,
      value: stat.base_stat,
    })),
  };
}

/**
 * Retrieves the German name of a Pokémon from its language data.
 *
 * @param {Object} data - The base data object containing Pokémon information.
 * @returns {String|null} The German name of the Pokémon, or null if unavailable.
 */
async function getGermanName(data) {
  try {
    const germanNameEntry = data.names.find(
      (name) => name.language.name === "de"
    );
    if (!germanNameEntry) {
      console.error("Error: German language data not found");
      return null;
    }
    return germanNameEntry.name;
  } catch (error) {
    console.error("Error getting German name:", error);
    return null;
  }
}

/**
 * Creates a Pokémon card element with specified attributes.
 *
 * This function constructs a Pokémon card element with name, id, types, and an image.
 * It sets the background color of the card to the first type of the Pokémon.
 * The card is also assigned an event listener to open the detail view when clicked.
 *
 * @param {Object} pokemon - The Pokémon object containing name, id, types, and image.
 * @returns {HTMLElement} The constructed card element.
 */
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.id = `pokemon-${pokemon.id}`; // Setzen der ID des Container-Elements
  card.style.backgroundColor = getCardBackgroundColor(pokemon.types[0]); // Verwende die Hintergrundfarbe des ersten Typs
  card.innerHTML = createPokemonCardHTML(pokemon);
  card.addEventListener("click", () => openPokemonDetail(pokemon));
  return card;
}

/**
 * Opens the detail view of a Pokémon.
 *
 * This function checks if a modal element is already present in the DOM,
 * and if so, updates its content to show the provided Pokémon's details.
 * If no modal element exists, it is created and appended to the body.
 *
 * @param {Object} pokemon - The Pokémon object containing name, id, types, and image.
 */
function openPokemonDetail(pokemon) {
  const modal = document.querySelector(".modal");

  if (!modal) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = createModalHTML(pokemon);
    document.body.appendChild(modal);
  } else {
    modal.innerHTML = createModalHTML(pokemon);
    setisModalOpen = true; // Setze den Modalzustand auf geöffnet
  }
  currentPokemonData = pokemon; // Aktuelle Pokemon-Daten speichern
}

/**
 * Generates HTML for a Pokémon's stats chart.
 *
 * The stats chart is a horizontal bar chart that displays the values of the
 * Pokémon's stats. The chart is generated by taking the maximum stat value
 * and calculating the percentage of each stat relative to the maximum.
 *
 * @param {Object} pokemon - The Pokémon object containing the stats.
 * @returns {string} The HTML for the stats chart.
 */
function createPokemonStatsChart(pokemon) {
  const maxStat = Math.max(...pokemon.stats.map((stat) => stat.value)); // Maximale Statistikwert
  const statsChartHTML = pokemon.stats
    .map((stat) => {
      const percentage = (stat.value / maxStat) * 100; // Prozentualer Anteil des aktuellen Werts
      return `
            <div class="stat-bar">
                <div class="stat-name">${stat.name.toUpperCase()}:</div>
                <div class="stat-value" style="width: ${percentage}%"></div>
            </div>
        `;
    })
    .join("");

  return `
        <h3>Stats:</h3>
        <br>
        <div class="stats-chart">
            ${statsChartHTML}
        </div>
    `;
}

/**
 * Updates the detail view of the current Pokémon.
 *
 * This function retrieves the Pokémon detail element from the DOM
 * and sets its inner HTML to display the basic information of the
 * currently selected Pokémon. It includes a button to toggle the
 * display of the Pokémon's stats.
 */

function returnToDetailView() {
  const pokemonDetail = document.getElementById("pokemonDetail");
  const infoHTML = createPokemonInfo(currentPokemonData);
  pokemonDetail.innerHTML = `
        ${infoHTML}
        <button id="toggleBtn" onclick="toggleView()">Stats anzeigen</button>
    `;
}

/**
 * Generates HTML for a Pokémon's basic information.
 *
 * The generated HTML includes the Pokémon's ID and its types.
 *
 * @param {Object} pokemon - The Pokémon object containing the ID and types.
 * @returns {String} The HTML for the Pokémon's basic information.
 */
function createPokemonInfo(pokemon) {
  return `
        <h4>ID: ${pokemon.id}</h4>
        <h4>Types: ${pokemon.types.join(", ")}</h4> 
    `;
}

/**
 * Generates HTML for a Pokémon's stats.
 *
 * This function creates an HTML string representing the stats of a Pokémon.
 * Each stat is displayed as a paragraph with its name and value.
 *
 * @param {Object} pokemon - The Pokémon object containing the stats.
 * @returns {String} The HTML string for the Pokémon's stats.
 */

function createPokemonStats(pokemon) {
  const statsHTML = pokemon.stats
    .map((stat) => `<p>${stat.name}: ${stat.value}</p>`)
    .join("");
  return `
        <h3>Stats</h3>
        ${statsHTML}
    `;
}

/**
 * Closes the currently open modal.
 *
 * This function selects the modal element from the DOM and removes it,
 * effectively closing the modal and freeing up the screen space it occupied.
 */

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.remove();
}

/**
 * Loads 20 more Pokémon and renders them into the DOM.
 *
 * This function checks if a loading process is already in progress
 * and prevents additional loads if so. It calculates the current
 * offset based on the number of Pokémon cards already in the DOM
 * and requests 20 more Pokémon from the API. After fetching, it
 * renders the new Pokémon and re-adds the search event listener.
 * Any errors during the process are logged to the console.
 */

async function load20More() {
  if (isLoading) return;
  isLoading = true;

  try {
    const offset = document.querySelectorAll(".card").length;
    const limit = 20;
    const newPokemons = await loadPokemons(offset, limit);
    renderNewPokemons(newPokemons);
    addSearchEventListener();
  } catch (error) {
    console.error("Error loading more pokemons:", error);
  } finally {
    isLoading = false;
  }
}

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Renders a list of new Pokémon cards into the DOM.
 *
 * This function takes an array of Pokémon data objects and renders a card
 * element for each Pokémon. If a card for a Pokémon with the same ID already
 * exists in the DOM, it is skipped to prevent duplicates.
 *
 * @param {Array<Object>} newPokemons - Array of Pokémon data objects to render.
 */
/******  f3e90921-6b00-4326-8374-8d9158bb3fdf  *******/
function renderNewPokemons(newPokemons) {
  const pokemonContainer = document.getElementById("pokemonContainer");
  for (const pokemon of newPokemons) {
    if (!document.getElementById(`pokemon-${pokemon.id}`)) {
      const card = createPokemonCard(pokemon);
      pokemonContainer.appendChild(card);
    }
  }
}

document
  .getElementById("searchInput")
  .addEventListener("input", async (event) => {
    const searchQuery = event.target.value.trim().toLowerCase();

    if (searchQuery.length >= 3) {
      const filteredPokemons = allPokemonData.filter((pokemon) => {
        return pokemon.germanName.toLowerCase().includes(searchQuery);
      });

      renderFilteredPokemons(filteredPokemons);
    } else {
      renderPokemons();
    }
  });


/**
 * Renders a filtered list of Pokémon cards into the DOM.
 *
 * This function takes an array of Pokémon data objects that match a search query
 * and renders a card element for each Pokémon. If a card for a Pokémon with the same ID already
 * exists in the DOM, it is skipped to prevent duplicates.
 *
 * @param {Array<Object>} filteredPokemons - Array of filtered Pokémon data objects to render.
 */
async function renderFilteredPokemons(filteredPokemons) {
  const pokemonContainer = document.getElementById("pokemonContainer");

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
    pokemonContainer.innerHTML = "";
    // Füge das Fragment einmal dem Container hinzu, um die Leistung zu verbessern
    pokemonContainer.appendChild(fragment);
  } catch (error) {
    console.error("Error rendering filtered pokemons:", error);
  }
}


/**
 * Adds an event listener to the search input field to filter the Pokémon list.
 *
 * The event listener is called whenever the user types or deletes a character in the search input field.
 * The function filters the Pokémon data array based on the search query and renders the filtered list of Pokémon cards.
 * If the search query is empty, all Pokémon are displayed again.
 *
 * @param {Event} event - Input event triggered by the user
 */
function addSearchEventListener() {
  document
    .getElementById("searchInput")
    .addEventListener("input", async (event) => {
      const searchQuery = event.target.value.trim().toLowerCase();

      if (searchQuery.length >= 3) {
        // Suche startet bereits ab dem dritten Zeichen
        // Durchsuchen der Pokemon-Daten und Filtern
        const filteredPokemons = [];
        for (const pokemon of allPokemonData) {
          if (pokemon.germanName.toLowerCase().includes(searchQuery)) {
            filteredPokemons.push(pokemon);
          }
        }
        renderFilteredPokemons(filteredPokemons);
      } else if (searchQuery.length === 0) {
        // Wenn die Suche leer ist, alle Pokémon anzeigen
        renderPokemons();
      }
    });
}


/**
 * Navigiert durch die geladenen Pokémon-Daten.
 *
 * Die Funktion wird von den Schaltflächen "vorheriges" und "nächstes" in der
 * Detailansicht eines Pokémon aufgerufen. Sie bestimmte den Index des nächsten
 * oder vorherigen Pokémons in der Liste der geladenen Pokémon und öffnet die
 * Detailansicht des gewählten Pokémon.
 *
 * @param {string} direction - Richtung der Navigation; "previous" oder "next"
 */
function navigatePokemon(direction) {
  const currentIndex = allPokemonData.findIndex(
    (pokemon) => pokemon === currentPokemonData
  );
  let newIndex;
  closeModal();

  if (direction === "previous") {
    newIndex =
      currentIndex === 0 ? allPokemonData.length - 1 : currentIndex - 1;
  } else if (direction === "next") {
    newIndex =
      currentIndex === allPokemonData.length - 1 ? 0 : currentIndex + 1;
  }

  if (newIndex !== undefined) {
    const newPokemon = allPokemonData[newIndex];
    openPokemonDetail(newPokemon);
  }
}


document.addEventListener("click", (event) => {
  // Überprüfen, ob das Modal geöffnet ist und ob der Klick außerhalb des Modals erfolgt ist
  if (isModalOpen && !document.querySelector(".modal").contains(event.target)) {
    closeModal(); // Schließen Sie das Modal
  }
});
