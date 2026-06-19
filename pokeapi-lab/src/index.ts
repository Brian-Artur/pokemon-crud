import express from 'express';

import { pokemonSchema } from './pokemons/pokemon.schema';
import { pokemonRepository } from './pokemons/pokemon.repository';

const app = express();
app.use(express.json());                    // Codifico JSON a obj literal

// Paso 1: algo vivo
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });            // Paso Obj a JSON
});

// Paso 2: prototipo feo
const pokemons = [
  { id: 1, name: 'bulbasaur', "types": ["grass", "poison"] },
  { id: 4, name: 'charmander', "types": ["fire"] },
];


app.get('/api/pokemons', async (req, res) => {    // Paso 2
  try {
    const lista = await pokemonRepository.getAll();
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cargar pokemons" });  
  }
});


app.post('/api/pokemons', async (req, res) => {
  const result = pokemonSchema.safeParse(req.body);
  if(!result.success){
    res.status(400).json({ error: result.error.issues });
    return; 
  }
  try {
    await pokemonRepository.create(result.data);
    res.status(201).json(result.data);
  } catch (err){
    console.error(err);
    res.status(500).json({ error: "No se pudo crear el pokémon" });
  }
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

