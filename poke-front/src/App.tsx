import { useEffect, useState } from "react";
import { pokemonGateway } from "./api/pokemon.gateway";

type Pokemon = { id: number; name: string; types: string[] };                             

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    pokemonGateway.getAll()
      .then(setPokemons);
  }, []);

  return (
    <ul>
      {pokemons.map((p) => (
        <li key={p.id}>{p.name} - {p.types.join(", ")}</li>
      ))}
    </ul>
  );

}
export default App;