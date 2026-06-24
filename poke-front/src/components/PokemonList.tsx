import type { Pokemon, PokemonSinId } from "../pokemons/pokemon.schema";
import { PokemonCard } from "./PokemonCard";

type Props = {
  pokemons: Pokemon[];
  onUpdate: (id: number, datos: PokemonSinId) => Promise<void>;
  onRemove: (id: number) => void;
};

export function PokemonList({ pokemons, onUpdate, onRemove }: Props) {
  return (
    <ul>
      {pokemons.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onUpdate={onUpdate} onRemove={onRemove} />
      ))}
    </ul>
  );
}