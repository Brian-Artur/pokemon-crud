import express from 'express';

import { pool } from './db';
import { MariaDbPokemonRepository } from './pokemons/pokemon.repository';
import { PokemonController } from './pokemons/pokemon.controller';
import { pokemonRoutes } from './pokemons/pokemon.routes';

const app = express();
app.use(express.json());                    // Codifico JSON a obj literal

const repository = new MariaDbPokemonRepository(pool);
const controller = new PokemonController(repository);

app.use("/api/pokemons", pokemonRoutes(controller))


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

