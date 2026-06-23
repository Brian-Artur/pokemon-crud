import { useEffect, useState } from "react";
import { pokemonGateway } from "../api/pokemon.gateway";
import type{ Pokemon } from "../pokemons/pokemon.schema";



export function usePokemons() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const addPokemon = async (pokemon: Pokemon): Promise<boolean> => {
    setCreateError(null);
    await pokemonGateway.create(pokemon);
    load();
  }

  const removePokemon = async (id: number) => {
    await pokemonGateway.remove(id);        // Espera a que el back confirme
    load();                                 // Re-lee base de datos
  }

  const load = () => {
    pokemonGateway.getAll()
      .then(setPokemons)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }
  


  useEffect(() => { load(); }, []);

  return { pokemons, loading, error, addPokemon, removePokemon };
}