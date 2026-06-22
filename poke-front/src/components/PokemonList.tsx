import type { Pokemon } from "../pokemons/pokemon.schema";
import { PokemonCard } from "./PokemonCard";


type Props = {
  pokemons: Pokemon[];
  onRemove: (id: number) => void;
};

export function PokemonList({ pokemons, onRemove }: Props) {
  return (
    <ul>
      {pokemons.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onRemove={onRemove}/>
      ))}
    </ul>
  );
}