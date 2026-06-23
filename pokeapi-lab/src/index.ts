import express from 'express';

import { pool } from './db';
import { MariaDbPokemonRepository } from './pokemons/pokemon.repository';
import { PokemonController } from './pokemons/pokemon.controller';
import { pokemonRoutes } from './pokemons/pokemon.routes';
import { errorMiddleware } from './pokemons/error.middleware';

const app = express();
app.use(express.json());                    // Middleware de parse

const repository = new MariaDbPokemonRepository(pool);
const controller = new PokemonController(repository);

// Middleware de enrutado
app.use("/api/pokemons", pokemonRoutes(controller))

app.use(errorMiddleware);                   // Middleware de error, al final

const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

