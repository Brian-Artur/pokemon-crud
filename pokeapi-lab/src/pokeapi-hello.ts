import { pokeapiGateway } from "./pokemons/pokeapi.gateway";

async function main() {
  const pokemon = await pokeapiGateway.getPokemon(1);
  console.log(pokemon);
}

main().catch((err) => console.error("Error:", err));