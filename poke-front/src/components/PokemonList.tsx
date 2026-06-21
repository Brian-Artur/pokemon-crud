import type { Pokemon } from "../pokemons/pokemon.schema";
import { PokemonCard } from "./PokemonCard";


type Props = {
  pokemons: Pokemon[];
};

export function PokemonList({ pokemons }: Props) {
  return (
    <ul>
      {pokemons.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </ul>
  );
}