import { useEffect, useState } from "react";
import { pokemonGateway } from "./api/pokemon.gateway";

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pokemons")
      .then((r) => r.json())
      .then(setData);

    pokemonGateway.getAll()
  }, []);

  console.log(
    "Chanchito feliz"
  )

  return <pre>{JSON.stringify(data, null, 2)}</pre>;

}
export default App;