import { useEffect, useState } from "react";
import { pokemonGateway } from "../api/pokemon.gateway";
import type { Pokemon, PokemonSinId } from "../pokemons/pokemon.schema";



export function usePokemons() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const addPokemon = async (pokemon: Pokemon): Promise<boolean> => {
    setCreateError(null);
    try {
      await pokemonGateway.create(pokemon);
      load();
      return true;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    }
  }

  const updatePokemon = async (id: number, datos: PokemonSinId) => {
    await pokemonGateway.update(id, datos);
    load();   // patrón refetch, igual que en add/remove
  };

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

  return { pokemons, loading, error, createError, 
           addPokemon, updatePokemon, removePokemon };
}