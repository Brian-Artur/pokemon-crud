import type { Pokemon } from "../pokemons/pokemon.schema";

type Props = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: Props) {
  return (
    <li>
      {pokemon.name} — {pokemon.types.join(", ")}
    </li>
  );
}