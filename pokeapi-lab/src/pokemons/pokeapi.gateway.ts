import z from "zod";
import { Pokemon } from "./pokemon.schema";

const BASE_URL = "https://pokeapi.co/api/v2";

// La forma CRUDA que esperamos de la PokeAPI (solo lo que usamos)
const pokeapiResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  types: z.array(
    z.object({
      type: z.object({ name: z.string() }),
    })
  ),
});


// Adaptador HTTP
export const pokeapiGateway = {

  // Traer un solo pokemon de la API externa
  async getPokemon(identifier: number | string): Promise<Pokemon> {
    const res = await fetch(`${BASE_URL}/pokemon/${identifier}`);
    if (!res.ok) throw new Error(`PokeAPI: no se pudo traer ${identifier}`);
    
    const data = await res.json();
    const parsed = pokeapiResponseSchema.parse(data);

    return {
      id: parsed.id,
      name: parsed.name,
      types: parsed.types.map((t) => t.type.name),
    }
  }
}