import express from 'express';

import { pool } from './db';
import { MariaDbPokemonRepository, type PokemonRepository } from './pokemons/pokemon.repository';
import { pokemonSchema } from './pokemons/pokemon.schema';
import { PokemonController } from './pokemons/pokemon.controller';
import { pokemonRoutes } from './pokemons/pokemon.routes';

const app = express();
app.use(express.json());                    // Codifico JSON a obj literal

const pokemonRepository: PokemonRepository = new MariaDbPokemonRepository(pool);
const controller = new PokemonController(pokemonRepository);

app.use("/api/pokemons", pokemonRoutes(controller))


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

