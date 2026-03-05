const pokeApi = {};

const TYPE_COLORS = {
  normal:   '#A8A77A',
  fire:     '#EE8130',
  water:    '#6390F0',
  electric: '#F7D02C',
  grass:    '#7AC74C',
  ice:      '#96D9D6',
  fighting: '#C22E28',
  poison:   '#A33EA1',
  ground:   '#E2BF65',
  flying:   '#A98FF3',
  psychic:  '#F95587',
  bug:      '#A6B91A',
  rock:     '#B6A136',
  ghost:    '#735797',
  dragon:   '#6F35FC',
  dark:     '#705746',
  steel:    '#B7B7CE',
  fairy:    '#D685AD',
};

function mapPokemonToModel(rawPokemon) {
  const pokemon = new Pokemon();
  pokemon.id        = rawPokemon.id;
  pokemon.name      = rawPokemon.name;
  pokemon.types     = rawPokemon.types.map(t => t.type.name);
  pokemon.mainType  = pokemon.types[0];
  pokemon.photo     =
    rawPokemon.sprites.other['official-artwork'].front_default ||
    rawPokemon.sprites.front_default;
  pokemon.height    = rawPokemon.height;
  pokemon.weight    = rawPokemon.weight;
  pokemon.stats     = rawPokemon.stats;
  pokemon.abilities = rawPokemon.abilities;
  pokemon.baseExperience = rawPokemon.base_experience;
  pokemon.speciesUrl = rawPokemon.species.url;
  return pokemon;
}

pokeApi.getPokemonDetail = async (pokemon) => {
  const res = await fetch(pokemon.url);
  const data = await res.json();
  return mapPokemonToModel(data);
};

pokeApi.getPokemons = async (offset = 0, limit = 20) => {
  const res  = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  const details = await Promise.all(data.results.map(p => pokeApi.getPokemonDetail(p)));
  return { results: details, next: data.next };
};

pokeApi.getPokemonSpecies = async (url) => {
  const res  = await fetch(url);
  const data = await res.json();
  const flavorEntry =
    data.flavor_text_entries.find(e => e.language.name === 'pt') ||
    data.flavor_text_entries.find(e => e.language.name === 'en');
  return flavorEntry
    ? flavorEntry.flavor_text.replace(/\f|\n/g, ' ')
    : '';
};

pokeApi.TYPE_COLORS = TYPE_COLORS;