import { PokemonForm } from "./components/PokemonForm";
import { PokemonList } from "./components/PokemonList";
import { usePokemons } from "./hooks/usePokemons";

export default function App() {
  /*
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    pokemonGateway.getAll().then(setPokemons);
  }, []);
  */

  const {pokemons, loading, error, addPokemon, removePokemon} = usePokemons();

  if(loading) return <p>Cargando...</p>;
  if(error) return <p>Error: {error}</p>;

  return (
    <>
      <PokemonForm onCreate={addPokemon} />
      <PokemonList pokemons={pokemons} onRemove={removePokemon}/>;
    </>
  )
}
