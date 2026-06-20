import type { PokeapiGateway } from "./pokeapi.gateway";
import type { PokemonRepository } from "./pokemon.repository";

export class IngestionService {
  constructor(
    private readonly pokeapi: PokeapiGateway,
    private readonly repo: PokemonRepository
  ) {}

  async ingest(count: number): Promise<void> {
    for (let id = 1; id <= count; id++) {
      try {
        const pokemon = await this.pokeapi.getPokemon(id);
        await this.repo.create(pokemon);
        console.log(`Guardado #${pokemon.id}: ${pokemon.name}`);
      } catch (err) {
        console.error(`Saltado #${id}:`, err instanceof Error ? err.message : err);
      }
    }
  }
}