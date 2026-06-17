import express from 'express';
import { nuevoPokemonSchema } from './pokemons/pokemon.schema';
import { error } from 'node:console';

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


app.get('/api/pokemons', (req, res) => {    // Paso 2
  res.json(pokemons);
});


app.post('/api/pokemons', (req, res) => {   // Paso 2
  const result = nuevoPokemonSchema.safeParse(req.body);
  if(!result.success){
    res.status(400).json({ error: result.error.issues });
    return; 
  }
  const nuevo = { id: pokemons.length + 1, ...result.data };
  pokemons.push(nuevo);
  res.status(201).json(nuevo);
});


const PORT = 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));