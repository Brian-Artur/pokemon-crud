import { PokemonForm } from "./components/PokemonForm";
import { PokemonList } from "./components/PokemonList";
import { usePokemons } from "./hooks/usePokemons";

export default function App() {

  const {pokemons, loading, 
         error, createError, 
         addPokemon, removePokemon} = usePokemons();

  if(loading) return <p>Cargando...</p>;
  if(error) return <p>Error: {error}</p>;

  return (
    <>
      <PokemonForm onCreate={addPokemon} createError={createError} />
      <PokemonList pokemons={pokemons} onRemove={removePokemon}/>
    </>
  )
}
