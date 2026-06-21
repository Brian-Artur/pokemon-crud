import { useEffect, useState } from "react";
import { pokemonGateway } from "../api/pokemon.gateway";
import type{ Pokemon } from "../pokemons/pokemon.schema";



export function usePokemons() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pokemonGateway.getAll()
    .then(setPokemons)
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));
  }, []);

  return { pokemons, loading, error };
}