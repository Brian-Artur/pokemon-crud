import { pokemonSchema, pokemonsListSchema, type Pokemon } from "../pokemons/pokemon.schema";

const PATH_BASE = "/api/pokemons";          // path del backekd

export const pokemonGateway = {
  
  async getAll() {
    const res = await fetch(PATH_BASE);
    if (!res.ok) throw new Error("No se pudieron cargar pokémons");
    const data = await res.json();          // 1. No sé la forma de data
    return pokemonsListSchema.parse(data);  // 2. Compruebo si encaja con el molde
  },

  async getById(id: number) {
    const res = await fetch(`${PATH_BASE}/${id}`);
    if (!res.ok) throw new Error("Pokémon no encontrado");
    return res.json();
  },

  //          tipo NuevoPokemon
  async create(pokemon: Pokemon) {
    const res = await fetch(PATH_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(pokemon)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = Array.isArray(body?.error)
        ? body.error.map((issue: { message: string }) => issue.message).join(", ")
        : body?.error ?? "No se pudo crear el pokémon"
      throw new Error(message);
    }
    return pokemonSchema.parse(await res.json());
  },

  async remove(id: number){
    const res = await fetch(`${PATH_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo eliminar");
  }
}