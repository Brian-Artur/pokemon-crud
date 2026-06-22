import type { Pokemon } from "../pokemons/pokemon.schema";

type Props = {
  pokemon: Pokemon;
  onRemove: (id: number) => void;
};

export function PokemonCard({ pokemon, onRemove }: Props) {
  return (
    <li>
      {pokemon.name} — {pokemon.types.join(", ")}
      <button onClick={() => onRemove(pokemon.id)}>Borrar</button>
    </li>
  );
}